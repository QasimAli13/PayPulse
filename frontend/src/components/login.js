import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "https://paypulse-og6r.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", data.token);

      toast.success(`Welcome back, ${data.user.fullName}!`);

      onLogin(data.user);
    } catch (error) {
      const message = error.response?.data?.message || "Authentication failed";

      setError(message);

      toast.error(message);
    }

    setLoading(false);
  };
  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="on">
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          className="form-input"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-input"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => setIsForgotModalOpen(true)}
          className="forgot-btn"
        >
          Forgot Password?
        </button>
      </form>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </>
  );
}

export default Login;
