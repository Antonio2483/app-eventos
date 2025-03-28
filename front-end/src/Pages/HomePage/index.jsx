import React from "react";
import { Link } from 'react-router-dom';
import './Style.css';

// Componentes

import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";

export default function Home() {

    return (
        <div className="home-page">
            
            <Navbar />
            <div className="home-content">
                {/* Conteúdo da página */}
                <Header title="Página inicial"/>
                <h1>Bem-vindo ao aplicativo de eventos!</h1>
            </div>
        </div>
    );
}