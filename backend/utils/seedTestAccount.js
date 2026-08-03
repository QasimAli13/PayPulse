const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function seedTestAccount() {
  try {
    const testAccount = await User.findOne({
      accountNumber: "PAYP-TEST-9999",
    });

    if (!testAccount) {
      const hashedPassword = await bcrypt.hash(
        "TestVaultPass123!",
        10
      );

      await User.create({
        fullName: "PayPulse Test Vault",
        email: "testvault@paypulse.internal",
        password: hashedPassword,
        accountNumber: "PAYP-TEST-9999",
        balance: 50000,
      });

      console.log("Test account created");
    } else {
      console.log("Test account already exists");
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = seedTestAccount;