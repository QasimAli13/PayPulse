import React, { useState } from "react";
import axios from "axios";
import PasswordInput from "./PasswordInput";

function ProfileSettings({ user }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        "https://paypulse-og6r.onrender.com/api/auth/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage({
        type: "success",
        text: data.message,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="profile-settings">
      <div className="profile-header">
        <h2>Account & Security</h2>
      </div>

      <div className="profile-cards">
        <div className="profile-card">
          <span className="profile-label">Account Holder</span>
          <p className="profile-value">{user?.fullName || "N/A"}</p>
        </div>

        <div className="profile-card">
          <span className="profile-label">Email Address</span>
          <p className="profile-value">{user?.email || "N/A"}</p>
        </div>

        <div className="profile-card">
          <span className="profile-label">Account Number</span>
          <p className="profile-account-number">
            {user?.accountNumber || "N/A"}
          </p>
        </div>

        <div className="profile-card">
          <span className="profile-label">Current Balance</span>
          <p className="profile-balance">
            ${user?.balance?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>

      <div className="password-section">
        <h3>Change Password</h3>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="password-form" onSubmit={handlePasswordChange}>
          <PasswordInput
            label="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            className="profile-input"
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="profile-input"
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="profile-input"
          />

          <button
            className="update-password-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
