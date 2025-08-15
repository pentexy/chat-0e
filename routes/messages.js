import express from 'express';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

const router = express.Router();

// POST /sendMessage { chatId, from, to, message, timestamp }
router.post('/sendMessage', async (req, res) => {
  const { chatId, from, to, message, timestamp } = req.body || {};
  if (!chatId || !from || !to || !message) return res.status(400).json({ error: 'missing fields' });

  await Chat.updateOne(
    { chatId },
    { $set: { chatId, participants: [from, to], lastMessageAt: new Date(timestamp || Date.now()) } },
    { upsert: true }
  );

  const msg = await Message.create({
    chatId, from, to, text: message,
    timestamp: timestamp ? new Date(timestamp) : new Date()
  });

  res.json({ ok: true, message: { from: msg.from, text: msg.text, time: msg.timestamp } });
});

export default router;
