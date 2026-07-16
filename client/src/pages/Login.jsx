import { useState } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useRole();
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      const res = await loginUser({ email, password });
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === "agent") navigate("/agent-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
      else navigate("/customer-dashboard");
    } catch (err) {
      setErrors({ general: err.response?.data?.error || "Login failed" });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brand}>
          <span style={styles.brandText}>ZRP</span>
          <p style={styles.brandSub}>Zambia Real Estate Platform</p>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtext}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.fieldGroup}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                ...styles.input,
                border: errors.email
                  ? "1px solid #EF4444"
                  : "1px solid #CBD5E1",
              }}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <span style={styles.forgotLink}>Forgot password?</span>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                ...styles.input,
                border: errors.password
                  ? "1px solid #EF4444"
                  : "1px solid #CBD5E1",
              }}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          {errors.general && <p style={styles.error}>{errors.general}</p>}

          {/* Submit */}
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>Don't have an account?</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Register link */}
        <Link to="/register" style={styles.registerLink}>
          Create an account
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.08)",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "440px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  brandText: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: "-0.5px",
  },
  brandSub: {
    fontSize: "13px",
    color: "#64748B",
    margin: 0,
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 8px 0",
  },
  subtext: {
    fontSize: "15px",
    color: "#64748B",
    margin: "0 0 32px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0F172A",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#C29A4B",
    cursor: "pointer",
    fontWeight: "500",
  },
  input: {
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    outline: "none",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    width: "100%",
    boxSizing: "border-box",
  },
  error: {
    fontSize: "13px",
    color: "#EF4444",
    margin: "2px 0 0 0",
  },
  button: {
    marginTop: "8px",
    padding: "14px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: "700",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "28px 0 20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: "13px",
    color: "#64748B",
    whiteSpace: "nowrap",
  },
  registerLink: {
    display: "block",
    textAlign: "center",
    padding: "13px",
    border: "1px solid #0F172A",
    borderRadius: "10px",
    color: "#0F172A",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Login;
