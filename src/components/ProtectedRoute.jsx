import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  console.log("ProtectedRoute isLoggedIn:", isLoggedIn); // Log the value
  if (loading) {
    return <div>Loading...</div>; // Hoặc có thể dùng một component loading nào đó
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
