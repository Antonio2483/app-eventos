import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Style.css';
// Componentes

import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";

export default function Mapa() {

    return (
        <div className="mapa-page">
            <Navbar />
            <Header title="Mapa de eventos" />
            <main className="mapa-content">

                <p>Mapa de Eventos</p>

            </main>
            <Perfil />
        </div>
    );
}