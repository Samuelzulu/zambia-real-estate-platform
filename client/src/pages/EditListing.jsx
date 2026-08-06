import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getListingById, updateListing, uploadImages } from "../services/api";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    property_type: "house",
    square_footage: "",
    year_built: "",
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await getListingById(id);
        const l = res.data;
        setForm({
          title: l.title || "",
          description: l.description || "",
          price: l.price || "",
          location: l.location || "",
          bedrooms: l.bedrooms || "",
          bathrooms: l.bathrooms || "",
          property_type: l.property_type || "house",
          square_footage: l.square_footage || "",
          year_built: l.year_built || "",
        });
        setImages(l.images || []);
      } catch (err) {
        setServerError("Failed to load listing");
      } finally {
        setFetching(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 6) {
      setUploadError("You can upload up to 6 photos per listing.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadImages(files);
      const newEntries = res.data.urls.map((url) => ({ url, label: "" }));
      setImages((prev) => [...prev, ...newEntries]);
    } catch (err) {
      setUploadError(
        err.response?.data?.error || "Failed to upload one or more photos",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url) => {
    setImages((prev) => prev.filter((img) => img.url !== url));
  };

  const updateLabel = (url, label) => {
    setImages((prev) =>
      prev.map((img) => (img.url === url ? { ...img, label } : img)),
    );
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.price) next.price = "Price is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.bedrooms) next.bedrooms = "Bedrooms is required";
    if (!form.bathrooms) next.bathrooms = "Bathrooms is required";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await updateListing(id, { ...form, images });
      navigate("/agent-dashboard");
    } catch (err) {
      setServerError(err.response?.data?.error || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ color: "#64748B" }}>Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/agent-dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>

        <div style={styles.header}>
          <p style={styles.eyebrow}>Agent Portal</p>
          <h1 style={styles.heading}>Edit Listing</h1>
          <p style={styles.subtext}>
            Update the details of your property listing.
          </p>
        </div>

        <div style={styles.card}>
          {serverError && <p style={styles.serverError}>{serverError}</p>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Photos */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Photos {images.length > 0 && `(${images.length}/6)`}
              </label>

              {images.length > 0 && (
                <div style={styles.photoGrid}>
                  {images.map((img) => (
                    <div key={img.url} style={styles.photoCard}>
                      <div style={styles.photoThumb}>
                        <img src={img.url} alt="" style={styles.photoImg} />
                        <button
                          type="button"
                          onClick={() => removeImage(img.url)}
                          style={styles.photoRemove}
                          aria-label="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        list="photo-label-suggestions"
                        value={img.label}
                        onChange={(e) => updateLabel(img.url, e.target.value)}
                        placeholder="Label (e.g. Living Room)"
                        style={styles.photoLabelInput}
                      />
                    </div>
                  ))}
                </div>
              )}
              <datalist id="photo-label-suggestions">
                <option value="Front View" />
                <option value="Living Room" />
                <option value="Primary Bedroom" />
                <option value="Secondary Bedroom" />
                <option value="Kitchen" />
                <option value="Bathroom" />
                <option value="Dining Room" />
                <option value="Exterior" />
                <option value="Garden / Yard" />
              </datalist>

              {images.length < 6 && (
                <label style={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                  <span style={styles.uploadText}>
                    {uploading
                      ? "Uploading..."
                      : "+ Add photos (up to 6, 5MB each)"}
                  </span>
                </label>
              )}
              {uploadError && <p style={styles.error}>{uploadError}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Property Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.title
                    ? "1px solid #EF4444"
                    : "1px solid #CBD5E1",
                }}
              />
              {errors.title && <p style={styles.error}>{errors.title}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                style={{
                  ...styles.input,
                  resize: "vertical",
                  border: errors.description
                    ? "1px solid #EF4444"
                    : "1px solid #CBD5E1",
                }}
              />
              {errors.description && (
                <p style={styles.error}>{errors.description}</p>
              )}
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Price (K)</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    border: errors.price
                      ? "1px solid #EF4444"
                      : "1px solid #CBD5E1",
                  }}
                />
                {errors.price && <p style={styles.error}>{errors.price}</p>}
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    border: errors.location
                      ? "1px solid #EF4444"
                      : "1px solid #CBD5E1",
                  }}
                />
                {errors.location && (
                  <p style={styles.error}>{errors.location}</p>
                )}
              </div>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Bedrooms</label>
                <input
                  name="bedrooms"
                  type="number"
                  value={form.bedrooms}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    border: errors.bedrooms
                      ? "1px solid #EF4444"
                      : "1px solid #CBD5E1",
                  }}
                />
                {errors.bedrooms && (
                  <p style={styles.error}>{errors.bedrooms}</p>
                )}
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Bathrooms</label>
                <input
                  name="bathrooms"
                  type="number"
                  value={form.bathrooms}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    border: errors.bathrooms
                      ? "1px solid #EF4444"
                      : "1px solid #CBD5E1",
                  }}
                />
                {errors.bathrooms && (
                  <p style={styles.error}>{errors.bathrooms}</p>
                )}
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Property Type</label>
                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Square footage and year built */}
            <div style={styles.row}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Square Footage</label>
                <input
                  name="square_footage"
                  type="number"
                  step="1"
                  min="0"
                  value={form.square_footage}
                  onChange={handleChange}
                  placeholder="e.g. 1450"
                  style={{ ...styles.input, border: "1px solid #CBD5E1" }}
                />
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Year Built</label>
                <input
                  name="year_built"
                  type="number"
                  value={form.year_built}
                  onChange={handleChange}
                  placeholder="e.g. 2018"
                  style={{ ...styles.input, border: "1px solid #CBD5E1" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
          </form>
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
    maxWidth: "760px",
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
  header: {
    marginBottom: "28px",
  },
  eyebrow: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#C29A4B",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 8px 0",
  },
  subtext: {
    fontSize: "15px",
    color: "#64748B",
    margin: 0,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
    padding: "36px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
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
  select: {
    padding: "11px 14px",
    fontSize: "14px",
    borderRadius: "10px",
    outline: "none",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    width: "100%",
    border: "1px solid #CBD5E1",
    fontFamily: "inherit",
  },
  error: {
    fontSize: "12px",
    color: "#EF4444",
    margin: "2px 0 0 0",
  },
  serverError: {
    fontSize: "14px",
    color: "#EF4444",
    backgroundColor: "#FFF1F2",
    border: "1px solid #FECDD3",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
  },
  button: {
    padding: "14px",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
    fontFamily: "inherit",
  },
  photoGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "10px",
  },
  photoCard: {
    width: "110px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  photoThumb: {
    position: "relative",
    width: "110px",
    height: "88px",
    borderRadius: "8px",
    overflow: "hidden",
  },
  photoImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  photoRemove: {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(15,23,42,0.75)",
    color: "#FFFFFF",
    fontSize: "11px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  photoLabelInput: {
    fontSize: "11px",
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #CBD5E1",
    outline: "none",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  uploadBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    borderRadius: "10px",
    border: "1px dashed #CBD5E1",
    backgroundColor: "#F8FAFC",
    cursor: "pointer",
  },
  uploadText: {
    fontSize: "14px",
    color: "#64748B",
    fontWeight: "600",
  },
};

export default EditListing;
