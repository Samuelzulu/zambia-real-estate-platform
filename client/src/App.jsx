import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import AgentDirectory from "./pages/AgentDirectory";
import AgentProfile from "./pages/AgentProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import AdminDashboard from "./pages/AdminDashboard";
import VerificationReview from "./pages/VerificationReview";
import Reports from "./pages/Reports";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<PropertyDetails />} />
        <Route path="/agents" element={<AgentDirectory />} />
        <Route path="/agents/:id" element={<AgentProfile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />

        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/edit-listing" element={<EditListing />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/verification-review" element={<VerificationReview />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;

// import Listings from "./pages/Listings";

// function App() {
//   return <Listings />;
// }

// export default App;