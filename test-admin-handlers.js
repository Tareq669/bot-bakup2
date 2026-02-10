#!/usr/bin/env node

/**
 * اختبار معالجات الإدارة الجديدة
 */

require('dotenv').config();
const Database = require('./src/database/db');
const MenuHandler = require('./src/commands/menuHandler');

async function testAdminHandlers() {
  try {
    console.log('🧪 جاري اختبار معالجات الإدارة...\n');

    // Connect to database
    await Database.connect();
    console.log('✅ تم الاتصال بـ MongoDB\n');

    // Test 1: Check that handlers exist
    console.log('📋 فحص المعالجات:');
    const handlers = [
      'handleGeneralSettings',
      'handleUserManagement',
      'handleSecuritySettings',
      'handleContentManagement',
      'handleAdminStats',
      'handleSearchUser',
      'handleSecurityLogs',
      'handleContentStats',
      'handleStatsUsers',
      'handleStatsGames'
    ];

    handlers.forEach(handler => {
      if (typeof MenuHandler[handler] === 'function') {
        console.log(`✅ ${handler} - موجود`);
      } else {
        console.log(`❌ ${handler} - غير موجود`);
      }
    });

    // Test 2: Check user counts
    const { User, Transaction } = require('./src/database/models');
    const totalUsers = await User.countDocuments();
    const bannedUsers = await User.countDocuments({ banned: true });
    const totalTransactions = await Transaction.countDocuments();

    console.log(`\n📊 إحصائيات:
    👥 إجمالي المستخدمين: ${totalUsers}
    🚫 المستخدمين المحظورين: ${bannedUsers}
    💳 إجمالي المعاملات: ${totalTransactions}`);

    // Test 3: Check aggregation
    const economyStats = await User.aggregate([
      { $group: {
        _id: null,
        totalCoins: { $sum: '$coins' },
        avgCoins: { $avg: '$coins' },
        maxCoins: { $max: '$coins' }
      }}
    ]);

    if (economyStats.length > 0) {
      console.log(`\n💰 إحصائيات الاقتصاد:
      💵 إجمالي العملات: ${economyStats[0].totalCoins}
      📊 معدل العملات: ${economyStats[0].avgCoins.toFixed(2)}
      🏆 أعلى رصيد: ${economyStats[0].maxCoins}`);
    }

    console.log('\n✅ اكتمل الاختبار بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    process.exit(0);
  }
}

testAdminHandlers();
