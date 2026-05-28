import { useState } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../context/RoleContext";

const navLinks = {
  customer: [
    { label: "Home", to: "/" },
    { label: "Listings", to: "/listings" },
    { label: "Agents", to: "/agents" },
    { label: "Dashboard", to: "/customer-dashboard" },
    { label: "Login", to: "/login" },
  ],
  agent: [
    { label: "Home", to: "/" },
    { label: "Listings", to: "/listings" },
    { label: "My Dashboard", to: "/agent-dashboard" },
    { label: "Add Listing", to: "/add-listing" },
    { label: "Login", to: "/login" },
  ],
  admin: [
    { label: "Home", to: "/" },
    { label: "Admin Dashboard", to: "/admin-dashboard" },
    { label: "Verification", to: "/verification-review" },
    { label: "Reports", to: "/reports" },
    { label: "Login", to: "/login" },
  ],
};

const roleLabels = {
  customer: "Customer",
  agent: "Agent",
  admin: "Admin",
};

function Navbar() {
  const { role, setRole } = useRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const links = navLinks[role];

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        ZRP
      </Link>

      {/* Nav links */}
      <div style={styles.links}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} style={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Role switcher */}
      <div style={styles.roleWrapper}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          style={styles.roleButton}
        >
          <span
            style={{
              ...styles.roleIndicator,
              backgroundColor:
                role === "customer"
                  ? "#C29A4B"
                  : role === "agent"
                    ? "#22C55E"
                    : "#EF4444",
            }}
          />
          {roleLabels[role]}
          <span style={styles.caret}>▾</span>
        </button>

        {dropdownOpen && (
          <div style={styles.dropdown}>
            <p style={styles.dropdownLabel}>Viewing as</p>
            {Object.entries(roleLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setRole(key);
                  setDropdownOpen(false);
                }}
                style={{
                  ...styles.dropdownItem,
                  backgroundColor: role === key ? "#F1F5F9" : "transparent",
                  fontWeight: role === key ? "700" : "500",
                }}
              >
                <span
                  style={{
                    ...styles.dot,
                    backgroundColor:
                      key === "customer"
                        ? "#C29A4B"
                        : key === "agent"
                          ? "#22C55E"
                          : "#EF4444",
                  }}
                />
                {label}
                {role === key && <span style={styles.activeCheck}>✓</span>}
              </button>
            ))}
            <p style={styles.dropdownNote}>
              Role switcher is for demo purposes. Auth coming in Phase 2.
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#0F172A",
    padding: "0 32px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#FFFFFF",
    textDecoration: "none",
    letterSpacing: "-0.5px",
    flexShrink: 0,
  },
  links: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  link: {
    color: "#CBD5E1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.15s ease",
  },
  roleWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  roleButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    padding: "7px 14px",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  roleIndicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
  },
  caret: {
    fontSize: "11px",
    opacity: 0.7,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    minWidth: "200px",
    padding: "8px",
    zIndex: 200,
  },
  dropdownLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    padding: "6px 10px 4px",
    margin: 0,
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "10px 12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#0F172A",
    cursor: "pointer",
    textAlign: "left",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  activeCheck: {
    marginLeft: "auto",
    color: "#0F172A",
    fontSize: "13px",
  },
  dropdownNote: {
    fontSize: "11px",
    color: "#94A3B8",
    padding: "8px 10px 4px",
    margin: 0,
    borderTop: "1px solid #F1F5F9",
    marginTop: "4px",
  },
};

export default Navbar;
