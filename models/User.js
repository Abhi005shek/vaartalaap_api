const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: "default-avatar.png" },
  lastLogin: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["online", "offline", "away"],
    default: "online",
  },
  theme: {type: Number, default: 0},
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userschema);
module.exports = User;
