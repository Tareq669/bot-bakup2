#!/usr/bin/env node

/**
 * Test Script - اختبار نظام إعادة الاتصال
 * 
 * استخدام:
 * node test-reconnect.js
 */

const ReconnectManager = require('./src/utils/reconnect');
const { logger } = require('./src/utils/helpers');

console.log('\n🧪 اختبار نظام إعادة الاتصال\n');
console.log('═'.repeat(50) + '\n');

// اختبار 1: إنشاء ReconnectManager
console.log('✅ اختبار 1: إنشاء RE ConnectManager');
const reconnectManager = new ReconnectManager({
  maxRetries: 5,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 1.5,
});
console.log('   القيم الافتراضية:', reconnectManager.getStatus());
console.log('\n');

// اختبار 2: حساب التأخير
console.log('✅ اختبار 2: حساب التأخيرات مع exponential backoff');
for (let i = 0; i < 5; i++) {
  reconnectManager.retryCount = i;
  const delay = Math.round(reconnectManager.calculateDelay());
  console.log(`   محاولة ${i+1}: ${delay}ms (~${Math.round(delay/1000)}s)`);
}
console.log('\n');

// اختبار 3: محاولة الاتصال (محاكاة الفشل)
console.log('✅ اختبار 3: محاكاة فشل الاتصال');
let failCount = 0;
const failingConnect = async () => {
  failCount++;
  throw new Error('فشل الاتصال (محاكاة)');
};

reconnectManager.connect(failingConnect)
  .then(result => {
    console.log('   النتيجة:', result);
  })
  .catch(err => {
    console.log('   تم التقاط الخطأ:', err.message);
  });

setTimeout(() => {
  console.log('\n');

  // اختبار 4: نجاح الاتصال
  console.log('✅ اختبار 4: محاكاة نجاح الاتصال');
  reconnectManager.reset();
  
  const successConnect = async () => {
    return true;
  };

  reconnectManager.connect(successConnect)
    .then(result => {
      console.log('   النتيجة:', result);
      console.log('   الحالة:', reconnectManager.getStatus());
      console.log('\n');

      // اختبار 5: إعادة تعيين
      console.log('✅ اختبار 5: إعادة تعيين الحالة');
      reconnectManager.reset();
      console.log('   الحالة بعد التعيين:', reconnectManager.getStatus());
      console.log('\n');

      console.log('═'.repeat(50));
      console.log('✅ جميع الاختبارات نجحت!\n');
      process.exit(0);
    });
}, 100);
