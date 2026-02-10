const { User } = require('../database/models');

class LearningSystem {
  // Analyze user behavior patterns
  static async analyzeUserBehavior(userId) {
    try {
      const user = await User.findOne({ userId });
      if (!user) return null;

      const behavior = {
        userId,
        preferences: this.detectPreferences(user),
        activityLevel: this.calculateActivityLevel(user),
        engagement: this.calculateEngagement(user),
        strengths: this.detectStrengths(user),
        weaknesses: this.detectWeaknesses(user),
        recommendations: this.generateRecommendations(user)
      };

      return behavior;
    } catch (error) {
      console.error('Behavior analysis error:', error);
      return null;
    }
  }

  // Detect user preferences
  static detectPreferences(user) {
    const preferences = [];

    if (user.khatmaProgress?.currentPage > 100) {
      preferences.push('قارئ قرآن نشط');
    }

    if (user.gamesPlayed?.total > 10) {
      preferences.push('لاعب متحمس');
    }

    if (user.coins > 500) {
      preferences.push('محب للتجميع والتوفير');
    }

    if (user.level > 10) {
      preferences.push('لاعب متقدم');
    }

    return preferences.length > 0 ? preferences : ['مستخدم جديد'];
  }

  // Calculate activity level
  static calculateActivityLevel(user) {
    const daysActive = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) || 1;
    const totalActions = (user.gamesPlayed?.total || 0) + (user.khatmaProgress?.currentPage || 0) + (user.level || 1);
    const activityIndex = totalActions / daysActive;

    if (activityIndex > 5) return 'عالي جداً 🔥';
    if (activityIndex > 3) return 'عالي 💪';
    if (activityIndex > 1) return 'متوسط 👍';
    return 'منخفض 😴';
  }

  // Calculate engagement score
  static calculateEngagement(user) {
    let score = 0;

    // Game engagement
    if (user.gamesPlayed?.total > 20) score += 25;
    else if (user.gamesPlayed?.total > 10) score += 15;
    else if (user.gamesPlayed?.total > 0) score += 5;

    // Khatma engagement
    if (user.khatmaProgress?.currentPage > 300) score += 25;
    else if (user.khatmaProgress?.currentPage > 100) score += 15;
    else if (user.khatmaProgress?.currentPage > 0) score += 5;

    // Level engagement
    if (user.level > 15) score += 20;
    else if (user.level > 5) score += 10;

    // Coins accumulation
    if (user.coins > 1000) score += 15;

    return Math.min(score, 100);
  }

  // Detect user strengths
  static detectStrengths(user) {
    const strengths = [];

    if (user.gamesPlayed?.wins / (user.gamesPlayed?.total || 1) > 0.7) {
      strengths.push('🏆 لاعب بارع');
    }

    if (user.khatmaProgress?.currentPage > 500) {
      strengths.push('📖 قارئ متفاني');
    }

    if (user.level > 20) {
      strengths.push('⭐ لاعب متقدم');
    }

    if (user.coins > 2000) {
      strengths.push('💰 محترف الاقتصاد');
    }

    return strengths.length > 0 ? strengths : ['🌱 في البداية ولكن بقوة'];
  }

  // Detect areas for improvement
  static detectWeaknesses(user) {
    const weaknesses = [];

    if (!user.khatmaProgress?.currentPage || user.khatmaProgress.currentPage < 50) {
      weaknesses.push('📖 يمكنك توسيع قراءتك للقرآن');
    }

    if (!user.gamesPlayed?.total || user.gamesPlayed.total < 5) {
      weaknesses.push('🎮 جرب الألعاب أكثر!');
    }

    if (user.gamesPlayed?.wins / (user.gamesPlayed?.total || 1) < 0.5) {
      weaknesses.push('🎯 استراتيجية اللعب تحتاج تحسين');
    }

    if (user.coins < 100) {
      weaknesses.push('💰 جمِّع المزيد من العملات');
    }

    return weaknesses.length > 0 ? weaknesses : ['✨ أنت بتطور رائع!'];
  }

  // Generate AI recommendations
  static generateRecommendations(user) {
    const recommendations = [];

    // Based on game performance
    if (user.gamesPlayed?.wins / (user.gamesPlayed?.total || 1) < 0.5) {
      recommendations.push({
        priority: 'عالية',
        action: '🎮 تحسين مهارات اللعب',
        description: 'جرب استراتيجيات مختلفة في الألعاب'
      });
    }

    // Based on Khatma progress
    if (!user.khatmaProgress?.currentPage || user.khatmaProgress.currentPage < 100) {
      recommendations.push({
        priority: 'متوسطة',
        action: '📖 زيادة القراءة',
        description: 'اقرأ يومياً لتحقيق تقدم ثابت'
      });
    }

    // Based on level
    if (user.level < 5) {
      recommendations.push({
        priority: 'عالية',
        action: '⭐ رفع المستوى',
        description: 'العب والاعب يومياً لجمع نقاط'
      });
    }

    // Based on coin balance
    if (user.coins < 100) {
      recommendations.push({
        priority: 'متوسطة',
        action: '💰 جمع العملات',
        description: 'عدد الألعاب تزيد رصيدك'
      });
    }

    // Motivation
    recommendations.push({
      priority: 'منخفضة',
      action: '🌟 التحفيز والاستمرار',
      description: 'أنت تعمل بشكل رائع! استمر هكذا!'
    });

    return recommendations;
  }

  // Predict next user action
  static predictNextAction(user) {
    const predictions = [];

    if (user.gamesPlayed?.total > user.khatmaProgress?.currentPage) {
      predictions.push('🎮 سيلعب لعبة أخرى بعد قليل');
    }

    if (user.level < 10) {
      predictions.push('⭐ سيركز على جمع نقاط');
    }

    if (user.coins > 500) {
      predictions.push('💰 قد يشتري أشياء جديدة');
    }

    return predictions[Math.floor(Math.random() * predictions.length)] || '🎯 يبحث عن تحدي جديد';
  }

  // Get personalized insights
  static getPersonalizedInsights(user) {
    const activityLevel = this.calculateActivityLevel(user);
    const engagementScore = this.calculateEngagement(user);
    const nextAction = this.predictNextAction(user);

    return `
📊 <b>تحليل سلوكك الذكي</b>

🔥 مستوى النشاط: ${activityLevel}
📈 نسبة المشاركة: ${engagementScore}%

💡 توقعاتنا: ${nextAction}

🎯 استمر في هذا الطريق! أنت تعمل بشكل عظيم!`;
  }

  // Smart streak tracking
  static async updateUserStreak(userId) {
    try {
      const user = await User.findOne({ userId });
      if (!user) return;

      const lastActive = new Date(user.lastActive || user.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

      if (!user.streak) {
        user.streak = {
          current: 1,
          longest: 1,
          lastActiveDay: new Date()
        };
      } else if (daysDiff === 1) {
        // Consecutive day
        user.streak.current += 1;
        if (user.streak.current > user.streak.longest) {
          user.streak.longest = user.streak.current;
        }
      } else if (daysDiff > 1) {
        // Streak broken
        user.streak.current = 1;
      }

      user.lastActive = now;
      await user.save();

      return user.streak;
    } catch (error) {
      console.error('Streak update error:', error);
      return null;
    }
  }
}

module.exports = LearningSystem;
