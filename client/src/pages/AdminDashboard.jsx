import { useState, useEffect } from "react";
import {
  getListings,
  getAllReports,
  getPendingAgents,
  verifyAgent,
  updateReportStatus,
} from "../services/api";

function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [pendingAgents, setPendingAgents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, reportsRes] = await Promise.all([
          getListings(),
          getAllReports(),
        ]);
        setListings(listingsRes.data);
        setReports(reportsRes.data);

        // Fetch pending agents
        try {
          const agentsRes = await getPendingAgents();
          setPendingAgents(agentsRes.data);
        } catch (err) {
          console.error("Could not fetch pending agents:", err);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerifyAgent = async (id, verified) => {
    try {
      await verifyAgent(id, verified);
      setPendingAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to update agent status");
    }
  };

  const handleUpdateReport = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    } catch (err) {
      alert("Failed to update report");
    }
  };

  const stats = {
    total: listings.length,
    approved: listings.filter((l) => l.status === "approved").length,
    pending: listings.filter((l) => l.status === "pending").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Admin Portal</p>
          <h1 style={styles.heading}>Admin Dashboard</h1>
          <p style={styles.subtext}>Manage listings, agents, and reports.</p>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.total}</span>
            <span style={styles.statLabel}>Total Listings</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.approved}</span>
            <span style={styles.statLabel}>Approved</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.pending}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{pendingAgents.length}</span>
            <span style={styles.statLabel}>Agents Awaiting Verification</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {reports.filter((r) => r.status === "pending").length}
            </span>
            <span style={styles.statLabel}>Open Reports</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("overview")}
            style={
              activeTab === "overview" ? styles.tabActive : styles.tabInactive
            }
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            style={
              activeTab === "agents" ? styles.tabActive : styles.tabInactive
            }
          >
            Agent Verification
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            style={
              activeTab === "reports" ? styles.tabActive : styles.tabInactive
            }
          >
            Reports
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === "overview" && (
          <div>
            {loading ? (
              <p style={{ color: "#64748B" }}>Loading...</p>
            ) : listings.length === 0 ? (
              <p style={{ color: "#64748B" }}>No listings yet.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td style={styles.td}>{listing.title}</td>
                      <td style={styles.td}>{listing.location}</td>
                      <td style={styles.td}>{listing.price}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            listing.status === "approved"
                              ? styles.statusApproved
                              : listing.status === "rejected"
                                ? styles.statusRejected
                                : styles.statusPending
                          }
                        >
                          {listing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Agent Verification Tab */}
        {activeTab === "agents" && (
          <div>
            {loading ? (
              <p style={{ color: "#64748B" }}>Loading...</p>
            ) : pendingAgents.length === 0 ? (
              <p style={{ color: "#64748B" }}>
                No agents pending verification.
              </p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>ZIEA Number</th>
                    <th style={styles.th}>Registered</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAgents.map((agent) => (
                    <tr key={agent.id}>
                      <td style={styles.td}>{agent.full_name}</td>
                      <td style={styles.td}>{agent.email}</td>
                      <td style={styles.td}>
                        {agent.ziea_number || "Not provided"}
                      </td>
                      <td style={styles.td}>
                        {new Date(agent.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            onClick={() => handleVerifyAgent(agent.id, true)}
                            style={styles.approveButton}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyAgent(agent.id, false)}
                            style={styles.rejectButton}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div>
            {loading ? (
              <p style={{ color: "#64748B" }}>Loading...</p>
            ) : reports.length === 0 ? (
              <p style={{ color: "#64748B" }}>No reports submitted.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Reporter</th>
                    <th style={styles.th}>Listing</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td style={styles.td}>{report.reporter_name}</td>
                      <td style={styles.td}>{report.listing_title || "N/A"}</td>
                      <td style={styles.td}>{report.reason}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            report.status === "resolved"
                              ? styles.statusApproved
                              : report.status === "dismissed"
                                ? styles.statusRejected
                                : styles.statusPending
                          }
                        >
                          {report.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            onClick={() =>
                              handleUpdateReport(report.id, "resolved")
                            }
                            style={styles.approveButton}
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateReport(report.id, "dismissed")
                            }
                            style={styles.rejectButton}
                          >
                            Dismiss
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
    padding: "50px 20px 80px",
  },
  container: {
    maxWidth: "1100px",
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
  statsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: "140px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: "13px",
    color: "#64748B",
    fontWeight: "500",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "2px solid #E2E8F0",
  },
  tabActive: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#0F172A",
    border: "none",
    borderBottom: "2px solid #0F172A",
    marginBottom: "-2px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  tabInactive: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#64748B",
    border: "none",
    borderBottom: "2px solid transparent",
    marginBottom: "-2px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
    color: "#0F172A",
    borderBottom: "1px solid #F1F5F9",
  },
  statusApproved: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  statusPending: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#FEF9C3",
    color: "#854D0E",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  statusRejected: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#FFF1F2",
    color: "#BE123C",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  approveButton: {
    padding: "6px 14px",
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "6px 14px",
    backgroundColor: "#FFF1F2",
    color: "#BE123C",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AdminDashboard;
