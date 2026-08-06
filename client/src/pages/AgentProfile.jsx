import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAgentById } from "../services/api";
import VerifiedBadge from "../components/VerifiedBadge";
import ListingCard from "../components/ListingCard";
import { useRole } from "../context/RoleContext";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function AgentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useRole();
  const [agent, setAgent] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAgentById(id);
        setAgent(res.data.agent);
        setListings(res.data.listings || []);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Agent not found."
            : "Failed to load agent profile.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ color: "#64748B" }}>Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.notFound}>{error || "Agent not found."}</h1>
          <Link to="/agents" style={styles.backLink}>
            ← Back to Agent Directory
          </Link>
        </div>
      </div>
    );
  }

  const memberSince = agent.created_at
    ? new Date(agent.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <Link to="/agents" style={styles.backLink}>
          ← Back to Agent Directory
        </Link>

        {/* Profile card */}
        <div style={styles.profileCard}>
          {agent.photo_url ? (
            <img
              src={agent.photo_url}
              alt={agent.full_name}
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarFallback}>{initials(agent.full_name)}</div>
          )}

          <div style={styles.profileInfo}>
            <div style={styles.nameRow}>
              <h1 style={styles.name}>{agent.full_name}</h1>
              {agent.verified && <VerifiedBadge />}
            </div>
            <p style={styles.agency}>{agent.agency || "Independent Agent"}</p>
            {agent.location && (
              <p style={styles.location}>📍 {agent.location}</p>
            )}
            {agent.bio && <p style={styles.bio}>{agent.bio}</p>}
            <p style={styles.memberSince}>Member since {memberSince}</p>

            {/* Contact details — hidden from guests to keep contact on-platform */}
            <div style={styles.contactRow}>
              {user ? (
                <>
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} style={styles.contactItem}>
                      📞 {agent.phone}
                    </a>
                  )}
                  <a href={`mailto:${agent.email}`} style={styles.contactItem}>
                    ✉️ {agent.email}
                  </a>
                </>
              ) : (
                <span style={styles.contactHidden}>
                  Sign in to view contact details
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div style={styles.buttonRow}>
              {user ? (
                <a href={`mailto:${agent.email}`} style={styles.primaryButton}>
                  Contact Agent
                </a>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  style={styles.primaryButton}
                >
                  Contact Agent
                </button>
              )}
              <button style={styles.reportButton}>Report Agent</button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{listings.length}</span>
            <span style={styles.statLabel}>Active Listings</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{agent.location || "—"}</span>
            <span style={styles.statLabel}>Primary Area</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNumber}>
              {agent.verified ? "Verified" : "Unverified"}
            </span>
            <span style={styles.statLabel}>Status</span>
          </div>
        </div>

        {/* Agent's listings */}
        <div style={styles.listingsSection}>
          <h2 style={styles.sectionTitle}>Properties by {agent.full_name}</h2>
          {listings.length > 0 ? (
            <div style={styles.listingsGrid}>
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p style={styles.noListings}>No active listings at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
    padding: "40px 20px 80px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748B",
    textDecoration: "none",
    marginBottom: "24px",
  },
  notFound: {
    fontSize: "24px",
    color: "#0F172A",
    marginBottom: "16px",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "36px",
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarFallback: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    flexShrink: 0,
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
    minWidth: "260px",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "6px",
  },
  name: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0F172A",
    margin: 0,
  },
  agency: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#C29A4B",
    margin: "0 0 4px 0",
  },
  location: {
    fontSize: "15px",
    color: "#64748B",
    margin: "0 0 16px 0",
  },
  bio: {
    fontSize: "15px",
    color: "#475569",
    lineHeight: "1.7",
    margin: "0 0 12px 0",
  },
  memberSince: {
    fontSize: "13px",
    color: "#94A3B8",
    margin: "0 0 20px 0",
  },
  contactRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  contactItem: {
    fontSize: "14px",
    color: "#0F172A",
    textDecoration: "none",
    fontWeight: "500",
  },
  contactHidden: {
    fontSize: "14px",
    color: "#94A3B8",
    fontStyle: "italic",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
  },
  reportButton: {
    padding: "12px 24px",
    backgroundColor: "transparent",
    color: "#EF4444",
    border: "1px solid #EF4444",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  statsBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: "24px 32px",
    display: "flex",
    alignItems: "center",
    gap: "32px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statNumber: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: "13px",
    color: "#64748B",
    fontWeight: "500",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    backgroundColor: "#E2E8F0",
  },
  listingsSection: {
    marginTop: "8px",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "20px",
  },
  listingsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
  },
  noListings: {
    fontSize: "16px",
    color: "#64748B",
  },
};

export default AgentProfile;
