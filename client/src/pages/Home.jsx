import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getListings } from "../services/api";
import ListingCard from "../components/ListingCard";

function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await getListings();
        const approved = res.data.filter((l) => l.status === "approved");
        setFeaturedListings(approved.slice(0, 3));
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <p style={styles.eyebrow}>Zambia Real Estate Platform</p>
          <h1 style={styles.heroTitle}>Find Trusted Real Estate in Zambia</h1>
          <p style={styles.heroText}>
            Browse verified property listings and connect with trusted real
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

      {/* Trust bar */}
      <div style={styles.trustBar}>
        <div style={styles.trustItem}>
          <span style={styles.trustNumber}>500+</span>
          <span style={styles.trustLabel}>Properties Listed</span>
        </div>
        <div style={styles.trustDivider} />
        <div style={styles.trustItem}>
          <span style={styles.trustNumber}>120+</span>
          <span style={styles.trustLabel}>Verified Agents</span>
        </div>
        <div style={styles.trustDivider} />
        <div style={styles.trustItem}>
          <span style={styles.trustNumber}>10+</span>
          <span style={styles.trustLabel}>Cities Covered</span>
        </div>
        <div style={styles.trustDivider} />
        <div style={styles.trustItem}>
          <span style={styles.trustNumber}>ZIEA</span>
          <span style={styles.trustLabel}>Verified Agents Only</span>
        </div>
      </div>

      {/* Featured listings */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>Featured Properties</p>
              <h2 style={styles.sectionTitle}>Latest Listings</h2>
            </div>
            <Link to="/listings" style={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {loading && (
            <p style={{ color: "#64748B", fontSize: "15px" }}>
              Loading listings...
            </p>
          )}

          {!loading && featuredListings.length === 0 && (
            <p style={{ color: "#64748B", fontSize: "15px" }}>
              No listings available yet.
            </p>
          )}

          <div style={styles.grid}>
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Why ZRP */}
      <section style={styles.whySection}>
        <div style={styles.sectionContainer}>
          <p style={styles.sectionEyebrow}>Why ZRP</p>
          <h2 style={styles.sectionTitle}>The Smarter Way to Find Property</h2>
          <div style={styles.whyGrid}>
            <div style={styles.whyCard}>
              <span style={styles.whyIcon}>✓</span>
              <h3 style={styles.whyTitle}>ZIEA Verified Agents</h3>
              <p style={styles.whyText}>
                Every agent on ZRP is verified against the ZIEA registry. You
                only deal with licensed professionals.
              </p>
            </div>
            <div style={styles.whyCard}>
              <span style={styles.whyIcon}>⚡</span>
              <h3 style={styles.whyTitle}>Fast Connections</h3>
              <p style={styles.whyText}>
                Send inquiries directly to agents and get responses quickly. No
                middlemen, no delays.
              </p>
            </div>
            <div style={styles.whyCard}>
              <span style={styles.whyIcon}>🏠</span>
              <h3 style={styles.whyTitle}>Wide Selection</h3>
              <p style={styles.whyText}>
                From Lusaka to Livingstone, browse properties across all major
                cities in Zambia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Find Your Property?</h2>
          <p style={styles.ctaText}>
            Join thousands of Zambians using ZRP to buy, rent, and sell
            property.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/register" style={styles.primaryButton}>
              Create an Account
            </Link>
            <Link to="/listings" style={styles.ctaSecondaryButton}>
              Browse Listings
            </Link>
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
    background:
      "linear-gradient(160deg, #020617 0%, #0F172A 60%, #1E293B 100%)",
    color: "white",
    padding: "110px 20px 120px",
  },
  heroContainer: {
    maxWidth: "860px",
    margin: "0 auto",
    textAlign: "center",
  },
  eyebrow: {
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#C29A4B",
    marginBottom: "20px",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
  heroTitle: {
    fontSize: "56px",
    lineHeight: "1.15",
    fontWeight: "800",
    margin: "0 auto 24px",
    fontFamily: "Poppins, sans-serif",
    letterSpacing: "-1px",
  },
  heroText: {
    fontSize: "18px",
    lineHeight: "1.8",
    maxWidth: "580px",
    margin: "0 auto 40px",
    color: "#94A3B8",
    fontFamily: "Inter, sans-serif",
  },
  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "inline-block",
    backgroundColor: "#C29A4B",
    color: "white",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    fontFamily: "Inter, sans-serif",
  },
  secondaryButton: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: "white",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "15px",
    border: "1px solid rgba(255,255,255,0.15)",
    fontFamily: "Inter, sans-serif",
  },
  trustBar: {
    backgroundColor: "#FFFFFF",
    padding: "28px 40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap",
    boxShadow: "0 1px 0 #E2E8F0",
  },
  trustItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  trustNumber: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0F172A",
    fontFamily: "Poppins, sans-serif",
  },
  trustLabel: {
    fontSize: "12px",
    color: "#64748B",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  },
  trustDivider: {
    width: "1px",
    height: "36px",
    backgroundColor: "#E2E8F0",
  },
  section: {
    padding: "80px 20px 90px",
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
    marginBottom: "36px",
    flexWrap: "wrap",
  },
  sectionEyebrow: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#C29A4B",
    fontWeight: "700",
    marginBottom: "8px",
    fontFamily: "Inter, sans-serif",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
    fontFamily: "Poppins, sans-serif",
  },
  viewAllLink: {
    textDecoration: "none",
    color: "#0F172A",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    alignItems: "stretch",
  },
  whySection: {
    backgroundColor: "#0F172A",
    padding: "80px 20px 90px",
  },
  whyGrid: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    marginTop: "40px",
  },
  whyCard: {
    flex: 1,
    minWidth: "240px",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "32px",
  },
  whyIcon: {
    fontSize: "24px",
    display: "block",
    marginBottom: "16px",
  },
  whyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: "12px",
    fontFamily: "Poppins, sans-serif",
  },
  whyText: {
    fontSize: "14px",
    color: "#94A3B8",
    lineHeight: "1.7",
    fontFamily: "Inter, sans-serif",
  },
  ctaSection: {
    padding: "90px 20px",
    backgroundColor: "#F8FAFC",
  },
  ctaContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "16px",
    fontFamily: "Poppins, sans-serif",
  },
  ctaText: {
    fontSize: "16px",
    color: "#64748B",
    marginBottom: "36px",
    lineHeight: "1.7",
    fontFamily: "Inter, sans-serif",
  },
  ctaSecondaryButton: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: "#0F172A",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "15px",
    border: "1px solid #CBD5E1",
    fontFamily: "Inter, sans-serif",
  },
};

export default Home;
