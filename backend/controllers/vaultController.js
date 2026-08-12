const Vault = require("../models/vault");
const User = require("../models/user");

// 1. Create New Vault
async function createVault(req, res) {
  try {
    const { title, targetAmount, lockUntil } = req.body;
    const userId = req.user._id;

    if (!title || !targetAmount || !lockUntil) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newVault = await Vault.create({
      user: userId,
      title,
      targetAmount: Number(targetAmount),
      lockUntil: new Date(lockUntil),
    });

    return res.status(201).json({
      message: "Vault created successfully!",
      vault: newVault,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// 2. Deposit Money into Vault (Main Balance -> Vault)
async function depositToVault(req, res) {
  try {
    const { vaultId, amount } = req.body;
    const depositAmount = Number(amount);
    const userId = req.user._id;

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const user = await User.findById(userId);
    if (user.balance < depositAmount) {
      return res.status(400).json({ message: "Insufficient main balance" });
    }

    const vault = await Vault.findOne({ _id: vaultId, user: userId });
    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }

    // Deduct from Main Balance & Add to Vault
    await User.findByIdAndUpdate(userId, { $inc: { balance: -depositAmount } });

    vault.savedAmount += depositAmount;
    if (vault.savedAmount >= vault.targetAmount) {
      vault.isCompleted = true;
    }
    await vault.save();

    return res.status(200).json({
      message: `Successfully added $${depositAmount} to ${vault.title}!`,
      vault,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// 3. Withdraw Money back to Main Balance (Enforces Locking Rule)
async function withdrawFromVault(req, res) {
  try {
    const { vaultId } = req.body;
    const userId = req.user._id;

    const vault = await Vault.findOne({ _id: vaultId, user: userId });
    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }

    const currentDate = new Date();
    if (currentDate < new Date(vault.lockUntil) && !vault.isCompleted) {
      return res.status(400).json({
        message: `Vault is locked until ${new Date(vault.lockUntil).toLocaleDateString()}. Cannot withdraw yet!`,
      });
    }

    if (vault.savedAmount <= 0) {
      return res.status(400).json({ message: "Vault balance is 0" });
    }

    const amountToReturn = vault.savedAmount;

    // Refund to Main Balance & Reset Vault
    await User.findByIdAndUpdate(userId, { $inc: { balance: amountToReturn } });

    vault.savedAmount = 0;
    await vault.save();

    return res.status(200).json({
      message: `Withdrew $${amountToReturn} back to your Main Balance!`,
      returnedAmount: amountToReturn,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// 4. Get All User Vaults
async function getUserVaults(req, res) {
  try {
    const vaults = await Vault.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(vaults);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createVault,
  depositToVault,
  withdrawFromVault,
  getUserVaults,
};
