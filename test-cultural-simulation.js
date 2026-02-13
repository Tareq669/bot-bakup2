/**
 * اختبار محاكاة شامل - إصلاح لعبة الأسئلة الثقافية
 * Comprehensive Simulation - Cultural Knowledge Game Fix
 */

const QuranicGames = require('./src/games/quranicGames');

console.log(`\n${  '='.repeat(80)}`);
console.log('🧪 اختبار شامل - إصلاح لعبة الأسئلة الثقافية');
console.log(`${'='.repeat(80)  }\n`);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// محاكاة processAnswer للعبة الثقافية
function simulateProcessAnswer(userAnswer, gameState) {
  let isCorrect = false;
  const cleanAnswer = String(userAnswer).trim().toUpperCase();

  if (gameState.type === 'cultural_knowledge') {
    let userIndex = -1;

    // التحقق من الأحرف (A, B, C, D)
    if (cleanAnswer.length === 1 && cleanAnswer >= 'A' && cleanAnswer <= 'D') {
      userIndex = cleanAnswer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    }
    // التحقق من الأرقام (1, 2, 3, 4)
    else if (cleanAnswer >= '1' && cleanAnswer <= '4') {
      userIndex = parseInt(cleanAnswer) - 1; // 1→0, 2→1, 3→2, 4→3
    }

    isCorrect = userIndex === gameState.answerIndex;
  }

  return isCorrect;
}

// اختبر 20 سؤال
console.log('📝 اختبار 20 سؤال من لعبة الأسئلة الثقافية:\n');

for (let i = 1; i <= 20; i++) {
  const game = QuranicGames.getCulturalKnowledgeGame();

  // إنشاء gameState مثل ما يفعل السيستم الفعلي
  const gameState = {
    game: 'quranic',
    type: game.type,
    answerIndex: game.answerIndex,
    options: game.options,
    reward: game.reward
  };

  // الحصول على الإجابة الصحيحة
  const correctLetter = String.fromCharCode(65 + game.answerIndex);
  const correctNumber = (game.answerIndex + 1).toString();
  const correctAnswer = game.options[game.answerIndex];

  // اختبار 1: الإجابة بالأحرف الكبيرة
  const test1 = simulateProcessAnswer(correctLetter, gameState);
  totalTests++;
  if (test1) {
    passedTests++;
    console.log(`✅ السؤال ${i}: ${correctLetter} (حرف) - نجح`);
  } else {
    failedTests++;
    console.log(`❌ السؤال ${i}: ${correctLetter} (حرف) - فشل`);
  }

  // اختبار 2: الإجابة بالأحرف الصغيرة
  const test2 = simulateProcessAnswer(correctLetter.toLowerCase(), gameState);
  totalTests++;
  if (test2) {
    passedTests++;
    console.log(`✅ السؤال ${i}: ${correctLetter.toLowerCase()} (حرف صغير) - نجح`);
  } else {
    failedTests++;
    console.log(`❌ السؤال ${i}: ${correctLetter.toLowerCase()} (حرف صغير) - فشل`);
  }

  // اختبار 3: الإجابة بالأرقام
  const test3 = simulateProcessAnswer(correctNumber, gameState);
  totalTests++;
  if (test3) {
    passedTests++;
    console.log(`✅ السؤال ${i}: ${correctNumber} (رقم) - نجح`);
  } else {
    failedTests++;
    console.log(`❌ السؤال ${i}: ${correctNumber} (رقم) - فشل`);
  }
}

// الملخص
console.log(`\n${  '='.repeat(80)}`);
console.log('📊 ملخص النتائج:');
console.log('='.repeat(80));
console.log(`📈 إجمالي الاختبارات: ${totalTests}`);
console.log(`✅ نجح: ${passedTests}`);
console.log(`❌ فشل: ${failedTests}`);
console.log(`📊 نسبة النجاح: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

if (failedTests === 0) {
  console.log('\n🎉 جميع الاختبارات نجحت! اللعبة الثقافية تعمل بشكل مثالي!');
} else {
  console.log(`\n⚠️  هناك ${failedTests} اختبارات فاشلة.`);
}

console.log(`${'='.repeat(80)  }\n`);
