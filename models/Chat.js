import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  chatId: { type: String, unique: true, index: true },
  participants: [{ type: String, index: true }],
  lastMessageAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.model('Chat', ChatSchema);
