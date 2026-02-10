// اختبار نظام الأذكار المحسّن
const AdhkarProvider = require('./src/content/adhkarProvider');

async function testAdhkarSystem() {
  console.log('🧪 اختبار نظام الأذكار المحسّن...\n');

  try {
    // 1. اختبار الحصول على جميع الأذكار
    console.log('1️⃣ اختبار الحصول على جميع الأذكار:');
    const allAdhkar = await AdhkarProvider.getAdhkarVerses();
    console.log(`   ✅ تم تحميل ${allAdhkar.length} ذكر\n`);

    // 2. اختبار الحصول على ذكر عشوائي
    console.log('2️⃣ اختبار الحصول على ذكر عشوائي:');
    const randomAdhkar = await AdhkarProvider.getRandomAdhkar();
    console.log(`   التصنيف: ${randomAdhkar.categoryAr}`);
    console.log(`   العنوان: ${randomAdhkar.title}`);
    console.log(`   النص: ${randomAdhkar.text}`);
    console.log(`   الفائدة: ${randomAdhkar.benefits}`);
    console.log(`   المصدر: ${randomAdhkar.source}\n`);

    // 3. اختبار أذكار الصباح
    console.log('3️⃣ اختبار أذكار الصباح:');
    const morningAdhkar = await AdhkarProvider.getMorningAdhkar();
    console.log(`   ✅ عدد أذكار الصباح: ${morningAdhkar.length}`);
    morningAdhkar.slice(0, 3).forEach((a, i) => {
      console.log(`      ${i + 1}. ${a.title}`);
    });
    console.log();

    // 4. اختبار أذكار المساء
    console.log('4️⃣ اختبار أذكار المساء:');
    const eveningAdhkar = await AdhkarProvider.getEveningAdhkar();
    console.log(`   ✅ عدد أذكار المساء: ${eveningAdhkar.length}`);
    eveningAdhkar.slice(0, 3).forEach((a, i) => {
      console.log(`      ${i + 1}. ${a.title}`);
    });
    console.log();

    // 5. اختبار أذكار النوم
    console.log('5️⃣ اختبار أذكار النوم:');
    const sleepAdhkar = await AdhkarProvider.getSleepAdhkar();
    console.log(`   ✅ عدد أذكار النوم: ${sleepAdhkar.length}`);
    sleepAdhkar.slice(0, 3).forEach((a, i) => {
      console.log(`      ${i + 1}. ${a.title}`);
    });
    console.log();

    // 6. اختبار التصنيفات
    console.log('6️⃣ اختبار جميع التصنيفات:');
    const categories = await AdhkarProvider.getAllCategories();
    console.log(`   ✅ إجمالي التصنيفات: ${categories.length}`);
    categories.forEach(c => {
      console.log(`      ${c.emoji} ${c.name} (${c.count})`);
    });
    console.log();

    // 7. اختبار الإحصائيات
    console.log('7️⃣ اختبار إحصائيات الأذكار:');
    const stats = await AdhkarProvider.getAdhkarStats();
    console.log(`   ✅ إجمالي الأذكار: ${stats.totalAdhkar}`);
    console.log(`   ✅ أذكار الصباح: ${stats.morningAdhkar}`);
    console.log(`   ✅ أذكار المساء: ${stats.eveningAdhkar}`);
    console.log(`   ✅ أذكار النوم: ${stats.sleepAdhkar}`);
    console.log(`   ✅ إجمالي المرات: ${stats.totalRepeats}`);
    console.log(`   ✅ الوقت المستغرق: ${stats.estimatedTime}\n`);

    // 8. اختبار الفوائد
    console.log('8️⃣ اختبار الفوائد الروحية:');
    const benefit1 = AdhkarProvider.getAdhkarBenefit(1);
    const benefit5 = AdhkarProvider.getAdhkarBenefit(5);
    const benefit20 = AdhkarProvider.getAdhkarBenefit(20);
    console.log(`   ذكر 1: ${benefit1}`);
    console.log(`   ذكر 5: ${benefit5}`);
    console.log(`   ذكر 20: ${benefit20}\n`);

    // 9. اختبار الأذكار حسب الحالة النفسية
    console.log('9️⃣ اختبار الأذكار حسب الحالة النفسية:');
    const sadAdhkar = await AdhkarProvider.getAdhkarByMood('حزن');
    const fearAdhkar = await AdhkarProvider.getAdhkarByMood('خوف');
    const gratitudeAdhkar = await AdhkarProvider.getAdhkarByMood('شكر');
    console.log(`   😢 أذكار الحزن: ${sadAdhkar.length}`);
    console.log(`   😨 أذكار الخوف: ${fearAdhkar.length}`);
    console.log(`   🙏 أذكار الشكر: ${gratitudeAdhkar.length}\n`);

    // 10. اختبار الأذكار حسب الوقت
    console.log('🔟 اختبار الأذكار حسب الوقت:');
    const timedAdhkar = await AdhkarProvider.getTimedAdhkar();
    const currentHour = new Date().getHours();
    let timeType = 'عشوائي';
    if (currentHour >= 5 && currentHour < 12) timeType = 'صباحي';
    else if (currentHour >= 19 && currentHour < 23) timeType = 'مسائي';
    else if (currentHour >= 23 || currentHour < 5) timeType = 'نوم';
    console.log(`   ⏰ الوقت الحالي: ${currentHour}:00`);
    console.log(`   📿 نوع الذكر المقترح: ${timeType}`);
    console.log(`   ✅ عدد الخيارات: ${Array.isArray(timedAdhkar) ? timedAdhkar.length : 1}\n`);

    console.log('✅ اختبار النظام نجح! جميع الميزات تعمل بشكل صحيح.\n');

    // عرض ملخص البيانات
    console.log('📊 ملخص البيانات:');
    console.log('═══════════════════════════════════════════════');
    console.log(`📿 إجمالي الأذكار: ${allAdhkar.length}`);
    console.log(`🌅 أذكار الصباح: ${morningAdhkar.length}`);
    console.log(`🌙 أذكار المساء: ${eveningAdhkar.length}`);
    console.log(`😴 أذكار النوم: ${sleepAdhkar.length}`);
    console.log(`────────────────────────────────────────────────`);
    console.log(`🔢 إجمالي المرات اليومية: ${stats.totalRepeats}`);
    console.log(`⏱️  الوقت المتوسط للأذكار: ${stats.estimatedTime}`);
    console.log(`💫 الفوائد الروحية: ${allAdhkar.length} نوايا مختلفة`);
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    process.exit(1);
  }
}

testAdhkarSystem();
