require('dotenv').config();
const { Telegraf, Context, session } = require('telegraf');
const Database = require('./database/db');
const CommandHandler = require('./commands/commandHandler');
const MenuHandler = require('./commands/menuHandler');
const GameHandler = require('./commands/gameHandler');
const EconomyHandler = require('./commands/economyHandler');
const ContentHandler = require('./commands/contentHandler');
const ProfileHandler = require('./commands/profileHandler');
const { logger } = require('./utils/helpers');
const ReconnectManager = require('./utils/reconnect');
const connectionMonitor = require('./utils/connectionMonitor');
const healthMonitor = require('./utils/healthMonitor');

// Import AI Systems
const AIManager = require('./ai/aiManager');
const LearningSystem = require('./ai/learningSystem');
const SmartNotifications = require('./ai/smartNotifications');
const AnalyticsEngine = require('./ai/analyticsEngine');
const IntegratedAI = require('./ai/integratedAI');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Initialize session middleware
bot.use(session());

// --- SET BOT COMMANDS MENU ---
bot.telegram.setMyCommands([
  { command: 'start', description: '🏠 الرئيسية' },
  { command: 'khatma', description: '🕌 الختمة' },
  { command: 'adhkar', description: '📿 الأذكار' },
  { command: 'quran', description: '📖 القرآن' },
  { command: 'quotes', description: '💭 الاقتباسات' },
  { command: 'poetry', description: '✍️ الشعر' },
  { command: 'games', description: '🎮 الألعاب' },
  { command: 'economy', description: '💰 الاقتصاد' },
  { command: 'profile', description: '👤 حسابي' },
  { command: 'leaderboard', description: '🏆 المتصدرين' },
  { command: 'stats', description: '📊 إحصائيات' },
  { command: 'rewards', description: '🎁 المكافآت' },
  { command: 'help', description: '❓ الساعدة' }
]).catch(err => {
  logger.error('خطأ في تعيين قائمة الأوامر:', err);
});

// Error handling for bot
bot.catch((err, ctx) => {
  logger.error('❌ خطأ في البوت:', err);
  healthMonitor.logError();
  
  // حاول الرد على المستخدم
  try {
    if (ctx && ctx.reply) {
      ctx.reply('❌ حدث خطأ غير متوقع، جاري محاولة الإصلاح...').catch(e => {
        logger.error('فشل الرد على الخطأ:', e.message);
      });
    }
  } catch (e) {
    logger.error('فشل في معالجة الخطأ:', e.message);
  }
});

// --- STARTUP COMMANDS ---
bot.start((ctx) => CommandHandler.handleStart(ctx));
bot.help((ctx) => CommandHandler.handleHelp(ctx));

// --- COMMAND HANDLERS ---
bot.command('profile', (ctx) => CommandHandler.handleProfile(ctx));
bot.command('balance', (ctx) => CommandHandler.handleBalance(ctx));
bot.command('leaderboard', (ctx) => CommandHandler.handleLeaderboard(ctx));
bot.command('daily', (ctx) => CommandHandler.handleDailyReward(ctx));
bot.command('features', (ctx) => CommandHandler.handleFeaturesMenu(ctx));
bot.command('goals', (ctx) => CommandHandler.handleGoals(ctx));
bot.command('charity', (ctx) => CommandHandler.handleCharity(ctx));
bot.command('memorization', (ctx) => CommandHandler.handleMemorization(ctx));
bot.command('dua', (ctx) => CommandHandler.handleDua(ctx));
bot.command('referral', (ctx) => CommandHandler.handleReferral(ctx));
bot.command('events', (ctx) => CommandHandler.handleEvents(ctx));
bot.command('library', (ctx) => CommandHandler.handleLibrary(ctx));
bot.command('teams', (ctx) => CommandHandler.handleTeams(ctx));

// --- AI SMART COMMANDS ---
bot.command('dashboard', async (ctx) => {
  try {
    const dashboard = await IntegratedAI.generateSmartDashboard(ctx.from.id);
    const formatted = IntegratedAI.formatSmartDashboard(dashboard);
    ctx.reply(formatted, { parse_mode: 'HTML' });
  } catch (error) {
    logger.error('Dashboard error:', error);
    ctx.reply('❌ خدمة اللوحة غير متاحة حالياً');
  }
});

bot.command('analytics', async (ctx) => {
  try {
    const report = await AnalyticsEngine.generateUserReport(ctx.from.id);
    const formatted = AnalyticsEngine.formatReport(report);
    ctx.reply(formatted, { parse_mode: 'HTML' });
  } catch (error) {
    logger.error('Analytics error:', error);
    ctx.reply('❌ خدمة التحليلات غير متاحة حالياً');
  }
});

bot.command('coaching', async (ctx) => {
  try {
    const message = await IntegratedAI.generateCoachingMessage(ctx.from.id);
    ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    logger.error('Coaching error:', error);
    ctx.reply('❌ خدمة التدريب غير متاحة حالياً');
  }
});

bot.command('motivation', async (ctx) => {
  try {
    const { User } = require('./database/models');
    const user = await User.findOne({ userId: ctx.from.id });
    if (user) {
      const motivation = IntegratedAI.generateMotivation(user);
      ctx.reply(motivation, { parse_mode: 'HTML' });
    }
  } catch (error) {
    logger.error('Motivation error:', error);
    ctx.reply('❌ خدمة التحفيز غير متاحة حالياً');
  }
});

// --- QUICK MENU COMMANDS ---
bot.command('khatma', (ctx) => MenuHandler.handleKhatmaMenu(ctx));
bot.command('adhkar', (ctx) => MenuHandler.handleAdhkarMenu(ctx));
bot.command('quran', (ctx) => MenuHandler.handleQuranMenu(ctx));
bot.command('quotes', (ctx) => MenuHandler.handleQuotesMenu(ctx));
bot.command('poetry', (ctx) => MenuHandler.handlePoetryMenu(ctx));
bot.command('games', (ctx) => MenuHandler.handleGamesMenu(ctx));
bot.command('economy', (ctx) => MenuHandler.handleEconomyMenu(ctx));
bot.command('stats', (ctx) => CommandHandler.handleStats(ctx));
bot.command('rewards', (ctx) => CommandHandler.handleRewards(ctx));

// --- ADMIN COMMANDS ---
bot.command('health', async (ctx) => {
  const ownerIds = (process.env.BOT_OWNERS || '').split(',').filter(Boolean).map(Number);
  
  if (ownerIds.includes(ctx.from.id)) {
    const report = healthMonitor.getFullReport();
    await ctx.reply(report, { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('❌ ليس لديك صلاحية لهذا الأمر');
  }
});

bot.command('myid', async (ctx) => {
  const ownerIds = (process.env.BOT_OWNERS || '').split(',').filter(Boolean).map(Number);
  const isOwner = ownerIds.includes(ctx.from.id);
  
  await ctx.reply(
    `🆔 <b>معلومات حسابك</b>\n\n` +
    `👤 الاسم: ${ctx.from.first_name || 'غير متوفر'}\n` +
    `🔢 Telegram ID: <code>${ctx.from.id}</code>\n` +
    `👨‍💼 اليوزر: ${ctx.from.username ? '@' + ctx.from.username : 'غير متوفر'}\n` +
    `${isOwner ? '👑 <b>أنت مالك البوت</b>' : ''}`,
    { parse_mode: 'HTML' }
  );
});

bot.command('owners', async (ctx) => {
  const ownerIds = (process.env.BOT_OWNERS || '').split(',').filter(Boolean).map(Number);
  
  if (!ownerIds.includes(ctx.from.id)) {
    return ctx.reply('❌ ليس لديك صلاحية لهذا الأمر');
  }
  
  await ctx.reply(
    `👑 <b>مالكي البوت</b>\n\n` +
    `IDs: <code>${ownerIds.join(', ')}</code>\n\n` +
    `📝 لإضافة مالك جديد:\n` +
    `1. اطلب منه إرسال /myid للبوت\n` +
    `2. أضف ID الخاص به في ملف .env\n` +
    `3. BOT_OWNERS=ID1,ID2,ID3\n` +
    `4. أعد تشغيل البوت`,
    { parse_mode: 'HTML' }
  );
});

// --- OWNER ONLY COMMANDS ---
bot.command('owner', (ctx) => CommandHandler.handleOwnerPanel(ctx));
bot.command('panel', (ctx) => CommandHandler.handleOwnerPanel(ctx));

// --- OWNER ACTIONS ---
bot.action('owner:panel', (ctx) => CommandHandler.handleOwnerPanel(ctx));
bot.action('owner:stats', (ctx) => CommandHandler.handleOwnerStats(ctx));
bot.action('owner:users', (ctx) => CommandHandler.handleOwnerUsers(ctx));
bot.action('owner:broadcast', (ctx) => CommandHandler.handleOwnerBroadcast(ctx));
bot.action('owner:economy', (ctx) => CommandHandler.handleOwnerEconomy(ctx));
bot.action('owner:database', (ctx) => CommandHandler.handleOwnerDatabase(ctx));
bot.action('owner:logs', (ctx) => CommandHandler.handleOwnerLogs(ctx));
bot.action('owner:viewall', (ctx) => CommandHandler.handleOwnerViewAllUsers(ctx));
bot.action('owner:givecoins', (ctx) => CommandHandler.handleOwnerGiveCoins(ctx));

// Owner - Banned Users List
bot.action('owner:banned', async (ctx) => {
  try {
    const UIManager = require('./ui/keyboards');
    if (!UIManager.isOwner(ctx.from.id)) {
      return ctx.answerCbQuery('❌ غير مصرح');
    }

    const { User } = require('./database/models');
    const banned = await User.find({ banned: true }).limit(20);
    
    let message = `🚫 <b>المستخدمون المحظورون (${banned.length})</b>\n\n`;
    
    if (banned.length === 0) {
      message += 'لا يوجد مستخدمون محظورون حالياً';
    } else {
      banned.forEach((u, i) => {
        message += `${i + 1}. ${u.firstName}\n`;
        message += `   ID: <code>${u.userId}</code>\n`;
        message += `   السبب: ${u.bannedReason || 'غير محدد'}\n\n`;
      });
    }

    const Markup = require('telegraf/markup');
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('⬅️ رجوع', 'owner:panel')]
    ]);

    try {
      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    } catch (e) {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    }
  } catch (error) {
    console.error('Owner banned error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

// Owner - Database Info
bot.action('owner:dbinfo', async (ctx) => {
  try {
    const UIManager = require('./ui/keyboards');
    if (!UIManager.isOwner(ctx.from.id)) {
      return ctx.answerCbQuery('❌ غير مصرح');
    }

    const mongoose = require('mongoose');
    const dbStats = await mongoose.connection.db.stats();
    
    const message = `🗄️ <b>معلومات قاعدة البيانات</b>\n\n` +
      `📊 <b>الإحصائيات:</b>\n` +
      `• الاسم: ${mongoose.connection.db.databaseName}\n` +
      `• الحجم: ${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB\n` +
      `• حجم التخزين: ${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB\n` +
      `• عدد المستندات: ${dbStats.objects}\n` +
      `• المجموعات: ${dbStats.collections}\n` +
      `• الفهارس: ${dbStats.indexes}\n\n` +
      `📡 <b>الاتصال:</b>\n` +
      `• الحالة: ${mongoose.connection.readyState === 1 ? '✅ متصل' : '❌ غير متصل'}\n` +
      `• Host: ${mongoose.connection.host}`;

    const Markup = require('telegraf/markup');
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🔄 تحديث', 'owner:dbinfo')],
      [Markup.button.callback('⬅️ رجوع', 'owner:database')]
    ]);

    try {
      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    } catch (e) {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    }
  } catch (error) {
    console.error('Owner dbinfo error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

// Owner - Richest Users
bot.action('owner:richest', async (ctx) => {
  try {
    const UIManager = require('./ui/keyboards');
    if (!UIManager.isOwner(ctx.from.id)) {
      return ctx.answerCbQuery('❌ غير مصرح');
    }

    const { User } = require('./database/models');
    const richest = await User.find().sort({ coins: -1 }).limit(10);
    
    let message = `💰 <b>أغنى 10 مستخدمين</b>\n\n`;
    richest.forEach((u, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      message += `${medal} ${u.firstName}\n`;
      message += `   💰 ${u.coins.toLocaleString()} عملة\n`;
      message += `   ID: <code>${u.userId}</code>\n\n`;
    });

    const Markup = require('telegraf/markup');
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('⬅️ رجوع', 'owner:economy')]
    ]);

    try {
      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    } catch (e) {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    }
  } catch (error) {
    console.error('Owner richest error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

// Owner - Reward All Users
bot.action('owner:rewardall', async (ctx) => {
  try {
    const UIManager = require('./ui/keyboards');
    if (!UIManager.isOwner(ctx.from.id)) {
      return ctx.answerCbQuery('❌ غير مصرح');
    }

    ctx.session = ctx.session || {};
    ctx.session.ownerAwait = { type: 'rewardall' };
    
    await ctx.answerCbQuery('✅ جاهز');
    await ctx.reply(
      `🎁 <b>مكافأة جماعية</b>\n\n` +
      `اكتب المبلغ الذي تريد إعطاءه لجميع المستخدمين:\n\n` +
      `❌ اكتب /cancel للإلغاء`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('Owner rewardall error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

// Owner - Systems Status
bot.action('owner:systems', async (ctx) => {
  try {
    const UIManager = require('./ui/keyboards');
    if (!UIManager.isOwner(ctx.from.id)) {
      return ctx.answerCbQuery('❌ غير مصرح');
    }

    const mongoose = require('mongoose');
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    const message = `⚡ <b>حالة الأنظمة</b>\n\n` +
      `🤖 <b>البوت:</b>\n` +
      `• الحالة: ✅ يعمل\n` +
      `• وقت التشغيل: ${Math.floor(uptime / 60)} دقيقة\n` +
      `• PID: ${process.pid}\n\n` +
      `💾 <b>الذاكرة:</b>\n` +
      `• المستخدمة: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
      `• المجموع: ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB\n` +
      `• RSS: ${(memory.rss / 1024 / 1024).toFixed(2)} MB\n\n` +
      `🗄️ <b>قاعدة البيانات:</b>\n` +
      `• الحالة: ${mongoose.connection.readyState === 1 ? '✅ متصل' : '❌ غير متصل'}\n\n` +
      `📊 <b>Node.js:</b>\n` +
      `• الإصدار: ${process.version}\n` +
      `• المنصة: ${process.platform}`;

    const Markup = require('telegraf/markup');
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🔄 تحديث', 'owner:systems')],
      [Markup.button.callback('⬅️ رجوع', 'owner:panel')]
    ]);

    try {
      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    } catch (e) {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    }
  } catch (error) {
    console.error('Owner systems error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

// Owner - Cleanup inactive users
bot.action('owner:cleanup', async (ctx) => {
  try {
    const UIManager = require('./ui/keyboards');
    if (!UIManager.isOwner(ctx.from.id)) {
      return ctx.answerCbQuery('❌ غير مصرح');
    }

    const { User } = require('./database/models');
    // Users inactive for more than 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const inactiveCount = await User.countDocuments({
      lastActiveDay: { $lt: ninetyDaysAgo }
    });

    const message = `🗑️ <b>تنظيف البيانات</b>\n\n` +
      `المستخدمون الغير نشطين (أكثر من 90 يوم): ${inactiveCount}\n\n` +
      `⚠️ هل تريد حذفهم؟\n\n` +
      `⚠️ هذا الإجراء لا يمكن التراجع عنه!`;

    const Markup = require('telegraf/markup');
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('✅ نعم، احذف', 'owner:cleanup:confirm'),
        Markup.button.callback('❌ إلغاء', 'owner:panel')
      ]
    ]);

    try {
      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    } catch (e) {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
      });
    }
  } catch (error) {
    console.error('Owner cleanup error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

bot.action('owner:cleanup:confirm', async (ctx) => {
  try {
    const UIManager = require('./ui/keyboards');
    if (!UIManager.isOwner(ctx.from.id)) {
      return ctx.answerCbQuery('❌ غير مصرح');
    }

    const { User } = require('./database/models');
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({
      lastActiveDay: { $lt: ninetyDaysAgo }
    });

    await ctx.answerCbQuery(`✅ تم حذف ${result.deletedCount} مستخدم`);
    await ctx.editMessageText(
      `✅ <b>تمت عملية التنظيف</b>\n\n` +
      `عدد المستخدمين المحذوفين: ${result.deletedCount}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('Owner cleanup confirm error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

// --- MENU CALLBACKS ---
bot.action('menu:main', (ctx) => MenuHandler.handleMainMenu(ctx));
bot.action('menu:khatma', (ctx) => MenuHandler.handleKhatmaMenu(ctx));
bot.action('menu:adhkar', (ctx) => MenuHandler.handleAdhkarMenu(ctx));
bot.action('menu:quran', (ctx) => MenuHandler.handleQuranMenu(ctx));
bot.action('menu:quotes', (ctx) => MenuHandler.handleQuotesMenu(ctx));
bot.action('menu:poetry', (ctx) => MenuHandler.handlePoetryMenu(ctx));
bot.action('menu:games', (ctx) => MenuHandler.handleGamesMenu(ctx));
bot.action('menu:economy', (ctx) => MenuHandler.handleEconomyMenu(ctx));
bot.action('menu:profile', (ctx) => MenuHandler.handleProfileMenu(ctx));
bot.action('menu:features', (ctx) => CommandHandler.handleFeaturesMenu(ctx));
bot.action('menu:library', (ctx) => CommandHandler.handleLibrary(ctx));
bot.action('menu:leaderboard', (ctx) => MenuHandler.handleLeaderboardMenu(ctx));
bot.action('menu:settings', (ctx) => MenuHandler.handleSettingsMenu(ctx));
bot.action('settings:notifications', (ctx) => MenuHandler.handleNotificationsSettings(ctx));
bot.action('settings:toggleNotify', (ctx) => MenuHandler.handleToggleNotifications(ctx));
bot.action('settings:language', (ctx) => MenuHandler.handleLanguageSettings(ctx));

// --- ADVANCED FEATURES ACTIONS ---
bot.action('features:goals', (ctx) => CommandHandler.handleGoals(ctx));
bot.action('features:charity', (ctx) => CommandHandler.handleCharity(ctx));
bot.action('features:memorization', (ctx) => CommandHandler.handleMemorization(ctx));
bot.action('features:dua', (ctx) => CommandHandler.handleDua(ctx));
bot.action('features:referral', (ctx) => CommandHandler.handleReferral(ctx));
bot.action('features:events', (ctx) => CommandHandler.handleEvents(ctx));
bot.action('features:rewards', (ctx) => CommandHandler.handleRewards(ctx));
bot.action('features:library', (ctx) => CommandHandler.handleLibrary(ctx));
bot.action('features:teams', (ctx) => CommandHandler.handleTeams(ctx));
bot.action('features:stats', (ctx) => CommandHandler.handleStats(ctx));
bot.action('stats:view', (ctx) => CommandHandler.handleStats(ctx));

// --- REFERRAL ACTIONS ---
bot.action('referral_leaderboard', async (ctx) => {
  const ReferralSystem = require('./features/referralSystem');
  const leaderboard = await ReferralSystem.getReferralLeaderboard(10);
  await ctx.reply(ReferralSystem.formatReferralLeaderboard(leaderboard), { parse_mode: 'HTML' });
});

bot.action('referral_info', async (ctx) => {
  const ReferralSystem = require('./features/referralSystem');
  await ctx.reply(ReferralSystem.getReferralInfo(), { parse_mode: 'HTML' });
});

// --- EVENTS ACTIONS ---
bot.action('events_leaderboard', async (ctx) => {
  const EventsSystem = require('./features/eventsSystem');
  const events = await EventsSystem.getActiveEvents();
  if (!events.length) return ctx.reply('❌ لا توجد أحداث نشطة');
  const leaderboard = await EventsSystem.getEventLeaderboard(events[0]._id, 10);
  await ctx.reply(EventsSystem.formatEventLeaderboard(events[0], leaderboard), { parse_mode: 'HTML' });
});

// --- REWARDS ACTIONS ---
bot.action('reward:daily', async (ctx) => {
  const RewardsSystem = require('./features/rewardsSystem');
  const result = await RewardsSystem.claimDailyReward(ctx.from.id);
  await ctx.answerCbQuery(result.success ? '✅ تم' : '❌');
  await ctx.reply(result.message, { parse_mode: 'HTML' });
});

bot.action('rewards:daily', async (ctx) => {
  const RewardsSystem = require('./features/rewardsSystem');
  const result = await RewardsSystem.claimDailyReward(ctx.from.id);
  await ctx.answerCbQuery(result.success ? '✅ تم' : '❌');
  await ctx.reply(result.message, { parse_mode: 'HTML' });
});

bot.action('reward:wheel', async (ctx) => {
  const RewardsSystem = require('./features/rewardsSystem');
  const result = await RewardsSystem.spinWheel(ctx.from.id);
  await ctx.answerCbQuery(result.success ? '✅ تم' : '❌');
  await ctx.reply(result.message, { parse_mode: 'HTML' });
});

bot.action(/reward:loot:(basic|silver|gold|legendary)/, async (ctx) => {
  const RewardsSystem = require('./features/rewardsSystem');
  const boxType = ctx.match[1];
  const result = await RewardsSystem.openLootBox(ctx.from.id, boxType);
  await ctx.answerCbQuery(result.success ? '✅ تم' : '❌');
  await ctx.reply(result.message, { parse_mode: 'HTML' });
});

// --- GOALS ACTIONS ---
bot.action('add_goal', async (ctx) => {
  const keyboard = require('./ui/keyboards').goalsTemplatesKeyboard();
  await ctx.reply('🎯 اختر قالب هدف جاهز:', { parse_mode: 'HTML', reply_markup: keyboard.reply_markup });
});

bot.action(/goal:(khatma|adhkar|pages|prayers|games|charity)/, async (ctx) => {
  const GoalsManager = require('./features/goals');
  const templates = GoalsManager.getSuggestedGoals();
  const type = ctx.match[1];
  const template = templates.find(t => {
    if (type === 'pages') return t.type === 'quran_pages';
    return t.type === type;
  });
  if (!template) return ctx.answerCbQuery('❌ قالب غير موجود');
  const result = await GoalsManager.createGoal(ctx.from.id, template);
  await ctx.answerCbQuery(result.success ? '✅ تم' : '❌');
  await ctx.reply(result.message, { parse_mode: 'HTML' });
});

// --- CHARITY ACTIONS ---
bot.action(/charity:add:(.+)/, async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.featureAwait = { type: 'charity', charityType: ctx.match[1] };
  await ctx.reply('💝 أرسل المبلغ والوصف (اختياري). مثال: 100 مساعدة محتاج');
  await ctx.answerCbQuery('✅');
});

// --- MEMORIZATION ACTIONS ---
bot.action('mem:add', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.featureAwait = { type: 'memorization' };
  await ctx.reply('📖 أرسل: رقم السورة | اسم السورة | من آية | إلى آية\nمثال: 1|الفاتحة|1|7');
  await ctx.answerCbQuery('✅');
});

bot.action('mem:stats', (ctx) => CommandHandler.handleMemorization(ctx));
bot.action('mem:tips', async (ctx) => {
  const MemorizationSystem = require('./features/memorizationSystem');
  const tips = MemorizationSystem.getMemorizationTips();
  await ctx.reply(`💡 <b>نصائح الحفظ</b>\n\n${tips.join('\n')}`, { parse_mode: 'HTML' });
});
bot.action('mem:review', async (ctx) => {
  const MemorizationSystem = require('./features/memorizationSystem');
  const dueReviews = await MemorizationSystem.getDueReviews(ctx.from.id);
  if (!dueReviews.length) {
    return ctx.reply('✅ لا توجد مراجعات مستحقة حالياً');
  }

  let message = '📝 <b>مراجعات مستحقة</b>\n\n';
  dueReviews.slice(0, 5).forEach((v, i) => {
    message += `${i + 1}. ${v.surahName} (${v.fromAyah}-${v.toAyah})\n`;
  });
  await ctx.reply(message, { parse_mode: 'HTML' });
});

// --- DUA ACTIONS ---
bot.action(/dua:(morning|evening|protection|forgiveness|sustenance|sleep|food|travel)/, async (ctx) => {
  const DuaSystem = require('./features/duaSystem');
  const category = ctx.match[1];
  const collection = DuaSystem.getDuaCollection(category);
  if (!collection) return ctx.answerCbQuery('❌ غير موجود');
  await ctx.reply(DuaSystem.formatDuaCollection(collection), { parse_mode: 'HTML' });
});

// --- LIBRARY ACTIONS ---
bot.action('library:tafsir', async (ctx) => {
  const IslamicLibrary = require('./features/islamicLibrary');
  const tafsir = await IslamicLibrary.getTafsir(1, 1, 'السعدي');
  await ctx.reply(IslamicLibrary.formatLibraryContent('tafsir', tafsir), { parse_mode: 'HTML' });
});

bot.action('library:hadith', async (ctx) => {
  const IslamicLibrary = require('./features/islamicLibrary');
  const hadith = await IslamicLibrary.getHadith('all');
  await ctx.reply(IslamicLibrary.formatLibraryContent('hadith', hadith), { parse_mode: 'HTML' });
});

bot.action('library:fiqh', async (ctx) => {
  const IslamicLibrary = require('./features/islamicLibrary');
  const fiqh = await IslamicLibrary.getFiqhRuling('الصلاة');
  await ctx.reply(IslamicLibrary.formatLibraryContent('fiqh', fiqh), { parse_mode: 'HTML' });
});

bot.action('library:stories', async (ctx) => {
  const IslamicLibrary = require('./features/islamicLibrary');
  const story = await IslamicLibrary.getQuranStory('موسى');
  await ctx.reply(IslamicLibrary.formatLibraryContent('story', story), { parse_mode: 'HTML' });
});

bot.action('library:sahabi', async (ctx) => {
  const IslamicLibrary = require('./features/islamicLibrary');
  const sahabi = await IslamicLibrary.getSahabiBiography('أبو بكر');
  await ctx.reply(IslamicLibrary.formatLibraryContent('sahabi', sahabi), { parse_mode: 'HTML' });
});

bot.action('library:awrad', (ctx) => CommandHandler.handleDua(ctx));

// --- TEAMS ACTIONS ---
bot.action('team:create', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.featureAwait = { type: 'team_create' };
  await ctx.reply('👥 أرسل اسم الفريق والوصف (اختياري) بصيغة: الاسم | الوصف');
  await ctx.answerCbQuery('✅');
});

bot.action('team:join', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.featureAwait = { type: 'team_join' };
  await ctx.reply('👥 أرسل اسم الفريق للانضمام:');
  await ctx.answerCbQuery('✅');
});

bot.action('team:leaderboard', async (ctx) => {
  const TeamManager = require('./features/teamManager');
  const teams = await TeamManager.getTeamLeaderboard(10);
  await ctx.reply(TeamManager.formatTeamLeaderboard(teams), { parse_mode: 'HTML' });
});

bot.action('team:info', (ctx) => CommandHandler.handleTeams(ctx));

// --- ADMIN HANDLERS (معالجات الإعدادات الإدارية) ---
bot.action('settings:general', (ctx) => MenuHandler.handleGeneralSettings(ctx));
bot.action('settings:users', (ctx) => MenuHandler.handleUserManagement(ctx));
bot.action('settings:security', (ctx) => MenuHandler.handleSecuritySettings(ctx));
bot.action('settings:content', (ctx) => MenuHandler.handleContentManagement(ctx));
bot.action('settings:stats', (ctx) => MenuHandler.handleAdminStats(ctx));

// --- SUB-MENU HANDLERS FOR SETTINGS ---
// General Settings Sub-menus
bot.action('settings:messages', (ctx) => MenuHandler.handleMessagesSettings(ctx));
bot.action('settings:notifySettings', (ctx) => MenuHandler.handleNotifySettings(ctx));
bot.action('settings:scheduler', (ctx) => MenuHandler.handleSchedulerSettings(ctx));

// User Management Sub-menus
bot.action('admin:searchUser', (ctx) => MenuHandler.handleSearchUserMenu(ctx));
bot.action('admin:banUsers', (ctx) => MenuHandler.handleBanUsers(ctx));

// Security Sub-menus
bot.action('security:rateLimit', (ctx) => MenuHandler.handleRateLimit(ctx));
bot.action('security:verification', (ctx) => MenuHandler.handleVerification(ctx));

// Content Management Sub-menus
bot.action('content:add', (ctx) => MenuHandler.handleAddContent(ctx));
bot.action('content:edit', (ctx) => MenuHandler.handleEditContent(ctx));
bot.action('content:delete', (ctx) => MenuHandler.handleDeleteContent(ctx));

// Stats Sub-menus
bot.action('stats:economy', (ctx) => MenuHandler.handleStatsEconomy(ctx));

// --- SEARCH & MANAGEMENT HANDLERS ---
bot.action('admin:search', (ctx) => MenuHandler.handleSearchUser(ctx));
bot.action('security:logs', (ctx) => MenuHandler.handleSecurityLogs(ctx));
bot.action('content:stats', (ctx) => MenuHandler.handleContentStats(ctx));
bot.action('stats:users', (ctx) => MenuHandler.handleStatsUsers(ctx));
bot.action('stats:games', (ctx) => MenuHandler.handleStatsGames(ctx));

// --- BAN/UNBAN HANDLERS ---
bot.action(/admin:ban:(\d+)/, async (ctx) => {
  try {
    const userId = parseInt(ctx.match[1]);
    const { User } = require('./database/models');
    const userToBan = await User.findOne({ userId });

    if (!userToBan) {
      return ctx.answerCbQuery('❌ لم يتم العثور على المستخدم');
    }

    userToBan.banned = true;
    userToBan.bannedAt = new Date();
    userToBan.bannedReason = 'تم الحظر من قبل الإدارة';
    await userToBan.save();

    await ctx.answerCbQuery('✅ تم حظر المستخدم بنجاح');
    await ctx.editMessageText(`✅ <b>تم حظر المستخدم</b>\n\n👤 ${userToBan.firstName}\n🆔 ${userId}`, 
      { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('⬅️ رجوع', 'settings:users')]]).reply_markup });
  } catch (error) {
    console.error('Ban error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

bot.action(/admin:unban:(\d+)/, async (ctx) => {
  try {
    const userId = parseInt(ctx.match[1]);
    const { User } = require('./database/models');
    const userToUnban = await User.findOne({ userId });

    if (!userToUnban) {
      return ctx.answerCbQuery('❌ لم يتم العثور على المستخدم');
    }

    userToUnban.banned = false;
    userToUnban.bannedAt = null;
    userToUnban.bannedReason = null;
    await userToUnban.save();

    await ctx.answerCbQuery('✅ تم السماح للمستخدم بنجاح');
    await ctx.editMessageText(`✅ <b>تم السماح للمستخدم</b>\n\n👤 ${userToUnban.firstName}\n🆔 ${userId}`, 
      { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('⬅️ رجوع', 'settings:users')]]).reply_markup });
  } catch (error) {
    console.error('Unban error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

// --- BROADCAST HANDLER ---
bot.action('admin:broadcast', async (ctx) => {
  try {
    ctx.session = ctx.session || {};
    ctx.session.adminAwait = { type: 'broadcast' };
    await ctx.answerCbQuery('✅ جاهز');
    await ctx.reply('📢 أدخل الرسالة المراد بثها لجميع المستخدمين:\n\n(اكتب /cancel للإلغاء)');
  } catch (error) {
    console.error('Broadcast error:', error);
    ctx.answerCbQuery('❌ حدث خطأ');
  }
});

bot.action('close', (ctx) => MenuHandler.handleClose(ctx));

// --- KHATMA ACTIONS ---
bot.action('khatma:addpage', (ctx) => MenuHandler.handleKhatmaAddPage(ctx, 1));
bot.action('khatma:add5', (ctx) => MenuHandler.handleKhatmaAddFive(ctx));
bot.action('khatma:reset', (ctx) => MenuHandler.handleKhatmaReset(ctx));
bot.action('khatma:save', (ctx) => MenuHandler.handleKhatmaSave(ctx));
bot.action('khatma:settings', (ctx) => MenuHandler.handleKhatmaSettings(ctx));
bot.action('khatma:toggleNotify', (ctx) => MenuHandler.handleKhatmaToggleNotify(ctx));
bot.action(/khatma:inc:(.+)/, (ctx) => {
  const delta = parseInt(ctx.match[1]);
  return MenuHandler.handleKhatmaAdjustIncrement(ctx, delta);
});
bot.action('khatma:setTime', (ctx) => MenuHandler.handleKhatmaSetTime(ctx));
bot.action('khatma:setTimezone', (ctx) => MenuHandler.handleKhatmaSetTimezone(ctx));
bot.action('khatma:share', (ctx) => MenuHandler.handleKhatmaShare(ctx));
bot.action('khatma:stats', (ctx) => MenuHandler.handleKhatmaStats(ctx));
bot.action('khatma:viewSaved', (ctx) => MenuHandler.handleKhatmaViewSaved(ctx));

// --- ADHKAR HANDLERS (أذكار الصباح والمساء والنوم) ---
bot.action('adhkar:morning', (ctx) => ContentHandler.handleMorningAdhkar(ctx));
bot.action('adhkar:evening', (ctx) => ContentHandler.handleEveningAdhkar(ctx));
bot.action('adhkar:sleep', (ctx) => ContentHandler.handleSleepAdhkar(ctx));
bot.action('adhkar:stats', (ctx) => ContentHandler.handleAdhkarStats(ctx));

// --- GAME HANDLERS ---
bot.action('game:rps', (ctx) => GameHandler.handleRPS(ctx));
bot.action(/game:rps:(rock|paper|scissors)/, (ctx) => {
  const choice = ctx.match[1];
  GameHandler.handleRPSChoice(ctx, choice);
});

bot.action('game:guess', (ctx) => GameHandler.handleGuess(ctx));
bot.action('game:quiz', (ctx) => GameHandler.handleQuiz(ctx));
bot.action(/game:quiz:(.+)/, (ctx) => {
  const answer = ctx.match[1];
  GameHandler.handleQuizAnswer(ctx, answer);
});

bot.action('game:dice', (ctx) => GameHandler.handleDice(ctx));
bot.action('game:luck', (ctx) => GameHandler.handleLuck(ctx));
bot.action('game:challenges', (ctx) => GameHandler.handleChallenges(ctx));

// --- ECONOMY HANDLERS ---
bot.action('eco:balance', (ctx) => EconomyHandler.handleBalance(ctx));
bot.action('eco:shop', (ctx) => EconomyHandler.handleShop(ctx));
bot.action(/shop:buy:(\d+)/, (ctx) => {
  const itemId = parseInt(ctx.match[1]);
  EconomyHandler.handleBuyItem(ctx, itemId);
});
bot.action('eco:inventory', (ctx) => EconomyHandler.handleInventory(ctx));
bot.action('eco:stats', (ctx) => EconomyHandler.handleEconomyStats(ctx));

// --- ADDITIONAL ECONOMY HANDLERS ---
bot.action('eco:transfer', async (ctx) => {
  try {
    ctx.session = ctx.session || {};
    ctx.session.ecoAwait = { type: 'transfer' };
    await ctx.answerCbQuery('✅ جاهز');
    await ctx.reply('💸 أدخل معرّف المستخدم الذي تريد التحويل له:\n\n(مثال: @username أو معرّفه الرقمي)');
  } catch (error) {
    console.error('Transfer error:', error);
    ctx.answerCbQuery('❌ خطأ');
  }
});

bot.action('eco:auction', async (ctx) => {
  try {
    const items = [
      '⭐ تذكرة نجمة - 500 عملة',
      '👑 تاج ملكي - 1000 عملة',
      '💎 جوهرة فريدة - 2000 عملة',
      '🎖️ وسام شرف - 750 عملة',
      '✨ أضاءة سحرية - 600 عملة'
    ];
    
    const message = `🎪 <b>سوق المزاد</b>\n\n${items.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}\n\n💰 اختر عنصراً للمزايدة عليه`;
    
    await ctx.editMessageText(message, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('⬅️ رجوع', 'menu:economy')]]).reply_markup });
    ctx.answerCbQuery('✅');
  } catch (error) {
    console.error('Auction error:', error);
    ctx.answerCbQuery('❌ خطأ');
  }
});

// --- CONTENT HANDLERS ---
bot.action('menu:baqfat', (ctx) => ContentHandler.handleBaqfat(ctx));
bot.action('menu:avatars', (ctx) => ContentHandler.handleAvatars(ctx));
bot.action('menu:tweets', (ctx) => ContentHandler.handleTweets(ctx));
bot.action('menu:books', (ctx) => ContentHandler.handleBooks(ctx));
bot.action('menu:stories', (ctx) => ContentHandler.handleStories(ctx));
bot.action('menu:movies', (ctx) => ContentHandler.handleMovies(ctx));
bot.action('menu:wallpapers', (ctx) => ContentHandler.handleWallpapers(ctx));
bot.action('menu:headers', (ctx) => ContentHandler.handleHeaders(ctx));
bot.action('menu:songs', (ctx) => ContentHandler.handleSongs(ctx));
bot.action('menu:entertainment', (ctx) => ContentHandler.handleEntertainment(ctx));

// --- PROFILE HANDLERS ---
bot.action('profile:info', (ctx) => ProfileHandler.handleProfileInfo(ctx));
bot.action('profile:badges', (ctx) => ProfileHandler.handleBadges(ctx));
bot.action('profile:stats', (ctx) => ProfileHandler.handleGameStats(ctx));
bot.action('profile:gifts', (ctx) => ProfileHandler.handleGifts(ctx));

// --- LEADERBOARD FILTERS ---
bot.action('leaderboard:xp', async (ctx) => {
  try {
    const users = await User.find().sort({ xp: -1 }).limit(10);
    const user = await User.findOne({ userId: ctx.from.id });
    const allUsers = await User.find().sort({ xp: -1 });
    const userRank = allUsers.findIndex(u => u.userId === user.userId) + 1;

    let board = `🏆 **أعلى 10 في النقاط**

🎯 ترتيبك: ${userRank}/${allUsers.length}\n\n`;
    
    users.forEach((u, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
      const userMark = u.userId === user.userId ? ' 👈' : '';
      board += `${medal} ${u.firstName || 'مستخدم'} - ⭐${u.xp.toLocaleString()}${userMark}\n`;
    });

    const buttons = Markup.inlineKeyboard([
      [
        Markup.button.callback('💰 العملات', 'leaderboard:coins'),
        Markup.button.callback('🎖️ المستويات', 'leaderboard:level')
      ],
      [Markup.button.callback('⬅️ رجوع', 'menu:main')]
    ]);
    await ctx.editMessageText(board, buttons);
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في التحديث');
  }
});

bot.action('leaderboard:coins', async (ctx) => {
  try {
    const users = await User.find().sort({ coins: -1 }).limit(10);
    const user = await User.findOne({ userId: ctx.from.id });
    const allUsers = await User.find().sort({ coins: -1 });
    const userRank = allUsers.findIndex(u => u.userId === user.userId) + 1;

    let board = `💰 **أغنى 10 مستخدمين**

🎯 ترتيبك: ${userRank}/${allUsers.length}\n\n`;
    
    users.forEach((u, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
      const userMark = u.userId === user.userId ? ' 👈' : '';
      board += `${medal} ${u.firstName || 'مستخدم'} - 💵${u.coins.toLocaleString()}${userMark}\n`;
    });

    const buttons = Markup.inlineKeyboard([
      [
        Markup.button.callback('⭐ النقاط', 'leaderboard:xp'),
        Markup.button.callback('🎖️ المستويات', 'leaderboard:level')
      ],
      [Markup.button.callback('⬅️ رجوع', 'menu:main')]
    ]);
    await ctx.editMessageText(board, buttons);
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في التحديث');
  }
});

bot.action('leaderboard:level', async (ctx) => {
  try {
    const users = await User.find().sort({ level: -1, xp: -1 }).limit(10);
    const user = await User.findOne({ userId: ctx.from.id });
    const allUsers = await User.find().sort({ level: -1, xp: -1 });
    const userRank = allUsers.findIndex(u => u.userId === user.userId) + 1;

    let board = `🎖️ **أعلى 10 في المستويات**

🎯 ترتيبك: ${userRank}/${allUsers.length}\n\n`;
    
    users.forEach((u, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
      const userMark = u.userId === user.userId ? ' 👈' : '';
      board += `${medal} ${u.firstName || 'مستخدم'} - 🎖️${u.level} (⭐${u.xp.toLocaleString()})${userMark}\n`;
    });

    const buttons = Markup.inlineKeyboard([
      [
        Markup.button.callback('⭐ النقاط', 'leaderboard:xp'),
        Markup.button.callback('💰 العملات', 'leaderboard:coins')
      ],
      [Markup.button.callback('⬅️ رجوع', 'menu:main')]
    ]);
    await ctx.editMessageText(board, buttons);
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في التحديث');
  }
});

// --- SMART STATS & REWARDS HANDLERS ---
bot.action('stats:view', async (ctx) => {
  try {
    const user = await User.findOne({ userId: ctx.from.id });
    if (!user) {
      return ctx.answerCbQuery('❌ لم يتم العثور على ملفك');
    }

    const statsMessage = Formatter.formatSmartStats(user);
    await ctx.editMessageText(statsMessage, Markup.inlineKeyboard([
      [Markup.button.callback('🎯 المهام اليومية', 'quests:daily')],
      [Markup.button.callback('🏅 الإنجازات', 'achievements:view')],
      [Markup.button.callback('⬅️ رجوع', 'menu:main')]
    ]));
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في التحديث');
  }
});

// --- AI ACHIEVEMENTS & NOTIFICATIONS ---
bot.action('achievements:view', async (ctx) => {
  try {
    const achievements = await SmartNotifications.checkAchievements(ctx.from.id);
    let message = '🏆 <b>إنجازاتك</b>\n\n';
    
    if (achievements.length > 0) {
      message += '<b>إنجازات جديدة! 🎉</b>\n';
      const formatted = SmartNotifications.formatAchievements(achievements);
      message += formatted;
    } else {
      message += '📊 لا توجد إنجازات جديدة حالياً\n';
      message += '💪 استمر في اللعب والقراءة لفتح إنجازات جديدة!';
    }

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '⬅️ رجوع', callback_data: 'stats:view' }
        ]]
      }
    });
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في الحصول على الإنجازات');
  }
});

bot.action('notification:check', async (ctx) => {
  try {
    const notification = await SmartNotifications.getSmartNotification(ctx.from.id, ctx);
    let message = '📢 <b>إشعاراتك الذكية</b>\n\n';
    
    if (notification) {
      message += SmartNotifications.formatNotification(notification);
    } else {
      message += '✅ لا توجد إشعارات جديدة';
    }

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '⬅️ رجوع', callback_data: 'menu:main' }
        ]]
      }
    });
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في الحصول على الإشعارات');
  }
});

bot.action('behavior:analyze', async (ctx) => {
  try {
    const behavior = await LearningSystem.analyzeUserBehavior(ctx.from.id);
    let message = '🧠 <b>تحليل سلوكك</b>\n\n';
    
    message += `<b>تفضيلاتك:</b>\n${behavior.preferences.join(', ')}\n\n`;
    message += `<b>النشاط:</b> ${behavior.activityLevel}\n`;
    message += `<b>المشاركة:</b> ${behavior.engagement}%\n\n`;
    message += `<b>نقاط قوتك:</b>\n${behavior.strengths.join(', ')}\n\n`;
    message += `<b>للتحسن:</b>\n${behavior.weaknesses.join(', ')}`;

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '⬅️ رجوع', callback_data: 'menu:main' }
        ]]
      }
    });
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في التحليل');
  }
});

// --- SMART STATS & REWARDS HANDLERS ---
bot.action('stats:view', async (ctx) => {
  try {
    const user = await User.findOne({ userId: ctx.from.id });
    if (!user) {
      return ctx.answerCbQuery('❌ لم يتم العثور على ملفك');
    }

    const statsMessage = Formatter.formatSmartStats(user);
    await ctx.editMessageText(statsMessage, Markup.inlineKeyboard([
      [Markup.button.callback('🎯 المهام اليومية', 'quests:daily')],
      [Markup.button.callback('🏅 الإنجازات', 'achievements:view')],
      [Markup.button.callback('⬅️ رجوع', 'menu:main')]
    ]));
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ في التحديث');
  }
});

bot.action('rewards:daily', async (ctx) => {
  try {
    const user = await User.findOne({ userId: ctx.from.id });
    if (!user) return ctx.answerCbQuery('❌ خطأ');

    const lastDaily = new Date(user.lastDailyReward);
    const now = new Date();
    const hoursDiff = (now - lastDaily) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
      const reward = 50;
      user.coins += reward;
      user.xp += 10;
      user.lastDailyReward = new Date();
      await user.save();
      
      await ctx.editMessageText(`🎁 **مكافأتك اليومية**

✅ حصلت على:
• 💰 ${reward} عملة
• ⭐ 10 نقاط

العودة غداً لأخذ المكافأة التالية!`, Markup.inlineKeyboard([
        [Markup.button.callback('⬅️ رجوع', 'menu:main')]
      ]));
    } else {
      const hoursLeft = Math.ceil(24 - hoursDiff);
      await ctx.answerCbQuery(`⏰ العودة في ${hoursLeft} ساعة`);
    }
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ');
  }
});

bot.action('achievements:view', async (ctx) => {
  try {
    const user = await User.findOne({ userId: ctx.from.id });
    const achievementsMsg = Formatter.formatAchievements(user);
    
    await ctx.editMessageText(achievementsMsg, Markup.inlineKeyboard([
      [Markup.button.callback('📊 الإحصائيات', 'stats:view')],
      [Markup.button.callback('⬅️ رجوع', 'menu:main')]
    ]));
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ');
  }
});

bot.action('quests:daily', async (ctx) => {
  try {
    const user = await User.findOne({ userId: ctx.from.id });
    const questsMsg = Formatter.formatDailyQuests(user);
    
    await ctx.editMessageText(questsMsg, Markup.inlineKeyboard([
      [Markup.button.callback('🎮 الألعاب', 'menu:games')],
      [Markup.button.callback('📖 الختمة', 'menu:khatma')],
      [Markup.button.callback('⬅️ رجوع', 'menu:main')]
    ]));
  } catch (error) {
    ctx.answerCbQuery('❌ خطأ');
  }
});

// --- KHATMA ACTIONS ---
bot.action('khatma:add5', async (ctx) => {
  const user = await User.findOne({ userId: ctx.from.id });
  if (user && user.khatmaProgress.currentPage < 604) {
    const pagesToAdd = Math.min(5, 604 - user.khatmaProgress.currentPage);
    user.khatmaProgress.currentPage += pagesToAdd;
    user.khatmaProgress.percentComplete = Math.round((user.khatmaProgress.currentPage / 604) * 100);
    user.khatmaProgress.lastRead = new Date();
    user.xp += pagesToAdd * 2;
    await user.save();
    await ctx.answerCbQuery(`✅ تم إضافة ${pagesToAdd} صفحات!`);
  }
  await MenuHandler.handleKhatmaMenu(ctx);
});

bot.action('khatma:addpage', async (ctx) => {
  const user = await User.findOne({ userId: ctx.from.id });
  if (user && user.khatmaProgress.currentPage < 604) {
    user.khatmaProgress.currentPage += 1;
    user.khatmaProgress.percentComplete = Math.round((user.khatmaProgress.currentPage / 604) * 100);
    user.khatmaProgress.lastRead = new Date();
    user.xp += 2;
    await user.save();
    await ctx.answerCbQuery('✅ تم إضافة صفحة! +2 نقاط');
  }
  await MenuHandler.handleKhatmaMenu(ctx);
});

bot.action('khatma:reset', async (ctx) => {
  const user = await User.findOne({ userId: ctx.from.id });
  if (user && user.khatmaProgress.currentPage >= 604) {
    user.khatmaProgress.currentPage = 1;
    user.khatmaProgress.percentComplete = 0;
    user.khatmaProgress.completionCount += 1;
    user.khatmaProgress.startDate = new Date();
    user.xp += 100;
    user.coins += 50;
    await user.save();
    await ctx.answerCbQuery('✅ مبروك! أكملت الختمة! +100 نقطة + 50 عملة');
  } else {
    await ctx.answerCbQuery('❌ لم تكملها بعد!');
  }
});

// --- SMART CONTENT HANDLERS ---
bot.action('adhkar:favorite', async (ctx) => {
  await ctx.answerCbQuery('❤️ تم حفظ الذكر في المفضلة!');
});

bot.action('quran:tafsir', async (ctx) => {
  await ctx.reply('📚 التفسير: هذه آية قرآنية كريمة تحتوي على حكم وعبر عظيمة...\n\n💡 تأمل فيها جيداً');
});

bot.action('quran:save', async (ctx) => {
  await ctx.answerCbQuery('❤️ تم حفظ الآية في المفضلة!');
});

bot.action('quote:save', async (ctx) => {
  await ctx.answerCbQuery('❤️ تم حفظ الاقتباس في المفضلة!');
});

bot.action('quote:share', async (ctx) => {
  await ctx.answerCbQuery('📤 شارك هذا الاقتباس مع أصدقائك!');
});

// --- KEYBOARD BUTTON HANDLERS ---
bot.hears('🕌 الختمة', (ctx) => MenuHandler.handleKhatmaMenu(ctx));
bot.hears('📿 الأذكار', (ctx) => MenuHandler.handleAdhkarMenu(ctx));
bot.hears('📖 القرآن', (ctx) => MenuHandler.handleQuranMenu(ctx));
bot.hears('💭 الاقتباسات', (ctx) => MenuHandler.handleQuotesMenu(ctx));
bot.hears('✍️ الشعر', (ctx) => MenuHandler.handlePoetryMenu(ctx));
bot.hears('🎮 الألعاب', (ctx) => MenuHandler.handleGamesMenu(ctx));
bot.hears('💰 الاقتصاد', (ctx) => MenuHandler.handleEconomyMenu(ctx));
bot.hears('👤 حسابي', (ctx) => MenuHandler.handleProfileMenu(ctx));
bot.hears('🏆 المتصدرين', (ctx) => MenuHandler.handleLeaderboardMenu(ctx));
bot.hears('⚙️ الإعدادات', (ctx) => MenuHandler.handleSettingsMenu(ctx));
bot.hears('✨ الميزات', (ctx) => CommandHandler.handleFeaturesMenu(ctx));
bot.hears('📚 المكتبة', (ctx) => CommandHandler.handleLibrary(ctx));
bot.hears('📊 إحصائيات', (ctx) => CommandHandler.handleStats(ctx));
bot.hears('🎁 المكافآت', (ctx) => CommandHandler.handleRewards(ctx));
bot.hears('❌ إغلق', (ctx) => ctx.deleteMessage().catch(() => ctx.reply('✅ تم')));

// --- OWNER KEYBOARD BUTTON HANDLERS ---
bot.hears('👑 لوحة المالك', async (ctx) => {
  const UIManager = require('./ui/keyboards');
  if (UIManager.isOwner(ctx.from.id)) {
    await CommandHandler.handleOwnerPanel(ctx);
  } else {
    ctx.reply('❌ هذا الأمر متاح للمالك فقط');
  }
});

// --- TEXT HANDLERS ---
bot.on('text', async (ctx) => {
  try {
    const message = ctx.message.text;

    // Handle feature awaiting input
    if (ctx.session && ctx.session.featureAwait) {
      const awaiting = ctx.session.featureAwait;
      ctx.session.featureAwait = null;

      if (awaiting.type === 'charity') {
        const CharityTracker = require('./features/charityTracker');
        const parts = message.trim().split(' ');
        let amount = 0;
        let description = message.trim();
        if (parts.length > 1 && /^\d+(\.\d+)?$/.test(parts[0])) {
          amount = parseFloat(parts[0]);
          description = parts.slice(1).join(' ');
        }

        const result = await CharityTracker.recordCharity(ctx.from.id, {
          type: awaiting.charityType,
          amount,
          description
        });

        return ctx.reply(result.message, { parse_mode: 'HTML' });
      }

      if (awaiting.type === 'memorization') {
        const MemorizationSystem = require('./features/memorizationSystem');
        const parts = message.split('|').map(p => p.trim());
        if (parts.length < 4) {
          return ctx.reply('❌ صيغة غير صحيحة. مثال: 1|الفاتحة|1|7');
        }

        const surah = parseInt(parts[0], 10);
        const surahName = parts[1];
        const fromAyah = parseInt(parts[2], 10);
        const toAyah = parseInt(parts[3], 10);

        if (Number.isNaN(surah) || Number.isNaN(fromAyah) || Number.isNaN(toAyah)) {
          return ctx.reply('❌ أرقام الآيات غير صحيحة');
        }

        const result = await MemorizationSystem.addMemorization(ctx.from.id, {
          surah,
          surahName,
          fromAyah,
          toAyah
        });

        return ctx.reply(result.message, { parse_mode: 'HTML' });
      }

      if (awaiting.type === 'team_create') {
        const TeamManager = require('./features/teamManager');
        const parts = message.split('|').map(p => p.trim());
        const name = parts[0];
        const description = parts[1] || '';
        if (!name) {
          return ctx.reply('❌ الرجاء إدخال اسم الفريق');
        }
        const result = await TeamManager.createTeam(ctx.from.id, name, description);
        return ctx.reply(result.message, { parse_mode: 'HTML' });
      }

      if (awaiting.type === 'team_join') {
        const TeamManager = require('./features/teamManager');
        const name = message.trim();
        if (!name) {
          return ctx.reply('❌ الرجاء إدخال اسم الفريق');
        }
        const result = await TeamManager.joinTeam(ctx.from.id, name);
        return ctx.reply(result.message, { parse_mode: 'HTML' });
      }
    }

    // Handle admin awaiting input
    if (ctx.session && ctx.session.adminAwait) {
      const awaiting = ctx.session.adminAwait;
      const { User } = require('./database/models');

      try {
        if (awaiting.type === 'searchUser') {
          // Search for user by ID or name
          let foundUser;
          if (/^\d+$/.test(message.trim())) {
            // Search by ID
            foundUser = await User.findOne({ userId: parseInt(message.trim()) });
          } else {
            // Search by name
            foundUser = await User.findOne({ firstName: new RegExp(message.trim(), 'i') });
          }

          ctx.session.adminAwait = null;

          if (!foundUser) {
            return ctx.reply('❌ لم يتم العثور على المستخدم');
          }

          const userInfo = `👤 <b>معلومات المستخدم</b>\n\n` +
            `👤 الاسم: ${foundUser.firstName}\n` +
            `🆔 ID: ${foundUser.userId}\n` +
            `⭐ النقاط: ${foundUser.xp || 0}\n` +
            `🎖️ المستوى: ${foundUser.level || 1}\n` +
            `💰 العملات: ${foundUser.coins || 0}\n` +
            `📅 تاريخ الانضمام: ${new Date(foundUser.joinedAt).toLocaleDateString('ar')}`;

          const buttons = Markup.inlineKeyboard([
            [Markup.button.callback('🚫 حظر', 'admin:ban:' + foundUser.userId)],
            [Markup.button.callback('✅ السماح', 'admin:unban:' + foundUser.userId)],
            [Markup.button.callback('⬅️ رجوع', 'settings:users')]
          ]);

          return ctx.reply(userInfo, { parse_mode: 'HTML', reply_markup: buttons.reply_markup });
        }

        if (awaiting.type === 'broadcast') {
          // Handle broadcast message
          if (message.toLowerCase() === '/cancel') {
            ctx.session.adminAwait = null;
            return ctx.reply('❌ تم الإلغاء');
          }

          const allUsers = await User.find({ banned: false });
          let sent = 0;
          let failed = 0;

          await ctx.reply(`📊 جاري الإرسال لـ ${allUsers.length} مستخدم...`);

          const sendPromises = allUsers.map(user => {
            return ctx.telegram.sendMessage(user.userId, 
              `📢 <b>رسالة من الإدارة</b>\n\n${message}`, 
              { parse_mode: 'HTML' }
            ).then(() => sent++)
            .catch(() => failed++);
          });

          await Promise.all(sendPromises);
          ctx.session.adminAwait = null;

          return ctx.reply(`✅ <b>تم الإرسال</b>\n\n✅ نجح: ${sent}\n❌ فشل: ${failed}`, { parse_mode: 'HTML' });
        }

        if (awaiting.type === 'transfer') {
          // Handle coin transfer
          const targetId = message.trim();
          let targetUser;

          if (/^\d+$/.test(targetId)) {
            targetUser = await User.findOne({ userId: parseInt(targetId) });
          } else if (targetId.startsWith('@')) {
            targetUser = await User.findOne({ firstName: new RegExp(targetId.substring(1), 'i') });
          } else {
            targetUser = await User.findOne({ firstName: new RegExp(targetId, 'i') });
          }

          ctx.session.ecoAwait = null;

          if (!targetUser) {
            return ctx.reply('❌ لم يتم العثور على المستخدم');
          }

          ctx.session.ecoAwait = { type: 'transferAmount', targetId: targetUser.userId, targetName: targetUser.firstName };
          return ctx.reply(`💸 كم عملة تريد التحويل لـ ${targetUser.firstName}?\n\n(رصيدك: ${(await User.findOne({ userId: ctx.from.id })).coins || 0} عملة)`);
        }

        if (awaiting.type === 'transferAmount') {
          // Handle transfer amount input
          const amount = parseInt(message.trim());
          const sender = await User.findOne({ userId: ctx.from.id });
          const receiver = await User.findOne({ userId: awaiting.targetId });

          if (isNaN(amount) || amount <= 0) {
            return ctx.reply('❌ المبلغ غير صحيح');
          }

          if (!sender || sender.coins < amount) {
            ctx.session.ecoAwait = null;
            return ctx.reply('❌ رصيدك غير كافي');
          }

          sender.coins -= amount;
          receiver.coins += amount;

          await sender.save();
          await receiver.save();

          ctx.session.ecoAwait = null;
          return ctx.reply(`✅ <b>تم التحويل بنجاح!</b>\n\n💸 حول ${amount} عملة لـ ${awaiting.targetName}\n💰 رصيدك الجديد: ${sender.coins} عملة`, { parse_mode: 'HTML' });
        }
      } catch (err) {
        console.error('Error handling ecoAwait input:', err);
        ctx.session.ecoAwait = null;
        return ctx.reply('❌ حدث خطأ أثناء المعالجة');
      }
    }

    // Handle owner awaiting input
    if (ctx.session && ctx.session.ownerAwait) {
      const awaiting = ctx.session.ownerAwait;
      const { User } = require('./database/models');
      const UIManager = require('./ui/keyboards');

      if (!UIManager.isOwner(ctx.from.id)) {
        ctx.session.ownerAwait = null;
        return ctx.reply('❌ غير مصرح');
      }

      try {
        if (awaiting.type === 'broadcast') {
          if (message.toLowerCase() === '/cancel') {
            ctx.session.ownerAwait = null;
            return ctx.reply('❌ تم الإلغاء');
          }

          const allUsers = await User.find({ banned: false });
          let sent = 0;
          let failed = 0;

          await ctx.reply(`📊 جاري الإرسال لـ ${allUsers.length} مستخدم...`);

          for (const user of allUsers) {
            try {
              await ctx.telegram.sendMessage(user.userId, 
                `📢 <b>رسالة من المالك</b>\n\n${message}`, 
                { parse_mode: 'HTML' }
              );
              sent++;
            } catch (e) {
              failed++;
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          ctx.session.ownerAwait = null;
          return ctx.reply(
            `✅ <b>تم الإرسال</b>\n\n✅ نجح: ${sent}\n❌ فشل: ${failed}`, 
            { parse_mode: 'HTML' }
          );
        }

        if (awaiting.type === 'givecoins') {
          if (message.toLowerCase() === '/cancel') {
            ctx.session.ownerAwait = null;
            return ctx.reply('❌ تم الإلغاء');
          }

          const parts = message.trim().split(/\s+/);
          if (parts.length !== 2) {
            return ctx.reply('❌ الصيغة غير صحيحة\nأرسل: ID المبلغ\nمثال: 123456789 1000');
          }

          const userId = parseInt(parts[0]);
          const amount = parseInt(parts[1]);

          if (isNaN(userId) || isNaN(amount) || amount <= 0) {
            return ctx.reply('❌ القيم غير صحيحة');
          }

          const targetUser = await User.findOne({ userId });
          if (!targetUser) {
            return ctx.reply('❌ لم يتم العثور على المستخدم');
          }

          targetUser.coins += amount;
          targetUser.totalEarnings += amount;
          await targetUser.save();

          ctx.session.ownerAwait = null;
          
          // Notify the user
          try {
            await ctx.telegram.sendMessage(userId, 
              `🎁 <b>مكافأة من المالك!</b>\n\n` +
              `تلقيت ${amount} عملة من مالك البوت!\n` +
              `رصيدك الجديد: ${targetUser.coins} عملة`, 
              { parse_mode: 'HTML' }
            );
          } catch (e) {
            // User blocked bot
          }

          return ctx.reply(
            `✅ <b>تم بنجاح</b>\n\n` +
            `المستخدم: ${targetUser.firstName}\n` +
            `المبلغ: ${amount} عملة\n` +
            `الرصيد الجديد: ${targetUser.coins} عملة`,
            { parse_mode: 'HTML' }
          );
        }

        if (awaiting.type === 'rewardall') {
          if (message.toLowerCase() === '/cancel') {
            ctx.session.ownerAwait = null;
            return ctx.reply('❌ تم الإلغاء');
          }

          const amount = parseInt(message.trim());
          if (isNaN(amount) || amount <= 0) {
            return ctx.reply('❌ المبلغ غير صحيح');
          }

          const allUsers = await User.find({ banned: false });
          let updated = 0;

          await ctx.reply(`⏳ جاري توزيع ${amount} عملة لـ ${allUsers.length} مستخدم...`);

          for (const user of allUsers) {
            user.coins += amount;
            user.totalEarnings += amount;
            await user.save();
            updated++;

            // Notify user
            try {
              await ctx.telegram.sendMessage(user.userId, 
                `🎁 <b>مكافأة جماعية!</b>\n\n` +
                `تلقيت ${amount} عملة من مالك البوت!\n` +
                `رصيدك الجديد: ${user.coins} عملة`, 
                { parse_mode: 'HTML' }
              );
            } catch (e) {
              // User blocked bot
            }

            // Small delay
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          ctx.session.ownerAwait = null;
          return ctx.reply(
            `✅ <b>تم التوزيع</b>\n\n` +
            `عدد المستخدمين: ${updated}\n` +
            `المبلغ لكل مستخدم: ${amount} عملة\n` +
            `المجموع الكلي: ${updated * amount} عملة`,
            { parse_mode: 'HTML' }
          );
        }
      } catch (err) {
        console.error('Error handling ownerAwait input:', err);
        ctx.session.ownerAwait = null;
        return ctx.reply('❌ حدث خطأ أثناء المعالجة');
      }
    }

    // Handle awaiting khatma settings input (time / timezone)
    if (ctx.session && ctx.session.khatmaAwait) {
      const awaiting = ctx.session.khatmaAwait;
      try {
        const { User } = require('./database/models');
        const user = await User.findOne({ userId: ctx.from.id });
        if (!user) return ctx.reply('❌ لم يتم العثور على ملفك');

        if (awaiting.type === 'notifyTime') {
          const m = message.trim();
          if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(m)) {
            return ctx.reply('❌ الصيغة غير صحيحة. الرجاء إرسال HH:MM مثل 08:30');
          }
          user.preferences = user.preferences || {};
          user.preferences.khatmaSettings = user.preferences.khatmaSettings || {};
          user.preferences.khatmaSettings.notifyTime = m;
          await user.save();
          ctx.session.khatmaAwait = null;
          return ctx.reply(`✅ تم حفظ وقت الإشعار: ${m}`);
        }

        if (awaiting.type === 'timezone') {
          const tz = message.trim();
          try {
            // validate timezone via Intl
            Intl.DateTimeFormat('en-US', { timeZone: tz });
            user.preferences = user.preferences || {};
            user.preferences.khatmaSettings = user.preferences.khatmaSettings || {};
            user.preferences.khatmaSettings.timezone = tz;
            await user.save();
            ctx.session.khatmaAwait = null;
            return ctx.reply(`✅ تم حفظ المنطقة الزمنية: ${tz}`);
          } catch (e) {
            return ctx.reply('❌ المنطقة الزمنية غير صالحة. حاول مثل: Asia/Riyadh أو UTC');
          }
        }
      } catch (err) {
        console.error('Error handling khatmaAwait input:', err);
        ctx.session.khatmaAwait = null;
        return ctx.reply('❌ حدث خطأ أثناء حفظ الإعداد');
      }
    }

    // Smart keyword detection
    if (message.includes('لوحة') || message.includes('dashboard')) {
      const dashboard = await IntegratedAI.generateSmartDashboard(ctx.from.id);
      const formatted = IntegratedAI.formatSmartDashboard(dashboard);
      return ctx.reply(formatted, { parse_mode: 'HTML' });
    }

    if (message.includes('إنجاز') || message.includes('achievement')) {
      const achievements = await SmartNotifications.checkAchievements(ctx.from.id);
      let response = '🏆 <b>إنجازاتك</b>\n\n';
      if (achievements.length > 0) {
        response += SmartNotifications.formatAchievements(achievements);
      } else {
        response += '📊 لا توجد إنجازات جديدة حالياً';
      }
      return ctx.reply(response, { parse_mode: 'HTML' });
    }

    if (message.includes('تحليل') || message.includes('analytics')) {
      const report = await AnalyticsEngine.generateUserReport(ctx.from.id);
      const formatted = AnalyticsEngine.formatReport(report);
      return ctx.reply(formatted, { parse_mode: 'HTML' });
    }

    if (message.includes('تدريب') || message.includes('coaching')) {
      const coaching = await IntegratedAI.generateCoachingMessage(ctx.from.id);
      return ctx.reply(coaching, { parse_mode: 'HTML' });
    }

    if (message.includes('تحفيز') || message.includes('motivation')) {
      const { User } = require('./database/models');
      const user = await User.findOne({ userId: ctx.from.id });
      if (user) {
        const motivation = IntegratedAI.generateMotivation(user);
        return ctx.reply(motivation, { parse_mode: 'HTML' });
      }
    }

    // Check if it's a game input
    if (ctx.session && ctx.session.gameState && ctx.session.gameState.game === 'guess') {
      const guess = parseInt(message);
      const number = ctx.session.gameState.number;

      if (isNaN(guess)) {
        return ctx.reply('❌ رقم صحيح من فضلك');
      }

      ctx.session.gameState.attempts++;

      if (guess === number) {
        ctx.reply(`🎉 صحيح! ${number}\n✅ 200 عملة!`);
        EconomyManager.addCoins(ctx.from.id, 200, 'لعبة تخمين');
        ctx.session.gameState = null;
      } else if (guess < number) {
        ctx.reply(`⬆️ أكبر من ${guess}`);
      } else {
        ctx.reply(`⬇️ أقل من ${guess}`);
      }

      if (ctx.session.gameState && ctx.session.gameState.attempts > 10) {
        ctx.reply(`❌ انتهت المحاولات! ${number}`);
        ctx.session.gameState = null;
      }
    } else {
      // Use AI for smart responses
      const aiResponse = await AIManager.generateSmartResponse(ctx.from.id, message);
      ctx.reply(aiResponse, { parse_mode: 'HTML' });

      // Record user interaction and update streak
      AIManager.recordUserInteraction(ctx.from.id, 'message:sent', 1);
      await LearningSystem.updateUserStreak(ctx.from.id);

      // Check for notifications
      const notification = await SmartNotifications.getSmartNotification(ctx.from.id, ctx);
      if (notification && Math.random() < 0.3) {
        // 30% chance to show notification
        setTimeout(() => {
          ctx.reply(SmartNotifications.formatNotification(notification), { parse_mode: 'HTML' });
        }, 2000);
      }
    }
  } catch (error) {
    console.error('Text handler error:', error);
    ctx.reply('❌ حدث خطأ، جاري المحاولة...');
  }
});

// --- BOT STARTUP WITH RECONNECTION ---
const reconnectManager = new ReconnectManager({
  maxRetries: 50,
  initialDelay: 3000,
  maxDelay: 300000,
  backoffMultiplier: 1.5,
});

let botStart = async () => {
  try {
    logger.info('🤖 جاري بدء بوت Telegram...');
    // Launch bot (non-blocking, returns immediately)
    bot.launch().then(() => {
      reconnectManager.isConnected = true;
      logger.info('✅ تم تشغيل البوت بنجاح!');
      logger.info('✅ البوت يعمل الآن!');
      logger.info('🎯 البوت مستعد و ينتظر الرسائل...');
    }).catch((error) => {
      logger.error('❌ فشل في بدء البوت:', error.message);
      reconnectManager.isConnected = false;
    });
    
    // Give it a moment to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  } catch (error) {
    logger.error('❌ فشل في بدء البوت:', error.message);
    reconnectManager.isConnected = false;
    return false;
  }
};

async function startBot() {
  try {
    // Connect to database
    logger.info('📦 جاري الاتصال بـ MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/arab-bot';
    
    // محاولة الاتصال بـ MongoDB مع إعادة محاولة
    await reconnectManager.connect(async () => {
      await Database.connect(mongoUri);
      logger.info('✅ تم الاتصال بـ MongoDB بنجاح!');
    });

    // Start bot with reconnection management
    logger.info('🚀 جاري بدء البوت...');
    
    let success = await botStart();
    
    if (!success) {
      // بدء نظام إعادة الاتصال التلقائي
      await reconnectManager.startAutoReconnect(
        botStart,
        () => {
          logger.info('🔄 تم استعادة الاتصال بالبوت!');
        }
      );
    }

    // بدء مراقبة صحة الاتصال
    await reconnectManager.startHealthCheck(
      async () => {
        // فحص أن البوت لا يزال يعمل
        try {
          if (bot.polling && bot.polling.timeout) {
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      },
      () => {
        logger.warn('⚠️ فقدان صلة البوت');
      }
    );

    // مراقبة اتصال الإنترنت
    connectionMonitor.startMonitoring((isOnline) => {
      if (isOnline) {
        logger.info('🌐 عاد اتصال الإنترنت!');
        healthMonitor.updateStats({ reconnectAttempts: healthMonitor.stats.reconnectAttempts + 1 });
        // حاول إعادة الاتصال إذا كان البوت معطل
        if (!reconnectManager.isConnected) {
          botStart();
        }
      } else {
        logger.warn('🌐 انقطع اتصال الإنترنت');
        reconnectManager.isConnected = false;
      }
    });

    // بدء مراقبة صحة البوت الدوري
    healthMonitor.startPeriodicCheck(60000); // فحص كل دقيقة

    logger.info('✅ البوت يعمل الآن!');
    logger.info(`🎯 البوت مستعد و ينتظر الرسائل...`);

      // Start Khatma scheduler (sends notifications to opted-in users)
      try {
        const KhatmaScheduler = require('./utils/khatmaScheduler');
        const khatmaScheduler = new KhatmaScheduler({ intervalMs: 1000 * 60 * 15 }, bot);
        khatmaScheduler.start();
        logger.info('🔔 KhatmaScheduler started — notifying opted-in users');

        // stop scheduler on shutdown
        process.once('SIGINT', () => {
          try { khatmaScheduler.stop(); } catch (e) { /* ignore */ }
        });
        process.once('SIGTERM', () => {
          try { khatmaScheduler.stop(); } catch (e) { /* ignore */ }
        });
      } catch (err) {
        logger.error('❌ Failed to start KhatmaScheduler:', err.message);
      }

    // Graceful shutdown
    process.once('SIGINT', () => {
      logger.info('🛑 جاري إيقاف البوت...');
      reconnectManager.stop();
      connectionMonitor.stopMonitoring();
      healthMonitor.stopPeriodicCheck();
      bot.stop('SIGINT');
      process.exit(0);
    });

    process.once('SIGTERM', () => {
      logger.info('🛑 جاري إيقاف البوت...');
      reconnectManager.stop();
      connectionMonitor.stopMonitoring();
      healthMonitor.stopPeriodicCheck();
      bot.stop('SIGTERM');
      process.exit(0);
    });

    // معالجة أخطاء غير متوقعة
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Promise Rejection غير معالج:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('❌ استثناء غير معالج:', error);
      // إعادة تشغيل البوت تلقائياً
      setTimeout(() => {
        logger.info('🔄 جاري إعادة تشغيل البوت...');
        botStart();
      }, 5000);
    });

  } catch (error) {
    logger.error('❌ فشل في بدء البوت:', error.message);
    logger.info('⏳ سيحاول البوت الاتصال مجدداً خلال 10 ثواني...');
    
    setTimeout(() => {
      startBot();
    }, 10000);
  }
}

// Start the bot
startBot();

module.exports = bot;
