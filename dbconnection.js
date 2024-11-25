const mongoose = require("mongoose");
require("dotenv").config();

async function dbconnection() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/vaartalaap" || process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database Connected");
  } catch (error) {
    console.log("Error while Connceting with the database : ", error);
  }
}

module.exports = dbconnection;
