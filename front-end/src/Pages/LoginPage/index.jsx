import React from "react";
import Header from "../../Components/Header"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from '../../services/api';
import Footer from "../../Components/Footer"
import './Style.css';

export default function Login() {

    // Código para fazer o login

    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleLogin = async () => {
        setErro("");
        try {
            const response = await api.post("/usuarios/login", { email, senha });

            login(response.data.auth);
            navigate("/logon")
        } catch (error) {
            console.log("EEEEERRRROOOO", error)
            if (error.response) {
                setErro(error.response.data.error);
            } else {
                setErro("Erro ao conectar com o servidor")
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-logo">
                    <img className="login-logo-img" src="img/logo-rolle-choose.png" alt="Logo" />
                </div>
                <div className="login-body">
                    <p className="title-font login-title">Vamos fazer um rápido Login...</p>
                    {erro && <p style={{ color: "red" }}>{erro}</p>}
                    <input className="input-login login-email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input className="input-login login-senha" type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
                    <div className="criar-conta-div">
                        <p><Link to="/CriarConta"><u>Criar uma conta</u></Link></p>
                    </div>
                    <button className="button login-button" onClick={handleLogin}>Entrar</button>
                </div>
            </div>
            <Footer />
        </div>

    );
}