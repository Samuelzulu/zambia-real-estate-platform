import { useParams } from "react-router-dom";
import { listings } from "../data/mockListings";

function PropertyDetails() {
  const { id } = useParams();
  const property = listings.find((item) => item.id === Number(id));

  if (!property) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Property not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.imageSection}>
          <img src={property.image} alt={property.title} style={styles.image} />
        </div>

        <div style={styles.infoSection}>
          <p style={styles.eyebrow}>Property Details</p>
          <h1 style={styles.title}>{property.title}</h1>
          <p style={styles.price}>{property.price}</p>

          <div style={styles.meta}>
            <span>{property.bedrooms} Bedrooms </span>
            <span>{property.bathrooms} Bathrooms </span>
            <span>{property.location}</span>
          </div>

          <p style={styles.description}>
            This property is a great option for buyers looking for comfort,
            convenience, and a strong location in Zambia.
          </p>

          <button style={styles.button}>Contact Agent</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    padding: "60px 20px 90px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  imageSection: {
    flex: "1",
    minWidth: "320px"
  },
  image: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  },
  infoSection: {
    flex: "1",
    minWidth: "320px",
  },
  eyebrow: {
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#C29A4B",
    fontWeight: "700",
    marginBottom: "12px",
  },
  title: {
    fontSize: "48px",
    lineHeight: "1.15",
    color: "#0F172A",
    marginBottom: "12px",
  },
  price: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "22px",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontSize: "18px",
    color: "#475569",
    marginBottom: "30px",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#475569",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#0F172A",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default PropertyDetails;
