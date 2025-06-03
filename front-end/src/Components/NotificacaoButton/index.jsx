import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons';
import callout from '../../services/api';
import './Style.css';

const notificacoesMock = [
    {
        _id: "1",
        mensagem: "Faltam 3 dias para o evento Hackathon 2025!",
        lido: false
    },
    {
        _id: "2",
        mensagem: "Faltam 2 dias para o evento Workshop de React!",
        lido: false
    },
    {
        _id: "3",
        mensagem: "Faltam 1 dia para o evento Palestra de UX Design!",
        lido: false
    },
    {
        _id: "4",
        mensagem: "Hoje é o dia do evento Conferência Tech!",
        lido: true
    },
    {
        _id: "5",
        mensagem: "Faltam 3 dias para o evento Feira de Startups!",
        lido: true
    },
    {
        _id: "6",
        mensagem: "Faltam 2 dias para o evento Meetup de Node.js!",
        lido: true
    }
];


export default function NotificacaoButton() {

    const [notificacoes, setNotificacoes] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Filtra notificações não lidas
    const naoLidas = useMemo(
        () => notificacoes.filter(n => !n.lido),
        [notificacoes]
    );

    // Função para buscar notificações
    const buscarNotificacoes = async () => {
        console.log("NOTIFICACOES")
        callout.get('http://localhost:5000/notificacoes/getNotificacoesUser')
            .then(response => {
                setNotificacoes(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => console.error('Erro ao buscar notificações:', error));
    };

    // Marcar notificações como lidas
    const marcarComoLidas = async () => {
        const idsNaoLidas = naoLidas.map(n => n._id);
        if (idsNaoLidas.length === 0) return;

        callout.patch('http://localhost:5000/notificacoes/marcarComoLidas', { ids: idsNaoLidas })
            .then(response => {
                setNotificacoes(prev => prev.map(n => ({ ...n, lido: true })));
            })
            .catch(error => console.error('Erro ao buscar notificações:', error));
    };

    // Toggle do modal
    const toggleModal = () => {
        setMostrarModal(!mostrarModal);
        if (mostrarModal) {
            marcarComoLidas();
        }
    };

    // Busca inicial e a cada 10 minutos
    useEffect(() => {
        // setNotificacoes(notificacoesMock);
        buscarNotificacoes();
        const interval = setInterval(buscarNotificacoes, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="notificacoes-container">
            <button className="notificacao-btn-icon" onClick={toggleModal}>
                <FontAwesomeIcon icon={faBell} />
                {naoLidas.length > 0 && (
                    <span className="notificacoes-badge">
                        {naoLidas.length}
                    </span>
                )}
            </button>

            {mostrarModal && (
                <div className="notificacoes-modal">
                    <div className="notificacoes-header">Notificações</div>
                    <ul className="notificacoes-lista">
                        {notificacoes
                            .sort((a, b) => (a.lido === b.lido ? 0 : a.lido ? 1 : -1))
                            .map(n => (
                                <li key={n._id} className="notificacao-item">
                                    {!n.lido && <span className="notificacao-indicador"></span>}
                                    <span>{n.mensagem}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
