/**
 * Bot Configuration and Constants
 */

const CONFIG = {
  // Game constants
  GAMES: {
    RPS: 'حجر_ورق_مقص',
    GUESS: 'التخمين',
    LUCK: 'الحظ',
    QUIZ: 'اسئلة_ثقافية',
    DICE: 'رول_نرد',
    CHALLENGES: 'تحديات_عشوائية'
  },

  // Economic constants
  ECONOMY: {
    INITIAL_COINS: 100,
    DAILY_REWARD_MIN: 50,
    DAILY_REWARD_MAX: 500,
    SHOP_ITEMS: [
      { id: 1, name: '⭐ نجمة برّاقة', price: 100 },
      { id: 2, name: '🎖️ ميدالية ذهبية', price: 250 },
      { id: 3, name: '👑 تاج ملكي', price: 500 },
      { id: 4, name: '🎯 درع الشرف', price: 1000 },
      { id: 5, name: '💎 جوهرة نادرة', price: 2000 }
    ]
  },

  // Level constants
  LEVELS: {
    XP_PER_LEVEL: 1000,
    MAX_LEVEL: 100
  },

  // Permission levels
  PERMISSIONS: {
    USER: 0,
    ADMIN: 1,
    BOT_ADMIN: 2,
    BOT_OWNER: 3
  },

  // Cooldown times (in seconds)
  COOLDOWNS: {
    COMMAND: 2,
    GAME: 5,
    TRANSFER: 10,
    DAILY: 86400 // 24 hours
  },

  // Content types
  CONTENT_TYPES: [
    'اذكار',
    'قران',
    'اقتباسات',
    'شعر',
    'بقفات',
    'افاتارات',
    'تريد',
    'كتب',
    'جداريات',
    'هيدرات',
    'اغاني',
    'قصص',
    'افلام'
  ]
};

module.exports = CONFIG;
