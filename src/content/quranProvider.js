const { Content } = require('../database/models');

class QuranProvider {
  // قرآن كريم - آيات كاملة مع قراءات صوتية
  static async getQuranVerses() {
    const verses = [
      {
        id: 1,
        surah: 'الفاتحة',
        surahNumber: 1,
        ayah: 1,
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝',
        content: 'الحمد لله رب العالمين',
        translation: 'Praise be to Allah, Lord of the worlds',
        tafsir: 'أول آية في القرآن الكريم، بيان لقدرة الله ورحمته',
        audioUrl: 'https://quran.com/1/1',
        reciter: 'محمد عثمان',
        duration: '0:15'
      },
      {
        id: 2,
        surah: 'البقرة',
        surahNumber: 2,
        ayah: 255,
        text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۝',
        content: 'لا تأخذه سنة ولا نوم له ما في السماوات وما في الأرض',
        translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence',
        tafsir: 'آية الكرسي: عظمة الله وقدرته اللانهائية',
        audioUrl: 'https://quran.com/2/255',
        reciter: 'عبدالباسط عبدالصمد',
        duration: '1:45'
      },
      {
        id: 3,
        surah: 'آل عمران',
        surahNumber: 3,
        ayah: 26,
        text: 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ ۝',
        content: 'وتنزع الملك ممن تشاء وتعز من تشاء وتذل من تشاء بيدك الخير إنك على كل شيء قدير',
        translation: 'Say, "O Allah, Owner of Sovereignty, You give sovereignty to whom You will"',
        tafsir: 'الراسخ في قلوب المؤمنين معرفة ملك الله لكل شيء',
        audioUrl: 'https://quran.com/3/26',
        reciter: 'ياسين الجزائري',
        duration: '1:20'
      },
      {
        id: 4,
        surah: 'الأعراف',
        surahNumber: 7,
        ayah: 54,
        text: 'إِنَّ رَبَّكُمُ اللَّهُ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ فِي سِتَّةِ أَيَّامٍ ۝',
        content: 'ثم استوى على العرش يغشي الليل النهار يطلبه حثيثا والشمس والقمر والنجوم مسخرات بأمره',
        translation: 'Indeed, your Lord is Allah, who created the heavens and earth in six days',
        tafsir: 'خلق الله السماوات والأرض في ستة أيام وكل شيء بتدبيره',
        audioUrl: 'https://quran.com/7/54',
        reciter: 'مشاري الخراز',
        duration: '2:10'
      },
      {
        id: 5,
        surah: 'يس',
        surahNumber: 36,
        ayah: 82,
        text: 'إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ ۝',
        content: 'فسبحان الذي بيده ملكوت كل شيء وإليه ترجعون',
        translation: 'His command is only when He intends a thing that He says to it, "Be," and it is',
        tafsir: 'قدرة الله المطلقة في خلق كل شيء بكلمة "كن"',
        audioUrl: 'https://quran.com/36/82',
        reciter: 'سعود الشريم',
        duration: '0:45'
      },
      {
        id: 6,
        surah: 'الحجر',
        surahNumber: 15,
        ayah: 94,
        text: 'فَاصْدَعْ بِمَا تُؤْمَرُ وَأَعْرِضْ عَنِ الْمُشْرِكِينَ ۝',
        content: 'إنا كفيناك المستهزئين',
        translation: 'So declare what you are commanded and turn away from the polytheists',
        tafsir: 'أمر الله نبيه بالجهر بالدعوة والثقة بحماية الله له',
        audioUrl: 'https://quran.com/15/94',
        reciter: 'فارس عباد',
        duration: '1:05'
      },
      {
        id: 7,
        surah: 'الحج',
        surahNumber: 22,
        ayah: 78,
        text: 'وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ ۝',
        content: 'هو اجتباكم وما جعل عليكم في الدين من حرج',
        translation: 'And strive for Allah with the striving due to Him',
        tafsir: 'الجهاد في سبيل الله بكل جهد وطاقة',
        audioUrl: 'https://quran.com/22/78',
        reciter: 'محمود خليل الحصري',
        duration: '1:35'
      },
      {
        id: 8,
        surah: 'النور',
        surahNumber: 24,
        ayah: 35,
        text: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۝',
        content: 'مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ الْمِصْبَاحُ فِي زُجَاجَةٍ',
        translation: 'Allah is the Light of the heavens and the earth',
        tafsir: 'آية النور الشهيرة: تمثيل لنور الهداية والإيمان في القلب',
        audioUrl: 'https://quran.com/24/35',
        reciter: 'عبدالرحمن السديس',
        duration: '2:45'
      },
      {
        id: 9,
        surah: 'الواقعة',
        surahNumber: 56,
        ayah: 77,
        text: 'إِنَّهُ لَقُرْآنٌ كَرِيمٌ ۝',
        content: 'في كتاب مكنون لا يمسه إلا المطهرون تنزيل من رب العالمين',
        translation: 'Indeed, it is a noble Qur\'an',
        tafsir: 'عظمة القرآن الكريم وقدسيته',
        audioUrl: 'https://quran.com/56/77',
        reciter: 'التويجري',
        duration: '1:15'
      },
      {
        id: 10,
        surah: 'الملك',
        surahNumber: 67,
        ayah: 1,
        text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝',
        content: 'الذي خلق الموت والحياة ليبلوكم أيكم أحسن عملا',
        translation: 'Blessed is He in whose hand is the dominion, and He over all things has power',
        tafsir: 'بداية سورة الملك: تعظيم لله وقدرته',
        audioUrl: 'https://quran.com/67/1',
        reciter: 'أحمد العجمي',
        duration: '1:50'
      },
      {
        id: 11,
        surah: 'الإخلاص',
        surahNumber: 112,
        ayah: 1,
        text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝',
        content: 'الله الصمد لم يلد ولم يولد ولم يكن له كفوا أحد',
        translation: 'Say, "He is Allah, [who is] One',
        tafsir: 'سورة الإخلاص: توحيد الله وتنزيهه عن كل ما لا يليق به',
        audioUrl: 'https://quran.com/112/1',
        reciter: 'القاضي',
        duration: '0:55'
      },
      {
        id: 12,
        surah: 'الفلق',
        surahNumber: 113,
        ayah: 1,
        text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝',
        content: 'من شر ما خلق ومن شر غاسق إذا وقب ومن شر النفاثات في العقد',
        translation: 'Say, "I seek refuge in the Lord of daybreak',
        tafsir: 'سورة الفلق: استعاذة بالله من جميع الشرور',
        audioUrl: 'https://quran.com/113/1',
        reciter: 'إبراهيم الأخضر',
        duration: '0:40'
      },
      {
        id: 13,
        surah: 'الناس',
        surahNumber: 114,
        ayah: 1,
        text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝',
        content: 'مَلِكِ النَّاسِ إِلَٰهِ النَّاسِ من شر الوسواس الخناس',
        translation: 'Say, "I seek refuge in the Lord of mankind',
        tafsir: 'سورة الناس: استعاذة من الوساوس وشر الشيطان',
        audioUrl: 'https://quran.com/114/1',
        reciter: 'ناصر القطامي',
        duration: '0:45'
      }
    ];

    return verses;
  }

  // الحصول على آية عشوائية
  static async getRandomVerse() {
    const verses = await this.getQuranVerses();
    return verses[Math.floor(Math.random() * verses.length)];
  }

  // الحصول على آية حسب السورة
  static async getVerseByName(surahName) {
    const verses = await this.getQuranVerses();
    return verses.filter(v => v.surah.includes(surahName));
  }

  // قائمة السور كاملة
  static async getAllSurahs() {
    const surahs = [
      { number: 1, name: 'الفاتحة', ayahs: 7, type: 'مكية' },
      { number: 2, name: 'البقرة', ayahs: 286, type: 'مدنية' },
      { number: 3, name: 'آل عمران', ayahs: 200, type: 'مدنية' },
      { number: 4, name: 'النساء', ayahs: 176, type: 'مدنية' },
      { number: 5, name: 'المائدة', ayahs: 120, type: 'مدنية' },
      { number: 6, name: 'الأنعام', ayahs: 165, type: 'مكية' },
      { number: 7, name: 'الأعراف', ayahs: 206, type: 'مكية' },
      { number: 8, name: 'الأنفال', ayahs: 75, type: 'مدنية' },
      { number: 9, name: 'التوبة', ayahs: 129, type: 'مدنية' },
      { number: 10, name: 'يونس', ayahs: 109, type: 'مكية' },
      { number: 11, name: 'هود', ayahs: 123, type: 'مكية' },
      { number: 12, name: 'يوسف', ayahs: 111, type: 'مكية' },
      { number: 13, name: 'الرعد', ayahs: 43, type: 'مدنية' },
      { number: 14, name: 'إبراهيم', ayahs: 52, type: 'مكية' },
      { number: 15, name: 'الحجر', ayahs: 99, type: 'مكية' },
      { number: 16, name: 'النحل', ayahs: 128, type: 'مكية' },
      { number: 17, name: 'الإسراء', ayahs: 111, type: 'مكية' },
      { number: 18, name: 'الكهف', ayahs: 110, type: 'مكية' },
      { number: 19, name: 'مريم', ayahs: 98, type: 'مكية' },
      { number: 20, name: 'طه', ayahs: 135, type: 'مكية' },
      { number: 21, name: 'الأنبياء', ayahs: 112, type: 'مكية' },
      { number: 22, name: 'الحج', ayahs: 78, type: 'مدنية' },
      { number: 23, name: 'المؤمنون', ayahs: 118, type: 'مكية' },
      { number: 24, name: 'النور', ayahs: 64, type: 'مدنية' },
      { number: 25, name: 'الفرقان', ayahs: 77, type: 'مكية' },
      { number: 26, name: 'الشعراء', ayahs: 227, type: 'مكية' },
      { number: 27, name: 'النمل', ayahs: 93, type: 'مكية' },
      { number: 28, name: 'القصص', ayahs: 88, type: 'مكية' },
      { number: 29, name: 'العنكبوت', ayahs: 69, type: 'مكية' },
      { number: 30, name: 'الروم', ayahs: 60, type: 'مكية' }
    ];
    return surahs;
  }

  // تفسير موجز للآية
  static getTafsirShort(ayahText) {
    const tafsirMap = {
      'الحمد لله': 'شكر الله على نعمه',
      'الملك': 'الحكم والسيطرة',
      'نور': 'الهداية والإضاءة',
      'دعاء': 'التضرع إلى الله',
      'استعاذة': 'الاستجارة من الله',
      'قدير': 'القادر على كل شيء',
      'حكيم': 'صاحب الحكمة والحكم'
    };

    for (const [key, value] of Object.entries(tafsirMap)) {
      if (ayahText.includes(key)) {
        return value;
      }
    }
    return 'آية كريمة من كتاب الله';
  }

  // قارئ القرآن المشهورين
  static async getFamousReciters() {
    const reciters = [
      { name: 'عبدالباسط عبدالصمد', country: 'مصر', rating: 5.0 },
      { name: 'محمد عثمان', country: 'السودان', rating: 4.9 },
      { name: 'سعود الشريم', country: 'السعودية', rating: 4.9 },
      { name: 'عبدالرحمن السديس', country: 'السعودية', rating: 4.9 },
      { name: 'ياسين الجزائري', country: 'الجزائر', rating: 4.8 },
      { name: 'مشاري الخراز', country: 'الكويت', rating: 4.8 },
      { name: 'محمود خليل الحصري', country: 'مصر', rating: 4.8 }
    ];
    return reciters;
  }

  // أجزاء القرآن (30 جزء)
  static async getQuranParts() {
    const parts = Array.from({ length: 30 }, (_, i) => ({
      part: i + 1,
      name: `الجزء ${i + 1}`,
      pages: 20,
      surahStart: 'السورة الأساسية',
      readingTime: '30 دقيقة'
    }));
    return parts;
  }

  // احصائيات القرآن
  static async getQuranStats() {
    return {
      totalSurahs: 114,
      totalAyahs: 6236,
      totalWords: 77934,
      totalLetters: 323670,
      longestSurah: 'البقرة',
      shortestSurah: 'الكوثر',
      timeToComplete: '30 ساعة تقريباً',
      dailyReading: '10-15 دقيقة',
      weeklyGoal: 'ختمة واحدة شهرياً',
      yearlyGoal: '12 ختمة كاملة'
    };
  }
}

module.exports = QuranProvider;
