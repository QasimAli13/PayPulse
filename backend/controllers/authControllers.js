const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      balance: 5000,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: newUser,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
    console.log("LOGIN REQUEST RECEIVED");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function forgetPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Is email par koi account nahi mila." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const emailTemplate = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; background: #fffdf8; border: 1px solid #e7dcc9; border-radius: 14px; overflow: hidden;">

  <div style="background: #8b6b4a; padding: 20px; text-align: center;">
    <h2 style="color: #ffffff; margin: 0;">PayPulse</h2>
    <p style="color: #f8f3ea; margin-top: 8px; font-size: 14px;">
      Password Reset Verification
    </p>
  </div>

  <div style="padding: 30px;">
    <p style="font-size: 16px; color: #4b3f35;">
      Hello,
    </p>

    <p style="font-size: 15px; color: #6b5b4d; line-height: 1.7;">
      We received a request to reset your PayPulse account password.
      Use the following One-Time Password (OTP) to continue.
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <div style="display: inline-block; background: #f6efe4; border: 2px dashed #b08968; color: #5c4430; padding: 16px 32px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 10px;">
        ${otp}
      </div>
    </div>

    <p style="font-size: 14px; color: #7a6a5b; line-height: 1.7;">
      This OTP will expire in <strong>10 minutes</strong>.
      Do not share this code with anyone.
    </p>

    <hr style="border: none; border-top: 1px solid #e7dcc9; margin: 25px 0;">

    <p style="font-size: 13px; color: #9a8c7c; text-align: center;">
      If you didn't request a password reset, you can safely ignore this email.
    </p>
  </div>

</div>
`;
    await sendEmail({
      email: user.email,
      subject: "PayPulse - Password Reset OTP",
      html: emailTemplate,
    });
    res
      .status(200)
      .json({ message: "OTP aapki email par bhej diya gaya hai!" });
  } catch (error) {
    console.error("Email Error:", error);
    res
      .status(500)
      .json({ message: "Email bhejne mein masla hua, dubara try karein." });
  }
}
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
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password successfully changed! Login Now.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, password can't be reset." });
  }
}

module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
};
