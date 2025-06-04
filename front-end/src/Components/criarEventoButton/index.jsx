import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faX } from '@fortawesome/free-solid-svg-icons'
import callout from '../../services/api';


export default function CriarEventoButton() {

    const [showModal, setShowModal] = useState(false);
    const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataTermino, setDataTermino] = useState("");
    const [mediaValor, setMediaValor] = useState("");
    const [gratuito, setGratuito] = useState(false);
    const [erro, setErro] = useState(false);

    const handleCriarEvento = (event) => {

        if (!dataInicio) {
            setErro("Campo data de início é obrigatório");
            return;
        }

        if (!dataTermino) {
            setErro("Campo data de término é obrigatório");
            return;
        }

        if (!gratuito && !mediaValor) {
            setErro("Campo média de valor é obrigatório");
            return;
        }

        if (!descricao) {
            setErro("Campo descrição é obrigatório");
            return;
        }

        if (dataInicio > dataTermino) {
            setErro("A data de início não pode ser depois da data de término");
            return;
        }

        callout.post('http://localhost:5000/eventos/criarEvento', { titulo, descricao, dataMarcada: dataInicio, dataTermino, mediaValor, gratuito })
            .then(response => {
                handleLimparFormEvento()
                setShowModalConfirmacao(true)
            })
            .catch(error => {
                if (error.response) {
                    setErro(error.response.data.error);
                } else {
                    setErro("Erro ao conectar com o servidor")
                }
            });
    };

    const handleLimparFormEvento = () => {
        setTitulo("");
        setDescricao("");
        setDataInicio("");
        setDataTermino("");
        setMediaValor("");
        setGratuito(false);
    };

    useEffect(() => {
        setShowModal(false)
        setShowModalConfirmacao(false)
    }, []);

    const handleGratuitoCheck = (event) => {

        if (event.target.checked) {
            setMediaValor("");
        }

        setGratuito(event.target.checked)
    };

    return (
        <div>
            <div className="CriarEventoButton-container">
                <button className='CriarEventoButton-icon' onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} /></button>

            </div>
            {showModal && (
                <div className='criarEventoModal-container'>
                    <div className="criarEventoModal-body">
                        <div className="criarEventoModal-header">
                            <div className="criarEventoModal-esquerda">
                                Criar evento
                            </div>
                            <div className="criarEventoModal-direita">
                                <button className='fecharModalButton-icon' onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faX} /></button>
                            </div>
                        </div>
                        <div className="criarEventoModal-content">
                            {erro && <p style={{ color: "red" }}>{erro}</p>}
                            <table className="criarEventoModal-form">
                                <tr>
                                    <td>
                                        Título:
                                    </td>
                                    <td>
                                        <input className="input-criar-evento criar-evento-titulo" type="text" placeholder="Título do evento" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Data de início:
                                    </td>
                                    <td>
                                        <input className="input-criar-evento criar-evento-dataInicio" type="datetime-local" placeholder="data de início" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Data de término:
                                    </td>
                                    <td>
                                        <input className="input-criar-evento criar-evento-dataTermino" type="datetime-local" placeholder="data de termino" value={dataTermino} onChange={(e) => setDataTermino(e.target.value)} />

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Média de preço:
                                    </td>
                                    <td>
                                        <input className="input-criar-evento criar-evento-mediaValor" type="number" placeholder="Valor" disabled={gratuito} value={mediaValor} onChange={(e) => setMediaValor(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td colpan={2}>
                                        <input className="criar-evento-gratuito" type="checkbox" checked={gratuito} onChange={handleGratuitoCheck} /> Evento gratuito?
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        Descrição:
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <textarea
                                            id="evento-descricao"
                                            name="evento-descricao"
                                            rows="4"
                                            cols="50"
                                            placeholder="Descrição do evento"
                                            value={descricao}
                                            onChange={(e) => setDescricao(e.target.value)}
                                        ></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button
                                            className="criar-evento-submit-botao"
                                            onClick={handleCriarEvento}
                                        >Criar evento</button>
                                    </td>
                                    <td>
                                        <button
                                            className="criar-evento-limpar-botao"
                                            onClick={handleLimparFormEvento}
                                        >Limpar formulario</button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {showModalConfirmacao && (
                <div className='criarEventoModalConfircacao-container'>
                    <div className="criarEventoModalConfircacao-body">
                        <div className="criarEventoModalConfircacao-header">
                            <p>Evento criado com sucesso!</p>
                        </div>
                        <div className="criarEventoModalConfircacao-content">
                            <button
                                className="criar-evento-fechar-modal-confirmacao-botao"
                                onClick={() => setShowModalConfirmacao(false)}
                            >Fechar</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );

}
