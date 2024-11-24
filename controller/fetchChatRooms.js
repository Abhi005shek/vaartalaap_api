const ChatRoom = require("../models/ChatRoom");
const mongoose = require("mongoose");
const Message = require("../models/Message");

function fetchLastMessages(chatRooms) {
  return Promise.all(
    chatRooms.map(async (el) => {
      const msg = await Message.findById(el.lastMessage);
      // console.log(msg);
      return { msg: msg };
    })
  );
}

const fetchChatRoom = async (req, res) => {
  const {
    user: { _id: userId },
  } = req.user;

  try {
    let chatRooms = await ChatRoom.find({
      participants: new mongoose.Types.ObjectId(userId),
    });

    const Rooms = await fetchLastMessages(chatRooms);
    // console.log("chat rooms last message --->  : ", Rooms);

    const chat = chatRooms.map((chatRoom, i) => ({
      ...chatRoom.toObject(),
      lastMsg: Rooms[i] && Rooms[i].msg ? Rooms[i].msg?.messageText : "",
      lastMsgTime: Rooms[i] && Rooms[i].msg ? Rooms[i].msg?.sentAt : "",
    }));

    res.json({
      success: true,
      chatRooms: chat,
    });
  } catch (error) {
    console.log("Error while fetching chatrooms for this user: ", error);
    res.status(500).json({ error: error });
  }
};

module.exports = fetchChatRoom;
