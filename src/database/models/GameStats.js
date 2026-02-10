const mongoose = require('mongoose');

const gameStatsSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  gameName: {
    type: String,
    required: true,
    enum: [
      'حجر_ورق_مقص',
      'التخمين',
      'الحظ',
      'اسئلة_ثقافية',
      'رول_نرد',
      'تحديات_عشوائية'
    ]
  },
  played: {
    type: Number,
    default: 0
  },
  won: {
    type: Number,
    default: 0
  },
  lost: {
    type: Number,
    default: 0
  },
  draw: {
    type: Number,
    default: 0
  },
  coinsEarned: {
    type: Number,
    default: 0
  },
  coinsLost: {
    type: Number,
    default: 0
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  lastPlayed: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameStats', gameStatsSchema);
