/**
 * 🎮 نظام الألعاب القرآنية المتكامل
 * Integrated Quranic Games System
 *
 * يحتوي على 5 ألعاب:
 * 1. تخمين الآية - Guess the Surah
 * 2. أكمل الآية - Complete the Verse
 * 3. اكتشف الفرق - Spot the Difference
 * 4. معلومات قرآنية - Quran Trivia
 * 5. عد الآيات - Count Verses
 */

const { logger } = require('../utils/helpers');
const User = require('../database/models/User');

class QuranicGames {
  /**
   * 0️⃣ لعبة تخمين الآية
   * المستخدم يخمن السورة من دليل
   */
  static getGuessTheSurahGame() {
    const games = [
      { clue: 'أول سورة في القرآن الكريم', answer: 'الفاتحة', reward: 10 },
      { clue: 'أطول سورة في القرآن الكريم', answer: 'البقرة', reward: 15 },
      { clue: 'سورة سميت باسم حيوان', answer: 'النحل', reward: 10 },
      { clue: 'سورة بها سجدة في الآية 15', answer: 'مريم', reward: 15 },
      { clue: 'سورة نزلت كاملة واحدة', answer: 'الفاتحة', reward: 10 },
      { clue: 'أقصر سورة في القرآن', answer: 'الكوثر', reward: 10 },
      { clue: 'سورة تسمى قلب القرآن', answer: 'يس', reward: 15 },
      { clue: 'سورة بها إخوة يوسف', answer: 'يوسف', reward: 15 },
      { clue: 'سورة بها قصة موسى والنار', answer: 'طه', reward: 15 },
      { clue: 'سورة تبدأ بـ "يا أيها الناس"', answer: 'النساء', reward: 10 },
      { clue: 'سورة عن براءة من المشركين', answer: 'التوبة', reward: 15 },
      { clue: 'سورة تسمى الفاتحة الثانية', answer: 'النحل', reward: 10 },
      { clue: 'سورة بها التسليمات من الجن', answer: 'الجن', reward: 15 },
      { clue: 'سورة تتدث عن الملك والحساب', answer: 'الملك', reward: 15 },
      { clue: 'سورة سميت باسم معدن ذهب', answer: 'الذهب', reward: 15 },
      { clue: 'سورة النبأ (الخبر العظيم)', answer: 'النبأ', reward: 10 },
      { clue: 'سورة عن يوم تدنو فيه الشمس', answer: 'الطارق', reward: 15 },
      { clue: 'سورة بها قصة الأخدود', answer: 'البروج', reward: 15 },
      { clue: 'سورة الليل والنهار', answer: 'الليل', reward: 10 },
      { clue: 'سورة عن الفيل وجيشه', answer: 'الفيل', reward: 10 },
      { clue: 'سورة عن أصحاب الكهف', answer: 'الكهف', reward: 15 },
      { clue: 'سورة عن سلمان الفارسي والأصحاب', answer: 'شورى', reward: 10 },
      { clue: 'آخر سورة في القرآن', answer: 'الناس', reward: 15 },
      { clue: 'سورة عن الوالدين والإحسان', answer: 'الإسراء', reward: 10 },
      { clue: 'سورة عن العنكبوت ونسيجها', answer: 'العنكبوت', reward: 10 }
    ];

    const game = games[Math.floor(Math.random() * games.length)];
    return {
      type: 'guess_surah',
      question: game.clue,
      answer: game.answer,
      reward: game.reward
    };
  }

  /**
   * 1️⃣ لعبة أكمل الآية
   * المستخدم يكمل الآية الناقصة
   */
  static getCompleteVerseGame() {
    const games = [
      { partial: 'الحمد لله رب...', answer: 'العالمين', reward: 10, surah: 'الفاتحة' },
      { partial: 'قل هو الله...', answer: 'أحد', reward: 10, surah: 'الإخلاص' },
      { partial: 'إنا أعطيناك...', answer: 'الكوثر', reward: 15, surah: 'الكوثر' },
      { partial: 'إن مع العسر...', answer: 'يسرا', reward: 10, surah: 'الشرح' },
      { partial: 'والعصر إن الإنسان لفي...', answer: 'خسر', reward: 15, surah: 'العصر' },
      { partial: 'ومن يتق الله يجعل له...', answer: 'مخرجا', reward: 20, surah: 'الطلاق' },
      { partial: 'بسم الله الرحمن...', answer: 'الرحيم', reward: 10, surah: 'الفاتحة' },
      { partial: 'الملك لك اللهم ولا...', answer: 'ملك', reward: 15, surah: 'آل عمران' },
      { partial: 'قل أعوذ برب...', answer: 'الفلق', reward: 10, surah: 'الفلق' },
      { partial: 'ولا تستوي الحسنة ولا...', answer: 'السيئة', reward: 15, surah: 'فصلت' },
      { partial: 'إذا جاء نصر الله والفتح ورأيت الناس يدخلون في دين الله...', answer: 'أفواجا', reward: 20, surah: 'النصر' },
      { partial: 'قل يا أيها الكافرون لا...', answer: 'تعبدون', reward: 15, surah: 'الكافرون' },
      { partial: 'وإذ قال إبراهيم رب اجعل هذا البلد آمنا...', answer: 'الأصنام', reward: 15, surah: 'إبراهيم' },
      { partial: 'أم خلقوا من غير شيء أم هم...', answer: 'الخالقون', reward: 10, surah: 'الطور' },
      { partial: 'فإذا قضيت الصلاة فانتشروا في...', answer: 'الأرض', reward: 10, surah: 'الجمعة' },
      { partial: 'والصبح إذا أسفر والليل إذا...', answer: 'أدبر', reward: 15, surah: 'المدثر' },
      { partial: 'عم يتساءلون عن النبأ...', answer: 'العظيم', reward: 10, surah: 'النبأ' },
      { partial: 'يا أيها الناس إنا خلقناكم من ذكر...', answer: 'وأنثى', reward: 15, surah: 'الحجرات' },
      { partial: 'إن الله مع الصابرين...', answer: 'صبروا', reward: 10, surah: 'الأنفال' },
      { partial: 'وما أمرنا إلا...', answer: 'واحدة', reward: 15, surah: 'القمر' }
    ];

    const game = games[Math.floor(Math.random() * games.length)];
    return {
      type: 'complete_verse',
      question: game.partial,
      answer: game.answer,
      reward: game.reward,
      surah: game.surah
    };
  }

  /**
   * 2️⃣ لعبة اكتشف الفرق
   * المستخدم يحدد إذا كانت الآية صحيحة أم محرفة
   */
  static getSpotDifferenceGame() {
    const games = [
      {
        correct: 'قل هو الله أحد',
        wrong: 'قل هو الله واحد',
        reward: 15,
        surah: 'الإخلاص'
      },
      {
        correct: 'الحمد لله رب العالمين',
        wrong: 'الحمد لله رب السماوات',
        reward: 15,
        surah: 'الفاتحة'
      },
      {
        correct: 'وما خلقت الجن والإنس إلا ليعبدون',
        wrong: 'وما خلقت الجن والإنس إلا ليطيعون',
        reward: 20,
        surah: 'الذاريات'
      },
      {
        correct: 'فإن مع العسر يسرا',
        wrong: 'فإن مع الصبر يسرا',
        reward: 15,
        surah: 'الشرح'
      },
      {
        correct: 'ربنا آتنا في الدنيا حسنة',
        wrong: 'ربنا آتنا في الحياة حسنة',
        reward: 20,
        surah: 'البقرة'
      },
      {
        correct: 'إن الله مع الصابرين',
        wrong: 'إن الله مع الشاكرين',
        reward: 15,
        surah: 'الأنفال'
      },
      {
        correct: 'والله يعز من يشاء',
        wrong: 'والله يعز من شاء',
        reward: 15,
        surah: 'آل عمران'
      },
      {
        correct: 'بسم الله الرحمن الرحيم',
        wrong: 'بسم الله الرحمن الكريم',
        reward: 20,
        surah: 'الفاتحة'
      },
      {
        correct: 'وإذا قالوا لهم آمنوا قالوا آمنا',
        wrong: 'وإذا قالوا لهم آمنوا قالوا نعم',
        reward: 15,
        surah: 'البقرة'
      },
      {
        correct: 'قل هل يستوي الذين يعلمون والذين لا يعلمون',
        wrong: 'قل هل يستوي الذين يعملون والذين لا يعملون',
        reward: 20,
        surah: 'الزمر'
      },
      {
        correct: 'الله لا إله إلا هو الحي القيوم',
        wrong: 'الله لا إله إلا هو الحي العزيز',
        reward: 20,
        surah: 'البقرة'
      },
      {
        correct: 'إن الله على كل شيء قدير',
        wrong: 'إن الله مع كل شيء قدير',
        reward: 15,
        surah: 'البقرة'
      },
      {
        correct: 'فلا تهنوا وتدعوا للسلم',
        wrong: 'فلا تهنوا وتدعوا للسلام',
        reward: 15,
        surah: 'محمد'
      },
      {
        correct: 'وما تفعلوا من خير يعلمه الله',
        wrong: 'وما تفعلوا من خير يراه الله',
        reward: 15,
        surah: 'البقرة'
      },
      {
        correct: 'الحيوة الدنيا متاع وزينة',
        wrong: 'الحيوة الدنيا متاع وغرور',
        reward: 15,
        surah: 'الكهف'
      }
    ];

    const game = games[Math.floor(Math.random() * games.length)];
    const isCorrect = Math.random() < 0.5; // 50% صحيحة، 50% خاطئة

    return {
      type: 'spot_difference',
      question: isCorrect ? game.correct : game.wrong,
      answer: isCorrect, // true or false
      correctVerse: game.correct,
      reward: game.reward,
      surah: game.surah
    };
  }

  /**
   * 3️⃣ لعبة معلومات قرآنية
   * أسئلة اختيار من متعدد
   */
  static getTriviaGame() {
    const games = [
      {
        question: 'كم عدد سور القرآن الكريم؟',
        options: ['114', '100', '120', '110'],
        answerIndex: 0,
        reward: 10
      },
      {
        question: 'ما أقصر سورة في القرآن؟',
        options: ['النصر', 'الكوثر', 'الإخلاص', 'الفلق'],
        answerIndex: 1,
        reward: 10
      },
      {
        question: 'كم عدد أحزاب القرآن الكريم؟',
        options: ['60', '30', '45', '90'],
        answerIndex: 1,
        reward: 10
      },
      {
        question: 'ما أطول آية في القرآن؟',
        options: ['آية الدين', 'آية الكرسي', 'أول آية في البقرة', 'آخر آية في البقرة'],
        answerIndex: 0,
        reward: 15
      },
      {
        question: 'كم عدد آيات القرآن الكريم تقريباً؟',
        options: ['6236', '5000', '7000', '4500'],
        answerIndex: 0,
        reward: 15
      },
      {
        question: 'ما السورة التي تسمى قلب القرآن؟',
        options: ['الفاتحة', 'يس', 'الملك', 'الرحمن'],
        answerIndex: 1,
        reward: 10
      },
      {
        question: 'كم عدد الأنبياء المذكورين في القرآن؟',
        options: ['25', '30', '35', '40'],
        answerIndex: 0,
        reward: 15
      },
      {
        question: 'كم عدد أركان الإسلام؟',
        options: ['3', '4', '5', '6'],
        answerIndex: 2,
        reward: 10
      },
      {
        question: 'كم عدد أركان الإيمان؟',
        options: ['5', '6', '7', '8'],
        answerIndex: 1,
        reward: 10
      },
      {
        question: 'ما أطول سورة في القرآن؟',
        options: ['النساء', 'البقرة', 'آل عمران', 'الأنعام'],
        answerIndex: 1,
        reward: 10
      },
      {
        question: 'كم عدد الأجزاء في القرآن الكريم؟',
        options: ['20', '30', '40', '50'],
        answerIndex: 1,
        reward: 10
      },
      {
        question: 'ما أول سورة تنزلت من القرآن؟',
        options: ['الفاتحة', 'يس', 'العلق', 'الضحى'],
        answerIndex: 2,
        reward: 15
      },
      {
        question: 'كم عدد سجدات التلاوة في القرآن؟',
        options: ['12', '13', '14', '15'],
        answerIndex: 1,
        reward: 15
      },
      {
        question: 'ما عدد آيات سورة البقرة؟',
        options: ['200', '250', '286', '300'],
        answerIndex: 2,
        reward: 10
      },
      {
        question: 'من هو الرسول الذي دعا يا رب إني مسني الضر؟',
        options: ['موسى', 'أيوب', 'يونس', 'عيسى'],
        answerIndex: 1,
        reward: 15
      },
      {
        question: 'كم عدد الرسل الذين صبروا من أولي العزم؟',
        options: ['3', '4', '5', '6'],
        answerIndex: 2,
        reward: 15
      },
      {
        question: 'ما هي أعظم بسملة في القرآن؟',
        options: ['كل البسملات', 'البسملة في الفاتحة', 'البسملة في النمل', 'البسملة في الأنفال'],
        answerIndex: 2,
        reward: 15
      },
      {
        question: 'كم عدد الكلمات في القرآن الكريم تقريباً؟',
        options: ['70000', '77000', '80000', '85000'],
        answerIndex: 1,
        reward: 15
      },
      {
        question: 'كم عدد الحروف في القرآن الكريم تقريباً؟',
        options: ['300000', '320000', '340000', '360000'],
        answerIndex: 1,
        reward: 15
      },
      {
        question: 'ما السورة التي في القرآن التي تسمى بـ "فاتحة الكتاب"؟',
        options: ['الفاتحة', 'البقرة', 'الإخلاص', 'النمل'],
        answerIndex: 0,
        reward: 10
      }
    ];

    const game = games[Math.floor(Math.random() * games.length)];
    return {
      type: 'trivia',
      question: game.question,
      options: game.options,
      answer: game.options[game.answerIndex], // الإجابة الصحيحة كنص
      reward: game.reward
    };
  }

  /**
   * 4️⃣ لعبة عد الآيات
   * المستخدم يخمن عدد آيات سورة معينة
   */
  static getCountVersesGame() {
    const games = [
      { surah: 'الفاتحة', count: 7, reward: 10 },
      { surah: 'البقرة', count: 286, reward: 20 },
      { surah: 'آل عمران', count: 200, reward: 15 },
      { surah: 'النساء', count: 176, reward: 15 },
      { surah: 'المائدة', count: 120, reward: 15 },
      { surah: 'الأنعام', count: 165, reward: 15 },
      { surah: 'الكهف', count: 110, reward: 15 },
      { surah: 'يس', count: 83, reward: 15 },
      { surah: 'الملك', count: 30, reward: 10 },
      { surah: 'الإخلاص', count: 4, reward: 10 },
      { surah: 'الأعراف', count: 206, reward: 20 },
      { surah: 'الإسراء', count: 111, reward: 15 },
      { surah: 'الشرح', count: 8, reward: 10 },
      { surah: 'العصر', count: 3, reward: 10 },
      { surah: 'الكوثر', count: 3, reward: 10 },
      { surah: 'الفيل', count: 5, reward: 10 },
      { surah: 'مريم', count: 98, reward: 15 },
      { surah: 'طه', count: 135, reward: 15 },
      { surah: 'الحج', count: 78, reward: 15 },
      { surah: 'النور', count: 64, reward: 15 },
      { surah: 'الشعراء', count: 227, reward: 20 },
      { surah: 'الأحزاب', count: 73, reward: 15 },
      { surah: 'الفاطر', count: 45, reward: 10 },
      { surah: 'الصافات', count: 182, reward: 15 },
      { surah: 'غافر', count: 85, reward: 15 },
      { surah: 'فصلت', count: 54, reward: 15 },
      { surah: 'الشورى', count: 53, reward: 15 },
      { surah: 'الزخرف', count: 89, reward: 15 },
      { surah: 'الدخان', count: 59, reward: 15 },
      { surah: 'الجاثية', count: 37, reward: 10 },
      { surah: 'محمد', count: 38, reward: 10 },
      { surah: 'الفتح', count: 29, reward: 10 },
      { surah: 'التوبة', count: 129, reward: 15 },
      { surah: 'يونس', count: 109, reward: 15 },
      { surah: 'هود', count: 123, reward: 15 },
      { surah: 'يوسف', count: 111, reward: 15 },
      { surah: 'الرعد', count: 43, reward: 10 },
      { surah: 'إبراهيم', count: 52, reward: 15 },
      { surah: 'الحجر', count: 99, reward: 15 },
      { surah: 'النحل', count: 128, reward: 15 }
    ];

    const game = games[Math.floor(Math.random() * games.length)];
    return {
      type: 'count_verses',
      question: `كم عدد آيات سورة ${game.surah}؟`,
      answer: game.count,
      reward: game.reward,
      surah: game.surah
    };
  }

  /**
   * 📊 تسجيل نتيجة اللعبة
   */
  static async recordGameResult(userId, gameType, reward, won) {
    try {
      const user = await User.findOne({ userId });
      if (!user) return false;

      // تهيئة gameStats إذا لم يكن موجوداً
      user.gameStats = user.gameStats || {};
      user.gameStats.quranic = user.gameStats.quranic || {
        played: 0,
        won: 0,
        totalPoints: 0
      };

      // تحديث الإحصائيات
      user.gameStats.quranic.played++;
      if (won) {
        user.gameStats.quranic.won++;
        user.gameStats.quranic.totalPoints += reward;
      }

      await user.save();
      return true;
    } catch (error) {
      logger.error(`خطأ في تسجيل نتيجة اللعبة: ${error.message}`);
      return false;
    }
  }

  /**
   * 📝 قائمة الألعاب
   */
  static getGamesList() {
    return `🎮 <b>الألعاب القرآنية</b>

اختبر معلوماتك القرآنية واحصل على النقاط!

0️⃣ <b>تخمين الآية</b> 🎯
   خمن السورة من الدليل

1️⃣ <b>أكمل الآية</b> ✍️
   أكمل الآية الناقصة

2️⃣ <b>اكتشف الفرق</b> 🔍
   حدد إذا كانت الآية صحيحة

3️⃣ <b>معلومات قرآنية</b> 🧠
   أسئلة اختيار من متعدد

4️⃣ <b>عد الآيات</b> 📊
   خمن عدد آيات السورة

💰 كل إجابة صحيحة = نقاط!`;
  }

  /**
   * ✅ التحقق من الإجابة
   */
  static checkAnswer(userAnswer, correctAnswer, gameType) {
    // تنظيف الإجابات
    const cleanUser = String(userAnswer).trim().toLowerCase();
    const cleanCorrect = String(correctAnswer).trim().toLowerCase();

    if (gameType === 'spot_difference') {
      // للعبة اكتشف الفرق: true/false
      return cleanUser === cleanCorrect;
    } else if (gameType === 'count_verses') {
      // للعبة عد الآيات: أرقام
      return parseInt(cleanUser) === parseInt(cleanCorrect);
    } else {
      // للألعاب النصية: مقارنة نصية
      return cleanUser === cleanCorrect;
    }
  }
}

module.exports = QuranicGames;
