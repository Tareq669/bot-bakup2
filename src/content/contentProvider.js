const { Content } = require('../database/models');

class ContentProvider {
  // Get daily Adhkar (Islamic reminders) - Now using AdhkarProvider with enhanced data
  static async getAdhkar() {
    try {
      const AdhkarProvider = require('./adhkarProvider');
      return await AdhkarProvider.getRandomAdhkar();
    } catch (error) {
      console.error('Error fetching Adhkar:', error);
      // Fallback to basic adhkar
      const adhkar = [
        { title: '🌅 أذكار الصباح', content: 'الحمد لله على كل حال، سبحان الله وبحمده' },
        { title: '🌙 أذكار المساء', content: 'اللهم بك أمسينا وبك أصبحنا، أمسينا في نعمك' },
        { title: '☀️ دعاء الاستيقاظ', content: 'الحمد لله الذي أحيانا بعد ما أماتنا' },
        { title: '😴 دعاء النوم', content: 'اللهم قني عذابك يوم تبعث عبادك' }
      ];
      return adhkar[Math.floor(Math.random() * adhkar.length)];
    }
  }

  // Get Quran verse - Now using QuranProvider with enhanced data
  static async getQuranVerse() {
    try {
      const QuranProvider = require('./quranProvider');
      return await QuranProvider.getRandomVerse();
    } catch (error) {
      console.error('Error fetching Quran verse:', error);
      // Fallback to basic verse
      const verses = [
        { surah: 'الفاتحة', content: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
        { surah: 'آل عمران', content: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ' },
        { surah: 'الحجر', content: 'فَاصْبِرْ عَلَىٰ مَا يَقُولُونَ' },
        { surah: 'طه', content: 'لَا تَخَافُ دَرَكًا وَلَا تَخْشَىٰ' }
      ];
      return verses[Math.floor(Math.random() * verses.length)];
    }
  }

  // Get motivational quote
  static async getQuote() {
    const quotes = [
      '💪 النجاح يبدأ برغبة صادقة والعزيمة القوية',
      '🌟 كل يوم جديد فرصة لحياة أفضل',
      '📚 العلم نور والجهل ظلام',
      '🎯 الأحلام لا تتحقق بالتمني بل بالعمل',
      '💎 القيمة الحقيقية لا تُقاس بالمال',
      '🔥 الصعوبات طريق إلى النجاح',
      '🌈 كل تجربة مؤلمة تعلمك درساً',
      '⭐ أنت أقوى مما تتوقع',
      '🎨 الحياة فن، تعلم أن تستمتع بالألوان',
      '🚀 بداياتك تحدد مستقبلك'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Get poetry verses
  static async getPoetry() {
    const poems = [
      '✨ ما أجمل الحياة حين تعيشها بشغف وحب',
      '🖋️ الحب أعظم قوة في الكون',
      '📖 حكيم القلب يعرف قيمة الصبر',
      '🌹 أنتِ جمال لا يُقدّر بثمن'
    ];
    return poems[Math.floor(Math.random() * poems.length)];
  }

  // Get book recommendations
  static async getBooks() {
    const books = [
      { title: 'تفسير الجلالين', author: 'الجلالين', emoji: '📖' },
      { title: 'سيرة ابن هشام', author: 'ابن هشام', emoji: '✍️' },
      { title: 'كليلة ودمنة', author: 'ابن المقفع', emoji: '📚' },
      { title: 'الفلسفة واليومي', author: 'إبراهيم الفقي', emoji: '🧠' },
      { title: 'حياة محمد', author: 'علي الطنطاوي', emoji: '🖋️' }
    ];
    return books[Math.floor(Math.random() * books.length)];
  }

  // Get stories
  static async getStories() {
    const stories = [
      { title: 'قصة الراهب والملك', content: 'اجتمع الناس حوله يطلبون الحكمة' },
      { title: 'حكاية الرجل والشجرة', content: 'زرع رجل شجرة ولم يرها تثمر' },
      { title: 'رحلة الألف ميل', content: 'تبدأ بخطوة واحدة. كل رحلة عظيمة' }
    ];
    return stories[Math.floor(Math.random() * stories.length)];
  }

  // Get movie recommendations
  static async getMovies() {
    const movies = [
      { title: 'الرسالة', year: 1976, rating: 8.5, emoji: '🎬' },
      { title: 'أسد الصحراء', year: 1992, rating: 7.8, emoji: '🎥' },
      { title: 'بغداد الزمن الجميل', year: 1993, rating: 8.0, emoji: '📽️' },
      { title: 'النور والظل', year: 2002, rating: 7.5, emoji: '🎞️' },
      { title: 'خيمة الحنين', year: 2008, rating: 7.9, emoji: '🎭' }
    ];
    return movies[Math.floor(Math.random() * movies.length)];
  }

  // Get wallpaper suggestions
  static async getWallpapers() {
    const wallpapers = [
      { theme: 'إسلامي', description: 'خلفيات إسلامية', emoji: '🕋️' },
      { theme: 'طبيعي', description: 'مناظر طبيعية', emoji: '🌿' },
      { theme: 'عصري', description: 'تصاميم حديثة', emoji: '✨' },
      { theme: 'نجوم', description: 'سماء الليل', emoji: '⭐' },
      { theme: 'أمواج', description: 'البحر الهادئ', emoji: '🌊' }
    ];
    return wallpapers[Math.floor(Math.random() * wallpapers.length)];
  }

  // Get header suggestions
  static async getHeaders() {
    const headers = [
      '👑 ملك الأحلام',
      '🌟 نجم ساطع',
      '💪 قوة لا تُقهر',
      '🔥 شعلة النجاح',
      '⭐ تاج الكرامة'
    ];
    return headers[Math.floor(Math.random() * headers.length)];
  }

  // Get songs
  static async getSongs() {
    const songs = [
      { title: 'النور', artist: 'محمد عبد الوهاب', emoji: '🎵' },
      { title: 'الحب الأول', artist: 'أم كلثوم', emoji: '🎶' },
      { title: 'قصة الحياة', artist: 'فيروز', emoji: '🎤' },
      { title: 'السلام عليكم', artist: 'عبدالقادر قوته', emoji: '🎧' },
      { title: 'أمي الحنونة', artist: 'كثيرة فنانين', emoji: '🎼' }
    ];
    return songs[Math.floor(Math.random() * songs.length)];
  }

  // Get entertainment/jokes
  static async getEntertainment() {
    const jokes = [
      '😂 لماذا الكتاب حزين؟ لأنه مليء بالمشاكل!',
      '😄 رجل يشتري معجون أسنان بدرهم، قالوا: غالي!',
      '😆 معلم يقول: من يكمل الجملة؟ الله يحب...\nالطالب: الشغل! 😂',
      '😉 امرأة تسأل زوجها: هل تحبني؟',
      '😁 طفل يسأل والده: بابا ليش الطير بيطير؟'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Get bio suggestions
  static async getBioSuggestions() {
    const bios = [
      '💖 محب للحياة والناس الطيبين',
      '🎯 باحث عن النجاح والسعادة',
      '📚 عاشق للقراءة والتعلم',
      '🌍 مسافر وحب الاستكشاف',
      '💪 رياضي وصحي الحياة',
      '🎨 فنان الحياة',
      '🔥 حالم طموح',
      '⭐ صاحب قلب ذهب'
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  }

  // Get avatars
  static async getAvatars() {
    const avatars = [
      '👘 شخصية أنمي كلاسيكية',
      '👳 شخصية عربية تراثية',
      '👨 شخصية عصرية حديثة',
      '🧑 شخصية كرتونية طريفة',
      '👩 شخصية أنثوية قوية'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  // Get tweets
  static async getTweets() {
    const tweets = [
      '📱 التكنولوجيا تقربنا، لكن الإنسانية تجمعنا',
      '🌈 كل إنسان في داخله نور ينير طريقه',
      '⏰ الوقت هو أثمن ما نملك، فلا تضيعه',
      '🎯 الفشل ليس نهاية، بل هو بداية طريق النجاح',
      '💝 اللطف كلمة طيبة تغير حياة إنسان'
    ];
    return tweets[Math.floor(Math.random() * tweets.length)];
  }
}

module.exports = ContentProvider;
