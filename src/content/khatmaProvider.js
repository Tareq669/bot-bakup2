const QuranProvider = require('./quranProvider');

class KhatmaProvider {
  // Total pages in standard mushaf
  static totalPages() {
    return 604;
  }

  // Basic page info: percent and a sample verse to guide the user
  static async getPageInfo(page) {
    const total = this.totalPages();
    const normalized = Math.max(1, Math.min(total, Number(page) || 1));
    const percent = Math.round((normalized / total) * 100);
    // Attempt to read precise map if provided (file: pageMap.json)
    let map = null;
    try {
      map = require('./pageMap.json');
    } catch (e) {
      try { map = require('./pageMap.sample.json'); } catch (e2) { map = null; }
    }

    let surahHint = null;
    if (map && map[normalized]) {
      surahHint = map[normalized];
    }

    // Use a sample verse as fallback inspirational marker
    const sampleVerse = await QuranProvider.getRandomVerse();

    return {
      page: normalized,
      totalPages: total,
      percent,
      sample: sampleVerse,
      guidance: `اقرأ الصفحة ${normalized} من المصحف اليوم. هدف الختمة: إكمال ${total} صفحة.`,
      surahHint
    };
  }

  // Advance pages for a user object (mutates user.khatmaProgress)
  static async advancePages(user, delta = 1) {
    if (!user) throw new Error('User required');
    const total = this.totalPages();
    const current = user.khatmaProgress.currentPage || 1;
    const next = Math.min(total, current + Number(delta));
    user.khatmaProgress.currentPage = next;
    user.khatmaProgress.percentComplete = Math.round((next / total) * 100);
    user.khatmaProgress.lastRead = new Date();
    if (next === total) {
      user.khatmaProgress.completionCount = (user.khatmaProgress.completionCount || 0) + 1;
      user.khatmaProgress.endDate = new Date();
    }
    return user;
  }

  static async resetKhatma(user) {
    if (!user) throw new Error('User required');
    user.khatmaProgress.currentPage = 1;
    user.khatmaProgress.percentComplete = 0;
    user.khatmaProgress.startDate = new Date();
    user.khatmaProgress.lastRead = null;
    return user;
  }
}

module.exports = KhatmaProvider;
