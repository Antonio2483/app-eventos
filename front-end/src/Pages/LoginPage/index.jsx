import React from "react";
import Header from "../../Components/Header"
import {useAuth} from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../../services/api';

export default function Login() {

    // Código para fazer o login

    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleLogin = async () => {
        setErro("");
        try{
        const response = await api.post("/usuarios/login",{email,senha});
        
        login(response.data.auth);
        navigate("/eventos")
        }catch(error){
            if(error.response){
                setErro(error.response.data.error);
            }else{
                setErro("Erro ao conectar com o servidor")
            }
        }
    };

    return (
        <div>
            <p>PÁGINA DE LOGIN</p>
            {erro && <p style={{ color: "red" }}>{erro}</p>}
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
            <button onClick={handleLogin}>Entrar</button>

        </div>
    );
}