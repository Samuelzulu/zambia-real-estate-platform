import { Link } from "react-router-dom";
import VerifiedBadge from "./VerifiedBadge";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function AgentCard({ agent }) {
  return (
    <Link to={`/agents/${agent.id}`} style={styles.link}>
      <div style={styles.card}>
        {agent.photo_url ? (
          <img
            src={agent.photo_url}
            alt={agent.full_name}
            style={styles.avatar}
          />
        ) : (
          <div style={styles.avatarFallback}>{initials(agent.full_name)}</div>
        )}
        <div style={styles.content}>
          <div style={styles.nameRow}>
            <h3 style={styles.name}>{agent.full_name}</h3>
            {agent.verified && <VerifiedBadge />}
          </div>
          <p style={styles.agency}>{agent.agency || "Independent Agent"}</p>
          {agent.location && <p style={styles.location}>📍 {agent.location}</p>}
          {agent.bio && <p style={styles.bio}>{agent.bio}</p>}
          <p style={styles.listings}>
            {agent.active_listings ?? 0} active listing
            {agent.active_listings === 1 ? "" : "s"}
          </p>
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
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "24px",
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarFallback: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    flexShrink: 0,
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "4px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  agency: {
    fontSize: "14px",
    color: "#C29A4B",
    fontWeight: "600",
    margin: "0 0 4px 0",
  },
  location: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 8px 0",
  },
  bio: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.6",
    margin: "0 0 10px 0",
  },
  listings: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0F172A",
    margin: 0,
  },
};

export default AgentCard;
