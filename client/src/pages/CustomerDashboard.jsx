import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { getFavorites, getMyInquiries } from "../services/api";

function CustomerDashboard() {
  const { user } = useRole();
  const [activeTab, setActiveTab] = useState("saved");
  const [savedListings, setSavedListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [favRes, inqRes] = await Promise.all([
          getFavorites(),
          getMyInquiries(),
        ]);
        setSavedListings(favRes.data);
        setInquiries(inqRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Welcome header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>My Dashboard</p>
            <h1 style={styles.heading}>
              Welcome back, {user?.full_name?.split(" ")[0] || "there"}
            </h1>
            <p style={styles.subtext}>
              {user?.email} · Member since {joinedDate}
            </p>
          </div>
          <Link to="/listings" style={styles.browseButton}>
            Browse Listings
          </Link>
        </div>

        {/* Stats cards */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{savedListings.length}</span>
            <span style={styles.statLabel}>Saved Properties</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{inquiries.length}</span>
            <span style={styles.statLabel}>Inquiries Sent</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {inquiries.filter((i) => i.status === "replied").length}
            </span>
            <span style={styles.statLabel}>Replies Received</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("saved")}
            style={
              activeTab === "saved" ? styles.tabActive : styles.tabInactive
            }
          >
            Saved Properties
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            style={
              activeTab === "inquiries" ? styles.tabActive : styles.tabInactive
            }
          >
            My Inquiries
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            style={
              activeTab === "profile" ? styles.tabActive : styles.tabInactive
            }
          >
            Account Settings
          </button>
        </div>

        {/* Tab content */}
        <div style={styles.tabContent}>
          {/* Saved Properties */}
          {activeTab === "saved" && (
            <div>
              {loading ? (
                <p style={{ color: "#64748B" }}>Loading saved properties...</p>
              ) : savedListings.length > 0 ? (
                <div style={styles.savedGrid}>
                  {savedListings.map((item) => (
                    <Link
                      key={item.id}
                      to={`/listings/${item.listing_id}`}
                      style={styles.savedCard}
                    >
                      <div style={styles.savedImagePlaceholder} />
                      <div style={styles.savedInfo}>
                        <p style={styles.savedPrice}>{item.price}</p>
                        <h3 style={styles.savedTitle}>{item.title}</h3>
                        <p style={styles.savedLocation}>{item.location}</p>
                        <p style={styles.savedMeta}>
                          {item.bedrooms} Beds · {item.bathrooms} Baths
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>
                    You haven't saved any properties yet.
                  </p>
                  <Link to="/listings" style={styles.emptyLink}>
                    Browse listings →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Inquiries */}
          {activeTab === "inquiries" && (
            <div>
              {loading ? (
                <p style={{ color: "#64748B" }}>Loading inquiries...</p>
              ) : inquiries.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Property</th>
                      <th style={styles.th}>Agent</th>
                      <th style={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td style={styles.td}>{inquiry.listing_title}</td>
                        <td style={styles.td}>{inquiry.agent_name}</td>
                        <td style={styles.td}>
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>
                    You haven't sent any inquiries yet.
                  </p>
                  <Link to="/agents" style={styles.emptyLink}>
                    Find an agent →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Account Settings */}
          {activeTab === "profile" && (
            <div style={styles.profileSection}>
              <h2 style={styles.profileHeading}>Account Settings</h2>
              <p style={styles.profileNote}>
                Profile editing will be available in a future update.
              </p>
              <div style={styles.profileFields}>
                <div style={styles.profileField}>
                  <label style={styles.profileLabel}>Full name</label>
                  <input
                    type="text"
                    defaultValue={user?.full_name}
                    disabled
                    style={styles.profileInput}
                  />
                </div>
                <div style={styles.profileField}>
                  <label style={styles.profileLabel}>Email address</label>
                  <input
                    type="text"
                    defaultValue={user?.email}
                    disabled
                    style={styles.profileInput}
                  />
                </div>
                <div style={styles.profileField}>
                  <label style={styles.profileLabel}>Role</label>
                  <input
                    type="text"
                    defaultValue={user?.role}
                    disabled
                    style={styles.profileInput}
                  />
                </div>
              </div>
              <button style={styles.disabledButton} disabled>
                Save Changes (coming soon)
              </button>
            </div>
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
    padding: "50px 20px 80px",
  },
  container: {
    maxWidth: "1000px",
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
  browseButton: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
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
  tabContent: {
    paddingTop: "8px",
  },
  savedGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  savedCard: {
    textDecoration: "none",
    color: "inherit",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
    overflow: "hidden",
    width: "280px",
  },
  savedImagePlaceholder: {
    width: "100%",
    height: "160px",
    backgroundColor: "#E2E8F0",
  },
  savedInfo: {
    padding: "16px",
  },
  savedPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#C29A4B",
    margin: "0 0 4px 0",
  },
  savedTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0F172A",
    margin: "0 0 4px 0",
  },
  savedLocation: {
    fontSize: "13px",
    color: "#64748B",
    margin: "0 0 6px 0",
  },
  savedMeta: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    margin: 0,
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
  profileSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: "32px",
    maxWidth: "500px",
  },
  profileHeading: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 8px 0",
  },
  profileNote: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 24px 0",
  },
  profileFields: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  profileField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  profileLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0F172A",
  },
  profileInput: {
    padding: "11px 14px",
    fontSize: "14px",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    backgroundColor: "#F8FAFC",
    color: "#94A3B8",
  },
  disabledButton: {
    padding: "12px 24px",
    backgroundColor: "#E2E8F0",
    color: "#94A3B8",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
};

export default CustomerDashboard;
