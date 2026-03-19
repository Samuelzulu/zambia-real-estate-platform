import { Link } from "react-router-dom";

function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`} style={styles.link}>
      <div style={styles.card}>
        <div style={styles.imagewrapper}>
          <img src={listing.image} alt={listing.title} style={styles.image} />
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
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    width: "320px",
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "pointer",
  },
  imageWrapper: {
    width: "100%",
    height: "220px",
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  content: {
    padding: "20px",
  },
  price: {
    fontSize: "24px",
    lineHeight: "1.3",
    color: "#0F172A",
    marginBottom: "10px",
  },
  title: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#0F172A",
  },
  location: {
    fontSize: "16px",
    color: "#64748B",
    marginBottom: "18px",
  },
  meta: {
    display: "flex",
    gap: "16px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#334155",
  },
};

export default ListingCard;
