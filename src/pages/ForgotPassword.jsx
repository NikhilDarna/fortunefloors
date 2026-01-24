import { useState } from "react";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import './Login.css';

const ForgotPassword = () => {
  // Add a body class while on the forgot-password page so we can hide site chrome
  useEffect(() => {
    document.body.classList.add('page-forgot-password');
    return () => document.body.classList.remove('page-forgot-password');
  }, []);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Validation / UI states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);

  const validateEmail = (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const sendOtp = async () => {
    setEmailError("");
    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/forgot-password`, { email });

      console.log("Backend RESPONSE:", res.data);

      if (res.data.message === "OTP sent to email") {
        setStep(2);
      } else {
        setEmailError(res.data.error || "Something went wrong");
      }

    } catch (err) {
      setEmailError(err.response?.data?.error || "Server error");
    } finally {
      setSendingOtp(false);
    }
  };


  const resetPassword = async () => {
    setPasswordError('');
    setConfirmError('');

    if (!newPassword || newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      return;
    }

    setResetting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (res.data.message === "Password updated successfully") {
        alert("Password updated!");
        setStep(1);  // Back to email login step
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.data.error || 'Failed to reset password');
      }

    } catch (err) {
      setPasswordError(err.response?.data?.error || "Server error");
    } finally {
      setResetting(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <h2>Forgot Password</h2>

          {/** inline general error */}
          {emailError && <p className="error-message">{emailError}</p>}
          {passwordError && <p className="error-message">{passwordError}</p>}
          {confirmError && <p className="error-message">{confirmError}</p>}

          {step === 1 && (
            <div className="tab-content">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                aria-invalid={emailError ? 'true' : 'false'}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                required
              />

              <button type="button" onClick={sendOtp}>{sendingOtp ? 'Sending...' : 'Send OTP'}</button>

              <p className="auth-link">Remembered? <Link to="/login">Login</Link></p>
            </div>
          )}

          {step === 2 && (
            <div className="tab-content">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <div className="password-wrapper">
                <input
                  id="new-password"
                  className={`password-input ${passwordError ? 'input-error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  aria-invalid={passwordError ? 'true' : 'false'}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                />
                <div
                  className="password-toggle"
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowPassword((s) => !s)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPassword((s) => !s); }}
                  aria-label={showPassword ? 'Hide new password' : 'Show new password'}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>

              <div className="password-wrapper">
                <input
                  id="confirm-password"
                  className={`password-input ${confirmError ? 'input-error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  aria-invalid={confirmError ? 'true' : 'false'}
                  onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(''); }}
                />
                <div
                  className="password-toggle"
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowPassword((s) => !s)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPassword((s) => !s); }}
                  aria-label={showPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>

              <button type="button" onClick={resetPassword}>{resetting ? 'Resetting...' : 'Reset Password'}</button>

              <p className="auth-link">Back to <Link to="/login">Login</Link></p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;