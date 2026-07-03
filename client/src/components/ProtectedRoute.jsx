import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const adminKey = sessionStorage.getItem("ADMIN_KEY");

  if (!adminKey) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
