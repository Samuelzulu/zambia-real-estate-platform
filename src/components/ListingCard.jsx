function ListingCard({ listing }) {
    return (
        <div className="listing-card">
            <img src={"listing.image"} alt="property" />

            <h3>{listing.title}</h3>

            <p>{listing.location}</p>

            <p>{listing.price}</p>
        </div>
    );
}

export default ListingCard;