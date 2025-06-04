import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../context/AuthContext"
import './Style.css';

export default function LogoutButton() {

    const [erro, setErro] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setErro("");
        try {

            logout();
            navigate("/")
        } catch (error) {
            console.log("EEEEERRRROOOO", error)
            if (error.response) {
                alert("Ocorreu um erro ao deslogar!")
            } else {
                alert("Erro ao conectar com o servidor")
            }
        }
    };

    return (
        <div className="logout-container">
            <button className="logout-btn-icon" onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
        </div>
    );
}
