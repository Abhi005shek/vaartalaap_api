const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ], // list of users in the chat room
  type: { type: String, enum: ["private", "group"], required: true },
  createdAt: { type: Date, default: Date.now },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // reference to the last message sent in the room
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
