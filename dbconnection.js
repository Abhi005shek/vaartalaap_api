const mongoose = require("mongoose");

async function dbconnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected");
  } catch (error) {
    console.log("Error while Connceting with the database : ", error);
  }
}

module.exports = dbconnection;
