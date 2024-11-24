const ChatRoom = require("../models/ChatRoom");

async function createPrivateChatRoom(user1, user2) {
  // Check if a chat room already exists between user1 and user2
  const existingRoom = await ChatRoom.findOne({
    participants: { $all: [user1, user2] },
    type: "private",
  });

  if (existingRoom) {
    return existingRoom;
  }

  const newRoom = await ChatRoom.create({
    name: `${user1.username}-${user2.username}`, // Private chat name
    participants: [user1._id, user2._id],
    type: "private",
  });

  return newRoom;
}

module.exports = {
  createPrivateChatRoom,
};
