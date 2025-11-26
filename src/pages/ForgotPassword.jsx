import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    const res = await axios.post("http://localhost:5000/forgot-password", { email });
    if (res.data.status === "success") {
      alert("OTP sent to email");
      setStep(2);
    } else {
      alert(res.data.message);
    }
  };

  const resetPassword = async () => {
    const res = await axios.post("http://localhost:5000/reset-password", {
      email,
      otp,
      newPassword,
    });

    if (res.data.status === "success") {
      alert("Password reset successful");
      setStep(1);
    } else {
      alert(res.data.message);
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
