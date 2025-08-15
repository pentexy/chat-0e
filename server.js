import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDB } from './db.js';
import { initSocket } from './socket.js';
import usersRoutes from './routes/users.js';
import chatsRoutes from './routes/chats.js';
import messagesRoutes from './routes/messages.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.use('/', usersRoutes);    // /register, /users, /export/users.txt
app.use('/', chatsRoutes);    // /startChat, /messages, /export/chats.txt
app.use('/', messagesRoutes); // /sendMessage

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

connectDB(MONGODB_URI)
  .then(() => server.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Mongo error', err);
    process.exit(1);
  });
