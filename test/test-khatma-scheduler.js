const mongoose = require('mongoose');
require('dotenv').config();
const { User } = require('../src/database/models');
const KhatmaScheduler = require('../src/utils/khatmaScheduler');
const Database = require('../src/database/db');

async function runTest() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/arab-bot-test';
  await Database.connect(mongoUri);

  // create test user
  let user = await User.findOne({ userId: 999999 });
  if (!user) {
    user = new User({ userId: 999999, firstName: 'Test', khatmaProgress: { currentPage: 1 } });
  }
  user.preferences = user.preferences || {};
  user.preferences.khatmaSettings = Object.assign({}, user.preferences.khatmaSettings || {}, {
    notify: true,
    dailyIncrement: 1,
    timezone: 'UTC',
    notifyTime: (new Date()).toISOString().slice(11,16),
    notifyWindowMinutes: 120
  });
  await user.save();

  console.log('Created test user with notifyTime', user.preferences.khatmaSettings.notifyTime);

  const scheduler = new KhatmaScheduler({ intervalMs: 1000 * 60 * 60 }, null);
  // call tick directly to simulate
  await scheduler.tick();

  const refreshed = await User.findOne({ userId: 999999 });
  console.log('After tick - page:', refreshed.khatmaProgress.currentPage, 'percent:', refreshed.khatmaProgress.percentComplete);

  // cleanup
  await User.deleteOne({ userId: 999999 });
  await Database.disconnect();
  process.exit(0);
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
