import { Link } from "react-router-dom";

function ListingCard({ listing }) {
  const thumbnail =
    listing.images && listing.images.length > 0 ? listing.images[0].url : null;

  return (
    <Link to={`/listings/${listing.id}`} style={styles.link}>
      <div style={styles.card}>
        <div style={styles.imageWrapper}>
          {thumbnail ? (
            <img src={thumbnail} alt={listing.title} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>
              <span style={styles.placeholderText}>No photo</span>
            </div>
          )}
        </div>
        <div style={styles.content}>
          <p style={styles.price}>{listing.price}</p>
          <h3 style={styles.title}>{listing.title}</h3>
          <p style={styles.location}>{listing.location}</p>
          <div style={styles.meta}>
            <span>{listing.bedrooms} Beds</span>
            <span>{listing.bathrooms} Baths</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  link: { textDecoration: "none", color: "inherit" },
  card: {
    width: "320px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  imageWrapper: { width: "100%", height: "200px", overflow: "hidden" },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: "13px",
    color: "#94A3B8",
    fontWeight: "600",
  },
  content: { padding: "20px" },
  price: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#C29A4B",
    margin: "0 0 6px 0",
  },
  title: { fontSize: "18px", color: "#0F172A", margin: "0 0 6px 0" },
  location: { fontSize: "14px", color: "#64748B", margin: "0 0 12px 0" },
  meta: {
    display: "flex",
    gap: "16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
};

export default ListingCard;
