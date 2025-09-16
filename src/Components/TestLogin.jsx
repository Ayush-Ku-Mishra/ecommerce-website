// TestLogin.jsx - Create this file temporarily
import React, { useState } from "react";

const TestLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("TEST LOGIN SUBMITTED!");
    console.log("Email:", email);
    console.log("Password:", password);
    
    // Test your actual login API
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Login response:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
      }
    })
    .catch(error => {
      console.error("Login error:", error);
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Test Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none" }}>
          Test Login
        </button>
      </form>
    </div>
  );
};

export default TestLogin;