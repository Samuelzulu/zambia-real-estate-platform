import { Navigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

// Wrap any route that should only be reachable by specific roles.
// Not logged in -> /login. Logged in but wrong role -> their own
// dashboard, rather than a half-loaded page full of failed API calls.
function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useRole();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "agent")
      return <Navigate to="/agent-dashboard" replace />;
    if (user.role === "admin")
      return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/customer-dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
