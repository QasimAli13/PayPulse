const User = require("../models/user");
const Transaction = require("../models/transactions");

// 1️⃣ HANDLE TRANSFER (Atomic Updates to prevent race condition & double hashing)
async function handleTransfer(req, res) {
  try {
    const { receiverAccountNumber, amount } = req.body;

    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      return res.status(400).json({
        message: "Invalid transfer amount",
      });
    }

    const sender = await User.findById(req.user._id);

    if (!sender) {
      return res.status(404).json({
        message: "Sender account not found",
      });
    }

    const receiver = await User.findOne({
      accountNumber: receiverAccountNumber,
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver account number does not exist",
      });
    }

    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        message: "You cannot transfer money to your own account",
      });
    }

    if (sender.balance < transferAmount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // 🟢 Atomic Balance Update ($inc) - Pre-save hooks trigger nahi honge
    const updatedSender = await User.findByIdAndUpdate(
      sender._id,
      { $inc: { balance: -transferAmount } },
      { new: true },
    );

    await User.findByIdAndUpdate(receiver._id, {
      $inc: { balance: transferAmount },
    });

    // Create Transaction Record
    const newTransaction = await Transaction.create({
      sender: sender._id,
      receiver: receiver._id,
      amount: transferAmount,
      description: `Transfer to ${receiver.fullName} (${receiver.accountNumber})`,
    });

    return res.status(200).json({
      message: "Transfer successful!",
      updatedBalance: updatedSender.balance,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("❌ TRANSFER ERROR:", error);

    return res.status(500).json({
      message: "Server error during transfer",
      error: error.message,
    });
  }
}

// 2️⃣ GET TRANSACTIONS
async function getTransactions(req, res) {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "fullName accountNumber")
      .populate("receiver", "fullName accountNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transaction history",
      error: error.message,
    });
  }
}

// 3️⃣ GET USER DATA
async function getUserData(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  handleTransfer,
  getTransactions,
  getUserData,
};
