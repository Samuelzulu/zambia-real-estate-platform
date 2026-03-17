import { Link } from "react-router-dom";

function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`} style={{ textDecoration: "none" }}>
      <div style={styles.card}>
        <img src={listing.image} alt={listing.title} style={styles.image} />

        <div style={styles.content}>
          <h2 style={styles.title}>{listing.title}</h2>
          <p style={styles.text}>
            <strong>Price:</strong> {listing.price}
          </p>
          <p style={styles.text}>
            <strong>Location:</strong> {listing.location}
          </p>
          <p style={styles.text}>
            <strong>Bedrooms:</strong> {listing.bedrooms} |{" "}
            <strong>Bathrooms:</strong> {listing.bathrooms}
          </p>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    width: "300px",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  content: {
    padding: "16px",
  },
  title: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#0F172A",
  },
  text: {
    margin: "6px 0",
    color: "#334155",
  },
};

export default ListingCard;
