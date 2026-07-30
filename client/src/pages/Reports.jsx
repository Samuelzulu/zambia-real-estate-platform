import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllReports, updateReportStatus } from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getAllReports();
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    } catch (err) {
      alert("Failed to update report");
    }
  };

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    dismissed: reports.filter((r) => r.status === "dismissed").length,
  };

  const statusStyle = (status) => {
    if (status === "resolved") return styles.statusResolved;
    if (status === "dismissed") return styles.statusDismissed;
    if (status === "reviewed") return styles.statusReviewed;
    return styles.statusPending;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin-dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>

        <div style={styles.header}>
          <p style={styles.eyebrow}>Admin Portal</p>
          <h1 style={styles.heading}>Reports & Complaints</h1>
          <p style={styles.subtext}>
            Review and manage user-submitted reports.
          </p>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.total}</span>
            <span style={styles.statLabel}>Total Reports</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.pending}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.reviewed}</span>
            <span style={styles.statLabel}>Reviewed</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.resolved}</span>
            <span style={styles.statLabel}>Resolved</span>
          </div>
        </div>

        {/* Filter */}
        <div style={styles.filterRow}>
          {["all", "pending", "reviewed", "resolved", "dismissed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={filter === f ? styles.filterActive : styles.filterInactive}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Reports table */}
        {loading ? (
          <p style={{ color: "#64748B" }}>Loading reports...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#64748B" }}>No reports found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Reporter</th>
                <th style={styles.th}>Listing</th>
                <th style={styles.th}>Agent</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report) => (
                <tr key={report.id}>
                  <td style={styles.td}>{report.reporter_name}</td>
                  <td style={styles.td}>
                    {report.listing_id ? (
                      <Link
                        to={`/listings/${report.listing_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.listingLink}
                      >
                        {report.listing_title || "View listing"}
                      </Link>
                    ) : (
                      report.listing_title || "—"
                    )}
                  </td>
                  <td style={styles.td}>{report.agent_name || "—"}</td>
                  <td style={styles.td}>{report.reason}</td>
                  <td style={styles.td}>
                    <span style={statusStyle(report.status)}>
                      {report.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {report.status === "pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(report.id, "reviewed")
                          }
                          style={styles.reviewButton}
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {report.status !== "resolved" &&
                        report.status !== "dismissed" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(report.id, "resolved")
                              }
                              style={styles.resolveButton}
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(report.id, "dismissed")
                              }
                              style={styles.dismissButton}
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  listingLink: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#C29A4B",
    textDecoration: "none",
  },
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
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: "120px",
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
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterActive: {
    padding: "8px 16px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  filterInactive: {
    padding: "8px 16px",
    backgroundColor: "#FFFFFF",
    color: "#64748B",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    fontSize: "13px",
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
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  td: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#0F172A",
    borderBottom: "1px solid #F1F5F9",
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
  statusReviewed: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#E0F2FE",
    color: "#0369A1",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  statusResolved: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  statusDismissed: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#F1F5F9",
    color: "#64748B",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  actions: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  reviewButton: {
    padding: "5px 10px",
    backgroundColor: "#E0F2FE",
    color: "#0369A1",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  resolveButton: {
    padding: "5px 10px",
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  dismissButton: {
    padding: "5px 10px",
    backgroundColor: "#F1F5F9",
    color: "#64748B",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Reports;
