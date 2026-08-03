import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Register({ onRegister }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "https://paypulse-og6r.onrender.com/api/auth/register",
        {
          fullName,
          email,
          password,
        }
      );

      localStorage.setItem("token", data.token);

      toast.success(`Welcome, ${data.user.fullName}!`);

      onRegister(data.user);
    } catch (error) {
      const message =
        error.response?.data?.message || "Authentication failed";

      setError(message);
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
      autoComplete="on"
    >
      <h2>Create Account</h2>

      {error && <p className="error-message">{error}</p>}

      <input
        className="form-input"
        type="text"
        placeholder="Full Name"
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

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
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="primary-btn"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}

export default Register;