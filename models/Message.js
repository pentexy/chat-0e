import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, index: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true }
});

export default mongoose.model('Message', MessageSchema);
