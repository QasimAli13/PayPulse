import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PasswordInput from "./PasswordInput"; // 🟢 PasswordInput component import kiya

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1️⃣ Send OTP Handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://paypulse-og6r.onrender.com/api/auth/forget-password",
        { email },
      );

      toast.success(res.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://paypulse-og6r.onrender.com/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        },
      );

      toast.success(res.data.message || "Password reset successful!");
      onClose();
      setStep(1);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-overlay">
      <div className="forgot-modal">
        <button className="forgot-close-btn" onClick={onClose}>
          ✕
        </button>

        {step === 1 ? (
          <>
            <h2 className="forgot-title">Forgot Password</h2>

            <p className="forgot-text">
              Enter your registered email address to receive a 6-digit OTP.
            </p>

            <form onSubmit={handleSendOtp} className="forgot-form">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="forgot-primary-btn"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="forgot-title">Verify OTP</h2>

            <p className="forgot-text">
              Enter the OTP sent to <strong>{email}</strong>
            </p>

            <form onSubmit={handleResetPassword} className="forgot-form">
              <label>OTP Code</label>

              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              {/* 🟢 Replaced standard input with PasswordInput component */}
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="form-input"
              />

              <button
                type="submit"
                className="forgot-primary-btn"
                disabled={loading}
                style={{ marginTop: "15px" }}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
