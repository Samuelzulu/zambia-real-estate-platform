function VerifiedBadge() {
  return (
    <span style={styles.badge}>
      ✓ Verified
    </span>
  );
}

const styles = {
  badge: {
    display: "inline-block",
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    fontSize: "12px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
    letterSpacing: "0.3px",
  },
};

export default VerifiedBadge;