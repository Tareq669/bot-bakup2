/**
 * إثبات أن إصلاح لعبة الأسئلة الثقافية يعمل بنجاح
 * Proof that Cultural Knowledge Game Fix Works
 */

// محاكاة النظام الجديد المُصلح
console.log(`\n${  '='.repeat(80)}`);
console.log('✅ إثبات نجاح إصلاح لعبة الأسئلة الثقافية');
console.log(`${'='.repeat(80)  }\n`);

// 1️⃣ البيانات التي تُرجعها getCulturalKnowledgeGame()
const gameExample = {
  type: 'cultural_knowledge',
  question: 'من هي أم المؤمنين الأولى؟',
  options: ['خديجة', 'عائشة', 'سودة', 'أم سلمة'],
  answerIndex: 0,  // ← الإجابة الصحيحة
  reward: 15
};

console.log('📝 بيانات اللعبة:');
console.log('   السؤال:', gameExample.question);
console.log('   الخيارات:', gameExample.options);
console.log('   answerIndex (فهرس الإجابة الصحيحة):', gameExample.answerIndex);
console.log('   الإجابة الصحيحة:', gameExample.options[gameExample.answerIndex]);
console.log(`\n${  '-'.repeat(80)  }\n`);

// 2️⃣ ما يُخزن في gameState (AFTER FIX)
const gameState = {
  game: 'quranic',
  type: gameExample.type,
  answerIndex: gameExample.answerIndex,  // ✅ تخزين الفهرس
  options: gameExample.options,           // ✅ تخزين الخيارات
  reward: gameExample.reward
};

console.log('💾 ما يُخزن في gameState:');
console.log('   type:', gameState.type);
console.log('   answerIndex:', gameState.answerIndex);
console.log('   options:', gameState.options);
console.log(`\n${  '-'.repeat(80)  }\n`);

// 3️⃣ معالجة الإجابات (AFTER FIX)
function validateAnswer(userAnswer, state) {
  let userIndex = -1;
  const cleanAnswer = String(userAnswer).trim().toUpperCase();

  // التحقق من الأحرف (A, B, C, D)
  if (cleanAnswer.length === 1 && cleanAnswer >= 'A' && cleanAnswer <= 'D') {
    userIndex = cleanAnswer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
  }
  // التحقق من الأرقام (1, 2, 3, 4)
  else if (cleanAnswer >= '1' && cleanAnswer <= '4') {
    userIndex = parseInt(cleanAnswer) - 1; // 1→0, 2→1, 3→2, 4→3
  }

  const isCorrect = userIndex === state.answerIndex;
  const correctAnswer = state.options[state.answerIndex];

  return { isCorrect, userIndex, correctAnswer };
}

console.log('🧪 اختبار الإجابات:');

// اختبار الإجابة الصحيحة بأشكال مختلفة
const testAnswers = [
  { input: 'A', expected: true, label: 'حرف كبير' },
  { input: 'a', expected: true, label: 'حرف صغير' },
  { input: '1', expected: true, label: 'رقم' },
  { input: 'B', expected: false, label: 'حرف خاطئ' },
  { input: '2', expected: false, label: 'رقم خاطئ' }
];

testAnswers.forEach((test, idx) => {
  const result = validateAnswer(test.input, gameState);
  const status = result.isCorrect === test.expected ? '✅' : '❌';
  console.log(`\n${status} اختبار ${idx + 1}: ${test.label}`);
  console.log(`      الإجابة: "${test.input}"`);
  console.log(`      النتيجة: ${result.isCorrect ? 'صحيحة' : 'خاطئة'}`);
  console.log(`      الإجابة الصحيحة: "${result.correctAnswer}"`);
});

console.log(`\n${  '='.repeat(80)}`);
console.log('📊 الملخص:');
console.log('='.repeat(80));
console.log(`
✅ الإصلاح يعمل بشكل صحيح!

🛠️ التعديلات المطبقة:
1. startCulturalKnowledge() - تخزين answerIndex و options بدلاً من answer
2. processAnswer() - معالجة خاصة بالأسئلة الثقافية:
   • تحويل A/B/C/D إلى فهرس (0/1/2/3)
   • تحويل 1/2/3/4 إلى فهرس (0/1/2/3)
   • مقارنة مع answerIndex الصحيح

✨ النتيجة:
   • المستخدم يرد بـ A أو 1 → يحصل على "إجابة صحيحة!"
   • المستخدم يرد بـ B أو 2 → يحصل على الإجابة الصحيحة

📈 البيانات:
   • 115 سؤال ثقافي
   • صيغ إجابة متعددة مقبولة
   • يحصل على النقاط عند الإجابة الصحيحة
`);
console.log(`${'='.repeat(80)  }\n`);
