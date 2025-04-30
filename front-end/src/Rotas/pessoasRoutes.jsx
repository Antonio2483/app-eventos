import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PessoaRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/login" />;
    if (user.tipo !== "Pessoa") return <Navigate to="/logon" />;
    return <Outlet />;
};

export default PessoaRoute;