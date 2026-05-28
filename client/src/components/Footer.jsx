function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>&copy; 2026 Zambia Real Estate Platform. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#0F172A",
    padding: "20px",
    textAlign: "center",
    marginTop: "40px",
  },
  text: {
    margin: 0,
    color: "#64748B",
  },
};

export default Footer;
