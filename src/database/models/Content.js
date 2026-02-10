const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  contentType: {
    type: String,
    enum: [
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
    ],
    required: true,
    index: true
  },
  content: String,
  description: String,
  category: String,
  source: String,
  mediaUrl: String,
  metadata: mongoose.Schema.Types.Mixed,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 3
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', contentSchema);
