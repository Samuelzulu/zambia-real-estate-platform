import AgentCard from "../components/AgentCard";
import { getAgents } from "../services/api";
import { useState, useEffect } from "react";

function AgentDirectory() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterLocation, setFilterLocation] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await getAgents();
        setAgents(res.data);
      } catch (err) {
        setError("Failed to load agents");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const locations = [...new Set(agents.map((a) => a.location))].sort();

  const filtered = agents.filter((agent) => {
    const matchesSearch =
      agent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = filterVerified ? agent.verified : true;
    const matchesLocation = filterLocation
      ? agent.location === filterLocation
      : true;
    return matchesSearch && matchesVerified && matchesLocation;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Find Your Agent</p>
          <h1 style={styles.heading}>Agent Directory</h1>
          <p style={styles.subtext}>
            Browse verified real estate agents across Zambia.
          </p>
        </div>

        {loading && <p style={{ color: "#64748B" }}>Loading agents...</p>}
        {error && <p style={{ color: "#EF4444" }}>{error}</p>}

        {/* Filters */}
        <div style={styles.filtersRow}>
          <input
            type="text"
            placeholder="Search by name or agency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={styles.select}
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filterVerified}
              onChange={(e) => setFilterVerified(e.target.checked)}
              style={styles.checkbox}
            />
            Verified only
          </label>
        </div>

        {/* Results count */}
        <p style={styles.resultCount}>
          {filtered.length} agent{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Agent list */}
        {filtered.length > 0 ? (
          <div style={styles.list}>
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <p style={styles.noResults}>No agents found matching your search.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
    padding: "60px 20px 80px",
  },
  container: {
    maxWidth: "860px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  eyebrow: {
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#C29A4B",
    fontWeight: "700",
    margin: "0 0 10px 0",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 12px 0",
  },
  subtext: {
    fontSize: "17px",
    color: "#64748B",
    margin: 0,
  },
  filtersRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "16px",
  },
  searchInput: {
    flex: 1,
    minWidth: "200px",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    outline: "none",
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
  },
  select: {
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    outline: "none",
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
    cursor: "pointer",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#0F172A",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  resultCount: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 20px 0",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  noResults: {
    fontSize: "16px",
    color: "#475569",
  },
};

export default AgentDirectory;
