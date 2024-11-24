const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupName: { type: String, required: true },
  description: { type: String, default: "" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
