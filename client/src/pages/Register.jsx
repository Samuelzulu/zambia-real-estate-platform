import { useState } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { login } = useRole();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (!form.confirmPassword)
      next.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match";
    if (role === "agent" && !form.zieaId?.trim())
      next.zieaId = "ZIEA registration number is required";
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
      await registerUser({
        full_name: form.fullName,
        email: form.email,
        password: form.password,
        role,
        ziea_number: form.zieaId || null,
      });
      // Auto login after registration
      const { loginUser } = await import("../services/api");
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate("/customer-dashboard");
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || "Registration failed",
      });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandText}>ZRP</span>
          <p style={styles.brandSub}>Zambia Real Estate Platform</p>
        </div>

        <h1 style={styles.heading}>Create an account</h1>
        <p style={styles.subtext}>Join ZRP to browse or list properties</p>

        {/* Role Selection */}
        <div style={styles.roleRow}>
          <button
            type="button"
            onClick={() => setRole("customer")}
            style={
              role === "customer" ? styles.roleActive : styles.roleInactive
            }
          >
            I'm a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("agent")}
            style={role === "agent" ? styles.roleActive : styles.roleInactive}
          >
            I'm an Agent
          </button>
        </div>

        {role === "agent" && (
          <>
            <p style={styles.agentNote}>
              Agent accounts are subject to verification before listings go
              live.
            </p>
            <div style={styles.fieldGroup}>
              <label htmlFor="zieaId" style={styles.label}>
                ZIEA Registration Number
              </label>
              <input
                id="zieaId"
                name="zieaId"
                type="text"
                value={form.zieaId || ""}
                onChange={handleChange}
                placeholder="e.g. ZIEA-2024-00123"
                style={{
                  ...styles.input,
                  border: errors.zieaId
                    ? "1px solid #EF4444"
                    : "1px solid #CBD5E1",
                }}
              />
              {errors.zieaId && <p style={styles.error}>{errors.zieaId}</p>}
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Full Name */}
          <div style={styles.fieldGroup}>
            <label htmlFor="fullName" style={styles.label}>
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Banda"
              style={{
                ...styles.input,
                border: errors.fullName
                  ? "1px solid #EF4444"
                  : "1px solid #CBD5E1",
              }}
            />
            {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
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
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              style={{
                ...styles.input,
                border: errors.password
                  ? "1px solid #EF4444"
                  : "1px solid #CBD5E1",
              }}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div style={styles.fieldGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                ...styles.input,
                border: errors.confirmPassword
                  ? "1px solid #EF4444"
                  : "1px solid #CBD5E1",
              }}
            />
            {errors.confirmPassword && (
              <p style={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>

          {errors.general && <p style={styles.error}>{errors.general}</p>}

          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>Already have an account?</span>
          <div style={styles.dividerLine} />
        </div>

        <Link to="/login" style={styles.loginLink}>
          Sign in
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
    margin: "0 0 24px 0",
  },
  roleRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
  },
  roleActive: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    border: "1px solid #0F172A",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  roleInactive: {
    flex: 1,
    padding: "10px",
    backgroundColor: "transparent",
    color: "#64748B",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  agentNote: {
    fontSize: "13px",
    color: "#C29A4B",
    backgroundColor: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: "8px",
    padding: "10px 14px",
    margin: "0 0 16px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginTop: "8px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0F172A",
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
  loginLink: {
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

export default Register;
