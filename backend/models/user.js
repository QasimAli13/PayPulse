const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      unique: true,
    },

    balance: {
      type: Number,
      default: 1000,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    resetOtp: {
      type: String,
    },
    resetOtpExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.accountNumber) {
    let accountNumber;
    let exists = true;

    while (exists) {
      accountNumber = Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString();

      exists = await mongoose.model("User").exists({
        accountNumber,
      });
    }

    this.accountNumber = accountNumber;
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
