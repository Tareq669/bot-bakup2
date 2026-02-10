const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/database/models').User;
const KhatmaProvider = require('./src/content/khatmaProvider');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // create or get a test user
  let user = await User.findOne({ userId: 999999 });
  if (!user) {
    user = new User({ userId: 999999, firstName: 'Test', username: 'test_khatma' });
    user.khatmaProgress = { currentPage: 1, percentComplete: 0, completionCount: 0 };
    await user.save();
    console.log('Created test user');
  }

  console.log('Initial page:', user.khatmaProgress.currentPage);
  await KhatmaProvider.advancePages(user, 1);
  await user.save();
  console.log('After +1 page:', user.khatmaProgress.currentPage, user.khatmaProgress.percentComplete + '%');

  await KhatmaProvider.advancePages(user, 5);
  await user.save();
  console.log('After +5 pages:', user.khatmaProgress.currentPage, user.khatmaProgress.percentComplete + '%');

  await KhatmaProvider.resetKhatma(user);
  await user.save();
  console.log('After reset:', user.khatmaProgress.currentPage, user.khatmaProgress.percentComplete + '%');

  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
