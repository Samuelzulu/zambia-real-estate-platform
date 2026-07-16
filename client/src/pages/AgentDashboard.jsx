import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { getListings, deleteListing, getAgentInquiries } from "../services/api";

function AgentDashboard() {
  const { user } = useRole();
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, inquiriesRes] = await Promise.all([
          getListings(),
          getAgentInquiries(),
        ]);
        // Filter listings to only show this agent's listings
        const myListings = listingsRes.data.filter(
          (l) => l.agent_id === user?.id,
        );
        setListings(myListings);
        setInquiries(inquiriesRes.data);
      } catch (err) {
        console.error("Agent dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  const statusStyle = (status) => {
    if (status === "approved") return styles.statusApproved;
    if (status === "rejected") return styles.statusRejected;
    return styles.statusPending;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Agent Portal</p>
            <h1 style={styles.heading}>
              Welcome, {user?.full_name?.split(" ")[0] || "Agent"}
            </h1>
            <p style={styles.subtext}>{user?.email}</p>
          </div>
          <Link to="/add-listing" style={styles.addButton}>
            + Add Listing
          </Link>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{listings.length}</span>
            <span style={styles.statLabel}>Total Listings</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {listings.filter((l) => l.status === "approved").length}
            </span>
            <span style={styles.statLabel}>Approved</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {listings.filter((l) => l.status === "pending").length}
            </span>
            <span style={styles.statLabel}>Pending Review</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{inquiries.length}</span>
            <span style={styles.statLabel}>Inquiries</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("listings")}
            style={
              activeTab === "listings" ? styles.tabActive : styles.tabInactive
            }
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            style={
              activeTab === "inquiries" ? styles.tabActive : styles.tabInactive
            }
          >
            Inquiries
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div>
            {loading ? (
              <p style={{ color: "#64748B" }}>Loading listings...</p>
            ) : listings.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>
                  You haven't added any listings yet.
                </p>
                <Link to="/add-listing" style={styles.emptyLink}>
                  Add your first listing →
                </Link>
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
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td style={styles.td}>{listing.title}</td>
                      <td style={styles.td}>{listing.location}</td>
                      <td style={styles.td}>{listing.price}</td>
                      <td style={styles.td}>
                        <span style={statusStyle(listing.status)}>
                          {listing.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <Link
                            to={`/edit-listing/${listing.id}`}
                            style={styles.editLink}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(listing.id)}
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

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div>
            {loading ? (
              <p style={{ color: "#64748B" }}>Loading inquiries...</p>
            ) : inquiries.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No inquiries yet.</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Property</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Message</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td style={styles.td}>{inquiry.listing_title}</td>
                      <td style={styles.td}>{inquiry.customer_name}</td>
                      <td style={styles.td}>{inquiry.customer_email}</td>
                      <td style={styles.td}>{inquiry.message}</td>
                      <td style={styles.td}>
                        {new Date(inquiry.created_at).toLocaleDateString()}
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
  addButton: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#C29A4B",
    color: "#FFFFFF",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
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
    gap: "12px",
    alignItems: "center",
  },
  editLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0F172A",
    textDecoration: "none",
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
    marginBottom: "12px",
  },
  emptyLink: {
    fontSize: "15px",
    color: "#C29A4B",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default AgentDashboard;
