const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  leader: {
    type: Number, // Telegram user ID
    required: true
  },
  members: [{
    userId: Number,
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['leader', 'admin', 'member'],
      default: 'member'
    }
  }],
  stats: {
    totalXP: {
      type: Number,
      default: 0
    },
    totalCoins: {
      type: Number,
      default: 0
    },
    totalKhatmaPages: {
      type: Number,
      default: 0
    },
    gamesPlayed: {
      type: Number,
      default: 0
    },
    gamesWon: {
      type: Number,
      default: 0
    }
  },
  settings: {
    isPrivate: {
      type: Boolean,
      default: false
    },
    maxMembers: {
      type: Number,
      default: 50
    },
    requireApproval: {
      type: Boolean,
      default: true
    }
  },
  achievements: [{
    name: String,
    description: String,
    unlockedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
teamSchema.index({ name: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ 'stats.totalXP': -1 });

module.exports = mongoose.model('Team', teamSchema);
