import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../../utils/config";
import { useNavigate, Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../../utils/toasthelper";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${Server_URL}users/forgot-password`, data);
      showSuccessToast(res.data.message || "OTP Sent Successfully!");
      navigate("/verifyotp", { state: { email: data.email } });
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        {/* ── LEFT PANEL (Form) ── */}
        <div className="auth-left-panel">
          <div className="auth-form-container">
            <div className="auth-header">
              <h1 className="auth-title">Forgot Password</h1>
              <p className="auth-subtitle">Enter your email to receive a password reset OTP</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              
              {/* Email */}
              <div className="auth-field-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="auth-input"
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

              {/* Send OTP Button */}
              <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                {isSubmitting ? <span className="auth-spinner" /> : "Send OTP"}
              </button>
            </form>

            {/* Footer / Login Link */}
            <div className="auth-footer-row">
              <span className="auth-footer-text">Remember your password?</span>
              <Link to="/login" className="auth-signup-btn">Log in</Link>
            </div>
            
          </div>
        </div>

        {/* ── RIGHT PANEL (Illustration) ── */}
        <div className="auth-right-panel">
          <div className="auth-blob-1" />
          <div className="auth-blob-2" />
          <div className="auth-blob-3" />

          <div className="auth-right-content">
            <h1 className="auth-right-title">Reset your<br/>password</h1>
            <p className="auth-right-subtitle">We'll help you get back to your account securely</p>
            
            <div className="auth-img-wrapper">
              <img src="/purple-student-illustration.png" alt="Reset Password Illustration" className="auth-illustration" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}