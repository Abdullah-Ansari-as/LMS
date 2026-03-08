import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenExpired } from "./checkToken";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.user); 
  const token = localStorage.getItem("token");

  // console.log("allowedRoles", allowedRoles)

  const isAuthenticated = token && !isTokenExpired(token) && user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RoleProtectedRoute;