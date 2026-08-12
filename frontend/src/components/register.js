import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";

function Register({ onSwitchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Register Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "https://paypulse-og6r.onrender.com/api/auth/register",
        { fullName, email, password },
      );

      toast.success(data.message);
      setIsSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    }
    setLoading(false);
  };

  // Verification Code Submit Handler
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://paypulse-og6r.onrender.com/api/auth/verify-email",
        { email, code },
      );

      toast.success(data.message);
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  // 🟢 Verification Code Input Screen
  if (isSubmitted) {
    return (
      <form
        className="auth-form"
        onSubmit={handleVerifyCode}
        style={{ textAlign: "center" }}
      >
        <h2>Enter Verification Code</h2>
        <p
          style={{ color: "#64748b", fontSize: "14px", margin: "10px 0 20px" }}
        >
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        <div className="form-group">
          <input
            className="form-input"
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              textAlign: "center",
              fontSize: "20px",
              letterSpacing: "6px",
            }}
          />
        </div>

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Account"}
        </button>
      </form>
    );
  }

  // Registration Form
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Full Name</label>
        <input
          className="form-input"
          type="text"
          placeholder="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create password"
        className="form-input"
      />

      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}

export default Register;
