import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Style.css';
import callout from '../../services/api';


// Componentes

import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";
import EventoCard from "../../Components/EventoCard";
import { ClipLoader } from 'react-spinners';

export default function Home() {
    const [eventos, setEventos] = useState([]);
    const [inscricoes, setInscricoes] = useState([]);
    const [sliderValue, setSliderValue] = useState(10);
    const [filtro, setFiltro] = useState("todos");
    const [loading, setLoading] = useState(false);
    const [showModalConfirmacaoEvento, setShowModalConfirmacaoEvento] = useState(false);
    const [showModalCancelarEvento, setShowModalCancelarEvento] = useState(false);
    const [eventoSelecionadoId, setEventoSelecionadoId] = useState(null);
    const [erroInscricao, setErroInscricao] = useState(false);
    const [erroCancelar, setErroCancelar] = useState(false);
    const [isInscricao, setIsInscricao] = useState(false);
    const [isInscricaoModal, setIsInscricaoModal] = useState(false);
    const [statusInscricao, setStatusInscricao] = useState(false);
    const [eventoConfirmado, setEventoConfirmado] = useState(false);
    const [localizacaoUser, setLocalizacaoUser] = useState([]);

    const fetchEventos = () => {
        setLoading(true);

        if (isInscricao) {
            handleGetInscricao();
            return;
        }

        const url = `http://localhost:5000/eventos/obterEventosFiltro`;
        const agora = new Date();
        let dataMarcada;
        let tipoData = '';
        const raio = sliderValue;

        // Lógica do filtro
        switch (filtro) {
            case "todos":
                tipoData = 'apartir';
                dataMarcada = agora; // hoje
                break;
            case "hoje":
                tipoData = 'exata';
                // Ajuste: fixa data para hoje 00:00:00
                dataMarcada = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0);
                break;
            case "proximos":
                tipoData = 'apartir';
                const amanha = new Date(agora);
                amanha.setDate(agora.getDate() + 1);
                dataMarcada = amanha;
                break;
            default:
                tipoData = 'apartir';
                dataMarcada = agora;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coordenadas = [
                    -46.942290895066165,
                    -22.37022132194142
                    
                ];// [pos.coords.longitude, pos.coords.latitude];

                setLocalizacaoUser(coordenadas);

                const area = {
                    coordenadas: coordenadas,
                    raio: Number(raio) * 1000
                };

                callout.post(url, {
                    dataMarcada: dataMarcada.toISOString(),
                    tipoData,
                    area
                })
                    .then(response => {
                        setEventos(response.data);

                        console.log(response.data.map(e => ({
                            titulo: e.titulo,
                            distancia: e.distancia
                        })));
                    })
                    .catch(error => {
                        console.error('Erro ao buscar eventos:', error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            },
            (err) => {
                console.error('Erro ao obter localização:', err);
                setLoading(false);
            }
        );
    };



    useEffect(() => {
        fetchEventos(filtro, sliderValue);
    }, [filtro, sliderValue]);

    const handleSliderChange = (event) => {
        setSliderValue(event.target.value);
    };

    const handleFiltroClick = (tipo) => {
        setIsInscricao(false)
        setFiltro(tipo);
    };

    const abrirModalConfirmacao = (idEvento, idInscricao) => {
        if (idInscricao) {
            setIsInscricaoModal(true);
            setEventoSelecionadoId(idInscricao);
        } else {
            setEventoSelecionadoId(idEvento);
        }
        setShowModalConfirmacaoEvento(true);

    };

    const abrirModalCancelar = (idInscricao) => {
        setEventoSelecionadoId(idInscricao);
        setShowModalCancelarEvento(true);


    };

    const fecharModal = () => {
        setShowModalCancelarEvento(false)
        setShowModalConfirmacaoEvento(false);
        setEventoSelecionadoId(null);
        setIsInscricaoModal(false);
    };

    const criarInscricao = (status) => {

        callout.post('http://localhost:5000/inscricoes/criarInscricao', { eventoId: eventoSelecionadoId, status })
            .then(response => {
                fetchEventos();
                fecharModal();
            })
            .catch(error => {
                if (error.response) {
                    setErroInscricao(error.response.data.error);
                } else {
                    setErroInscricao("Erro ao conectar com o servidor")
                }
            });

    }

    const cancelarInscricao = () => {
        callout.patch(`http://localhost:5000/inscricoes/cancelarInscricao/${eventoSelecionadoId}`)
            .then(response => {
                fetchEventos();
                fecharModal();
            })
            .catch(error => {
                alert("Erro ao cancelar a inscrição");
            });
    }

    const HandleconfirmarInscricao = () => {
        if (isInscricaoModal) {
            confirmarInscricao();
        } else {
            criarInscricao("confirmado")
        }
    }

    const confirmarInscricao = () => {
        callout.patch(`http://localhost:5000/inscricoes/confirmarInscricao/${eventoSelecionadoId}`)
            .then(response => {
                fetchEventos();
                fecharModal();
            })
            .catch(error => {
                alert("Erro ao confirmar a inscrição");
                console.log(error)
            });
    }

    const handleAtualizarEventos = () => {
        fetchEventos(filtro)
    };

    const handleInscricaoClick = (tipo) => {
        setIsInscricao(true);
        if (tipo === 'salvos') {
            setEventoConfirmado(false)
            setStatusInscricao('pendente')
            setFiltro('salvos');
        }
        if (tipo === 'confirmado') {
            setEventoConfirmado(true)
            setStatusInscricao('confirmado')
            setFiltro('confirmados');
        }
    };

    const handleGetInscricao = () => {
        console.log('BUSCANDO INSCRIÇÃO')
        const coordenadas = localizacaoUser;
        callout.post('http://localhost:5000/inscricoes/GetInscricaoUserFiltro/', { status: statusInscricao, coordenadas })
            .then(response => {
                console.log("inscricao", response.data);
                setInscricoes(response.data);

                console.log(eventos.map(e => ({
                    titulo: e.titulo,
                    distancia: e.distancia
                })))
            })
            .catch(error => {
                console.error('Erro ao buscar inscricoes:', error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    return (
        <div className="home-page">
            {showModalConfirmacaoEvento && (
                <div className="eventoCard-modalConfirmacao-container">
                    <div className="eventoCard-modalConfirmacao-body">
                        <div className="eventoCard-modalConfirmacao-header">
                            Você deseja participar desse evento?
                        </div>
                        <div className="eventoCard-modalConfirmacao-content">
                            {erroInscricao && <p style={{ color: "red" }}>{erroInscricao}</p>}
                            <button className="eventoCard-modalConfirmacao-button" onClick={() => HandleconfirmarInscricao()}>Sim</button>
                            <button className="eventoCard-modalConfirmacao-button" onClick={fecharModal}>Não</button>
                        </div>
                    </div>
                </div>
            )}
            {showModalCancelarEvento && (
                <div className="eventoCard-modalCancelar-container">
                    <div className="eventoCard-modalCancelar-body">
                        <div className="eventoCard-modalCancelar-header">
                            Tem certeza que quer cancelar esse evento?
                        </div>
                        <div className="eventoCard-modalCancelar-content">
                            {erroCancelar && <p style={{ color: "red" }}>{erroCancelar}</p>}
                            <button className="eventoCard-modalCancelar-button-sim" onClick={() => cancelarInscricao()}>Sim</button>
                            <button className="eventoCard-modalCancelar-button" onClick={fecharModal}>Não</button>
                        </div>
                    </div>
                </div>
            )}
            <Navbar />
            <Header title="Eventos" />

            <main className="home-content">
                <div className="home-painel-filtros">
                    <div className="home-painel-filtros-botao-container">
                        <button
                            className={`home-painel-filtros-botao ${filtro === "hoje" ? "selecionado" : ""}`}
                            onClick={() => handleFiltroClick("hoje")}
                        >
                            Hoje
                        </button>
                        <button
                            className={`home-painel-filtros-botao ${filtro === "proximos" ? "selecionado" : ""}`}
                            onClick={() => handleFiltroClick("proximos")}
                        >
                            Próximos
                        </button>
                        <button
                            className={`home-painel-filtros-botao ${filtro === "todos" ? "selecionado" : ""}`}
                            onClick={() => handleFiltroClick("todos")}
                        >
                            Todos
                        </button>
                        <button
                            className={`home-painel-filtros-botao ${filtro === "salvos" ? "selecionado" : ""}`}
                            onClick={() => handleInscricaoClick("salvos")}
                        >
                            Salvos
                        </button>
                        <button
                            className={`home-painel-filtros-botao ${filtro === "confirmados" ? "selecionado" : ""}`}
                            onClick={() => handleInscricaoClick("confirmado")}
                        >
                            Confirmados
                        </button>
                    </div>
                    <div className="home-painel-filtros-slider-container">
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="home-painel-filtros-slider"
                            id="filtrosSlider"
                        />
                        <spam className="filtros-slider-output">{sliderValue}</spam>
                    </div>
                </div>

                {loading ? (
                    <div className="home-loading">
                        <ClipLoader color="#cda6d2" size={80} />
                        <span>Carregando...</span>
                    </div>
                ) : (
                    <>
                        {isInscricao ? (
                            <div className="home-eventos-lista">
                                {inscricoes.length === 0 ? (
                                    <div className="home-eventos-nao-encontrado">
                                        <p>Nenhum evento encontrado.</p>
                                    </div>
                                ) : (
                                    inscricoes.map((inscricao, index) => {
                                        const dataInicio = new Date(inscricao.evento.dataMarcada);
                                        const dataFim = new Date(inscricao.evento.dataTermino);

                                        const dataFormatada = dataInicio.toLocaleDateString('pt-BR');
                                        const horaInicio = dataInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                        const horaFim = dataFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <EventoCard
                                                key={index}
                                                titulo={inscricao.evento.titulo}
                                                data={dataFormatada}
                                                horaInicio={horaInicio}
                                                horaFim={horaFim}
                                                mediaValor={inscricao.evento.mediaValor}
                                                gratuito={inscricao.evento.gratuito}
                                                distancia={inscricao.distancia}
                                                criadoPor={inscricao.evento?.criadoPor?.empresaData?.nomeFantasia}
                                                id={inscricao.evento._id}
                                                onParticiparClick={abrirModalConfirmacao}
                                                isBookmarked={true}
                                                atualizarEventos={handleAtualizarEventos}
                                                inscricaoId={inscricao._id}
                                                isConfirmado={eventoConfirmado}
                                                onCancelarClick={abrirModalCancelar}
                                            >
                                                {inscricao.evento.descricao}
                                            </EventoCard>
                                        );
                                    })
                                )}
                            </div>
                        ) : (
                            <div className="home-eventos-lista">
                                {eventos.length === 0 ? (
                                    <div className="home-eventos-nao-encontrado">
                                        <p>Nenhum evento encontrado.</p>
                                    </div>
                                ) : (
                                    eventos.map((evento, index) => {
                                        const dataInicio = new Date(evento.dataMarcada);
                                        const dataFim = new Date(evento.dataTermino);

                                        const dataFormatada = dataInicio.toLocaleDateString('pt-BR');
                                        const horaInicio = dataInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                        const horaFim = dataFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <EventoCard
                                                key={index}
                                                titulo={evento.titulo}
                                                data={dataFormatada}
                                                horaInicio={horaInicio}
                                                horaFim={horaFim}
                                                mediaValor={evento.mediaValor}
                                                gratuito={evento.gratuito}
                                                distancia={evento.distancia}
                                                criadoPor={evento.criadoPor.empresaData.nomeFantasia}
                                                id={evento._id}
                                                onParticiparClick={abrirModalConfirmacao}
                                                isBookmarked={false}
                                                atualizarEventos={handleAtualizarEventos}
                                            >
                                                {evento.descricao}
                                            </EventoCard>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </>
                )}



            </main>

            <Perfil />
        </div>
    );
}