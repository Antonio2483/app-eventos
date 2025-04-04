import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Style.css';
import callout from '../../services/api';

// Componentes

import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";
import EventoCard from "../../Components/EventoCard";

export default function Home() {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        callout.get('http://localhost:5000/eventos/obterTodosEventosPublicos')
            .then(response => {

                const data = response.data;
                setEventos(data)

            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }, []);

    return (
        <div className="home-page">
            <Navbar />
            <Header title="Eventos" />

            <main className="home-content">
                <div className="home-painel-filtros">
                    <button className="home-painel-filtros-botao">Hoje</button>
                    <button className="home-painel-filtros-botao">Próximos</button>
                </div>

                {eventos.map((evento, index) => (
                    <EventoCard key={index} titulo={evento.titulo} descricao={evento.descricao}/>
                ))}

            </main>

            <Perfil />
        </div>
    );
}