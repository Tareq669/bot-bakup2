const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['competition', 'challenge', 'seasonal', 'community'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    userId: Number,
    joinedAt: Date,
    score: {
      type: Number,
      default: 0
    },
    progress: {
      type: Object,
      default: {}
    }
  }],
  prizes: [{
    rank: Number,
    coins: Number,
    xp: Number,
    badge: String,
    title: String
  }],
  requirements: {
    minLevel: {
      type: Number,
      default: 0
    },
    maxParticipants: Number,
    entryFee: {
      type: Number,
      default: 0
    }
  },
  rules: [String],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  },
  stats: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    }
  },
  createdBy: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
