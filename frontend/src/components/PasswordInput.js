import React, { useState } from "react";

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="form-group"
      style={{ position: "relative", marginBottom: "16px" }}
    >
      {label && (
        <label style={{ display: "block", marginBottom: "6px" }}>{label}</label>
      )}
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Enter password"}
        required={required}
        className="profile-input"
        style={{ width: "100%", paddingRight: "60px", boxSizing: "border-box" }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "12px",
          top: label ? "38px" : "50%",
          transform: label ? "none" : "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default PasswordInput;
