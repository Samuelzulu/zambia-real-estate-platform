import { Link } from "react-router-dom";
import { listings } from "../data/mockListings";
import ListingCard from "../components/ListingCard";

function Home() {
  const featuredListings = listings.slice(0, 3);

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Trusted Real Estate in Zambia</h1>
        <p style={styles.heroText}>
          Browse verified property listings and connect with trustedreal estate
          agents across Zambia.
        </p>

        <Link to="/listings" style={styles.heroButton}>
          Browse Listings
        </Link>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Listings</h2>

        <div style={styles.grid}>
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#F8FAFC"
    },
    hero: {
        backgroundColor: "#0F172A",
        color: "white",
        padding: "80px 40px",
        textAlign: "center",
    },
    heroTitle: {
        fontSize: "48px",
        marginBottom: "20px",
    },
    heroText: {
        fontSize: "20px",
        maxwidth: "700px",
        margin: "0 auto 30px auto",
        lineHeight: "1.6",
    },
    heroButton: {
        display: "inline-block",
        backgroundColor: "#C29A4B",
        color: "white",
        textDecoration: "none",
        padding: "14px 24px",
        borderRadius: "10px",
        fontWeight: "bold",
    },
    section: {
        padding: "flex",
    },
    sectionTitle: {
        fontSize: "32px",
        marginBottom: "wrap",
        color: "#0F172A",
    },
    grid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
    },
};

export default Home;
