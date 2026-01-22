import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTokenExpiryTime, isTokenExpired } from "./checkToken";

export default function ProtectedRoute({ children }) {
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.user);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token || isTokenExpired(token)) {
			localStorage.removeItem("token");
			navigate("/login");
		} else {
			// auto-logout when token expires
			const expiryTime = getTokenExpiryTime(token);
			const timeout = expiryTime - Date.now();

			const timer = setTimeout(() => {
				localStorage.removeItem("token");
				navigate("/login");
			}, timeout);

			// Cleanup timer on unmount
			return () => clearTimeout(timer);
		}
	}, [navigate]);

	// Check user in Redux

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// All good: show protected content
	return children;
}
