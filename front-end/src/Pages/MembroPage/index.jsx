import React, { useState, useEffect } from "react";
import './Style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import callout from '../../services/api';
import { geocodeAddress } from '../../utils/geocode';


//Components 
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";

export default function Membro() {
    const [telefone, setTelefone] = useState("");
    const [celular, setCelular] = useState("");
    const [erro, setErro] = useState("");
    const [cep, setCep] = useState('');
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [site, setSite] = useState('');
    const [formEnviado, setFormEnviado] = useState(false);
    const [coordenadas, setCoordenadas] = useState([]);



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

    const handleChangeCelular = (e) => {
        const valorFormatado = formatarTelefone(e.target.value);
        setCelular(valorFormatado);
    };

    const handleCepChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número

        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }

        setCep(value);
    };

    const handleCnpjChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número

        if (value.length > 2) {
            value = value.slice(0, 2) + '.' + value.slice(2);
        }
        if (value.length > 6) {
            value = value.slice(0, 6) + '.' + value.slice(6);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + '/' + value.slice(10);
        }
        if (value.length > 15) {
            value = value.slice(0, 15) + '-' + value.slice(15, 17);
        }

        setCnpj(value);
    };

    const handleEnviarForm = async (e) => {
        if (verificarValores()) {
            const endereco = `${numero}, ${bairro}, ${cidade}, ${estado}, ${cep}, Brasil`;

            try {
                const coordenadas = await geocodeAddress(endereco);

                if (coordenadas) {
                    let empresaData = {};
                    empresaData.nomeFantasia = nomeFantasia
                    empresaData.nomeEmpresa = nomeEmpresa
                    empresaData.emailResponsavel = email
                    empresaData.celular = celular
                    empresaData.telefone = telefone
                    empresaData.site = site
                    empresaData.cnpj = cnpj

                    let localizacao = {};
                    localizacao.coordinates = [coordenadas.longitude, coordenadas.latitude];

                    let endereco = {};
                    endereco.numero = numero;
                    endereco.bairro = bairro;
                    endereco.cidade = cidade;
                    endereco.estado = estado;
                    endereco.cep = cep;
                    endereco.pais = "Brasil";
                    endereco.complemento = complemento;

                    localizacao.endereco = endereco;

                    empresaData.localizacao = localizacao;

                    callout.post('http://localhost:5000/requisicoes/criarRequisicao', { empresaData })
                        .then(response => {
                            setFormEnviado(true);
                        })
                        .catch(error => {
                            if (error.response) {
                                setErro("correu um erro ao enviar a requisição");
                            } else {
                                setErro("Erro ao conectar com o servidor")
                            }
                        });
                } else {
                    setErro("Não foi possível obter as coordenadas.");
                }

            } catch (erro) {
                console.error("Erro ao geocodificar o endereço:", erro);
                setErro("Ocorreu um erro ao verificar o endereço")
                // Aqui também pode exibir uma mensagem de erro para o usuário
            }

        }
    };

    const verificarValores = () => {
        if (!nomeEmpresa) {
            setErro("Nome da empresa é obrigatório")
            return false;
        }
        if (!nomeFantasia) {
            setErro("Nome fantasia é obrigatório")
            return false;
        }
        if (!cnpj || cnpj.length < 18) {
            setErro("CNPJ é obrigatório")
            return false;
        }
        if (!email) {
            setErro("Email do responsável é obrigatório")
            return false;
        }
        if (!cep || cep.length < 9) {
            setErro("CEP é obrigatório")
            return false;
        }
        if (!estado) {
            setErro("Estado é obrigatório")
            return false;
        }
        if (!cidade) {
            setErro("Cidade é obrigatória")
            return false;
        }
        if (!bairro) {
            setErro("Bairro é obrigatório")
            return false;
        }
        if (!numero) {
            setErro("Número é obrigatório")
            return false;
        }
        if (!celular || celular.length < 15) {
            setErro("Celular para contato é obrigatório")
            return false;
        }
        if (!telefone || telefone.length < 15) {
            setErro("Telefone é obrigatório")
            return false;
        }
        if (nomeEmpresa && nomeFantasia && cnpj && email && cep && estado && cidade && bairro && numero && celular && telefone) {
            return true;
        }
    };


    return (
        <div className="membro-page">
            <Navbar />
            <Header title="Conte-nos um pouco sobre vocês!" />
            <main className="membro-content">
                <div className="membro-body">
                    {!formEnviado ? (
                        <table className="membro-form-table">
                            <tr>
                                <td colSpan={3} style={{ paddingRight: '15px' }}>
                                    <p>Nome da empresa*</p>
                                    <input className="input-form-membro" type="text" placeholder="" onChange={(e) => setNomeEmpresa(e.target.value)} />
                                </td>
                                <td colSpan={3}>
                                    <p>Nome Fantasia*</p>
                                    <input className="input-form-membro" type="text" placeholder="" onChange={(e) => setNomeFantasia(e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} style={{ paddingRight: '15px' }}>
                                    <p>CNPJ*</p>
                                    <input className="input-form-membro"
                                        type="text"
                                        value={cnpj}
                                        onChange={handleCnpjChange}
                                        maxLength={18}
                                        placeholder="00.000.000/0000-00"
                                        inputMode="numeric" />
                                </td>
                                <td colSpan={3}>
                                    <p>Email do responsavel*</p>
                                    <input className="input-form-membro" type="email" placeholder="" onChange={(e) => setEmail(e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ paddingRight: '15px' }} colSpan={2}>
                                    <p>CEP*</p>
                                    <input className="input-form-membro form-membro-cep" type="text" maxlength="9" placeholder="00000-000" value={cep}
                                        onChange={handleCepChange} />
                                </td>
                                <td style={{ paddingRight: '15px' }} colSpan={2}>
                                    <p>Estado*</p>
                                    <select id="estado" name="estado" className="input-form-membro form-membro-estado" onChange={(e) => setEstado(e.target.value)}>
                                        <option value="" disabled selected>---</option>
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
                                </td>
                                <td colSpan={2}>
                                    <p>Cidade*</p>
                                    <input className="input-form-membro" type="text" placeholder="" onChange={(e) => setCidade(e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ paddingRight: '15px' }} colSpan={2}>
                                    <p>Bairro*</p>
                                    <input className="input-form-membro" type="text" placeholder="" onChange={(e) => setBairro(e.target.value)} />
                                </td>
                                <td style={{ paddingRight: '15px' }} colSpan={2}>
                                    <p>Número*</p>
                                    <input className="input-form-membro" type="text" placeholder="" onChange={(e) => setNumero(e.target.value)} />
                                </td>
                                <td colSpan={2}>
                                    <p>Complemento(Opicional)</p>
                                    <input className="input-form-membro" type="text" placeholder="" onChange={(e) => setComplemento(e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ paddingRight: '15px' }}>
                                    <p>Celular para contato*</p>
                                    <input className="input-form-membro" type="text" value={celular}
                                        onChange={handleChangeCelular}
                                        placeholder="(11) 91234-5678"
                                        maxLength={15} />
                                </td>
                                <td colSpan={2} style={{ paddingRight: '15px' }}>
                                    <p>Telefone*</p>
                                    <input className="input-form-membro" type="text" value={telefone}
                                        onChange={handleChangeTelefone}
                                        placeholder="(11) 91234-5678"
                                        maxLength={15} />
                                </td>
                                <td colSpan={2}>
                                    <p>Site(Opicional)</p>
                                    <input className="input-form-membro" type="text" placeholder="" onChange={(e) => setSite(e.target.value)} />
                                </td>
                            </tr>
                            {erro &&
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center" }}>
                                        <p style={{ color: "red" }}>{erro}</p>
                                    </td>
                                </tr>
                            }
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center" }}>
                                    <button className="enviar-form-button" onClick={handleEnviarForm}>Enviar formulario</button>
                                </td>
                            </tr>
                        </table>
                    ) : (
                        <div className="membro-form-enviado">
                            <h1>formulario enviado com sucesso!</h1>
                            <p>Nós notificaremos caso o pedido for aprovado</p>
                        </div>
                    )}
                </div>
            </main>
            <Perfil />
        </div>
    );
}