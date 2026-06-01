import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../../utils/config";
import { useNavigate, useLocation } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../../utils/toasthelper";
import "./VerifyOtp.css";

export default function VerifyOTP() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${Server_URL}users/verify-otp`, data);
      showSuccessToast(res.data.message || "OTP Verified Successfully!");
      navigate("/resetpass", { state: { email: data.email } });
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResend = () => {
    showSuccessToast("OTP resent!");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        {/* ── LEFT PANEL (Form) ── */}
        <div className="auth-left-panel">
          <div className="auth-form-container">
            <div className="auth-header">
              <h1 className="auth-title">Verify OTP</h1>
              <p className="auth-subtitle">
                We've sent a 6-digit code to <br />
                <span className="auth-email-highlight">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              
              {/* Email (Hidden or Read-only) */}
              <div className="auth-field-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="auth-input"
                  defaultValue={email}
                  readOnly
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <span className="auth-error">{errors.email.message}</span>}
              </div>

              {/* OTP */}
              <div className="auth-field-group">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  className="auth-input"
                  {...register("otp", { 
                    required: "OTP is required",
                    minLength: { value: 6, message: "OTP must be 6 digits" },
                    maxLength: { value: 6, message: "OTP must be 6 digits" },
                    pattern: { value: /^[0-9]{6}$/, message: "OTP must be numeric" }
                  })}
                />
                {errors.otp && <span className="auth-error">{errors.otp.message}</span>}
              </div>

              {/* Verify OTP Button */}
              <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                {isSubmitting ? <span className="auth-spinner" /> : "Verify OTP"}
              </button>
            </form>

            {/* Footer / Resend OTP */}
            <div className="auth-footer-row">
              <span className="auth-footer-text">Didn't receive the code?</span>
              <button onClick={handleResend} className="resend-otp-btn">Resend OTP</button>
            </div>
            
          </div>
        </div>

        {/* ── RIGHT PANEL (Illustration) ── */}
        <div className="auth-right-panel">
          <div className="auth-blob-1" />
          <div className="auth-blob-2" />
          <div className="auth-blob-3" />

          <div className="auth-right-content">
            <h1 className="auth-right-title">Security<br/>Check</h1>
            <p className="auth-right-subtitle">Please verify your identity to continue</p>
            
            <div className="auth-img-wrapper">
              <img src="/purple-student-illustration.png" alt="Verify OTP Illustration" className="auth-illustration" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}