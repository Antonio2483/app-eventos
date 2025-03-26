import React from "react";
import Header from "../../Components/Header"
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <div className="home-page">
            <Header className="home-header" />
            <div className="home-content">
                {/* Conteúdo da página */}
                <h1>Bem-vindo ao aplicativo de eventos!</h1>
            </div>
        </div>
    );
}