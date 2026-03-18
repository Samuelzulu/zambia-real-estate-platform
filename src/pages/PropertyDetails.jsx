import { useParams } from "react-router-dom";
import { listings } from "../data/mockListings";

function PropertyDetails() {
  const { id } = useParams();
  const property = listings.find((item) => item.id === Number(id));

  if (!property) {
    return <h1>Property not found</h1>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <img src={property.image} alt={property.title} style={styles.image} />

        <div style={styles.infoSection}>
          <h1 style={styles.title}>{property.title}</h1>

          <p style={styles.price}>
            <strong>Price:</strong> {property.price}
          </p>
          <p style={styles.text}>
            <strong>Location:</strong> {property.location}
          </p>
          <p style={styles.text}>
            <strong>Bedrooms:</strong> {property.bedrooms}
          </p>
          <p style={styles.text}>
            <strong>Bathrooms:</strong> {property.bathrooms}
          </p>

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
    padding: "40px 20px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "40px",
    gap: "40px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  image: {
    width: "100%",
    maxWidth: "520px",
    height: "340px",
    objectFit: "cover",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  infoSection: {
    flex: "1",
    minWidth: "280px",
  },
  title: {
    fontSize: "48px",
    marginBottom: "20px",
    color: "#0F172A",
  },
  price: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#0F172A",
  },
  text: {
    fontSize: "22px",
    marginBottom: "12px",
    color: "#334155",
  },
  description: {
    marginTop: "24px",
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#475569",
  },
  button: {
    marginTop: "24px",
    backgroundColor: "#0F172A",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default PropertyDetails;
