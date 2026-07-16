import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Automatically attach token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Listings
export const getListings = () => API.get("/listings");
export const getListingById = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post("/listings", data);
export const updateListing = (id, data) => API.put(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);

// Agents
export const getAgents = () => API.get("/agents");
export const getAgentById = (id) => API.get(`/agents/${id}`);
export const updateAgentProfile = (data) => API.put("/agents/profile", data);

// Inquiries
export const createInquiry = (data) => API.post("/inquiries", data);
export const getMyInquiries = () => API.get("/inquiries/my");
export const getAgentInquiries = () => API.get("/inquiries/agent");

// Favorites
export const addFavorite = (listing_id) =>
  API.post("/favorites", { listing_id });
export const getFavorites = () => API.get("/favorites");
export const removeFavorite = (listing_id) =>
  API.delete(`/favorites/${listing_id}`);

// Reports
export const createReport = (data) => API.post("/reports", data);

// Admin
export const getPendingAgents = () => API.get("/agents/admin/pending");
export const verifyAgent = (id, verified) =>
  API.put(`/agents/admin/${id}/verify`, { verified });
export const getAllReports = () => API.get("/reports");
export const updateReportStatus = (id, status) =>
  API.put(`/reports/${id}`, { status });

export default API;
