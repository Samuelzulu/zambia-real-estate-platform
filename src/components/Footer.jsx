function Footer() {
    return (
        <footer style={styles.footer}>
            <p style={styles.tetxt}>&copy; 2026 Zambia Real Extate Platform. All rights reserved.</p>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: "#E2E8F0",
        padding: "20px",
        textAlign: "center",
        marginTop: "40px",
    },
    text: {
        margin: 0,
        color: "#0F172A"
    },
};

export default Footer;