import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const EmpresaRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/login" />;
    if (user.tipo !== "Empresa") return <Navigate to="/logon" />;
    return <Outlet />;
};

export default EmpresaRoute;