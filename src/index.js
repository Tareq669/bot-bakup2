<<<<<<< HEAD
// src/index.js

const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Telegraf bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Start command
bot.start((ctx) => {
    ctx.reply('Welcome!');
});

// Handle errors
bot.catch((err) => {
    console.error('Error occurred:', err);
});

// Main startup function
(async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        const client = new MongoClient(mongoUri);
        
        console.log('📡 جاري الاتصال بقاعدة البيانات...');
        await client.connect();
        console.log('✅ تم الاتصال بقاعدة البيانات');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🛑 إيقاف البوت بشكل آمن...');
            await client.close();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\n🛑 إيقاف البوت بشكل آمن...');
            await client.close();
            process.exit(0);
        });

        // Start the bot
        console.log('🚀 بدء تشغيل البوت...');
        await bot.launch();
        console.log('✅ البوت يعمل الآن!');
        console.log('🤖 Bot Token: ' + (process.env.BOT_TOKEN ? 'موجود ✓' : 'مفقود ✗'));
        console.log('📊 Database: متصل ✓');
        console.log('⏸️  اضغط Ctrl+C لإيقاف البوت');

    } catch (error) {
        console.error('❌ خطأ:', error.message);
        process.exit(1);
    }
})();
=======
// Assuming you've restored the content of src/index.js
console.log('Bot has been restored!');
// Add the rest of your restored code here...
>>>>>>> 7c89d3cbe61d82f4f596f309c05231e17a57f287
