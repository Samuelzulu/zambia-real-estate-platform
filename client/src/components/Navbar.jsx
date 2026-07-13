import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

function Navbar() {
  const { user, logout } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        ZRP
      </Link>

      {/* Nav links */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/listings" style={styles.link}>
          Listings
        </Link>
        <Link to="/agents" style={styles.link}>
          Agents
        </Link>

        {/* Show dashboard link based on role when logged in */}
        {user && user.role === "customer" && (
          <Link to="/customer-dashboard" style={styles.link}>
            Dashboard
          </Link>
        )}
        {user && user.role === "agent" && (
          <Link to="/agent-dashboard" style={styles.link}>
            Dashboard
          </Link>
        )}
        {user && user.role === "admin" && (
          <Link to="/admin-dashboard" style={styles.link}>
            Dashboard
          </Link>
        )}
      </div>

      {/* Auth buttons */}
      <div style={styles.authSection}>
        {!user ? (
          <>
            <Link to="/login" style={styles.loginLink}>
              Sign In
            </Link>
            <Link to="/register" style={styles.registerLink}>
              Get Started
            </Link>
          </>
        ) : (
          <div style={styles.userSection}>
            <span style={styles.userName}>
              Hi, {user.full_name.split(" ")[0]}
            </span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#0F172A",
    padding: "0 40px",
    height: "68px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#FFFFFF",
    textDecoration: "none",
    letterSpacing: "-0.5px",
    fontFamily: "Poppins, sans-serif",
    flexShrink: 0,
  },
  links: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  link: {
    color: "#94A3B8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.15s ease",
    fontFamily: "Inter, sans-serif",
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  loginLink: {
    color: "#94A3B8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  registerLink: {
    backgroundColor: "#C29A4B",
    color: "#FFFFFF",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 18px",
    borderRadius: "8px",
    fontFamily: "Inter, sans-serif",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userName: {
    color: "#CBD5E1",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  logoutButton: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#94A3B8",
    fontSize: "13px",
    fontWeight: "500",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
};

export default Navbar;