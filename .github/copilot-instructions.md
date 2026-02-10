# Project Setup Instructions

This is an advanced Arabic-first Telegram bot built with Node.js, Telegraf, and MongoDB.

## Project Structure
- **src/commands/** - Command and menu handlers
- **src/games/** - Game system implementation
- **src/economy/** - Economy and leveling system
- **src/content/** - Content providers (Quran, Adhkar, etc.)
- **src/moderation/** - Group protection and moderation tools
- **src/database/** - MongoDB models
- **src/ui/** - UI components (keyboards, formatters)
- **src/utils/** - Helper utilities

## Key Features
1. **Islamic Content** - Quran, Adhkar, Islamic reminders
2. **Game System** - Multiple interactive games with rewards
3. **Economy System** - Virtual currency, purchases, transfers
4. **Leveling System** - User progression and rewards
5. **Moderation Tools** - Group protection and admin controls
6. **User Profiles** - Detailed user information and statistics
7. **Leaderboards** - Ranking system based on XP and coins

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Create `.env` file from `.env.example`
2. Set your Telegram Bot Token
3. Configure MongoDB URI
4. Add Bot Owner IDs

### 3. Database Setup
- Ensure MongoDB is running
- Models will auto-create collections

### 4. Run the Bot
```bash
npm start          # Production mode
npm run dev        # Development with auto-reload
```

## Bot Owner IDs
- @JOAmeer
- @llTDTll

These users have full unrestricted control over all bot systems.

## Available Commands
- `/start` - Start the bot
- `/help` - Show help
- `/profile` - Display user profile
- `/balance` - Show coin balance
- `/leaderboard` - View top users
- `/daily` - Claim daily reward

## Main Features
All accessible through button-based interface:
- 🕌 الختمة (Quran Tracking)
- 📿 الأذكار (Islamic Reminders)
- 🎮 الألعاب (Games)
- 💰 الاقتصاد (Economy)
- 👤 حسابي (Profile)
- 🏆 المتصدرين (Leaderboard)
- ⚙️ الاعدادات (Settings)

## Tech Stack
- **Runtime:** Node.js
- **Bot Framework:** Telegraf
- **Database:** MongoDB with Mongoose
- **Language:** JavaScript (ES6+)

## Database Models
- User (profiles, economy, leveling)
- Group (settings, moderation)
- Transaction (economy tracking)
- GameStats (game statistics)
- Content (database for content)
- Config (bot configuration)

## Security
- Admin permission verification
- Economy abuse protection
- Input validation
- Rate limiting via flood protection
