import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// POST /register { username }
router.post('/register', async (req, res) => {
  try {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ error: 'username required' });

    const u = await User.findOneAndUpdate(
      { username },
      { $setOnInsert: { username }, $set: { lastSeen: new Date() } },
      { upsert: true, new: true }
    );
    res.json({ success: true, user: { username: u.username, createdAt: u.createdAt } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /users?query=abc
router.get('/users', async (req, res) => {
  const q = (req.query.query || '').trim();
  const filter = q ? { username: { $regex: q, $options: 'i' } } : {};
  const users = await User.find(filter).sort({ username: 1 }).limit(100).lean();
  res.json(users.map(u => ({ username: u.username })));
});

// GET /export/users.txt  (plain usernames)
router.get('/export/users.txt', async (_req, res) => {
  const users = await User.find({}).sort({ username: 1 }).lean();
  const lines = users.map(u => u.username);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="users.txt"');
  res.send(lines.join('\n'));
});

export default router;
