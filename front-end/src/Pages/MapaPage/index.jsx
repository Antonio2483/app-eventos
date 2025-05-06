import React, { useState, useEffect } from "react";
import callout from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Style.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';


// Componentes

import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";

const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

function SetViewOnUserLocation({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 13);
        }
    }, [position, map]);
    return null;
}

function RecenterMap({ position, onDone }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 13);
            onDone(); // chama callback pra resetar a flag
        }
    }, [position, map, onDone]);

    return null;
}

export default function Mapa() {

    const [userPosition, setUserPosition] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [recenter, setRecenter] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserPosition([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => {
                console.error(err);
            },
            {
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 0 
            }
        );

        callout.post('http://localhost:5000/inscricoes/GetInscricaoUserFiltro/',{status:'confirmado', coordenadas:'none'})
            .then(response => {
                const inscricoes = response.data;

                const eventosParseados = inscricoes.map(inscricao => {
                    const evento = inscricao.evento;
                    const data = new Date(evento.dataMarcada);
                    return {
                        titulo: evento.titulo,
                        endereco: evento.localizacao.endereco,
                        latitude: evento.localizacao.coordinates[1],
                        longitude: evento.localizacao.coordinates[0]
                    };
                });

                setEventos(eventosParseados);

            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }, []);

    return (
        <div className="mapa-page">
            <Navbar />
            <Header title="Mapa de eventos" />
            <main className="mapa-content">

                <MapContainer center={userPosition || [-23.55052, -46.633308]} zoom={13} style={{ height: "100%", width: "100%" }}>

                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {eventos.map((evento, i) => (
                        <Marker
                            key={i}
                            position={[
                                evento.latitude, // latitude
                                evento.longitude, // longitude
                            ]}
                        >
                            <Popup>
                                <strong>{evento.titulo}</strong><br />
                                {evento.endereco}
                            </Popup>
                        </Marker>

                    ))}
                    <SetViewOnUserLocation position={userPosition} />
                    {recenter && (
                        <RecenterMap
                            position={userPosition}
                            onDone={() => setRecenter(false)} // reset a flag depois de recenter
                        />
                    )}

                </MapContainer>
                {/* Botão flutuante */}
                {userPosition && (
                <button className="recentralizar-mapa-button"
                    onClick={() => setRecenter(true)}
                >
                    Centralizar em mim
                </button>)}
            </main>
            <Perfil />
        </div>
    );
}