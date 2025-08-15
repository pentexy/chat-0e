import express from 'express';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const router = express.Router();

// POST /startChat { from, to }
router.post('/startChat', async (req, res) => {
  const { from, to } = req.body || {};
  if (!from || !to) return res.status(400).json({ error: 'from/to required' });
  const chatId = [from, to].sort().join('__');
  await Chat.updateOne(
    { chatId },
    { $set: { chatId, participants: [from, to] } },
    { upsert: true }
  );
  res.json({ chatId });
});

// GET /messages?chatId=...
router.get('/messages', async (req, res) => {
  const { chatId } = req.query || {};
  if (!chatId) return res.status(400).json({ error: 'chatId required' });
  const msgs = await Message.find({ chatId }).sort({ timestamp: 1 }).lean();
  res.json(msgs.map(m => ({ from: m.from, to: m.to, text: m.text, time: m.timestamp })));
});

// GET /export/chats.txt  → "[ {USERNAME} ] : {message}"
router.get('/export/chats.txt', async (_req, res) => {
  const msgs = await Message.find({}).sort({ timestamp: 1 }).limit(1000).lean();
  const lines = msgs.map(m => `[ {${m.from}} ] : ${m.text}`);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="chats.txt"');
  res.send(lines.join('\n'));
});

export default router;
