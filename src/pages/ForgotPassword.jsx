import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/forgot-password", { email });

    console.log("Backend RESPONSE:", res.data);

    if (res.data.message === "OTP sent to email") {
      alert("OTP sent to your email!");
      setStep(2);  // ✅ Move to OTP page
    } else {
      alert(res.data.error || "Something went wrong");
    }

  } catch (err) {
    alert(err.response?.data?.error || "Server error");
  }
};


  const resetPassword = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/reset-password", {
      email,
      otp,
      newPassword,
    });

    if (res.data.message === "Password updated successfully") {
      alert("Password updated!");
      setStep(1);  // Back to email login step
    } else {
      alert(res.data.error);
    }

  } catch (err) {
    alert(err.response?.data?.error || "Server error");
  }
};


  return (
    <div style={{ padding: "40px" }}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
