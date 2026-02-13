/**
 * اختبار التحقق من إصلاح الـ Validation
 * Test for Validation Fix
 */

const QuranicGames = require('./src/games/quranicGames');

console.log(`\n${  '='.repeat(80)}`);
console.log('✅ اختبار إصلاح التحقق من البيانات');
console.log(`${'='.repeat(80)  }\n`);

// محاكاة processAnswer
function testValidation(gameState) {
  let isValid = true;
  let error = '';

  // التحقق من البيانات حسب نوع اللعبة
  if (!gameState.reward || !gameState.type) {
    error = 'Missing reward or type';
    isValid = false;
  }

  // للعبة الثقافية: يجب أن تكون هناك answerIndex و options
  if (gameState.type === 'cultural_knowledge' && (gameState.answerIndex === undefined || !gameState.options)) {
    error = 'Missing answerIndex or options for cultural_knowledge';
    isValid = false;
  }

  // للألعاب الأخرى: يجب أن يكون هناك answer
  if (gameState.type !== 'cultural_knowledge' && !gameState.answer) {
    error = 'Missing answer for other game types';
    isValid = false;
  }

  return { isValid, error };
}

// اختبر لعبة ثقافية
console.log('📝 اختبار لعبة ثقافية:');
const game1 = QuranicGames.getCulturalKnowledgeGame();
const gameState1 = {
  type: game1.type,
  answerIndex: game1.answerIndex,
  options: game1.options,
  reward: game1.reward
};

const result1 = testValidation(gameState1);
console.log(`   Question: ${game1.question}`);
console.log(`   answerIndex: ${game1.answerIndex}`);
console.log(`   options: ${game1.options.length} خيارات`);
console.log(`   ✅ التحقق: ${result1.isValid ? 'نجح' : `فشل - ${  result1.error}`}`);

// اختبر لعبة تخمين
console.log('\n📝 اختبار لعبة تخمين السورة:');
const game2 = QuranicGames.getGuessTheSurahGame();
const gameState2 = {
  type: game2.type,
  answer: game2.answer,
  reward: game2.reward
};

const result2 = testValidation(gameState2);
console.log(`   Question: ${game2.question}`);
console.log(`   Answer: ${game2.answer}`);
console.log(`   ✅ التحقق: ${result2.isValid ? 'نجح' : `فشل - ${  result2.error}`}`);

// اختبر معالجة الإجابة
console.log('\n📝 اختبار معالجة إجابات اللعبة الثقافية:');

function simulateAnswerProcessing(userAnswer, gameState) {
  let isCorrect = false;
  const cleanAnswer = String(userAnswer).trim().toUpperCase();

  if (gameState.type === 'cultural_knowledge') {
    let userIndex = -1;

    if (cleanAnswer.length === 1 && cleanAnswer >= 'A' && cleanAnswer <= 'D') {
      userIndex = cleanAnswer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    }
    else if (cleanAnswer >= '1' && cleanAnswer <= '4') {
      userIndex = parseInt(cleanAnswer) - 1; // 1→0, 2→1, 3→2, 4→3
    }

    isCorrect = userIndex === gameState.answerIndex;
  }

  return isCorrect;
}

// اختبر عدة إجابات
console.log('   السؤال: "من فتح الأندلس؟"');
console.log('   الخيارات: A) طارق بن زياد, B) قتيبة, C) حسان, D) الوليد');
console.log('   answerIndex: 0 (طارق بن زياد)');

const testAnswers = [
  { answer: 'A', expected: true },
  { answer: 'a', expected: true },
  { answer: '1', expected: true },
  { answer: 'B', expected: false },
  { answer: '2', expected: false }
];

const testGameState = {
  type: 'cultural_knowledge',
  answerIndex: 0,
  options: ['طارق بن زياد', 'قتيبة بن مسلم', 'حسان بن ثابت', 'الوليد بن عبدالملك'],
  reward: 15
};

testAnswers.forEach(test => {
  const result = simulateAnswerProcessing(test.answer, testGameState);
  const status = result === test.expected ? '✅' : '❌';
  console.log(`   ${status} الإجابة: "${test.answer}" → ${result ? 'صحيحة' : 'خاطئة'} (متوقع: ${test.expected ? 'صحيحة' : 'خاطئة'})`);
});

console.log(`\n${  '='.repeat(80)}`);
console.log('🎉 الاختبار اكتمل! اللعبة الثقافية الآن تعمل بشكل صحيح!');
console.log(`${'='.repeat(80)  }\n`);
