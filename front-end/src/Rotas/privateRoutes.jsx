import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    return user ? <Outlet /> : <Navigate to="/logon" />;
};

export default PrivateRoute;
