import { Link } from "react-router-dom";
import { listings } from "../data/mockListings";
import ListingCard from "../components/ListingCard";

function Home() {
  const featuredListings = listings.slice(0, 3);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <p style={styles.eyebrow}>Zambia Real Estate Platform</p>

          <h1 style={styles.heroTitle}>Find Trusted Real Estate in Zambia</h1>

          <p style={styles.heroText}>
            Browse verified property listings and connect with trustedreal
            estate agents across Zambia.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/listings" style={styles.primaryButton}>
              Browse Listings
            </Link>

            <Link to="/agents" style={styles.secondaryButton}>
              Find Agents
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>Featured Properties</p>
              <h2 style={styles.sectionTitle}>Featured Listings</h2>
            </div>

            <Link to="/listings" style={styles.viewAllLink}>
              View All
            </Link>
          </div>

          <div style={styles.grid}>
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
  },
  hero: {
    background: "linear-gradient(135deg, #020617 0%, #0F172A 100%)",
    color: "white",
    padding: "100px 20px 110px",
  },
  heroContainer: {
    maxwidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },
  eyebrow: {
    fontSize: "14px",
    letterSpacing: "1.5px",
    textTransformation: "uppercase",
    color: "#C29A4B",
    marginBottom: "18px",
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: "64px",
    lineHeight: "1.7",
    fontWeight: "800",
    maxWidth: "950px",
    margin: "0 auto 24px"
  },
  heroText: {
    fontSize: "22px",
    lineHeight: "1.7",
    maxwidth: "760px",
    margin: "0 auto 36px",
    color: "#E2E8F0",
  },
  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "inline-block",
    backgroundColor: "#C29A4B",
    color: "white",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
  },
  secondaryButton: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: "white",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
  },
  section: {
    padding: "70px 20px 90px",
  },
  sectionContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  sectionEyebrow: {
    fontSize: "14px",
    textTransformation: "uppercase",
    letterSpacing: "1.5px",
    color: "#C29A4B",
    fontWeight: "700",
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "38px",
    color: "#0F172A",
    margin: 0,
  },
  viewAllLink: {
    textDecoration: "none",
    color: "#0F172A",
    fontWeight: "700",
    fontSize: "16px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
};

export default Home;
