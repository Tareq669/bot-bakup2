const { User } = require('../database/models');
const KhatmaProvider = require('../content/khatmaProvider');
const { logger } = require('./helpers');
const SendQueue = require('./sendQueue');

// Simple in-process scheduler: checks users every interval and applies daily increment
class KhatmaScheduler {
  // Accept options and bot instance (bot may be null for dry-run)
  constructor(options = {}, bot = null) {
    this.intervalMs = options.intervalMs || 1000 * 60 * 60;
    this.bot = bot;
    this.timer = null;
    this.running = false;
    this.sendQueue = new SendQueue({ concurrency: 4, delayMs: 250 });
  }

  async tick() {
    try {
      const users = await User.find({ 'preferences.khatmaSettings.notify': true }).limit(1000);
      const nowUtc = new Date();
      for (const user of users) {
        const settings = (user.preferences && user.preferences.khatmaSettings) || {};
        const inc = settings.dailyIncrement || 0;
        if (inc <= 0) continue;

        // Determine user's local date/time using Intl (avoid extra deps)
        const tz = settings.timezone || 'UTC';
        let userNow;
        try {
          // Obtain a locale string in the user's timezone and parse
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).formatToParts(nowUtc);

          const obj = {};
          parts.forEach(p => { if (p.type !== 'literal') obj[p.type] = p.value; });
          // Build a date-time string like YYYY-MM-DDTHH:mm:00
          const localIso = `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.minute}:00`;
          userNow = new Date(localIso);
        } catch (e) {
          // Fallback to UTC
          userNow = new Date(nowUtc.toISOString());
        }

        const localDateStr = userNow.toDateString();

        // Check lastNotified in user's khatmaProgress (store local times as UTC dates)
        const lastNotified = user.khatmaProgress && user.khatmaProgress.lastNotified ? new Date(user.khatmaProgress.lastNotified) : null;
        const lastNotifiedLocal = lastNotified ? (() => {
          try {
            const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(lastNotified);
            const obj = {}; parts.forEach(p => { if (p.type !== 'literal') obj[p.type] = p.value; });
            return `${obj.year}-${obj.month}-${obj.day}`;
          } catch (e) { return lastNotified.toDateString(); }
        })() : null;

        // Determine user's preferred notify time window
        const notifyTime = settings.notifyTime || '08:00';
        const [nh, nm] = notifyTime.split(':').map(Number);
        const windowMinutes = Number(settings.notifyWindowMinutes || 60);

        // Compute minutes since midnight for userNow and notifyTime
        const minutesNow = userNow.getHours() * 60 + userNow.getMinutes();
        const minutesTarget = (nh * 60) + (nm || 0);
        const delta = Math.abs(minutesNow - minutesTarget);

        // Only trigger if within the window and we haven't notified today (in user's local date)
        if (delta <= windowMinutes && lastNotifiedLocal !== localDateStr) {
          // Advance pages and mark lastNotified/lastRead
          try {
            await KhatmaProvider.advancePages(user, inc);
            user.khatmaProgress.lastNotified = nowUtc;
            user.khatmaProgress.lastRead = nowUtc;
            await user.save();

            if (this.bot && user.userId) {
              try {
                const pageInfo = await KhatmaProvider.getPageInfo(user.khatmaProgress.currentPage);
                let text = `🕌 تقدم الختمة — تم إضافة <b>${inc}</b> صفحة تلقائياً\nصفحتك الحالية: <b>${pageInfo.page}</b> — ${pageInfo.percent}%\n`;
                if (pageInfo.surahHint) {
                  text += `📚 تقريباً في سورة: <b>${pageInfo.surahHint.surah}</b> (آية ${pageInfo.surahHint.startAyah || pageInfo.surahHint.ayah || ''})\n`;
                }
                text += `${pageInfo.guidance}`;
                // include quick-action keyboard
                const keyboard = {
                  inline_keyboard: [
                    [{ text: 'عرض الختمة', callback_data: 'menu:khatma' }],
                    [{ text: '🔗 مشاركة التقدم', callback_data: 'khatma:share' }]
                  ]
                };
                // enqueue send to central queue
                await this.sendQueue.enqueue(this.bot, user.userId, text, { parse_mode: 'HTML', reply_markup: keyboard });
              } catch (sendErr) {
                logger.error(`KhatmaScheduler: failed to send notification to ${user.userId}`, sendErr);
              }
            }
          } catch (procErr) {
            console.error('KhatmaScheduler: failed to advance pages for', user.userId, procErr.message);
          }
        }
      }
    } catch (err) {
      console.error('KhatmaScheduler error:', err);
    }
  }

  start() {
    if (this.timer) return;
    this.running = true;
    this.timer = setInterval(() => this.tick(), this.intervalMs);
    // run once immediately
    this.tick();
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
  }
}

module.exports = KhatmaScheduler;
