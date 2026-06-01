import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../../utils/config";
import { useNavigate, useLocation } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../../utils/toasthelper";
import { EyeOff, Eye } from "lucide-react";
import "./UpdatePassword.css";

export default function ResetPassword() {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${Server_URL}users/reset-password`, data);
      showSuccessToast(res.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        {/* ── LEFT PANEL (Form) ── */}
        <div className="auth-left-panel">
          <div className="auth-form-container">
            <div className="auth-header">
              <h1 className="auth-title">New Password</h1>
              <p className="auth-subtitle">Create a new strong password for your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              
              {/* Email */}
              <div className="auth-field-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="auth-input"
                  defaultValue={email}
                  readOnly={!!email}
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

              {/* New Password */}
              <div className="auth-field-group">
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="New Password"
                    className="auth-input"
                    style={{ paddingRight: "35px" }}
                    {...register("newPassword", {
                      required: "Password is required",
                      minLength: { 
                        value: 6, 
                        message: "Password must be at least 6 characters" 
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="auth-eye-btn"
                  >
                    {showPass ? <Eye size={16} color="var(--text-muted)" /> : <EyeOff size={16} color="var(--text-muted)" />}
                  </button>
                </div>
                {errors.newPassword && <span className="auth-error">{errors.newPassword.message}</span>}
              </div>

              {/* Confirm Password */}
              <div className="auth-field-group">
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="auth-input"
                    style={{ paddingRight: "35px" }}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => 
                        value === watch("newPassword") || "Passwords do not match"
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="auth-eye-btn"
                  >
                    {showConfirm ? <Eye size={16} color="var(--text-muted)" /> : <EyeOff size={16} color="var(--text-muted)" />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword.message}</span>}
              </div>

              {/* Reset Password Button */}
              <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                {isSubmitting ? <span className="auth-spinner" /> : "Reset Password"}
              </button>
            </form>
          </div>
        </div>

        {/* ── RIGHT PANEL (Illustration) ── */}
        <div className="auth-right-panel">
          <div className="auth-blob-1" />
          <div className="auth-blob-2" />
          <div className="auth-blob-3" />

          <div className="auth-right-content">
            <h1 className="auth-right-title">Almost<br/>Done</h1>
            <p className="auth-right-subtitle">Set your new password to regain access</p>
            
            <div className="auth-img-wrapper">
              <img src="/purple-student-illustration.png" alt="Reset Password Illustration" className="auth-illustration" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}