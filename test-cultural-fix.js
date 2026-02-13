/**
 * اختبار إصلاح لعبة الأسئلة الثقافية
 */

const QuranicGames = require('./src/games/quranicGames');

console.log('\n' + '='.repeat(70));
console.log('🧪 اختبار لعبة الأسئلة الثقافية المُصلحة');
console.log('='.repeat(70) + '\n');

// اختبر 5 أسئلة
for (let i = 1; i <= 5; i++) {
  const game = QuranicGames.getCulturalKnowledgeGame();
  const correctAnswer = game.options[game.answerIndex];
  const correctLetter = String.fromCharCode(65 + game.answerIndex);
  
  console.log(`📝 السؤال ${i}:`);
  console.log(`   السؤال: ${game.question}`);
  console.log(`   الخيارات:`);
  game.options.forEach((opt, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const marker = idx === game.answerIndex ? ' ✓' : '';
    console.log(`     ${letter}) ${opt}${marker}`);
  });
  console.log(`   ✓ الجواب الصحيح: ${correctLetter}) ${correctAnswer}`);
  console.log(`   Reward: ${game.reward} نقطة\n`);
}

console.log('='.repeat(70));
console.log('✅ لعبة الأسئلة الثقافية جاهزة!');
console.log('   يمكن للمستخدم الآن الرد بـ:');
console.log('   • A, B, C, D (الأحرف)');
console.log('   • 1, 2, 3, 4 (الأرقام)');
console.log('='.repeat(70) + '\n');
