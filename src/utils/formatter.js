/**
 * Formatter Utility - تنسيق الرسائل والبيانات
 */

class Formatter {
  /**
   * تنسيق معلومات المستخدم
   */
  static formatUserProfile(user) {
    return `
👤 <b>ملفك الشخصي</b>

👤 الاسم: ${user.firstName || 'مستخدم'}
🆔 المعرّف: @${user.username || 'بدون معرّف'}
⭐ المستوى: ${user.level || 1}
💰 العملات: ${user.coins || 0}
📊 نقاط الخبرة: ${user.xp || 0}
🎮 الألعاب المكملة: ${user.gamesCompleted || 0}
📖 الختمات: ${user.khatmaCount || 0}

تاريخ الانضمام: ${new Date(user.createdAt).toLocaleDateString('ar-SA')}
    `.trim();
  }

  /**
   * تنسيق الإحصائيات الذكية
   */
  static formatSmartStats(user) {
    const totalActivity = (user.gamesCompleted || 0) + (user.khatmaCount || 0);
    const level = Math.floor((user.xp || 0) / 100) + 1;

    return `
📊 <b>إحصائياتك الذكية</b>

⭐ المستوى: ${level}
📈 نقاط الخبرة: ${user.xp || 0}
💰 الرصيد: ${user.coins || 0} عملة
🎮 النشاط الكلي: ${totalActivity}
🏆 الترتيب: #${user.rank || 'غير معروف'}

آخر نشاط: ${user.lastActivity ? new Date(user.lastActivity).toLocaleDateString('ar-SA') : 'لا يوجد'}
    `.trim();
  }

  /**
   * تنسيق المهام اليومية
   */
  static formatDailyQuests(user) {
    const quests = [
      { id: 1, name: '🎮 لعب لعبة', reward: 20, completed: user.dailyQuests?.games || false },
      { id: 2, name: '📖 قراءة صورة', reward: 30, completed: user.dailyQuests?.quran || false },
      { id: 3, name: '📿 قول أذكار', reward: 25, completed: user.dailyQuests?.adhkar || false },
      { id: 4, name: '💬 التفاعل في المجموعة', reward: 15, completed: user.dailyQuests?.interact || false }
    ];

    let message = '📋 <b>المهام اليومية</b>\n\n';

    quests.forEach(quest => {
      const status = quest.completed ? '✅' : '⏳';
      message += `${status} ${quest.name} - ${quest.reward} عملة\n`;
    });

    const completedCount = quests.filter(q => q.completed).length;
    message += `\n✨ المكتملة: ${completedCount}/${quests.length}`;

    return message;
  }

  /**
   * تنسيق لوحة المتصدرين
   */
  static formatLeaderboard(users) {
    let message = '🏆 <b>لوحة المتصدرين</b>\n\n';

    users.forEach((user, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      message += `${medal} ${user.firstName || 'مستخدم'} - ⭐ ${user.xp || 0} نقطة\n`;
    });

    return message;
  }

  /**
   * تنسيق رسالة الخطأ
   */
  static formatError(message) {
    return `❌ <b>خطأ</b>\n\n${message}`;
  }

  /**
   * تنسيق رسالة النجاح
   */
  static formatSuccess(message) {
    return `✅ <b>تم بنجاح</b>\n\n${message}`;
  }

  /**
   * تنسيق معلومات اللعبة
   */
  static formatGameInfo(game) {
    return `
🎮 <b>${game.name}</b>

📝 ${game.description}

👥 اللاعبون: ${game.players || 0}
💰 المكافأة: ${game.reward || 0} عملة
⏱️ المدة: ${game.duration || 'متغيرة'}

الحالة: ${game.active ? '✅ نشطة' : '❌ مغلقة'}
    `.trim();
  }

  /**
   * تنسيق معلومات المتجر
   */
  static formatShopItem(item) {
    return `
🛍️ <b>${item.name}</b>

📝 ${item.description}
💰 السعر: ${item.price} عملة

${item.limited ? '⚠️ عرض محدود الوقت!' : ''}
    `.trim();
  }

  /**
   * تنسيق إحصائيات الاقتصاد
   */
  static formatEconomyStats(user) {
    return `
💰 <b>إحصائائيات الاقتصاد</b>

💵 الرصيد: ${user.coins || 0}
📊 الإنفاق: ${user.totalSpent || 0}
📈 المكاسب: ${user.totalEarned || 0}
🎁 الإعطاءات: ${user.gifted || 0}

المحفظة: ${user.wallet ? '✅ مفعلة' : '❌ معطلة'}
    `.trim();
  }

  /**
   * تنسيق الإنجازات
   */
  static formatAchievements(achievements) {
    let message = '';
    achievements.forEach(ach => {
      message += `🏅 ${ach.name} - ${ach.description}\n`;
    });
    return message;
  }

  /**
   * تنسيق الرسائل الطويلة مع ترقيم
   */
  static truncate(text, length = 4096) {
    if (text.length <= length) return text;
    return text.substring(0, length - 3) + '...';
  }

  /**
   * تنسيق رسالة التحويل
   */
  static formatTransfer(from, to, amount) {
    return `
💸 <b>تحويل أموال</b>

من: ${from.firstName}
إلى: ${to.firstName}
المبلغ: ${amount} عملة

✅ تم التحويل بنجاح!
    `.trim();
  }
}

module.exports = Formatter;