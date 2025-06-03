import React, { useState, useEffect } from "react";
import './Style.css';
import callout from '../../services/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { geocodeAddress } from '../../utils/geocode';


export default function Perfil() {
    const [user, setUser] = useState([]);
    const [edicao, setEdicao] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [cep, setCep] = useState("");
    const [erro, setErro] = useState("");

    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [celular, setCelular] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [emailResponsavel, setEmailResponsavel] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [rua, setRua] = useState('');
    const [complemento, setComplemento] = useState('');
    const [site, setSite] = useState('');
    const [formEnviado, setFormEnviado] = useState(false);
    const [coordenadas, setCoordenadas] = useState([]);

    useEffect(() => {
        obterDadosConta();
    }, []);

    const obterDadosConta = async () => {
        callout.get('http://localhost:5000/usuarios/obterUsuario')
            .then(response => {
                console.log("USUÁRIO: ", response.data)

                const data = response.data;

                if (data.tipo == "Pessoa") {

                    const nascimento = new Date(data.pessoaData?.dataNascimento);

                    console.log("nascimento: ", nascimento)
                    const hoje = new Date();
                    let idade = hoje.getFullYear() - nascimento.getFullYear();
                    const m = hoje.getMonth() - nascimento.getMonth();
                    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
                        idade--;
                    }

                    console.log("idade: ", idade)
                    setUser({ data, idade })

                } else {
                    setUser({ data })
                }
            })
            .catch(error => console.error('Erro ao buscar usuario:', error));
    };

    const handleCepChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número

        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }

        setCep(value);
    };

    const handleChangeTelefone = (e) => {
        let input = e.target.value;

        input = input.replace(/\D/g, '');

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

        setTelefone(formatted);
    };

    const handleChangeCelular = (e) => {
        let input = e.target.value;

        input = input.replace(/\D/g, '');

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

        setCelular(formatted);
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

    const handleEdicaoPessoa = (event) => {
        setEdicao(true);
        setNome(user.data?.pessoaData?.nomeCompleto)
        setEmail(user.data?.email)
        setNascimento(user.data?.pessoaData?.dataNascimento
            ? new Date(user.data.pessoaData.dataNascimento).toISOString().slice(0, 10)
            : '')
        setTelefone(user.data?.pessoaData?.telefone)
        setCidade(user.data?.pessoaData?.endereco?.cidade)
        setEstado(user.data?.pessoaData?.endereco?.estado)
        setCep(user.data?.pessoaData?.endereco?.cep)
    };

    const handleCancelarPessoa = (event) => {
        setEdicao(false);
        setNome("")
        setEmail("")
        setNascimento("")
        setTelefone("")
        setCidade("")
        setEstado("")
        setCep("")
        setErro("");
    };

    const handleSalvarPessoa = (event) => {
        if (!nome) {
            setErro("Campo nome é obrigatório");
            return;
        }
        if (!email) {
            setErro("Campo email é obrigatório");
            return;
        }
        if (!nascimento) {
            setErro("Campo data de nascimento é obrigatório");
            return;
        }
        if (!telefone || telefone.length < 15) {
            setErro("Campo telefone é obrigatório");
            return;
        }
        if (!cidade) {
            setErro("Campo cidade é obrigatório");
            return;
        }
        if (!estado) {
            setErro("Campo estado é obrigatório");
            return;
        }
        if (!cep || cep.length < 9) {
            setErro("Campo cep é obrigatório");
            return;
        }

        atualizarUsuario();
    };

    const handleEdicaoEmpresa = (event) => {
        setEdicao(true);
        setNomeFantasia(user.data?.empresaData?.nomeFantasia);
        setNomeEmpresa(user.data?.empresaData?.nomeEmpresa);
        setCnpj(user.data?.empresaData?.cnpj)
        setEmailResponsavel(user.data?.empresaData?.emailResponsavel);
        setCidade(user.data?.empresaData?.localizacao?.endereco?.cidade);
        setEstado(user.data?.empresaData?.localizacao?.endereco?.estado);
        setRua(user.data?.empresaData?.localizacao?.endereco?.rua);
        setBairro(user.data?.empresaData?.localizacao?.endereco?.bairro);
        setNumero(user.data?.empresaData?.localizacao?.endereco?.numero);
        setComplemento(user.data?.empresaData?.localizacao?.endereco?.complemento);
        setCelular(user.data?.empresaData?.celular);
        setTelefone(user.data?.empresaData?.telefone);
        setSite(user.data?.empresaData?.site);
    };

    const handleCancelarEmpresa = (event) => {
        setEdicao(false);
        setNomeFantasia("");
        setNomeEmpresa("");
        setCnpj("")
        setEmailResponsavel("");
        setCidade("");
        setEstado("");
        setRua("");
        setBairro("");
        setNumero("");
        setComplemento("");
        setCelular("");
        setTelefone("");
        setSite("");
        setErro("");
    };

    const handleSalvarEmpresa = async (event) => {
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
        if (!emailResponsavel) {
            setErro("Email do responsável é obrigatório")
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




        try {

            const endereco = `${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}, ${cep}, Brasil`;

            const coordenadas = await geocodeAddress(endereco);

            setCoordenadas([coordenadas.longitude, coordenadas.latitude]);

            if (coordenadas) {
                setCoordenadas([coordenadas.longitude, coordenadas.latitude]);

                atualizarUsuario([coordenadas.longitude, coordenadas.latitude]);

            } else {
                setErro("Não foi possível obter as coordenadas.");
            }
        } catch (erro) {
            console.error("Erro ao geocodificar o endereço:", erro);
            setErro("Ocorreu um erro ao verificar o endereço")
            // Aqui também pode exibir uma mensagem de erro para o usuário
        }


    };

    const atualizarUsuario = async (coordenadas) => {
        let pessoaData = {};
        let empresaData = {};

        if (user.data?.tipo == "Pessoa") {
            pessoaData.nomeCompleto = nome;
            pessoaData.dataNascimento = nascimento;
            pessoaData.telefone = telefone;

            let endereco = {};

            endereco.cidade = cidade;
            endereco.estado = estado;
            endereco.cep = cep;

            pessoaData.endereco = endereco;
        } else {
            empresaData.nomeFantasia = nomeFantasia
            empresaData.nomeEmpresa = nomeEmpresa
            empresaData.emailResponsavel = emailResponsavel
            empresaData.celular = celular
            empresaData.telefone = telefone
            empresaData.site = site
            empresaData.cnpj = cnpj

            let localizacao = {};
            localizacao.coordinates = coordenadas;
            localizacao.type = "Point";

            let endereco = {};
            endereco.numero = numero;
            endereco.bairro = bairro;
            endereco.cidade = cidade;
            endereco.estado = estado;
            endereco.cep = cep;
            endereco.rua = rua;
            endereco.pais = "Brasil";
            endereco.complemento = complemento;

            localizacao.endereco = endereco;

            empresaData.localizacao = localizacao;
        }

        callout.put('http://localhost:5000/usuarios/atualizar', { email, pessoaData, empresaData })
            .then(response => {
                handleCancelarPessoa();
                handleCancelarEmpresa();
                obterDadosConta();
            })
            .catch(error => { console.error('Erro ao buscar atualizar usuario:', error); setErro("Erro ao atualizar o usuário") });
    };


    return (
        <div className="perfil-container">
            <div className="perfil-body">
                <img src='/img/user-template.png' className='perfil-img'></img>
                {user.data?.tipo == "Pessoa" ? (
                    <>
                        {!edicao ? (
                            // Parte que mostra os dados
                            <table>
                                <tr>
                                    <td colSpan={2} className='perfil-nomeUsuario'>
                                        {user.data?.pessoaData?.nomeCompleto} <button className='perfil-editar-button' style={{ color: "gray" }} onClick={handleEdicaoPessoa}><FontAwesomeIcon icon={faPencil} /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Email
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.email}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Idade
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.idade}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Telefone
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.pessoaData?.telefone}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Cidade:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.pessoaData?.endereco?.cidade}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Estado:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.pessoaData?.endereco?.estado}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        CEP:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.pessoaData?.endereco?.cep}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className='perfil-td-botao-membro'>
                                        <Link to="/torne-se-membro"><button className='perfil-botao'>Torne-se um membro</button></Link>
                                    </td>
                                </tr>
                            </table>
                        ) : (
                            // Parte da edição
                            <table>
                                <tr>
                                    <td colSpan={2} className='perfil-nomeUsuario'>
                                        <input
                                            className="input-atualizar-conta"
                                            type="text"
                                            placeholder="Nome completo"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td className='perfil-td-direita'>
                                        <input
                                            className="input-atualizar-conta"
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Data de nascimento</td>
                                    <td className='perfil-td-direita'>
                                        <input
                                            className="input-atualizar-conta"
                                            type="date"
                                            placeholder="Data de nascimento"
                                            value={nascimento}
                                            onChange={(e) => setNascimento(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Telefone</td>
                                    <td className='perfil-td-direita'>
                                        <input
                                            className="input-atualizar-conta"
                                            type="text"
                                            placeholder="Telefone"
                                            value={telefone}
                                            maxLength={15}
                                            onChange={handleChangeTelefone}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Cidade:</td>
                                    <td className='perfil-td-direita'>
                                        <input
                                            className="input-atualizar-conta"
                                            type="text"
                                            placeholder="Cidade"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Estado:</td>
                                    <td className='perfil-td-direita'>
                                        <input
                                            className="input-atualizar-conta"
                                            type="text"
                                            placeholder="Estado"
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Cep:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="CEP" maxlength={9} value={cep} onChange={handleCepChange} />
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
                                    <td colSpan={2} className='perfil-td-botao-membro'>
                                        <button className='salvar-botao' onClick={handleSalvarPessoa}>Salvar</button>
                                        <button className='cancelar-botao' onClick={handleCancelarPessoa}>Cancelar</button>
                                    </td>
                                </tr>
                            </table>
                        )}
                    </>
                ) : (
                    <>
                        {!edicao ? (
                            // Parte empresa
                            <table>
                                <tr>
                                    <td colSpan={2} className='perfil-nomeUsuario'>
                                        {user.data?.empresaData?.nomeFantasia} <button className='perfil-editar-button' style={{ color: "gray" }} onClick={handleEdicaoEmpresa}><FontAwesomeIcon icon={faPencil} /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Nome da empresa:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.nomeEmpresa}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        CNPJ:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.cnpj}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Email do responsavel:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.emailResponsavel}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Cidade:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.localizacao?.endereco?.cidade}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Estado:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.localizacao?.endereco?.estado}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Rua:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.localizacao?.endereco?.rua}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Bairro:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.localizacao?.endereco?.bairro}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Numero:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.localizacao?.endereco?.numero}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Complemento:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.localizacao?.endereco?.complemento}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Celular para contato:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.celular}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Telefone:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.telefone}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Site:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        {user.data?.empresaData?.site}
                                    </td>
                                </tr>
                            </table>
                        ) : (
                            // Parte de edição empresa
                            <table>
                                <tr>
                                    <td colSpan={2} className='perfil-nomeUsuario'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Nome da empresa:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        CNPJ:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta"
                                            type="text"
                                            value={cnpj}
                                            onChange={handleCnpjChange}
                                            maxLength={18}
                                            placeholder="00.000.000/0000-00"
                                            inputMode="numeric" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Email do responsavel:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="email" placeholder="" value={emailResponsavel} onChange={(e) => setEmailResponsavel(e.target.value)} />

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Cidade:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Estado:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <select id="estado" name="estado" className="input-atualizar-conta form-membro-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
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
                                </tr>
                                <tr>
                                    <td>
                                        Rua:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={rua} onChange={(e) => setRua(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Bairro:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Numero:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={numero} onChange={(e) => setNumero(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Complemento:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Celular para contato:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" value={celular}
                                            onChange={handleChangeCelular}
                                            placeholder="(11) 91234-5678"
                                            maxLength={15} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Telefone:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" value={telefone}
                                            onChange={handleChangeTelefone}
                                            placeholder="(11) 91234-5678"
                                            maxLength={15} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Site:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="" value={site} onChange={(e) => setSite(e.target.value)} />
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
                                    <td colSpan={2} className='perfil-td-botao-membro'>
                                        <button className='salvar-botao' onClick={handleSalvarEmpresa}>Salvar</button>
                                        <button className='cancelar-botao' onClick={handleCancelarEmpresa}>Cancelar</button>
                                    </td>
                                </tr>
                            </table>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}