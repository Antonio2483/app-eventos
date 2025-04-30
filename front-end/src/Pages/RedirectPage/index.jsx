import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Redirect() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.tipo === "Pessoa") {
            navigate("/home");
        } else if (user.tipo === "Empresa") {
            navigate("/eventos/todos");
        } else {
            navigate("/acesso-negado"); // fallback
        }
    }, [user, navigate]);

    return null; // Ou pode mostrar "Carregando..." enquanto redireciona
}
