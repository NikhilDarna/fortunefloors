import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.body.classList.add("page-register");
    return () => document.body.classList.remove("page-register");
  }, []);
const OTP_ENABLED = import.meta.env.VITE_OTP_ENABLED === "true";
useEffect(() => {
  if (!OTP_ENABLED) {
    setPhoneVerified(true);
  }
}, []);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "normal",
    fullName: "",
    phone: "",
    agentLocation: "",
    agentArea: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneExists, setPhoneExists] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [phoneVerified, setPhoneVerified] = useState(false);
const [otpLoading, setOtpLoading] = useState(false);


  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  const handleChange = async (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  if (name === "password" && !strongPassword.test(value)) {
    setPasswordError(
      "Password must contain uppercase, lowercase, number & min 6 chars"
    );
  } else if (name === "password") {
    setPasswordError("");
  }

  // 📱 CHECK PHONE EXISTS
  if (name === "phone" && value.length >= 10) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/check-phone`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: value }),
        }
      );

      const data = await res.json();
      setPhoneExists(data.exists);
    } catch {
      setPhoneExists(false);
    }
  }
};
const sendOTP = async () => {
  if (formData.phone.length !== 10) {
    setError("Enter valid 10-digit phone number");
    return;
  }

  setOtpLoading(true);
  setError("");

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/register/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${formData.phone}` }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setOtpSent(true);
    } else {
      setError("Failed to send OTP");
    }
  } catch {
    setError("OTP network error");
  }

  setOtpLoading(false);
};


const verifyOTP = async () => {
  if (otp.length !== 6) {
    setError("Enter valid 6-digit OTP");
    return;
  }

  setOtpLoading(true);
  setError("");

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/register/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+91${formData.phone}`,
          otp,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setPhoneVerified(true); // ✅ GREEN TICK
    } else {
      setError("Invalid OTP");
    }
  } catch {
    setError("OTP verification failed");
  }

  setOtpLoading(false);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!strongPassword.test(formData.password)) {
      setPasswordError("Weak password");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
   if (!phoneVerified) {
setError("Please verify your phone number");
setLoading(false);
return;
}


if (phoneExists) {
setError("Account already exists. Please login.");
setLoading(false);
return;
}
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {

  // ✅ TEMP: store agent info for Agents pages (frontend only)
  if (formData.role === "agent") {
    const existingAgents = JSON.parse(localStorage.getItem("agents")) || [];

    existingAgents.push({
      id: Date.now(),
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.agentLocation,
      operatingArea: formData.agentArea,
      rating: 0,
      reviews:[],         // default rating
      isVerified: false,    // admin will verify later
      role: "agent"
    });

    localStorage.setItem("agents", JSON.stringify(existingAgents));
  }

  login(data.token, data.user);
  navigate('/dashboard');
}

       else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-login-page">

      {/* LEFT SECTION */}
      <div className="mb-left-login">
        <h2>Join FortuneFloors</h2>
        <ul>
          <li>✔ Post properties for FREE</li>
          <li>✔ Get verified buyer & tenant leads</li>
          <li>✔ Sell, Rent, PG & Commercial</li>
          <li>✔ Manage listings from one dashboard</li>
          <li>✔ Trusted by owners, agents & builders</li>
        </ul>
      </div>

      {/* RIGHT SECTION */}
      <div className="mb-right-login">
        <div className="mb-login-scroll">

          <div className="mb-login-box">
            <h3>Create Account</h3>

            {error && <div className="mb-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />

              <input
  name="phone"
  placeholder="Phone"
  value={formData.phone}
  onChange={handleChange}
  required
/>

{OTP_ENABLED && !phoneVerified && !otpSent && (
  <button type="button" onClick={sendOTP}>Send OTP</button>
)}

{otpSent && !phoneVerified && (
  <>
    <input
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
    />
    <button type="button" onClick={verifyOTP}>
      {otpLoading ? "Verifying..." : "Verify OTP"}
    </button>
  </>
)}

{phoneVerified && (
  <div style={{ color: "green", fontWeight: "bold" }}>
    ✔ Phone number verified
  </div>
)}

              {phoneExists && (
                <small style={{ color: "red" }}>
                  Account already exists with this number.
                  <Link to="/login"> Please login</Link>
                </small>
              )}

              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="normal">General User</option>
                <option value="agent">Real Estate Agent</option>
                <option value="agency">Real Estate Agency</option>
                <option value="builder">Builder</option>
                <option value="furnisher">Furnisher</option>
                <option value="pghostel">Pg/Hostel</option>
                <option value="bankingloans">Banking Loans</option>
                <option value="interiors">Interior Designer</option>
              </select>
             

              {formData.role === "agent" && (
                <>
                  <input
                    name="agentLocation"
                    placeholder="Agent Location"
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="agentArea"
                    placeholder="Operating Area"
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              {formData.role === "interiors" && (
                <>
                  <input
                    name="interiorsLocation"
                    placeholder="Agent Location"
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="interiorsArea"
                    placeholder="Operating Area"
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <div className="mb-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>


              {passwordError && (
                <small style={{ color: "red" }}>{passwordError}</small>
              )}

              <div className="mb-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>


              <button
                className="mb-next"
                type="submit"
                disabled={!phoneVerified || loading}
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="mb-signup">
              Already have an account? <Link to="/login">Login</Link>
            </p>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;