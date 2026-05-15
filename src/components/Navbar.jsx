import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>ZRP</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/customer-dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/listings" style={styles.link}>Listings</Link>
        <Link to="/agents" style={styles.link}>Agents</Link>
        <Link to="/login" style={styles.link}>Login</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#0F172A",
    color: "white",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { fontSize: "24px", fontWeight: "bold" },
  links: { display: "flex", gap: "20px" },
  link: { color: "white", textDecoration: "none", fontWeight: "500" },
};

export default Navbar;
