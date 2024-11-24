const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  messageText: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'image', 'video', 'audio', 'file'], default: 'text' },
  sentAt: { type: Date, default: Date.now },
  isActive: {type: Boolean, default: true}
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
