const express = require("express");
const socketio = require("socket.io");
const { createServer } = require("http");
const dbconnection = require("./dbconnection");
const socket_server = require("./socket_server");
const User = require("./models/User");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const authenticateSocket = require("./utils/auth");
const fetchChatRoom = require("./controller/fetchChatRooms");
const authenticate = require("./middleware/authenicate");
const { fetchChatHistory } = require("./controller/privateChat");
const { fetchAvatar } = require("./controller/fetchAavatar");
const { mongoose } = require("mongoose");
require("dotenv").config();

dbconnection();

const app = express();
app.use(express.json());

app.use(
  cors()
);

const server = createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.get("/", (req, res) => res.send("<h2>Server Started</h2>"));

app.post("/signup", async (req, res) => {
  const { username, email } = req.body;
  try {
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and Email are must fields",
      });
    }
    const isExist = await User.findOne({ email: email });

    if (isExist)
      return res.json({ success: false, message: "User already exist" });

    const user = await User.create({
      username: username,
      email: email,
      passwordHash: "1234",
    });

    req.user = user;
    const token = jwt.sign({ user }, "vartalaap-secret-key");
    res.status(201).json({
      token: token,
      success: true,
      theme: user.theme,
      message: "User created in successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, email } = req.body;

  console.log(req.body);
  try {
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and Email are must fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }
    req.user = user;
    const token = jwt.sign({ user }, "vartalaap-secret-key", {
      expiresIn: "1h",
    });
    res.status(201).json({
      token: token,
      success: true,
      theme: user.theme,
      message: "User Logged in successfully",
    });
  } catch (error) {
    console.log("error -> ", error);

    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

app.get("/chatrooms", authenticate, fetchChatRoom);
app.post("/chathistory", authenticate, fetchChatHistory);
app.post("/avatarUrl", authenticate, fetchAvatar);
app.post("/theme", authenticate, async (req, res) => {
  const { user } = req.user;
  const { value } = req.body;
  try {
    const data = await User.updateOne({ _id: user._id }, { theme: value });

    // console.log("data -------->", user._id, value, data);

    res.status(200).json({
      success: true,
      message: "Theme changed!!",
    });
  } catch (error) {
    console.log("Error while fetching profile", error);
  }
});

io.use(authenticateSocket);
socket_server(io);

server.listen(process.env.PORT || 5000, () =>
  console.log("server started at 5000")
);
