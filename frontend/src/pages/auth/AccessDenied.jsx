import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, LogOut } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login-portal");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <ShieldAlert size={64} color="var(--status-danger, #EF4444)" />
        </div>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.subtitle}>
          You do not have permissions to view this resource.
        </p>
        <p style={styles.desc}>
          This area is restricted. Please make sure you are logged in with the correct role.
        </p>

        <div style={styles.buttonGroup}>
          <button onClick={() => navigate("/")} style={styles.primaryBtn}>
            <Home size={16} /> Go to Home
          </button>
          <button onClick={handleLogout} style={styles.secondaryBtn}>
            <LogOut size={16} /> Log Out / Switch Portal
          </button>
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "var(--bg-primary, #090914)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "var(--bg-card, #0f172a)",
    borderRadius: "24px",
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px var(--border-color, rgba(255,255,255,0.05))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconWrapper: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "rgba(239, 68, 68, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    boxShadow: "0 0 20px rgba(239, 68, 68, 0.15)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--text-primary, #F8FAFC)",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--status-danger, #EF4444)",
    marginBottom: "8px",
    lineHeight: "1.4",
  },
  desc: {
    fontSize: "14px",
    color: "var(--text-muted, #94A3B8)",
    marginBottom: "32px",
    lineHeight: "1.6",
    maxWidth: "380px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    flexDirection: "column",
    width: "100%",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "var(--accent-primary, #6366F1)",
    color: "var(--text-on-accent, #FFFFFF)",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  secondaryBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "transparent",
    color: "var(--text-primary, #F8FAFC)",
    border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
};
