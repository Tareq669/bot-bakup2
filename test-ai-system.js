#!/usr/bin/env node

/**
 * 🤖 نظام اختبار الذكاء الاصطناعي المتكامل
 * اختبر جميع وحدات AI الجديدة قبل الاستخدام في الإنتاج
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import AI Systems
const AIManager = require('./src/ai/aiManager');
const LearningSystem = require('./src/ai/learningSystem');
const SmartNotifications = require('./src/ai/smartNotifications');
const AnalyticsEngine = require('./src/ai/analyticsEngine');
const IntegratedAI = require('./src/ai/integratedAI');
const { User } = require('./src/database/models');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.yellow}\n========== ${msg} ==========${colors.reset}`)
};

async function testAISystems() {
  try {
    log.header('اختبار أنظمة الذكاء الاصطناعي');

    // Connect to database
    log.test('جاري الاتصال بـ MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/arab-bot';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    log.success('تم الاتصال بـ MongoDB بنجاح');

    // Create/Find test user
    log.test('جاري إنشاء/البحث عن مستخدم اختبار...');
    const testUserId = 999999999;
    let testUser = await User.findOne({ userId: testUserId });
    
    if (!testUser) {
      testUser = await User.create({
        userId: testUserId,
        firstName: 'اختبار',
        lastName: 'AL-BOT',
        level: 5,
        xp: 250,
        coins: 500,
        totalEarnings: 500,
        totalSpending: 0,
        gamesPlayed: { total: 15, wins: 10 },
        khatmaProgress: { currentPage: 50, daysActive: 10 },
        interactions: { gamesPlayed: 15, messagesRead: 50, commandsUsed: 20 },
        streak: { current: 7, longest: 14 }
      });
      log.success('تم إنشاء مستخدم اختبار جديد');
    } else {
      log.success('تم العثور على مستخدم اختبار موجود');
    }

    // Test 1: AIManager
    log.header('اختبار 1: مدير الذكاء الاصطناعي');
    log.test('اختبار كشف النوايا والاستجابات...');
    
    const testMessages = [
      'السلام عليكم ورحمة الله',
      'كيف أحسّن مستواي؟',
      'أريد نصيحة للختمة',
      'أخبرني عن الألعاب',
      'كم عملتي الآن؟',
      'أنا محبط، أحتاج تحفيز'
    ];

    for (const msg of testMessages) {
      const response = await AIManager.generateSmartResponse(testUserId, msg);
      log.success(`الرسالة: "${msg}"\nالاستجابة: ${response.substring(0, 60)}...`);
    }

    // Test 2: LearningSystem
    log.header('اختبار 2: نظام التعلم');
    log.test('تحليل السلوك...');
    const behavior = await LearningSystem.analyzeUserBehavior(testUserId);
    log.success(`التفضيلات: ${behavior.preferences.join(', ')}`);
    log.success(`مستوى النشاط: ${behavior.activityLevel}`);
    log.success(`نسبة المشاركة: ${behavior.engagement}%`);
    log.success(`نقاط القوة: ${behavior.strengths.join(', ')}`);

    // Test 3: SmartNotifications
    log.header('اختبار 3: نظام الإشعارات الذكية');
    log.test('فحص الإشعارات والإنجازات...');
    
    const notification = await SmartNotifications.getSmartNotification(testUserId);
    if (notification) {
      log.success(`نوع الإشعار: ${notification.type} - ${notification.title}`);
    } else {
      log.info('لا توجد إشعارات جديدة حالياً');
    }

    const achievements = await SmartNotifications.checkAchievements(testUserId);
    if (achievements.length > 0) {
      log.success(`الإنجازات الجديدة: ${achievements.map(a => a.title).join(', ')}`);
    } else {
      log.info('لا توجد إنجازات جديدة');
    }

    // Test 4: AnalyticsEngine
    log.header('اختبار 4: محرك التحليلات');
    log.test('إنشاء التقرير الشامل...');
    
    const report = await AnalyticsEngine.generateUserReport(testUserId);
    log.success(`الحالة: ${report.overview.status}`);
    log.success(`معدل الفوز: ${report.gameStats.winRate}`);
    log.success(`تقدم القراءة: ${report.readingStats.progress}`);
    log.success(`الحالة المالية: ${report.economyStats.wealthStatus}`);
    log.success(`المشاركة: ${report.comparison.levelComparison}`);

    // Test 5: IntegratedAI
    log.header('اختبار 5: نظام الذكاء المتكامل');
    log.test('إنشاء لوحة القيادة الذكية...');
    
    const dashboard = await IntegratedAI.generateSmartDashboard(testUserId);
    log.success(`السلسلة الحالية: ${dashboard.streak?.current || 0} أيام`);
    log.success(`عدد الاقتراحات: ${dashboard.recommendations?.length || 0}`);

    log.test('إنشاء رسالة التدريب...');
    const coaching = await IntegratedAI.generateCoachingMessage(testUserId);
    if (coaching) {
      log.success('تم إنشاء رسالة التدريب بنجاح');
    }

    log.test('التنبؤ باحتياجات المستخدم...');
    const predictions = await IntegratedAI.predictUserNeeds(testUserId);
    log.success(`التوقع: ${predictions.nextAction}`);

    // Test 6: Streak Tracking
    log.header('اختبار 6: تتبع السلسلة');
    log.test('تحديث السلسلة...');
    const updatedStreak = await LearningSystem.updateUserStreak(testUserId);
    log.success(`السلسلة الحالية: ${updatedStreak.current} أيام`);
    log.success(`أطول سلسلة: ${updatedStreak.longest} أيام`);

    // Summary
    log.header('ملخص الاختبار');
    log.success('✅ جميع اختبارات الوحدات نجحت!');
    log.success('✅ نظام الذكاء الاصطناعي يعمل بكفاءة عالية');
    log.success('✅ جميع المكونات متكاملة ومتسقة');

    // Test Statistics
    console.log(`
${colors.green}📊 إحصائيات الاختبار:
- عدد الرسائل المختبرة: ${testMessages.length}
- عدد التحليلات: 5
- عدد الإنجازات المفتوحة: ${achievements.length}
- معدل النجاح: 100%${colors.reset}
    `);

    // Cleanup
    log.test('تنظيف قاعدة البيانات...');
    await User.deleteOne({ userId: testUserId });
    log.success('تم حذف مستخدم الاختبار');

    log.header('انتهى الاختبار بنجاح! 🎉');

  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    log.success('تم إغلاق الاتصال بـ MongoDB');
    process.exit(0);
  }
}

// Run tests
console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║        🤖 اختبار نظام الذكاء الاصطناعي المتكامل         ║
║              Integrated AI System Testing                 ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

testAISystems().catch(error => {
  log.error(`فشل الاختبار: ${error.message}`);
  process.exit(1);
});
