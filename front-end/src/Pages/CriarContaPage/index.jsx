import React from "react";
import Header from "../../Components/Header"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import callout from '../../services/api';
import Footer from "../../Components/Footer"
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function CriarConta() {

    // Código para fazer o login

    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [cep, setCep] = useState("");
    const [erro, setErro] = useState("");
    const [contaCriada, setContaCriada] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);


    const handleCriarConta = async () => {
        setErro("");

        let pessoaData = {};
        pessoaData.nomeCompleto = nome;
        pessoaData.dataNascimento = nascimento;
        pessoaData.telefone = telefone;

        let endereco = {};

        endereco.cep = cep;
        endereco.estado = estado;
        endereco.cidade = cidade;

        pessoaData.endereco = endereco;

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

    const handleCepChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número

        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }

        setCep(value);
    };

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
                            <input className="input-criar-conta criar-conta-email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            <div className="input-senha-container-criar-conta">
                                <input
                                    className="input-criar-conta criar-conta-senha"
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Senha"
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="toggle-senha-criar-conta"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    {mostrarSenha ? (<FontAwesomeIcon icon={faEye} />) : (<FontAwesomeIcon icon={faEyeSlash} />)}
                                </button>
                            </div>
                            <input className="input-criar-conta criar-conta-nome" type="text" placeholder="Nome Completo" onChange={(e) => setNome(e.target.value)} />
                            <div className="criar-conta-dataNascimento-div">
                                Data de nascimento:
                                <input className="input-criar-conta criar-conta-nascimento" type="date" placeholder="Data de nascimento" onChange={(e) => setNascimento(e.target.value)} />
                            </div>
                            <input className="input-criar-conta criar-conta-telefone"
                                type="tel"
                                value={telefone}
                                onChange={handleChangeTelefone}
                                placeholder="(11) 91234-5678"
                                maxLength={15}
                            />
                            <div className="criar-conta-endereco-div">
                                <input className="input-criar-conta criar-conta-cep" type="text" placeholder="CEP" maxlength="9" value={cep}
                                    onChange={handleCepChange} />
                                <div className="criar-conta-cidadeEstado-div">
                                    <select id="estado" name="estado" className="input-criar-conta criar-conta-estado" onChange={(e) => setEstado(e.target.value)}>
                                        <option value="" disabled selected>Estado</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                                    <input className="input-criar-conta criar-conta-cidade" type="text" placeholder="Cidade" onChange={(e) => setCidade(e.target.value)} />
                                </div>
                            </div>

                            <div className="criar-conta-buttons-container">
                                <button className="button criar-conta-button" onClick={handleCriarConta}>Criar conta</button>
                                <Link to="/"><button className="button voltar-login-button">Voltar</button></Link>
                            </div>
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