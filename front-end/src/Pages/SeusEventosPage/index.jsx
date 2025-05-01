import React, { useState, useEffect } from "react";
import callout from '../../services/api';
import 'leaflet/dist/leaflet.css';
import './Style.css';


// Componentes

import Header from "../../Components/HeaderEmpresa"
import Perfil from "../../Components/Perfil";
import EventoCard from "../../Components/EventoEmpresaCard"
import CriarEventoButton from "../../Components/criarEventoButton";

export default function SeusEventos() {

    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        
        callout.get('http://localhost:5000/eventos/obterEventosUser')
            .then(response => {

                console.log("AAAAAAAAA",response.data)

                setEventos(response.data)
            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }, []);
    
    return (
        <div className="eventosEmpresa-page">
            <Header title="Seus eventos" />
            <CriarEventoButton />
            <main className="eventosEmpresa-content">
            
            {eventos.length === 0 ? (
                            <div className="home-eventos-nao-encontrado"> 
                                <p>Nenhum evento encontrado.</p>
                            </div>
                        ) : (
                            eventos.map((evento, index) => (
                                <EventoCard key={index} titulo={evento.titulo} descricao={evento.descricao} id={evento._id}/>
                            ))
                        )}
            </main>
            <Perfil />
        </div>
    );
}