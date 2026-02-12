/**
 * Multi-Language Support System
 * نظام دعم اللغات المتعددة
 */

const { logger } = require('../utils/helpers');
const User = require('../database/models/User');

class LanguageManager {
  constructor() {
    this.languages = {
      ar: {
        name: '🇸🇦 العربية',
        flag: 'ar',
        translations: this.getArabicTranslations()
      },
      en: {
        name: '🇺🇸 English',
        flag: 'en',
        translations: this.getEnglishTranslations()
      },
      fr: {
        name: '🇫🇷 Français',
        flag: 'fr',
        translations: this.getFrenchTranslations()
      }
    };
  }

  /**
   * الترجمات العربية
   */
  getArabicTranslations() {
    return {
      welcome_user: '👋 مرحباً {name}!\n\n🎯 اختر من لوحة المفاتيح:',
      owner_welcome: '👑 أهلاً بك يا مالك البوت {name}!\n\n⚡ لديك صلاحيات كاملة على النظام\n🎯 اختر من لوحة المفاتيح الخاصة:',
      friend: 'صديقي',
      help_title: '📚 الأوامر المتاحة:',
      help_start: '/start - البدء',
      help_profile: '/profile - ملفك',
      help_balance: '/balance - رصيدك',
      help_daily: '/daily - مكافأة يومية',
      help_leaderboard: '/leaderboard - الترتيب',
      language_settings_title: '🌐 إعدادات اللغة',
      languages_menu_title: '🌍 إدارة اللغات',
      current_language: 'اللغة الحالية: {language}',
      language_choose: 'اختر اللغة المفضلة للبوت من القائمة أدناه.',
      languages_available: 'اللغات المتاحة:',
      languages_note: '💡 سيتم تطبيق اللغة على الرسائل والقوائم الأساسية.',
      khatma: '🕌 الختمة',
      quotes: '💭 الاقتباسات',
      poetry: '✍️ الشعر',
      features: '✨ الميزات',
      library: '📚 المكتبة',
      transfers: '💸 التحويلات والتبرعات',
      smart_notifications: '🔔 الإشعارات الذكية',
      language_admin: '🌍 إدارة اللغات',
      backups: '📁 النسخ الاحتياطية',
      cache: '⚡ التخزين المؤقت',
      protection: '🛡️ حماية من الإساءة',
      stats: '📊 إحصائيات',
      rewards: '🎁 المكافآت',
      close: '❌ إغلق',
      owner_panel: '👑 لوحة المالك',
      welcome: 'مرحباً بك في البوت الإسلامي! 🕌',
      start: 'اختر خياراً من القائمة أدناه:',
      help: 'هل تحتاج إلى مساعدة؟',
      profile: '👤 حسابي',
      games: '🎮 الألعاب',
      adhkar: '📿 الأذكار',
      quran: '📖 القرآن',
      economy: '💰 الاقتصاد',
      leaderboard: '🏆 المتصدرين',
      settings: '⚙️ الإعدادات',
      language: '🌐 اللغة',
      error: '❌ حدث خطأ',
      success: '✅ تم بنجاح',
      invalid_input: '❌ إدخال غير صحيح',
      more: '📖 المزيد',
      back: '⬅️ رجوع',
      next: '➡️ التالي',
      previous: '⬅️ السابق',
      shop: '🛍️ المتجر',
      achievements: '🏅 الإنجازات',
      notifications: '🔔 الإشعارات'
    };
  }

  /**
   * الترجمات الإنجليزية
   */
  getEnglishTranslations() {
    return {
      welcome_user: '👋 Hello {name}!\n\n🎯 Choose from the keyboard:',
      owner_welcome: '👑 Welcome, owner {name}!\n\n⚡ You have full system access\n🎯 Choose from the owner keyboard:',
      friend: 'my friend',
      help_title: '📚 Available commands:',
      help_start: '/start - Start',
      help_profile: '/profile - My profile',
      help_balance: '/balance - My balance',
      help_daily: '/daily - Daily reward',
      help_leaderboard: '/leaderboard - Leaderboard',
      language_settings_title: '🌐 Language Settings',
      languages_menu_title: '🌍 Language Manager',
      current_language: 'Current language: {language}',
      language_choose: 'Choose your preferred bot language from the list below.',
      languages_available: 'Available languages:',
      languages_note: '💡 The language will be applied to core messages and menus.',
      khatma: '🕌 Khatma',
      quotes: '💭 Quotes',
      poetry: '✍️ Poetry',
      features: '✨ Features',
      library: '📚 Library',
      transfers: '💸 Transfers & Donations',
      smart_notifications: '🔔 Smart Notifications',
      language_admin: '🌍 Language Manager',
      backups: '📁 Backups',
      cache: '⚡ Cache',
      protection: '🛡️ Abuse Protection',
      stats: '📊 Stats',
      rewards: '🎁 Rewards',
      close: '❌ Close',
      owner_panel: '👑 Owner Panel',
      welcome: 'Welcome to the Islamic Bot! 🕌',
      start: 'Choose an option from the menu below:',
      help: 'Need help?',
      profile: '👤 My Profile',
      games: '🎮 Games',
      adhkar: '📿 Remembrance',
      quran: '📖 Quran',
      economy: '💰 Economy',
      leaderboard: '🏆 Leaderboard',
      settings: '⚙️ Settings',
      language: '🌐 Language',
      error: '❌ An error occurred',
      success: '✅ Done successfully',
      invalid_input: '❌ Invalid input',
      more: '📖 More',
      back: '⬅️ Back',
      next: '➡️ Next',
      previous: '⬅️ Previous',
      shop: '🛍️ Shop',
      achievements: '🏅 Achievements',
      notifications: '🔔 Notifications'
    };
  }

  /**
   * الترجمات الفرنسية
   */
  getFrenchTranslations() {
    return {
      welcome_user: '👋 Bonjour {name}!\n\n🎯 Choisissez depuis le clavier:',
      owner_welcome: '👑 Bienvenue, proprietaire {name}!\n\n⚡ Vous avez un acces complet au systeme\n🎯 Choisissez depuis le clavier proprietaire:',
      friend: 'mon ami',
      help_title: '📚 Commandes disponibles:',
      help_start: '/start - Demarrer',
      help_profile: '/profile - Mon profil',
      help_balance: '/balance - Mon solde',
      help_daily: '/daily - Recompense quotidienne',
      help_leaderboard: '/leaderboard - Classement',
      language_settings_title: '🌐 Parametres de langue',
      languages_menu_title: '🌍 Gestion des langues',
      current_language: 'Langue actuelle: {language}',
      language_choose: 'Choisissez la langue preferee du bot dans la liste ci-dessous.',
      languages_available: 'Langues disponibles:',
      languages_note: '💡 La langue sera appliquee aux messages et menus principaux.',
      khatma: '🕌 Khatma',
      quotes: '💭 Citations',
      poetry: '✍️ Poesie',
      features: '✨ Fonctionnalites',
      library: '📚 Bibliotheque',
      transfers: '💸 Transferts et Dons',
      smart_notifications: '🔔 Notifications Intelligentes',
      language_admin: '🌍 Gestion des langues',
      backups: '📁 Sauvegardes',
      cache: '⚡ Cache',
      protection: '🛡️ Protection contre les abus',
      stats: '📊 Statistiques',
      rewards: '🎁 Recompenses',
      close: '❌ Fermer',
      owner_panel: '👑 Panneau Proprietaire',
      welcome: 'Bienvenue dans le bot islamique! 🕌',
      start: 'Choisissez une option dans le menu ci-dessous:',
      help: 'Besoin d\'aide?',
      profile: '👤 Mon Profil',
      games: '🎮 Jeux',
      adhkar: '📿 Zikr',
      quran: '📖 Coran',
      economy: '💰 Économie',
      leaderboard: '🏆 Classement',
      settings: '⚙️ Paramètres',
      language: '🌐 Langue',
      error: '❌ Une erreur s\'est produite',
      success: '✅ Succès',
      invalid_input: '❌ Entrée invalide',
      more: '📖 Plus',
      back: '⬅️ Retour',
      next: '➡️ Suivant',
      previous: '⬅️ Précédent',
      shop: '🛍️ Boutique',
      achievements: '🏅 Réalisations',
      notifications: '🔔 Notifications'
    };
  }

  getTranslationsForLanguage(languageCode) {
    return this.languages[languageCode]?.translations || this.languages.ar.translations;
  }

  async getTranslationsForUser(userId) {
    const language = await this.getUserLanguage(userId);
    return {
      language,
      translations: this.getTranslationsForLanguage(language)
    };
  }

  /**
   * الحصول على اللغة المفضلة للمستخدم
   */
  async getUserLanguage(userId) {
    try {
      const user = await User.findOne({ userId });
      return user?.language || 'ar'; // العربية افتراضياً
    } catch (error) {
      logger.error(`خطأ في الحصول على لغة المستخدم: ${error.message}`);
      return 'ar';
    }
  }

  /**
   * تعيين لغة المستخدم
   */
  async setUserLanguage(userId, languageCode) {
    try {
      if (!this.languages[languageCode]) {
        return { success: false, message: 'اللغة غير مدعومة' };
      }

      await User.findOneAndUpdate({ userId }, { language: languageCode });
      logger.info(`🌐 تم تغيير لغة المستخدم ${userId} إلى ${languageCode}`);

      return {
        success: true,
        message: `✅ تم تغيير اللغة إلى ${this.languages[languageCode].name}`
      };
    } catch (error) {
      logger.error(`خطأ في تعيين اللغة: ${error.message}`);
      return { success: false, message: 'حدث خطأ' };
    }
  }

  /**
   * الحصول على ترجمة
   */
  async translate(userId, key) {
    const language = await this.getUserLanguage(userId);
    const translations = this.languages[language].translations;
    return translations[key] || translations['error'] || 'Error';
  }

  /**
   * عرض قائمة اللغات
   */
  getLanguagesMenu(languageCode = 'ar') {
    const translations = this.getTranslationsForLanguage(languageCode);
    let text = `${translations.languages_menu_title}\n\n${translations.languages_available}\n`;

    for (const [code, lang] of Object.entries(this.languages)) {
      text += `• ${lang.name}\n`;
    }

    text += `\n${translations.language_choose}\n\n${translations.languages_note}`;
    return text;
  }

  /**
   * معلومات اللغة
   */
  getLanguageInfo(languageCode) {
    const lang = this.languages[languageCode];
    if (!lang) return null;

    return {
      code: languageCode,
      name: lang.name,
      translations: Object.keys(lang.translations).length
    };
  }

  /**
   * الحصول على كل اللغات المدعومة
   */
  getSupportedLanguages() {
    return Object.entries(this.languages).map(([code, lang]) => ({
      code,
      name: lang.name,
      flag: lang.flag
    }));
  }

  /**
   * إضافة لغة جديدة
   */
  addLanguage(code, name, translations) {
    if (this.languages[code]) {
      return { success: false, message: 'اللغة موجودة بالفعل' };
    }

    this.languages[code] = {
      name,
      flag: code,
      translations
    };

    logger.info(`✅ تمت إضافة لغة جديدة: ${name}`);
    return { success: true, message: `تمت إضافة اللغة: ${name}` };
  }

  /**
   * ترجمة نص كامل
   */
  translateMessage(message, fromLanguage = 'ar', toLanguage = 'en') {
    // هذا يمكن تحسينه باستخدام API ترجمة خارجي مثل Google Translate
    // للآن نعيد نفس النص مع تنبيه أنه مترجم
    return `[${toLanguage.toUpperCase()}]\n${message}`;
  }

  /**
   * إحصائيات اللغات
   */
  async getLanguageStats() {
    try {
      const users = await User.find({}, { language: 1 });
      const stats = {};

      users.forEach(user => {
        const lang = user.language || 'ar';
        stats[lang] = (stats[lang] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error(`خطأ في إحصائيات اللغات: ${error.message}`);
      return {};
    }
  }

  /**
   * تنسيق الإحصائيات
   */
  async formatLanguageStats() {
    const stats = await this.getLanguageStats();
    let text = '📊 <b>إحصائيات اللغات</b>\n\n';

    for (const [code, count] of Object.entries(stats)) {
      const lang = this.languages[code];
      if (lang) {
        text += `${lang.name}: ${count} مستخدم\n`;
      }
    }

    return text;
  }
}

module.exports = LanguageManager;
