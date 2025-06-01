import React, { useState, useEffect } from "react";
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons'
import callout from '../../services/api';

export default function EventoCard(props) {
    const [showDescricao, setShowDescricao] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(props.isBookmarked);

    const handleShowDescricao = (event) => {
        console.log('DESCRICAO', showDescricao)
        setShowDescricao(!showDescricao);
    };

    const handleSalvarEvento = (event) => {
        criarInscricao();
    }

    const handleCancelarEvento = (event) => {
        cancelarInscricao();
    }

    const criarInscricao = () => {
        callout.post('http://localhost:5000/inscricoes/criarInscricao', { eventoId: props.id, status: "pendente" })
            .then(response => {
                alert("Evento Salvo!");
                props.atualizarEventos();
            })
            .catch(error => {
                alert("Erro ao salvar o evento!");
            });
    }

    const cancelarInscricao = () => {
        callout.patch(`http://localhost:5000/inscricoes/cancelarInscricao/${props.inscricaoId}`)
            .then(response => {
                alert("Inscrição cancelada");
                props.atualizarEventos();
            })
            .catch(error => {
                alert("Erro ao cancelar a inscrição");
            });
    }

    return (
        <div className="eventoCard-container">
            <div className="eventoCard-body">
                <div className="eventoCard-header">
                    <div className="eventoCard-header-titulo">
                        <div className="eventoCard-header-titulo-esquerda">
                            <img src='/img/user-template.png' className='eventoCard-img'></img>
                            <h1>{props.titulo} ({(Math.floor((props.distancia / 1000) * 10) / 10).toFixed(1)} KM)</h1>
                        </div>
                        <div className="eventoCard-header-titulo-direita">
                            {!props.isConfirmado &&
                                <>
                                    {isBookmarked ? (
                                        <button className='eventoCard-btn-icon' onClick={handleCancelarEvento}><FontAwesomeIcon icon={faBookmarkSolid} /></button>
                                    ) : (
                                        <button className='eventoCard-btn-icon' onClick={handleSalvarEvento}><FontAwesomeIcon icon={faBookmarkRegular} /></button>
                                    )}
                                </>
                            }

                        </div>
                    </div>
                    <div className="eventoCard-header-empresa">
                        <p>De: {props.criadoPor}</p>
                    </div>
                </div>
                <div className="eventoCard-content">
                    <div className='eventoCard-sessao'>
                        <h1>Média de valor</h1>
                        {props.gratuito ? (
                            <p>Evento gratúito</p>
                        ) : (
                            <p>R$ {props.mediaValor}</p>
                        )}

                    </div>
                    <div className='eventoCard-sessao'>
                        <h1>Data</h1>
                        <p>{props.data}</p>
                    </div>
                    <div className='eventoCard-sessao'>
                        <h1>Hora</h1>
                        <p>{props.horaInicio}</p>
                    </div>
                    <div className='eventoCard-sessao'>
                        <h1>Saber mais</h1>
                        <button className='eventoCard-botao' onClick={handleShowDescricao} >Clique aqui</button>
                    </div>
                    <div className='eventoCard-sessao' style={{ borderRight: '0' }}>
                        {props.isConfirmado ? (
                            <button className='eventoCard-botao-cancelar' onClick={() => props.onCancelarClick(props.inscricaoId)}>Cancelar participação</button>
                        ) : (
                            <button className='eventoCard-botao' onClick={() => props.onParticiparClick(props.id, props.inscricaoId)}>Vou participar</button>
                        )}
                    </div>
                </div>
                {showDescricao && (
                    <div className="eventoCard-descricao">
                        <p>Descrição: {props.children}</p>
                    </div>
                )}
            </div>
        </div>
    )
}