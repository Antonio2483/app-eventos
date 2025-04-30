import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import callout from '../../services/api';
import 'leaflet/dist/leaflet.css';
import './Style.css';


// Componentes

import Header from "../../Components/HeaderEmpresa"
import Perfil from "../../Components/Perfil";

export default function EventoDetail() {
    const { id } = useParams();
    const [evento, setEvento] = useState([]);

    useEffect(() => {

        callout.get(`http://localhost:5000/eventos/obterEvento/${id}`)
            .then(response => {

                console.log("AAAAAAAAA", response.data)

                setEvento(response.data)
            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }, [id]);

    return (
        <div className="EventoDetail-page">
            <Header title={evento.titulo} />
            <main className="EventoDetail-content">
                <div className="divCard-body">
                    <div className="divCard-header">
                        Métricas
                    </div>
                    <div className="divCard-descricao">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nostrum nobis eius fugiat sapiente minus. Placeat fugiat, sunt minus quo praesentium, quibusdam tenetur ipsum ratione doloribus, modi asperiores quis harum!
                    </div>
                </div>
                <div className="divCard-body">
                    <div className="divCard-header">
                        Dados do evento
                    </div>
                    <div className="divCard-descricao">
                        {evento.descricao}
                    </div>
                </div>
            </main>
            <Perfil />
        </div>
    );
}