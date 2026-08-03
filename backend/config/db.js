const mongoose = require("mongoose");
const seedTestAccount = require("../utils/seedTestAccount");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully!");

    await seedTestAccount();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectDB;
