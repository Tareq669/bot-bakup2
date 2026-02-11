/**
 * Caching System
 * نظام تخزين مؤقت لتحسين الأداء
 */

const { logger } = require('../utils/helpers');
const NodeCache = require('node-cache');

class CacheManager {
  constructor(stdTTL = 600) { // 10 دقائق افتراضياً
    this.cache = new NodeCache({ stdTTL, checkperiod: 120 });
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  /**
   * حفظ قيمة في الكاش
   */
  set(key, value, ttl = null) {
    try {
      if (ttl) {
        this.cache.set(key, value, ttl);
      } else {
        this.cache.set(key, value);
      }
      this.stats.sets++;
      logger.info(`💾 Cached: ${key}`);
    } catch (error) {
      logger.error(`خطأ في حفظ الكاش: ${error.message}`);
    }
  }

  /**
   * الحصول على قيمة من الكاش
   */
  get(key) {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.stats.hits++;
      logger.info(`✅ Cache hit: ${key}`);
    } else {
      this.stats.misses++;
      logger.info(`❌ Cache miss: ${key}`);
    }
    return value;
  }

  /**
   * حذف قيمة من الكاش
   */
  delete(key) {
    this.cache.del(key);
    logger.info(`🗑️ Cleared: ${key}`);
  }

  /**
   * مسح الكاش بالكامل
   */
  flush() {
    this.cache.flushAll();
    logger.info('🧹 تم مسح الكاش بالكامل');
  }

  /**
   * عرض إحصائيات الكاش
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests * 100).toFixed(2) : 0;

    return {
      ...this.stats,
      totalRequests,
      hitRate: `${hitRate}%`,
      keys: this.cache.keys(),
      keyCount: this.cache.keys().length
    };
  }

  /**
   * كاش للمستخدمين
   */
  cacheUser(userId, userData, ttl = 300) {
    this.set(`user:${userId}`, userData, ttl);
  }

  /**
   * الحصول على بيانات مستخدم من الكاش
   */
  getUser(userId) {
    return this.get(`user:${userId}`);
  }

  /**
   * كاش للقيادرة
   */
  cacheLeaderboard(leaderboardData, ttl = 600) {
    this.set('leaderboard:main', leaderboardData, ttl);
    this.set('leaderboard:timestamp', new Date(), ttl);
  }

  /**
   * الحصول على القيادرة من الكاش
   */
  getLeaderboard() {
    return this.get('leaderboard:main');
  }

  /**
   * كاش للألعاب
   */
  cacheGameResults(gameId, results, ttl = 300) {
    this.set(`game:${gameId}`, results, ttl);
  }

  /**
   * كاش متعدد المفاتيح
   */
  mset(keyValuePairs) {
    for (const [key, value] of Object.entries(keyValuePairs)) {
      this.set(key, value);
    }
  }

  /**
   * الحصول على مفاتيح بنمط معين
   */
  getByPattern(pattern) {
    const keys = this.cache.keys();
    return keys.filter(key => key.includes(pattern));
  }

  /**
   * حذف جميع المفاتيح بنمط معين
   */
  deleteByPattern(pattern) {
    const keys = this.getByPattern(pattern);
    keys.forEach(key => this.delete(key));
    logger.info(`🗑️ تم حذف ${keys.length} مفتاح بنمط: ${pattern}`);
  }

  /**
   * كاش النتائج المحسوبة
   */
  cacheLongOperation(key, operation, ttl = 3600) {
    const cached = this.get(key);
    if (cached) return cached;

    const result = operation();
    this.set(key, result, ttl);
    return result;
  }

  /**
   * عرض حجم الكاش
   */
  getSize() {
    const keys = this.cache.keys();
    return {
      keysCount: keys.length,
      keys: keys
    };
  }

  /**
   * تنسيق الإحصائيات للعرض
   */
  formatStats() {
    const stats = this.getStats();
    return `
📊 <b>إحصائيات الكاش</b>

✅ نجاح: ${stats.hits}
❌ فشل: ${stats.misses}
📝 إجمالي الطلبات: ${stats.totalRequests}
📈 نسبة النجاح: ${stats.hitRate}
🔑 عدد المفاتيح: ${stats.keyCount}
`.trim();
  }
}

module.exports = CacheManager;
