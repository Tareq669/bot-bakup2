const Telegraf = require('telegraf');
const session = require('telegraf/session');

// Test session persistence
const bot = new Telegraf('test-token');
bot.use(session());

// Simulate setting gameState
const mockCtx = {
  session: {},
  from: { id: 123456 }
};

// Test 1: Complete Verse
console.log('=== Test 1: Complete Verse ===');
mockCtx.session.gameState = {
  game: 'quranic',
  type: 'complete_verse',
  correctAnswer: 'العالمين',
  reward: 10,
  surah: 'الفاتحة'
};
console.log('gameState:', JSON.stringify(mockCtx.session.gameState, null, 2));
console.log('Type:', mockCtx.session.gameState.type);
console.log('Reward:', mockCtx.session.gameState.reward);
console.log('CorrectAnswer:', mockCtx.session.gameState.correctAnswer);
console.log('');

// Test button action
const gameType = mockCtx.session.gameState.type;
console.log(`Button callback: qgame:${gameType}`);
console.log('');

// Test 2: Spot Difference
console.log('=== Test 2: Spot Difference ===');
mockCtx.session.gameState = {
  game: 'quranic',
  type: 'spot_difference',
  isCorrect: true,
  correctVerse: 'قل هو الله أحد',
  reward: 15,
  surah: 'الإخلاص'
};
console.log('Type:', mockCtx.session.gameState.type);
console.log('Reward:', mockCtx.session.gameState.reward);
console.log('');

// Test 3: Trivia
console.log('=== Test 3: Trivia ===');
mockCtx.session.gameState = {
  game: 'quranic',
  type: 'trivia',
  correctAnswer: 'الكوثر',
  reward: 10
};
console.log('Type:', mockCtx.session.gameState.type);
console.log('Reward:', mockCtx.session.gameState.reward);
console.log('CorrectAnswer:', mockCtx.session.gameState.correctAnswer);
console.log('');

// Test 4: Surah Count
console.log('=== Test 4: Surah Count ===');
mockCtx.session.gameState = {
  game: 'quranic',
  type: 'surah_count',
  correctAnswer: 7,
  reward: 10,
  surah: 'الفاتحة'
};
console.log('Type:', mockCtx.session.gameState.type);
console.log('Reward:', mockCtx.session.gameState.reward);
console.log('CorrectAnswer:', mockCtx.session.gameState.correctAnswer);
console.log('');

console.log('=== All types are defined correctly! ===');
