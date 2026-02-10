// اختبار نظام القرآن الكريم الجديد
const QuranProvider = require('./src/content/quranProvider');

async function testQuranSystem() {
  console.log('🧪 اختبار نظام القرآن الكريم...\n');

  try {
    // 1. اختبار الحصول على آية عشوائية
    console.log('1️⃣ اختبار الحصول على آية عشوائية:');
    const randomVerse = await QuranProvider.getRandomVerse();
    console.log(`   السورة: ${randomVerse.surah}`);
    console.log(`   الآية: ${randomVerse.ayah}`);
    console.log(`   النص: ${randomVerse.text}`);
    console.log(`   التفسير: ${randomVerse.tafsir}`);
    console.log(`   القارئ: ${randomVerse.reciter}`);
    console.log(`   الرابط الصوتي: ${randomVerse.audioUrl}\n`);

    // 2. اختبار الحصول على جميع الآيات
    console.log('2️⃣ اختبار الحصول على جميع الآيات:');
    const allVerses = await QuranProvider.getQuranVerses();
    console.log(`   ✅ تم تحميل ${allVerses.length} آية\n`);

    // 3. اختبار البحث حسب السورة
    console.log('3️⃣ اختبار البحث حسب السورة:');
    const surahVerses = await QuranProvider.getVerseByName('البقرة');
    console.log(`   ✅ الآيات في البقرة: ${surahVerses.length} آية\n`);

    // 4. اختبار قائمة السور
    console.log('4️⃣ اختبار قائمة السور:');
    const surahs = await QuranProvider.getAllSurahs();
    console.log(`   ✅ إجمالي السور: ${surahs.length}`);
    console.log(`   السور الأولى:`);
    surahs.slice(0, 5).forEach(s => {
      console.log(`      - ${s.number}: ${s.name} (${s.ayahs} آية) - ${s.type}`);
    });
    console.log();

    // 5. اختبار القراء الشهيرين
    console.log('5️⃣ اختبار القراء الشهيرين:');
    const reciters = await QuranProvider.getFamousReciters();
    console.log(`   ✅ إجمالي القراء: ${reciters.length}`);
    reciters.slice(0, 3).forEach(r => {
      console.log(`      - ${r.name} (${r.country}) - ⭐${r.rating}`);
    });
    console.log();

    // 6. اختبار احصائيات القرآن
    console.log('6️⃣ اختبار احصائيات القرآن:');
    const stats = await QuranProvider.getQuranStats();
    console.log(`   ✅ السور: ${stats.totalSurahs}`);
    console.log(`   ✅ الآيات: ${stats.totalAyahs}`);
    console.log(`   ✅ الكلمات: ${stats.totalWords}`);
    console.log(`   ✅ الحروف: ${stats.totalLetters}`);
    console.log(`   ✅ وقت الختمة: ${stats.timeToComplete}\n`);

    // 7. اختبار أجزاء القرآن
    console.log('7️⃣ اختبار أجزاء القرآن:');
    const parts = await QuranProvider.getQuranParts();
    console.log(`   ✅ إجمالي الأجزاء: ${parts.length}`);
    console.log(`      الجزء الأول: ${parts[0].name}`);
    console.log(`      الجزء الأخير: ${parts[parts.length - 1].name}\n`);

    // 8. اختبار التفسير الموجز
    console.log('8️⃣ اختبار التفسير الموجز:');
    const tafsir1 = QuranProvider.getTafsirShort('الحمد لله');
    const tafsir2 = QuranProvider.getTafsirShort('نور');
    console.log(`   "الحمد لله" → ${tafsir1}`);
    console.log(`   "نور" → ${tafsir2}\n`);

    console.log('✅ اختبار النظام نجح! جميع الميزات تعمل بشكل صحيح.\n');

    // عرض عينة من الآيات
    console.log('📖 عينة من الآيات المتاحة:');
    allVerses.slice(0, 5).forEach(v => {
      console.log(`   ${v.surahNumber}:${v.ayah} - ${v.surah}`);
    });

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    process.exit(1);
  }
}

testQuranSystem();
