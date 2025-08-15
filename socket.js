import { Server } from 'socket.io';
import Message from './models/Message.js';
import Chat from './models/Chat.js';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('join', ({ chatId }) => { if (chatId) socket.join(chatId); });

    socket.on('sendMessage', async (payload) => {
      const { chatId, from, to, message, timestamp } = payload || {};
      if (!chatId || !from || !to || !message) return;

      await Chat.updateOne(
        { chatId },
        { $set: { chatId, participants: [from, to], lastMessageAt: new Date(timestamp || Date.now()) } },
        { upsert: true }
      );

      const msg = await Message.create({
        chatId, from, to, text: message,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      });

      io.to(chatId).emit('newMessage', {
        chatId, from, text: msg.text, time: msg.timestamp
      });
    });
  });

  console.log('📡 Socket.IO ready');
  return io;
};
