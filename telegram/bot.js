import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { connectDB } from '../db.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import tempy from 'tempy';
import fs from 'fs';

const bot = new Telegraf(process.env.BOT_TOKEN);

const boot = async () => {
  await connectDB(process.env.MONGODB_URI);

  bot.start((ctx) => ctx.reply('No-Login Chat Bot online. Use /users or /chats'));

  bot.command('users', async (ctx) => {
    const users = await User.find({}).sort({ username: 1 }).lean();
    const path = tempy.file({ name: 'users.txt' });
    await fs.promises.writeFile(path, users.map(u => u.username).join('\n'), 'utf8');
    await ctx.replyWithDocument({ source: path, filename: 'users.txt' });
  });

  bot.command('chats', async (ctx) => {
    const msgs = await Message.find({}).sort({ timestamp: 1 }).limit(1000).lean();
    const lines = msgs.map(m => `[ {${m.from}} ] : ${m.text}`);
    const path = tempy.file({ name: 'chats.txt' });
    await fs.promises.writeFile(path, lines.join('\n'), 'utf8');
    await ctx.replyWithDocument({ source: path, filename: 'chats.txt' });
  });

  bot.launch();
  console.log('Telegram bot running');
};

boot().catch(err => {
  console.error('Bot failed to start', err);
  process.exit(1);
});
