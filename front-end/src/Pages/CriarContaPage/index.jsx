import React from "react";
import Header from "../../Components/Header"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import callout from '../../services/api';
import Footer from "../../Components/Footer"
import './Style.css';

export default function CriarConta() {

    // Código para fazer o login

    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [contaCriada, setContaCriada] = useState("");

    const handleCriarConta = async () => {
        setErro("");

        let pessoaData = {};
        pessoaData.nome = nome;
        pessoaData.sobrenome = sobrenome;
        pessoaData.dataNascimento = nascimento;
        pessoaData.telefone = telefone;

        const tipo = 'Pessoa';

        callout.post('http://localhost:5000/usuarios/registrar', { email, senha, tipo, pessoaData })
            .then(response => {
                setContaCriada(true)
            })
            .catch(error => {
                if (error.response) {
                    setErro(error.response.data.error);
                } else {
                    setErro("Erro ao conectar com o servidor")
                }
            });

    };

    const formatarTelefone = (valor) => {
        let input = valor.replace(/\D/g, '');

        if (input.length > 11) input = input.slice(0, 11);

        let formatted = '';

        if (input.length > 0) {
            formatted += '(' + input.substring(0, 2);
        }
        if (input.length >= 3) {
            formatted += ') ' + input.substring(2, 7);
        }
        if (input.length >= 8) {
            formatted += '-' + input.substring(7);
        }

        return formatted;
    };

    const handleChangeTelefone = (e) => {
        const valorFormatado = formatarTelefone(e.target.value);
        setTelefone(valorFormatado);
    };

    useEffect(() => {
        setContaCriada(false)
    }, []);

    return (
        <div className="criar-conta-page">
            <div className="criar-conta-container">
                <div className="criar-conta-logo">
                    <img className="criar-conta-logo-img" src="img/logo-rolle-choose.png" alt="Logo" />
                </div>
                <div className="criar-conta-body">

                    {!contaCriada ? (

                        <div className="criar-conta-form">
                            <p className="title-font criar-conta-title">Só precisamos de alguns dados...</p>
                            {erro && <p style={{ color: "red" }}>{erro}</p>}
                            <div className="criar-conta-nomecompleto-div">
                                <input className="input-criar-conta criar-conta-nome" type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
                                <input className="input-criar-conta criar-conta-sobrenome" type="text" placeholder="Sobrenome" onChange={(e) => setSobrenome(e.target.value)} />
                            </div>
                            <div className="criar-conta-dataNascimento-div">
                                Data de nascimento:
                                <input className="input-criar-conta criar-conta-nascimento" type="date" placeholder="Data de nascimento" onChange={(e) => setNascimento(e.target.value)} />
                            </div>
                            <input className="input-criar-conta criar-conta-email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            <input className="input-criar-conta criar-conta-telefone"
                                type="tel"
                                value={telefone}
                                onChange={handleChangeTelefone}
                                placeholder="(11) 91234-5678"
                                maxLength={15}
                            />
                            <input className="input-criar-conta criar-conta-senha" type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
                            <button className="button criar-conta-button" onClick={handleCriarConta}>Criar conta</button>
                        </div>) : (
                        <div className="criar-conta-contaCriada">
                            <h1>Conta criada com sucesso!</h1>
                            <p>Você já pode acessar o aplicativo pela página de login</p>
                            <Link to="/"><button className="button voltar-login-button">Voltar para a página de login </button></Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>

    );
}