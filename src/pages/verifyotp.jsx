import React, { useState } from "react";
import axios from "axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/verify-otp", {
        email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
        phone: emailOrPhone.includes("@") ? undefined : emailOrPhone,
        otp,
      });
      alert(res.data.message);
      window.location.href = "/login";
    } catch {
      alert("Invalid OTP!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email or Phone"
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
      />
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default VerifyOtp;
