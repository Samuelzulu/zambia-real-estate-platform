import ListingCard from "../components/ListingCard";
import { useState, useEffect } from "react";
import { getListings } from "../services/api";

function Listings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await getListings();
        setListings(res.data);
      } catch (err) {
        setError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings
    .filter((listing) => listing.status === "approved")
    .filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Browse Properties</p>
          <h1 style={styles.heading}>Available Listings</h1>
          <p style={styles.subtext}>
            Explore homes and apartments accross Zambia.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {loading && <p style={{ color: "#64748B" }}>Loading listings...</p>}
        {error && <p style={{ color: "#EF4444" }}>{error}</p>}

        <div style={styles.grid}>
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <p style={styles.noResults}>No listings found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
    padding: "60px 20px 80px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "28px",
  },
  eyebrow: {
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#C29A4B",
    fontWeight: "700",
    marginBottom: "10px",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "24px",
    color: "#0F172A",
  },
  subtext: {
    fontSize: "18px",
    color: "#64748B",
  },
  searchInput: {
    width: "100%",
    maxWidth: "420px",
    padding: "14px 18px",
    marginBottom: "32px",
    fontSize: "16px",
    border: "1px solid #CBD5E1",
    borderRadius: "12px",
    outline: "none",
    backgroundColor: "white",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    alignItems: "stretch",
  },
  noResults: {
    fontSize: "18px",
    color: "#475569",
  },
};

export default Listings;
