const mongoose = require("mongoose");
const { privateChat, chatMessages } = require("./controller/privateChat");
const ChatRoom = require("./models/ChatRoom");
const User = require("./models/User");
const { createPrivateChatRoom } = require("./utils/helper");
const Message = require("./models/Message");

function socket_server(io) {
  io.on("connection", (socket) => {
    console.log("New User Connected, id: ", socket.id);

    socket.on("joinPrivateChat", async ({ userId1, userId2 }) => {
      const user1 = await User.findOne({ email: userId1 });
      const user2 = await User.findOne({ email: userId2 });

      if (!user1 || !user2) {
        socket.emit("error", "Users not found");
        return;
      }
      const room = await createPrivateChatRoom(user1, user2);
      console.log("Room Name: ", room._id.toString());
      socket.join(room._id.toString());
    });

    socket.on("join", async (roomId) => {
      try {
        const room = await ChatRoom.findById(roomId);
        console.log("Room Name: ", room._id.toString());
        socket.join(room._id.toString());
      } catch (error) {
        console.log("Error : ", error);
      }
    });

    socket.on("sendPrivateMessage", async ({ room, message }) => {
      try {
        const user = socket.user;
        const roomInfo = await ChatRoom.findById(room);
        console.log("Room Name: ", roomInfo._id.toString());
        socket.join(roomInfo._id.toString());

        const msg = await privateChat(user, room, message);
        await ChatRoom.updateOne(
          { _id: new mongoose.Types.ObjectId(room) },
          { $set: { lastMessage: msg._id } }
        );
        io.to(roomInfo._id.toString()).emit("chatmsg", msg);
        // socket.emit("chatmsg", msg);
        console.log("came upto here", room);
      } catch (err) {
        console.log("Error ❌❌ : ", err);
      }
    });

    socket.on("messagesForRoom", async (room) => {
      try {
        const msgs = await Message.find({
          chatRoom: new mongoose.Types.ObjectId(room),
        });
        socket.emit("vaarta", msgs);
      } catch (error) {
        console.log("Error: ", error);
      }
    });
  });
}

module.exports = socket_server;
