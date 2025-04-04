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

                    console.log("user: ", user)
                }
            })
            .catch(error => console.error('Erro ao buscar usuario:', error));
    }, []);

    return (
        <div className="perfil-container">
            <div className="perfil-body">
                <img src='/img/user-template.png' className='perfil-img'></img>
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
                            {user.data?.pessoaData?.cidade}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Estado:
                        </td>
                        <td className='perfil-td-direita'>
                            {user.data?.pessoaData?.estado}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    );
}