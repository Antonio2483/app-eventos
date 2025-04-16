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
    const [sliderValue, setSliderValue] = useState(10);
    const [filtro, setFiltro] = useState("todos");
    const [loading, setLoading] = useState(false);

    const fetchEventos = () => {
        setLoading(true);

        const url = `http://localhost:5000/eventos/obterEventosFiltro`;
        let dataMarcada = new Date();
        let tipoData = '';
        const raio = sliderValue;

        // Lógica do filtro
        switch (filtro) {
            case "todos":
                tipoData = 'apartir';
                break;
            case "hoje":
                tipoData = 'exata';
                break;
            case "proximos":
                tipoData = 'apartir';
                const amanha = new Date(dataMarcada);
                amanha.setDate(dataMarcada.getDate() + 1);
                dataMarcada = amanha;
                break;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coordenadas = [pos.coords.longitude, pos.coords.latitude];
                const area = {
                    coordenadas,
                    raio: Number(raio) * 1000
                };

                callout.post(url, { dataMarcada, tipoData, area })
                    .then(response => {
                        setEventos(response.data);

                        console.log(eventos.map(e => ({
                            titulo: e.titulo,
                            distancia: e.distancia
                        })))
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
        setFiltro(tipo);
    };


    return (
        <div className="home-page">
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
                    <div className="home-eventos-lista">
                        {eventos.length === 0 ? (
                            <div className="home-eventos-nao-encontrado"> 
                                <p>Nenhum evento encontrado.</p>
                            </div>
                        ) : (
                            eventos.map((evento, index) => (
                                <EventoCard key={index} titulo={evento.titulo} descricao={evento.descricao} />
                            ))
                        )}
                    </div>
                )}


            </main>

            <Perfil />
        </div>
    );
}