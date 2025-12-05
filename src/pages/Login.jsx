import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tab, setTab] = useState("password"); // password | otp | google

  // Password Login States
  const [userData, setUserData] = useState({ username: "", password: "" });

  // OTP Login States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // -------------------------------
  // 1️⃣ PASSWORD LOGIN
  // -------------------------------
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setErr(data.error);
      }
    } catch {
      setErr("Network error");
    }

    setLoading(false);
  };

  // -------------------------------
  // 2️⃣ SEND OTP
  // -------------------------------
  const sendOTP = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone }),   // 🔥🔥🔥 MUST ADD THIS !!!
});

      const data = await res.json();
      if (data.success) setOtpSent(true);
      else setErr("Failed to send OTP");
    } catch {
      setErr("Network error");
    }

    setLoading(false);
  };

  // -------------------------------
  // 3️⃣ VERIFY OTP LOGIN
  // -------------------------------
  const verifyOTP = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        navigate(data.user.role === "agent" ? "/agent" : "/dashboard");
      } else {
        setErr("Invalid OTP");
      }
    } catch {
      setErr("Network error");
    }

    setLoading(false);
  };

  // -------------------------------
  // 4️⃣ GOOGLE LOGIN
  // -------------------------------
  const googleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  // -------------------------------
  return (
    <div className="auth-page">
      <div className="auth-container">

        <h2>Login to Fortune Real Estate</h2>

        {err && <p className="error-message">{err}</p>}

        {/* ----------- TABS ----------- */}
        <div className="login-tabs">
          <button className={tab === "password" ? "active" : ""} onClick={() => setTab("password")}>
            Password Login
          </button>

          <button className={tab === "otp" ? "active" : ""} onClick={() => setTab("otp")}>
            OTP Login
          </button>

          <button className={tab === "google" ? "active" : ""} onClick={() => setTab("google")}>
            Google Login
          </button>
        </div>

        {/* ----------------------------------------- */}
        {/* 1️⃣ PASSWORD LOGIN FORM */}
        {/* ----------------------------------------- */}
        {tab === "password" && (
          <form onSubmit={handlePasswordLogin} className="auth-form">
            <input
              type="text"
              placeholder="Username or Email"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              required
            />

            <Link to="/ForgotPassword">Forgot Password?</Link>

            <button type="submit">{loading ? "Logging in..." : "Login"}</button>
          </form>
        )}

        {/* ----------------------------------------- */}
        {/* 2️⃣ OTP LOGIN FORM */}
        {/* ----------------------------------------- */}
        {tab === "otp" && (
          <div className="auth-form">
            {!otpSent ? (
              <>
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button onClick={sendOTP}>{loading ? "Sending OTP..." : "Send OTP"}</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button onClick={verifyOTP}>{loading ? "Verifying..." : "Verify OTP"}</button>

                <p onClick={sendOTP} style={{ cursor: "pointer", marginTop: "10px" }}>
                  Resend OTP
                </p>
              </>
            )}
          </div>
        )}
        {/* ----------------------------------------- */}
        {/* 3️⃣ GOOGLE LOGIN */}
        {/* ----------------------------------------- */}
        {tab === "google" && (
          <div className="auth-form">
            <button onClick={googleLogin} className="google-btn">
              Continue with Google
            </button>
          </div>
        )}
        <p className="auth-link">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
