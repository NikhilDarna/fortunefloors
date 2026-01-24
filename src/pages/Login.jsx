import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.body.classList.add("page-login");
    return () => document.body.classList.remove("page-login");
  }, []);

  const [mode, setMode] = useState("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   const [phoneInput, setPhoneInput] = useState("");
const OTP_ENABLED = import.meta.env.VITE_OTP_ENABLED === "true";

useEffect(() => {
  if (!OTP_ENABLED && mode === "otp") {
    setOtpSent(true); // skip send OTP step
  }
}, [mode]);
  // PASSWORD LOGIN
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);

        if (data.isNewUser) {
          navigate("/register");
        } else {
          navigate("/"); // HOME PAGE ✅
        }
      }else {
        setError(data.error || "Invalid credentials");
      }
      } catch {
        setError("Network error");
      }

    setLoading(false);
  };

  // 👈 ADD THIS
  // SEND OTP
const sendOTP = async () => {
  if (!OTP_ENABLED) {
    console.log("⚠️ OTP disabled (DEV MODE) — auto login");
    setOtpSent(true);
    return;
  }

  // existing code continues here
  console.log("Send OTP clicked");

  if (!phoneInput || phoneInput.length !== 10) {
    setError("Please enter valid 10-digit mobile number");
    return;
  }

  const phone = `+91${phoneInput}`; // 👈 THIS IS REQUIRED
  console.log("Formatted phone:", phone);

  setLoading(true);
  setError("");

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      }
    );

    const data = await res.json();
    console.log("OTP API response:", data);

    if (data.success) {
      setOtpSent(true);
    } else {
      setError(data.message || "Failed to send OTP");
    }
  } catch (err) {
    console.error(err);
    setError("Network error");
  }

  setLoading(false);
};
 
  // VERIFY OTP
const verifyOTP = async () => {
  if (!OTP_ENABLED) {
    console.log("⚠️ OTP auto verified (DEV MODE)");

    login("DEV_JWT_TOKEN", {
      phone: phoneInput,
      name: "Dev User",
    });

    navigate("/");
    return;
  }

  // existing verification code continues
  if (otp.length !== 6) {
    setError("Enter valid OTP");
    return;
  }

  const phone = `+91${phoneInput}`;

  setLoading(true);
  setError("");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();
    if (data.success) {
      login(data.token, {
        ...data.user,
        name: data.user?.name || "User"
      });
      navigate("/"); // ✅ SAME AS PASSWORD LOGIN
    } else {
          setError("Invalid OTP");
        }
      } catch {
        setError("timeout or network error");
      }

  setLoading(false);
};

  // GOOGLE LOGIN
  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="mb-login-page">

      {/* LEFT SECTION (STICKY) */}
      <div className="mb-left-login">
        <h2>Things you can do with FortuneFloors</h2>
        <ul>
          <li>✔ Post unlimited properties for <strong>FREE</strong></li>
          <li>✔ Sell, Rent or list PG properties</li>
          <li>✔ Receive direct calls, email & WhatsApp inquiries</li>
          <li>✔ Track reviews & responses in real time</li>
          <li>✔ Manage all leads from one dashboard</li>
          <li>✔ Add full details with multiple property photos</li>
          <li>✔ Higher visibility in location-based searches</li>
          <li>✔ Trusted platform for owners, agents & builders</li>
          <p className="mb-expo-highlight">
           Discover our upcoming <Link to="/property-expo">Property Expo</Link> — 
           meet top builders & agents and explore exclusive property deals under one roof.
        </p>
        </ul>
      </div>

      {/* RIGHT SECTION (SCROLLABLE) */}
      <div className="mb-right-login">
        <div className="mb-login-scroll">

          <div className="mb-login-box">
            <h3>Login</h3>

            {error && <div className="mb-error">{error}</div>}

            {/* MODE SWITCH */}
            <div className="mb-tabs">
              <button
                className={mode === "password" ? "active" : ""}
                onClick={() => setMode("password")}
              >
                Password
              </button>
              {OTP_ENABLED && (
  <button
    className={mode === "otp" ? "active" : ""}
    onClick={() => setMode("otp")}
  >
    OTP
  </button>
)}
            </div>

            {/* PASSWORD LOGIN */}
            {mode === "password" && (
              <form onSubmit={handlePasswordLogin}>
                <input
                  type="text"
                  placeholder="Username / Email / Mobile"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <div className="mb-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <Link to="/ForgotPassword" className="mb-forgot">
                  Forgot Password?
                </Link>

                <button className="mb-next" type="submit">
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}

            {/* OTP LOGIN */}
            {mode === "otp" && (
              <>
                {!otpSent ? (
                  <>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) setPhoneInput(val);
                      }}
                    />
                    <button
                      className="mb-next"
                      onClick={sendOTP}
                      disabled={phoneInput.length !== 10 || loading}
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 6) setOtp(val);
                      }}
                    />
                    <button className="mb-next" onClick={verifyOTP}>
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </>
                )}
              </>
            )}

            <div className="mb-divider">Or login using</div>

            <button className="mb-google" onClick={googleLogin}>
              Continue with Google
            </button>

            <p className="mb-signup">
              New to FortuneFloors? <Link to="/register">Sign Up</Link>
            </p>
          </div>

          

        </div>
      </div>
    </div>
  );
};

export default Login;



