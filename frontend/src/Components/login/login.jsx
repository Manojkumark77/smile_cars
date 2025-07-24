import React, { useState } from "react";
import "./login.css";
import { Navigate, useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose, switchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pwd }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed");
        return;
      }

      setSuccess("Login successful!");
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        onClose();
        setEmail("");
        setPwd("");
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">
          ✖
        </button>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <p>
          Don’t have an account?{" "}
          <span onClick={switchToSignUp} className="link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
