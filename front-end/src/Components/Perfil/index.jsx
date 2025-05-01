import React, { useState, useEffect } from "react";
import './Style.css';
import callout from '../../services/api';

export default function Perfil() {
    const [user, setUser] = useState([]);

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
                    <table>
                        <tr>
                            <td colSpan={2} className='perfil-nomeUsuario'>
                                {user.data?.pessoaData?.nome} {user.data?.pessoaData?.sobrenome}
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
                    </table>
                ) : (
                    <table>
                        <tr>
                            <td colSpan={2} className='perfil-nomeUsuario'>
                             {user.data?.empresaData?.nomeFantasia}
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
                    </table>
                )}
            </div>
        </div>
    );
}