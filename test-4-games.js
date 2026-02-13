// Test specific game issues
const QuranicGames = require('./src/games/quranicGames');

async function testAll() {
  console.log('=== Testing الألعاب الأربعة التي لا تعمل ===\n');

  // Test 1: Complete Verse
  console.log('1️⃣ Testing completeTheVerse:');
  const game1 = await QuranicGames.completeTheVerse();
  console.log('   Data returned:', game1);
  console.log('   correctAnswer type:', typeof game1.correctAnswer);
  console.log('   reward type:', typeof game1.reward);
  console.log('   Has correctAnswer?', game1.correctAnswer !== undefined);
  console.log('   Has reward?', game1.reward !== undefined);
  console.log('');

  // Test 2: Spot Difference
  console.log('2️⃣ Testing spotTheDifference:');
  const game2 = await QuranicGames.spotTheDifference();
  console.log('   Data returned:', game2);
  console.log('   isCorrect:', game2.isCorrect);
  console.log('   isCorrect type:', typeof game2.isCorrect);
  console.log('   What will be correctAnswer in gameState:', game2.isCorrect.toString());
  console.log('   reward type:', typeof game2.reward);
  console.log('');

  // Test 3: Trivia
  console.log('3️⃣ Testing qurranTrivia:');
  const game3 = await QuranicGames.qurranTrivia();
  console.log('   Data returned:', game3);
  console.log('   correctAnswer (index):', game3.correctAnswer);
  console.log('   options:', game3.options);
  console.log('   What will be correctAnswer in gameState:', game3.options[game3.correctAnswer]);
  console.log('   reward type:', typeof game3.reward);
  console.log('');

  // Test 4: Surah Count
  console.log('4️⃣ Testing surahCount:');
  const game4 = await QuranicGames.surahCount();
  console.log('   Data returned:', game4);
  console.log('   correctAnswer:', game4.correctAnswer);
  console.log('   correctAnswer type:', typeof game4.correctAnswer);
  console.log('   reward type:', typeof game4.reward);
  console.log('');

  // Simulate processQuranicAnswer logic
  console.log('=== Simulating processQuranicAnswer ===\n');

  // For complete_verse
  const gs1 = {
    game: 'quranic',
    type: 'complete_verse',
    correctAnswer: game1.correctAnswer,
    reward: game1.reward,
    surah: game1.surah
  };
  console.log('complete_verse gameState:', gs1);
  console.log('Validation check:', !gs1.correctAnswer || gs1.reward === undefined);
  console.log('');

  // For spot_difference
  const gs2 = {
    game: 'quranic',
    type: 'spot_difference',
    isCorrect: game2.isCorrect,
    correctAnswer: game2.isCorrect.toString(),
    correctVerse: game2.correctVerse,
    reward: game2.reward,
    surah: game2.surah
  };
  console.log('spot_difference gameState:', gs2);
  console.log('Validation check:', !gs2.correctAnswer || gs2.reward === undefined);
  console.log('');

  // For trivia
  const gs3 = {
    game: 'quranic',
    type: 'trivia',
    correctAnswer: game3.options[game3.correctAnswer],
    reward: game3.reward
  };
  console.log('trivia gameState:', gs3);
  console.log('Validation check:', !gs3.correctAnswer || gs3.reward === undefined);
  console.log('');

  // For surah_count
  const gs4 = {
    game: 'quranic',
    type: 'surah_count',
    correctAnswer: game4.correctAnswer,
    reward: game4.reward,
    surah: game4.surah
  };
  console.log('surah_count gameState:', gs4);
  console.log('Validation check:', !gs4.correctAnswer || gs4.reward === undefined);
  console.log('');

  console.log('=== Test Complete ===');
}

testAll().catch(console.error);
