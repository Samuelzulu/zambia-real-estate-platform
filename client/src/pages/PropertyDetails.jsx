import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getListingById,
  getAgentById,
  createInquiry,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/api";
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

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useRole();

  const [property, setProperty] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [savePending, setSavePending] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inquiry, setInquiry] = useState({ name: "", email: "", message: "" });
  const [inquiryErrors, setInquiryErrors] = useState({});
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const listingRes = await getListingById(id);
        setProperty(listingRes.data);

        if (listingRes.data.agent_id) {
          try {
            const agentRes = await getAgentById(listingRes.data.agent_id);
            setAgent(agentRes.data.agent);
          } catch {
            setAgent(null);
          }
        }

        if (user && role === "customer") {
          try {
            const favRes = await getFavorites();
            setSaved(
              favRes.data.some(
                (f) => f.listing_id === Number(listingRes.data.id),
              ),
            );
          } catch {
            // non-critical
          }
        }
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Property not found."
            : "Failed to load property.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, role]);

  const handleSaveToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSavePending(true);
    try {
      if (saved) {
        await removeFavorite(property.id);
        setSaved(false);
      } else {
        await addFavorite(property.id);
        setSaved(true);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    } finally {
      setSavePending(false);
    }
  };

  const handleContactClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setModalOpen(true);
  };

  const validateInquiry = () => {
    const errs = {};
    if (!inquiry.name.trim()) errs.name = "Name is required";
    if (!inquiry.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(inquiry.email))
      errs.email = "Enter a valid email";
    if (!inquiry.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const errs = validateInquiry();
    if (Object.keys(errs).length > 0) {
      setInquiryErrors(errs);
      return;
    }
    setInquiryErrors({});
    try {
      await createInquiry({
        listing_id: property.id,
        message: inquiry.message,
      });
      setInquirySent(true);
    } catch (err) {
      setInquiryErrors({
        general: err.response?.data?.error || "Failed to send inquiry",
      });
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ color: "#64748B" }}>Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={{ color: "#0F172A" }}>{error || "Property not found."}</h1>
          <Link to="/listings" style={styles.backLink}>
            ← Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0 ? property.images : null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <Link to="/listings" style={styles.backLink}>
          ← Back to Listings
        </Link>

        {/* Main layout */}
        <div style={styles.layout}>
          {/* Left — Image gallery */}
          <div style={styles.gallerySection}>
            <div style={styles.mainImageWrapper}>
              {images ? (
                <>
                  <img
                    src={images[activeImage].url}
                    alt={images[activeImage].label || property.title}
                    style={styles.mainImage}
                  />
                  {images[activeImage].label && (
                    <span style={styles.imageLabel}>
                      {images[activeImage].label}
                    </span>
                  )}
                </>
              ) : (
                <div style={styles.noImagePlaceholder}>
                  <span style={styles.noImageText}>No photos yet</span>
                </div>
              )}
            </div>
            {images && images.length > 1 && (
              <div style={styles.thumbnailRow}>
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setActiveImage(i)}
                    style={{
                      ...styles.thumbnail,
                      border:
                        activeImage === i
                          ? "2px solid #C29A4B"
                          : "2px solid transparent",
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.label || ""}
                      style={styles.thumbImage}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Property info */}
          <div style={styles.infoSection}>
            <p style={styles.eyebrow}>Property Details</p>
            <h1 style={styles.title}>{property.title}</h1>
            <p style={styles.price}>{property.price}</p>

            {/* Meta */}
            <div style={styles.metaRow}>
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>🛏</span>
                <span style={styles.metaText}>
                  {property.bedrooms} Bedrooms
                </span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>🚿</span>
                <span style={styles.metaText}>
                  {property.bathrooms} Bathrooms
                </span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>📍</span>
                <span style={styles.metaText}>{property.location}</span>
              </div>
              {property.square_footage && (
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>📐</span>
                  <span style={styles.metaText}>
                    {property.square_footage} sq ft
                  </span>
                </div>
              )}
              {property.year_built && (
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>🏗</span>
                  <span style={styles.metaText}>
                    Built {property.year_built}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p style={styles.description}>
              {property.description ||
                "This property is a great option for buyers looking for comfort, convenience, and a strong location in Zambia."}
            </p>

            {/* Action buttons */}
            <div style={styles.buttonRow}>
              <button onClick={handleContactClick} style={styles.primaryButton}>
                Contact Agent
              </button>
              <button
                onClick={handleSaveToggle}
                disabled={savePending}
                style={{
                  ...styles.saveButton,
                  backgroundColor: saved ? "#FFF1F2" : "#FFFFFF",
                  borderColor: saved ? "#EF4444" : "#CBD5E1",
                  color: saved ? "#EF4444" : "#64748B",
                  opacity: savePending ? 0.6 : 1,
                }}
              >
                {saved ? "♥ Saved" : "♡ Save"}
              </button>
            </div>

            {/* Agent preview card */}
            {agent && (
              <div style={styles.agentCard}>
                {agent.photo_url ? (
                  <img
                    src={agent.photo_url}
                    alt={agent.full_name}
                    style={styles.agentAvatar}
                  />
                ) : (
                  <div style={styles.agentAvatarFallback}>
                    {initials(agent.full_name)}
                  </div>
                )}
                <div style={styles.agentInfo}>
                  <p style={styles.agentLabel}>Listed by</p>
                  <p style={styles.agentName}>{agent.full_name}</p>
                  <p style={styles.agentAgency}>
                    {agent.agency || "Independent Agent"}
                  </p>
                </div>
                <Link to={`/agents/${agent.id}`} style={styles.viewProfileLink}>
                  View Profile →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {!inquirySent ? (
              <>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Contact Agent</h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    style={styles.closeButton}
                  >
                    ✕
                  </button>
                </div>
                <p style={styles.modalSubtext}>
                  Send an inquiry about <strong>{property.title}</strong>
                </p>

                <form onSubmit={handleInquirySubmit} style={styles.modalForm}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Your name</label>
                    <input
                      type="text"
                      value={inquiry.name}
                      onChange={(e) =>
                        setInquiry({ ...inquiry, name: e.target.value })
                      }
                      placeholder="John Banda"
                      style={{
                        ...styles.input,
                        border: inquiryErrors.name
                          ? "1px solid #EF4444"
                          : "1px solid #CBD5E1",
                      }}
                    />
                    {inquiryErrors.name && (
                      <p style={styles.errorText}>{inquiryErrors.name}</p>
                    )}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Your email</label>
                    <input
                      type="text"
                      value={inquiry.email}
                      onChange={(e) =>
                        setInquiry({ ...inquiry, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      style={{
                        ...styles.input,
                        border: inquiryErrors.email
                          ? "1px solid #EF4444"
                          : "1px solid #CBD5E1",
                      }}
                    />
                    {inquiryErrors.email && (
                      <p style={styles.errorText}>{inquiryErrors.email}</p>
                    )}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Message</label>
                    <textarea
                      value={inquiry.message}
                      onChange={(e) =>
                        setInquiry({ ...inquiry, message: e.target.value })
                      }
                      placeholder={`Hi, I'm interested in ${property.title}. Could we arrange a viewing?`}
                      rows={4}
                      style={{
                        ...styles.input,
                        resize: "vertical",
                        border: inquiryErrors.message
                          ? "1px solid #EF4444"
                          : "1px solid #CBD5E1",
                      }}
                    />
                    {inquiryErrors.message && (
                      <p style={styles.errorText}>{inquiryErrors.message}</p>
                    )}
                  </div>

                  {inquiryErrors.general && (
                    <p style={styles.errorText}>{inquiryErrors.general}</p>
                  )}

                  <button type="submit" style={styles.submitButton}>
                    Send Inquiry
                  </button>
                </form>
              </>
            ) : (
              <div style={styles.successState}>
                <p style={styles.successIcon}>✓</p>
                <h2 style={styles.successTitle}>Inquiry Sent!</h2>
                <p style={styles.successText}>
                  Your message has been sent
                  {agent ? ` to ${agent.full_name}` : ""}. They will get back to
                  you at {inquiry.email}.
                </p>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setInquirySent(false);
                    setInquiry({ name: "", email: "", message: "" });
                  }}
                  style={styles.submitButton}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    padding: "40px 20px 90px",
  },
  container: {
    maxWidth: "1100px",
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
  layout: {
    display: "flex",
    gap: "48px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  gallerySection: {
    flex: "1",
    minWidth: "320px",
  },
  mainImageWrapper: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  mainImage: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    display: "block",
  },
  noImagePlaceholder: {
    width: "100%",
    height: "420px",
    backgroundColor: "#E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    fontSize: "15px",
    color: "#94A3B8",
    fontWeight: "600",
  },
  imageLabel: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    backgroundColor: "rgba(15,23,42,0.6)",
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  thumbnailRow: {
    display: "flex",
    gap: "10px",
  },
  thumbnail: {
    width: "80px",
    height: "60px",
    borderRadius: "8px",
    overflow: "hidden",
    padding: 0,
    cursor: "pointer",
    background: "none",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  infoSection: {
    flex: "1",
    minWidth: "300px",
  },
  eyebrow: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#C29A4B",
    fontWeight: "700",
    margin: "0 0 10px 0",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: "1.2",
    margin: "0 0 12px 0",
  },
  price: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#C29A4B",
    margin: "0 0 20px 0",
  },
  metaRow: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "24px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  metaIcon: {
    fontSize: "18px",
  },
  metaText: {
    fontSize: "16px",
    color: "#475569",
    fontWeight: "500",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#475569",
    margin: "0 0 28px 0",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "13px 28px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  saveButton: {
    padding: "13px 20px",
    border: "1px solid",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  agentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  agentAvatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  agentAvatarFallback: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    flexShrink: 0,
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
  },
  agentInfo: {
    flex: 1,
  },
  agentLabel: {
    fontSize: "12px",
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 2px 0",
  },
  agentName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 2px 0",
  },
  agentAgency: {
    fontSize: "13px",
    color: "#C29A4B",
    fontWeight: "600",
    margin: 0,
  },
  viewProfileLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0F172A",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15,23,42,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 300,
    padding: "20px",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "18px",
    color: "#64748B",
    cursor: "pointer",
    padding: "4px",
  },
  modalSubtext: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 24px 0",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0F172A",
  },
  input: {
    padding: "11px 14px",
    fontSize: "14px",
    borderRadius: "10px",
    outline: "none",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  errorText: {
    fontSize: "12px",
    color: "#EF4444",
    margin: "2px 0 0 0",
  },
  submitButton: {
    padding: "13px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
  },
  successState: {
    textAlign: "center",
    padding: "16px 0",
  },
  successIcon: {
    fontSize: "48px",
    color: "#22C55E",
    margin: "0 0 12px 0",
  },
  successTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 10px 0",
  },
  successText: {
    fontSize: "15px",
    color: "#64748B",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
  },
};

export default PropertyDetails;
