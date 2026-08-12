const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// 1️⃣ REGISTER USER
async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Plain password create karein, pre-save hook 1st time hash karega
    const newUser = await User.create({
      fullName,
      email,
      password,
      isVerified: false,
      verificationToken: verificationCode,
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e7dcc9; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #8b6b4a; text-align: center;">Welcome to PayPulse!</h2>
        <p style="color: #334155;">Hi ${fullName},</p>
        <p style="color: #475569;">Use the verification code below to activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #f6efe4; border: 2px dashed #b08968; color: #5c4430; padding: 14px 32px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 10px;">
            ${verificationCode}
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "PayPulse - Account Verification Code",
        html: emailTemplate,
      });
    } catch (emailErr) {
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        message: "Verification code email send nahi ho saki.",
        error: emailErr.message,
      });
    }

    return res.status(201).json({
      message: "Registration successful! Verification code bhej diya gaya hai.",
      email: newUser.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// 2️⃣ VERIFY CODE (WITHOUT TRIGGERING PRE-SAVE HOOK)
async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email aur Verification Code lazmi hain." });
    }

    const user = await User.findOne({ email, verificationToken: code });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Ghalat ya expired verification code." });
    }

    // Direct Update karein taake pre-save hook re-trigger na ho
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      $unset: { verificationToken: 1 },
    });

    return res.status(200).json({
      message: "Account verify ho gaya hai! Ab aap login kar sakte hain.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// 3️⃣ LOGIN USER
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your account before logging in.",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
} // 4️⃣ FORGOT PASSWORD CONTROLLER
async function forgetPassword(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Please enter your email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email." });
    }

    // 6-Digit Reset OTP Generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Direct Database Update without password re-hashing
    await User.findByIdAndUpdate(user._id, {
      resetOtp: otp,
      resetOtpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fffdf8; border: 1px solid #e7dcc9; border-radius: 14px; overflow: hidden;">
        <div style="background: #8b6b4a; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">PayPulse</h2>
          <p style="color: #f8f3ea; margin-top: 8px; font-size: 14px;">Password Reset Verification</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #4b3f35;">Hello,</p>
          <p style="font-size: 15px; color: #6b5b4d; line-height: 1.7;">
            Use the OTP below to reset your PayPulse account password:
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <div style="display: inline-block; background: #f6efe4; border: 2px dashed #b08968; color: #5c4430; padding: 16px 32px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 10px;">
              ${otp}
            </div>
          </div>
          <p style="font-size: 14px; color: #7a6a5b;">This OTP will expire in <strong>10 minutes</strong>.</p>
        </div>
      </div>
    `;

    // Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: "PayPulse - Password Reset OTP",
        html: emailTemplate,
      });
    } catch (emailErr) {
      console.error("❌ RESET OTP EMAIL ERROR:", emailErr);
      return res.status(500).json({
        message: "Failed to send email. Check SMTP/Nodemailer settings.",
        error: emailErr.message,
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully to your email!",
    });
  } catch (error) {
    console.error("❌ FORGET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error, please try again." });
  }
}

// 5️⃣ RESET PASSWORD
async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or Expired OTP. Try again." });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res
      .status(200)
      .json({ message: "Password successfully changed! Login Now." });
  } catch (error) {
    res.status(500).json({ message: "Server error, password can't be reset." });
  }
}

// 6️⃣ CHANGE PASSWORD
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  changePassword,
};
