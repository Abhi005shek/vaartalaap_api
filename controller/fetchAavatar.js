const User = require("../models/User");

async function fetchAvatar(req, res) {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      avatarInfo: user,
    });
  } catch (error) {
    console.log("Error while fecthing Avatar : ", error);
  }
}

module.exports = {
  fetchAvatar,
};
