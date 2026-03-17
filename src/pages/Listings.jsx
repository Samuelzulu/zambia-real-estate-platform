import ListingCard from "../components/ListingCard";
import { listings } from "../data/mockListings";

function Listings() {
    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>Available Listings</h1>

            <div style={styles.grid}>
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
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
    grid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
    },
};

export default Listings;