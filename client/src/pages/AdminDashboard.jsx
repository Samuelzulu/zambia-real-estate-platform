import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import {
  getListings,
  deleteListing,
  updateListingStatus,
  getAllAgentsAdmin,
  updateAgentStatus,
  getPendingAgents,
  getAllReports,
} from "../services/api";

function AdminDashboard() {
  const { user } = useRole();
  const [listings, setListings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [openReportsCount, setOpenReportsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [listingFilter, setListingFilter] = useState("all");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [listingsRes, agentsRes, pendingRes, reportsRes] =
        await Promise.all([
          getListings(),
          getAllAgentsAdmin(),
          getPendingAgents(),
          getAllReports(),
        ]);
      setListings(listingsRes.data);
      setAgents(agentsRes.data);
      setPendingCount(pendingRes.data.length);
      setOpenReportsCount(
        reportsRes.data.filter((r) => r.status === "pending").length,
      );
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleListingStatus = async (id, status) => {
    let reason;
    if (status === "rejected") {
      reason = window.prompt(
        "Reason for rejecting this listing (the agent will see this):",
      );
      if (reason === null) return; // cancelled
      if (!reason.trim()) {
        alert("A reason is required to reject a listing.");
        return;
      }
    }
    try {
      await updateListingStatus(id, status, reason);
      setListings((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                status,
                rejection_reason: status === "rejected" ? reason : null,
              }
            : l,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update listing status");
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Permanently delete this listing?")) return;
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  const handleAgentStatus = async (id, account_status) => {
    const verb = account_status === "suspended" ? "suspend" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${verb} this agent?`)) return;
    try {
      await updateAgentStatus(id, account_status);
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, account_status } : a)),
      );
      const listingsRes = await getListings();
      setListings(listingsRes.data);
    } catch (err) {
      alert(`Failed to ${verb} agent`);
    }
  };

  const listingStatusStyle = (status) => {
    if (status === "approved") return styles.statusApproved;
    if (status === "rejected") return styles.statusRejected;
    if (status === "unpublished") return styles.statusUnpublished;
    if (status === "sold") return styles.statusSold;
    return styles.statusPending;
  };

  const filteredListings =
    listingFilter === "all"
      ? listings
      : listings.filter((l) => l.status === listingFilter);

  const totalListings = listings.length;
  const pendingListings = listings.filter((l) => l.status === "pending").length;
  const verifiedAgents = agents.filter((a) => a.verified).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Admin Portal</p>
            <h1 style={styles.heading}>
              Welcome, {user?.full_name?.split(" ")[0] || "Admin"}
            </h1>
            <p style={styles.subtext}>{user?.email}</p>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{agents.length}</span>
            <span style={styles.statLabel}>Total Agents</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{verifiedAgents}</span>
            <span style={styles.statLabel}>Verified Agents</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{pendingCount}</span>
            <span style={styles.statLabel}>Pending Verification</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{totalListings}</span>
            <span style={styles.statLabel}>Total Listings</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{pendingListings}</span>
            <span style={styles.statLabel}>Pending Listings</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{openReportsCount}</span>
            <span style={styles.statLabel}>Open Reports</span>
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("overview")}
            style={
              activeTab === "overview" ? styles.tabActive : styles.tabInactive
            }
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            style={
              activeTab === "listings" ? styles.tabActive : styles.tabInactive
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
            Agents
          </button>
        </div>

        {activeTab === "overview" && (
          <div style={styles.overviewGrid}>
            <Link to="/verification-review" style={styles.overviewCard}>
              <p style={styles.overviewCardTitle}>Verification Queue</p>
              <p style={styles.overviewCardText}>
                {pendingCount} agent{pendingCount === 1 ? "" : "s"} waiting on
                ZIEA verification
              </p>
              <span style={styles.overviewCardLink}>Review agents →</span>
            </Link>
            <Link to="/reports" style={styles.overviewCard}>
              <p style={styles.overviewCardTitle}>Reports Queue</p>
              <p style={styles.overviewCardText}>
                {openReportsCount} open report
                {openReportsCount === 1 ? "" : "s"} awaiting review
              </p>
              <span style={styles.overviewCardLink}>Review reports →</span>
            </Link>
            <div style={styles.overviewCard}>
              <p style={styles.overviewCardTitle}>Pending Listings</p>
              <p style={styles.overviewCardText}>
                {pendingListings} listing{pendingListings === 1 ? "" : "s"}{" "}
                waiting on approval (usually from unverified agents)
              </p>
              <button
                onClick={() => {
                  setListingFilter("pending");
                  setActiveTab("listings");
                }}
                style={styles.overviewCardButton}
              >
                Review listings →
              </button>
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div>
            <div style={styles.filterRow}>
              {[
                "all",
                "pending",
                "approved",
                "rejected",
                "unpublished",
                "sold",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setListingFilter(status)}
                  style={
                    listingFilter === status
                      ? styles.filterActive
                      : styles.filterInactive
                  }
                >
                  {status[0].toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: "#64748B" }}>Loading listings...</p>
            ) : filteredListings.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No listings match this filter.</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id}>
                      <td style={styles.td}>{listing.title}</td>
                      <td style={styles.td}>{listing.location}</td>
                      <td style={styles.td}>{listing.price}</td>
                      <td style={styles.td}>
                        <span style={listingStatusStyle(listing.status)}>
                          {listing.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <Link
                            to={`/listings/${listing.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.editLink}
                          >
                            View
                          </Link>
                          {listing.status !== "approved" && (
                            <button
                              onClick={() =>
                                handleListingStatus(listing.id, "approved")
                              }
                              style={styles.approveLink}
                            >
                              Approve
                            </button>
                          )}
                          {listing.status === "approved" && (
                            <button
                              onClick={() =>
                                handleListingStatus(listing.id, "unpublished")
                              }
                              style={styles.unpublishLink}
                            >
                              Unpublish
                            </button>
                          )}
                          {listing.status !== "rejected" && (
                            <button
                              onClick={() =>
                                handleListingStatus(listing.id, "rejected")
                              }
                              style={styles.rejectLink}
                            >
                              Reject
                            </button>
                          )}
                          <Link
                            to={`/edit-listing/${listing.id}`}
                            style={styles.editLink}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            style={styles.deleteButton}
                          >
                            Delete
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

        {activeTab === "agents" && (
          <div>
            {loading ? (
              <p style={{ color: "#64748B" }}>Loading agents...</p>
            ) : agents.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No agents yet.</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>ZIEA #</th>
                    <th style={styles.th}>Verified</th>
                    <th style={styles.th}>Account</th>
                    <th style={styles.th}>Listings</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id}>
                      <td style={styles.td}>{agent.full_name}</td>
                      <td style={styles.td}>{agent.email}</td>
                      <td style={styles.td}>{agent.ziea_number || "—"}</td>
                      <td style={styles.td}>
                        <span
                          style={
                            agent.verified
                              ? styles.statusApproved
                              : styles.statusPending
                          }
                        >
                          {agent.verified ? "verified" : "unverified"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={
                            agent.account_status === "suspended"
                              ? styles.statusRejected
                              : styles.statusApproved
                          }
                        >
                          {agent.account_status || "active"}
                        </span>
                      </td>
                      <td style={styles.td}>{agent.active_listings}</td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          {agent.account_status === "suspended" ? (
                            <button
                              onClick={() =>
                                handleAgentStatus(agent.id, "active")
                              }
                              style={styles.approveLink}
                            >
                              Reactivate
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleAgentStatus(agent.id, "suspended")
                              }
                              style={styles.rejectLink}
                            >
                              Suspend
                            </button>
                          )}
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
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
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
    fontSize: "26px",
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: "12px",
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
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  overviewCard: {
    display: "block",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: "24px",
    textDecoration: "none",
  },
  overviewCardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 8px 0",
  },
  overviewCardText: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 16px 0",
    lineHeight: "1.5",
  },
  overviewCardLink: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#C29A4B",
  },
  overviewCardButton: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#C29A4B",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterActive: {
    padding: "7px 16px",
    borderRadius: "20px",
    border: "1px solid #0F172A",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  filterInactive: {
    padding: "7px 16px",
    borderRadius: "20px",
    border: "1px solid #CBD5E1",
    backgroundColor: "#FFFFFF",
    color: "#64748B",
    fontSize: "13px",
    fontWeight: "600",
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
  statusUnpublished: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#F1F5F9",
    color: "#475569",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  statusSold: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#E0E7FF",
    color: "#3730A3",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  editLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0F172A",
    textDecoration: "none",
  },
  approveLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#15803D",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  rejectLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#EF4444",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  unpublishLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748B",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  deleteButton: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#EF4444",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  emptyState: {
    padding: "40px 0",
  },
  emptyText: {
    fontSize: "16px",
    color: "#64748B",
  },
};

export default AdminDashboard;
