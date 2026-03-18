import { useState } from "react";
import ListingCard from "../components/ListingCard";
import { listings } from "../data/mockListings";

function Listings() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Available Listings</h1>

      <input
        type="text"
        placeholder="Search by title or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

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
  );
}

const styles = {
  page: {
    padding: "40px",
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "24px",
    color: "#0F172A",
  },
  searchInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "12px 16px",
    marginBottom: "30px",
    fontSize: "16px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    outline: "none",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  noResults: {
    fontSize: "18px",
    color: "#475569"
  }
};

export default Listings;
