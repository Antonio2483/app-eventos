import React, { useState, useEffect } from "react";
import './Style.css';
import callout from '../../services/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

export default function Perfil() {
    const [user, setUser] = useState([]);
    const [edicao, setEdicao] = useState(false);

    useEffect(() => {
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
    }, []);

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
                                        {user.data?.pessoaData?.nomeCompleto} <button className='perfil-editar-button' style={{ color: "gray" }}><FontAwesomeIcon icon={faPencil} /></button>
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
                                        <input className="input-atualizar-conta" type="text" placeholder="Nome completo" value={user.data?.pessoaData?.nomeCompleto} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Email
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="email" placeholder="Email" value={user.data?.email} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Data de nascimento
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="date" placeholder="Data de nascimento" value={user.data?.pessoaData?.dataNascimento
                                            ? new Date(user.data.pessoaData.dataNascimento).toISOString().slice(0, 10)
                                            : ''
                                        } />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Telefone
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="Telefone" value={user.data?.pessoaData?.telefone} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Cidade:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="Cidade" value={user.data?.pessoaData?.endereco?.cidade} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Estado:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="Estado" value={user.data?.pessoaData?.endereco?.estado} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Cep:
                                    </td>
                                    <td className='perfil-td-direita'>
                                        <input className="input-atualizar-conta" type="text" placeholder="CEP" value={user.data?.pessoaData?.endereco?.cep} />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className='perfil-td-botao-membro'>
                                        <button className='salvar-botao'>Salvar</button>
                                        <button className='cancelar-botao'>Cancelar</button>
                                    </td>
                                </tr>
                            </table>
                        )}
                    </>
                ) : (
                    <table>
                        <tr>
                            <td colSpan={2} className='perfil-nomeUsuario'>
                                {user.data?.empresaData?.nomeFantasia} <button className='perfil-editar-button' style={{ color: "gray" }}><FontAwesomeIcon icon={faPencil} /></button>
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
                )}
            </div>
        </div>
    );
}