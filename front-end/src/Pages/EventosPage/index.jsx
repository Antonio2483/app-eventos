import React, { useState, useEffect } from "react";
import axios from 'axios';

// Componentes

import Header from "../../Components/Header"

export default function Eventos() {
    // Isso aqui faz uma requisição pro controller de eventos lá no back, chamando a função getEventos
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/eventos')
            .then(response => setEventos(response.data))
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }, []);

    return (
        <div>
            <Header />
            <p>Eventos</p>
            <ul>
                {eventos.map(evento => (
                    <li key={evento.id}>{evento.nome} - {evento.data}</li>
                ))}
            </ul>
        </div>
    );
}