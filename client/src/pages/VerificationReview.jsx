import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPendingAgents, verifyAgent } from "../services/api";

function VerificationReview() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await getPendingAgents();
        setAgents(res.data);
      } catch (err) {
        console.error("Failed to fetch pending agents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleVerify = async (id, verified) => {
    try {
      await verifyAgent(id, verified);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to update agent status");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin-dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>

        <div style={styles.header}>
          <p style={styles.eyebrow}>Admin Portal</p>
          <h1 style={styles.heading}>Agent Verification Review</h1>
          <p style={styles.subtext}>
            Review and approve or reject agent registration requests.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#64748B" }}>Loading pending agents...</p>
        ) : agents.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No agents pending verification.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {agents.map((agent) => (
              <div key={agent.id} style={styles.card}>
                <div style={styles.agentInfo}>
                  <h3 style={styles.agentName}>{agent.full_name}</h3>
                  <p style={styles.agentEmail}>{agent.email}</p>
                  <div style={styles.metaRow}>
                    <span style={styles.metaItem}>
                      <strong>ZIEA Number:</strong>{" "}
                      {agent.ziea_number || "Not provided"}
                    </span>
                    <span style={styles.metaItem}>
                      <strong>Registered:</strong>{" "}
                      {new Date(agent.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleVerify(agent.id, true)}
                    style={styles.approveButton}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleVerify(agent.id, false)}
                    style={styles.rejectButton}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backLink: {
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748B",
    textDecoration: "none",
    marginBottom: "24px",
  },
  page: {
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
    padding: "50px 20px 80px",
  },
  container: {
    maxWidth: "860px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  eyebrow: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#C29A4B",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 6px 0",
  },
  subtext: {
    fontSize: "14px",
    color: "#64748B",
    margin: 0,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 4px 0",
  },
  agentEmail: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 12px 0",
  },
  metaRow: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  metaItem: {
    fontSize: "13px",
    color: "#475569",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexShrink: 0,
  },
  approveButton: {
    padding: "10px 20px",
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "10px 20px",
    backgroundColor: "#FFF1F2",
    color: "#BE123C",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  emptyState: {
    padding: "40px 0",
  },
  emptyText: {
    fontSize: "16px",
    color: "#64748B",
  },
};

export default VerificationReview;
