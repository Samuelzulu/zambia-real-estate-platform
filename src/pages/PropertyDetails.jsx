import { useParams } from "react-router-dom";
import { listings } from "../data/mockListings"
import { use } from "react";

function PropertyDetails() {
  const { id } = useParams();

  const property = listings.find((item) => item.id === Number(id));

  if (!property) {
    return <h1>Property not found</h1>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{property.title}</h1>
      <img src={property.image} style={{ width: "40px", margin: "20px 0" }} />

      <p><strong>Price:</strong> {property.price}</p>
      <p><strong>Location:</strong> {property.location}</p>
      <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
      <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
    </div>
  );
}

export default PropertyDetails;