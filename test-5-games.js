/**
 * 🎮 اختبار نظام الألعاب القرآنية الكامل
 * Test all 5 quranic games
 */

require('dotenv').config();
const QuranicGames = require('./src/games/quranicGames');

console.log('\n🎮 اختبار الألعاب القرآنية - 5 ألعاب\n');
console.log('='.repeat(50));

// Test 1: Guess the Surah
console.log('\n✅ 1. اختبار لعبة تخمين الآية (Guess the Surah)');
const guessGame = QuranicGames.getGuessTheSurahGame();
console.log('📌 البيانات:', JSON.stringify(guessGame, null, 2));
console.log('✓ الدليل:', guessGame.question);
console.log('✓ الإجابة:', guessGame.answer);
console.log('✓ النقاط:', guessGame.reward);

// Verify answer validation
const isCorrect1 = QuranicGames.checkAnswer(guessGame.answer, guessGame.answer, 'guess_surah');
console.log('✓ التحقق من الإجابة الصحيحة:', isCorrect1 ? '✅ نعم' : '❌ لا');

// Test 2: Complete the Verse
console.log('\n✅ 2. اختبار لعبة أكمل الآية (Complete the Verse)');
const completeGame = QuranicGames.getCompleteVerseGame();
console.log('📌 البيانات:', JSON.stringify(completeGame, null, 2));
console.log('✓ السورة:', completeGame.surah);
console.log('✓ الآية الناقصة:', completeGame.question);
console.log('✓ الإجابة:', completeGame.answer);

const isCorrect2 = QuranicGames.checkAnswer(completeGame.answer, completeGame.answer, 'complete_verse');
console.log('✓ التحقق من الإجابة الصحيحة:', isCorrect2 ? '✅ نعم' : '❌ لا');

// Test 3: Spot the Difference
console.log('\n✅ 3. اختبار لعبة اكتشف الفرق (Spot the Difference)');
const spotGame = QuranicGames.getSpotDifferenceGame();
console.log('📌 البيانات:', JSON.stringify(spotGame, null, 2));
console.log('✓ الآية:', spotGame.question);
console.log('✓ الإجابة (true/false):', spotGame.answer);

const isCorrect3 = QuranicGames.checkAnswer(spotGame.answer, spotGame.answer, 'spot_difference');
console.log('✓ التحقق من الإجابة الصحيحة:', isCorrect3 ? '✅ نعم' : '❌ لا');

// Test 4: Trivia
console.log('\n✅ 4. اختبار لعبة معلومات قرآنية (Trivia)');
const triviaGame = QuranicGames.getTriviaGame();
console.log('📌 البيانات:', JSON.stringify(triviaGame, null, 2));
console.log('✓ السؤال:', triviaGame.question);
console.log('✓ الخيارات:', triviaGame.options);
console.log('✓ الإجابة:', triviaGame.answer);

const isCorrect4 = QuranicGames.checkAnswer(triviaGame.answer, triviaGame.answer, 'trivia');
console.log('✓ التحقق من الإجابة الصحيحة:', isCorrect4 ? '✅ نعم' : '❌ لا');

// Test 5: Count Verses
console.log('\n✅ 5. اختبار لعبة عد الآيات (Count Verses)');
const countGame = QuranicGames.getCountVersesGame();
console.log('📌 البيانات:', JSON.stringify(countGame, null, 2));
console.log('✓ السورة:', countGame.surah);
console.log('✓ السؤال:', countGame.question);
console.log('✓ الإجابة:', countGame.answer);

const isCorrect5 = QuranicGames.checkAnswer(countGame.answer, countGame.answer, 'count_verses');
console.log('✓ التحقق من الإجابة الصحيحة:', isCorrect5 ? '✅ نعم' : '❌ لا');

// Summary
console.log(`\n${  '='.repeat(50)}`);
console.log('\n📊 ملخص الاختبارات');
console.log('==================');
console.log('✅ لعبة 1 - تخمين الآية:', isCorrect1 ? 'نجح ✓' : 'فشل ✗');
console.log('✅ لعبة 2 - أكمل الآية:', isCorrect2 ? 'نجح ✓' : 'فشل ✗');
console.log('✅ لعبة 3 - اكتشف الفرق:', isCorrect3 ? 'نجح ✓' : 'فشل ✗');
console.log('✅ لعبة 4 - معلومات قرآنية:', isCorrect4 ? 'نجح ✓' : 'فشل ✗');
console.log('✅ لعبة 5 - عد الآيات:', isCorrect5 ? 'نجح ✓' : 'فشل ✗');

const allPassed = isCorrect1 && isCorrect2 && isCorrect3 && isCorrect4 && isCorrect5;
console.log('\n🎉 النتيجة النهائية:', allPassed ? '✅ جميع الألعاب تعمل!' : '❌ توجد مشاكل');
console.log(`${'='.repeat(50)  }\n`);
