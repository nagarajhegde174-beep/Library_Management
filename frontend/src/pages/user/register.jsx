import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";
import { EyeOff, Eye, Image as ImageIcon } from "lucide-react";

export default function Register() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [fileName, setFileName] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("stream", data.stream);
      formData.append("year", data.year);
      formData.append("role", "user");

      if (data.profilePicture && data.profilePicture[0]) {
        formData.append("profilePicture", data.profilePicture[0]);
      }

      const response = await axios.post(`${Server_URL}users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccessToast("Registration Successful!");
      reset();
      setFileName("");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      showErrorToast("Registration Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        
        {/* ── LEFT PANEL (Form) ── */}
        <div style={styles.leftPanel} className="left-panel-scroll">
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <h1 style={styles.title}>Create Account</h1>
              <p style={styles.subtitle}>Join the Library Management System</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              
              {/* Full Name */}
              <div style={styles.fieldGroup}>
                <input
                  type="text"
                  placeholder="Full Name"
                  style={styles.input}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span style={styles.error}>{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <input
                  type="email"
                  placeholder="Email Address"
                  style={styles.input}
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <span style={styles.error}>{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    style={{...styles.input, paddingRight: "35px"}}
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={styles.eyeBtn}
                  >
                    {showPass ? <Eye size={16} color="var(--text-muted)" /> : <EyeOff size={16} color="var(--text-muted)" />}
                  </button>
                </div>
                {errors.password && <span style={styles.error}>{errors.password.message}</span>}
              </div>

              {/* Stream & Year (Side by Side) */}
              <div style={styles.row}>
                <div style={{...styles.fieldGroup, flex: 1}}>
                  <input
                    type="text"
                    placeholder="Stream (e.g. Science)"
                    style={styles.input}
                    {...register("stream", { required: "Stream is required" })}
                  />
                  {errors.stream && <span style={styles.error}>{errors.stream.message}</span>}
                </div>
                <div style={{...styles.fieldGroup, flex: 1}}>
                  <input
                    type="number"
                    placeholder="Current Year"
                    style={styles.input}
                    {...register("year", { required: "Year is required" })}
                  />
                  {errors.year && <span style={styles.error}>{errors.year.message}</span>}
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div style={styles.uploadBox}>
                <input
                  type="file"
                  style={styles.fileInput}
                  {...register("profilePicture")}
                  onChange={e => setFileName(e.target.files?.[0]?.name || "")}
                />
                <ImageIcon size={24} color="var(--text-muted)" style={{ marginBottom: "8px" }} />
                <p style={styles.uploadText}>
                  {fileName || "Upload Profile Picture (Optional)"}
                </p>
              </div>

              {/* Register Button */}
              <button type="submit" disabled={loading} style={styles.loginBtn}>
                {loading ? <span style={styles.spinner} /> : "Register"}
              </button>
            </form>

            {/* Footer / Login Link */}
            <div style={styles.footerRow}>
              <span style={styles.footerText}>Already have an account?</span>
              <Link to="/login" style={styles.signupBtn}>Log in</Link>
            </div>
            
          </div>
        </div>

        {/* ── RIGHT PANEL (Illustration) ── */}
        <div style={styles.rightPanel}>
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={styles.blob3} />

          <div style={styles.rightContent}>
            <h1 style={styles.rightTitle}>Start your<br/>journey here</h1>
            <p style={styles.rightSubtitle}>Create an account to access the library</p>
            
            <div style={styles.imgWrapper}>
              <img src="/purple-student-illustration.png" alt="Student Illustration" style={styles.illustration} />
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        input::placeholder { color: var(--text-muted); }
        input:focus { border-bottom: 1px solid var(--accent-primary) !important; outline: none; }
        button:hover { opacity: 0.9; }
        
        /* Custom scrollbar for left panel if content overflows */
        .left-panel-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .left-panel-scroll::-webkit-scrollbar-track {
          background: transparent; 
        }
        .left-panel-scroll::-webkit-scrollbar-thumb {
          background: var(--border-medium); 
          border-radius: 10px;
        }
        .left-panel-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--border-strong); 
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "var(--bg-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "1000px",
    height: "650px", // Fixed height to match login
    backgroundColor: "var(--bg-card)",
    borderRadius: "24px",
    display: "flex",
    overflow: "hidden",
    boxShadow: "var(--shadow-lg)",
  },
  
  // Left Panel
  leftPanel: {
    width: "45%",
    backgroundColor: "var(--bg-secondary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    overflowY: "auto",
  },
  formContainer: {
    width: "100%",
    maxWidth: "340px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    margin: "auto 0",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    color: "var(--text-primary)",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "var(--text-muted)",
    fontSize: "13px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "8px 0",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    fontSize: "14px",
    transition: "border-color 0.2s",
  },
  eyeBtn: {
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
  },
  error: {
    color: "var(--status-danger)",
    fontSize: "11px",
    marginTop: "4px",
  },
  uploadBox: {
    border: "1px dashed var(--border-color)",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    backgroundColor: "var(--bg-input)",
    position: "relative",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "4px",
  },
  fileInput: {
    opacity: 0,
    position: "absolute",
    inset: 0,
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  uploadText: {
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: "500",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "var(--accent-primary)",
    color: "var(--text-on-accent)",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "8px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid transparent",
    borderTop: "2px solid var(--text-on-accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  footerRow: {
    marginTop: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
  },
  footerText: {
    color: "var(--text-muted)",
    fontSize: "12px",
  },
  signupBtn: {
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    transition: "background 0.2s",
  },

  // Right Panel
  rightPanel: {
    width: "55%",
    backgroundColor: "var(--accent-primary)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    overflow: "hidden",
  },
  rightContent: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  rightTitle: {
    color: "var(--text-on-accent)",
    fontSize: "44px",
    fontWeight: "700",
    lineHeight: "1.1",
    marginBottom: "12px",
    letterSpacing: "-1px",
    marginTop: "40px",
  },
  rightSubtitle: {
    color: "var(--text-on-accent)",
    fontSize: "14px",
    marginBottom: "auto",
    opacity: 0.8,
  },
  imgWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: "40px",
  },
  illustration: {
    width: "90%",
    height: "auto",
    objectFit: "contain",
  },

  // Blobs for background
  blob1: {
    position: "absolute",
    top: "-10%",
    left: "10%",
    width: "300px",
    height: "300px",
    backgroundColor: "var(--accent-primary-hover)",
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
    filter: "blur(40px)",
    opacity: 0.6,
  },
  blob2: {
    position: "absolute",
    bottom: "20%",
    right: "-10%",
    width: "400px",
    height: "400px",
    backgroundColor: "var(--accent-primary-light)",
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
    filter: "blur(50px)",
    opacity: 0.5,
  },
  blob3: {
    position: "absolute",
    bottom: "0",
    left: "20%",
    width: "250px",
    height: "250px",
    backgroundColor: "var(--accent-primary-hover)",
    borderRadius: "50%",
    filter: "blur(60px)",
    opacity: 0.7,
  }
};