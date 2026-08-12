import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your email, please wait...",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyToken = async () => {
      try {
        const backendUrl =
          process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

        const { data } = await axios.get(
          `${backendUrl}/api/auth/verify-email?token=${token}`,
        );

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed or link expired.",
        );
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="verify-page">
      <div className={`verify-card ${status}`}>
        {status === "verifying" && (
          <div className="verify-content">
            <div className="verify-spinner"></div>

            <h2>Verifying Email</h2>

            <p>{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="verify-content">
            <div className="verify-icon success-icon">✓</div>

            <h2>Email Verified!</h2>

            <p>{message}</p>

            <button onClick={() => navigate("/login")} className="verify-btn">
              Go to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="verify-content">
            <div className="verify-icon error-icon">!</div>

            <h2>Verification Failed</h2>

            <p>{message}</p>

            <button
              onClick={() => navigate("/register")}
              className="verify-btn"
            >
              Back to Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
