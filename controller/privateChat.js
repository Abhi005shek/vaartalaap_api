const mongoose = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const createPrivateChatRoom = async (user1, user2) => {
  const existingRoom = await ChatRoom.findOne({
    participants: { $all: [user1, user2] },
    type: "private",
  });

  if (existingRoom) return existingRoom;

  const newRoom = await ChatRoom.create({
    participants: [user1, user2],
    type: "private",
  });
  return newRoom;
};

const privateChat = async (user, room, msg) => {
  const {
    user: { _id: userId },
  } = user;

  try {
    const m = await Message.create({
      sender: new mongoose.Types.ObjectId(userId),
      chatRoom: new mongoose.Types.ObjectId(room),
      messageText: msg,
    });

    return m;
  } catch (err) {
    console.log("error in creating message: ", err);
  }
};

const chatMessages = async (user, room) => {
  // const {
  //   user: { _id: userId },
  // } = user;
  const chatRooms = await Message.find({
    chatRoom: new mongoose.Types.ObjectId(room),
  });
  return chatRooms;
};

const fetchChatHistory = async (req, res) => {
  const { room } = req.body;

  // Validate room parameter
  if (!room) {
    return res.status(400).json({
      success: false,
      message: "Chat room ID is required",
    });
  }
  try {
    // Find messages in the specified chat room
    const chatRoom = await ChatRoom.findById(room);
    const messages = await Message.find({
      chatRoom: new mongoose.Types.ObjectId(room),
    });

    // console.log(messages);

    if (!messages.length) {
      return res.status(200).json({ data: [] });
    }
    res.status(200).json({
      chatRoom,
      messages,
    });
  } catch (error) {
    console.log("Error while fetching messages", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching chat history",
      error: error.message,
    });
  }
};

module.exports = {
  createPrivateChatRoom,
  privateChat,
  chatMessages,
  fetchChatHistory,
};
