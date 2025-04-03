import React from "react";
import './Style.css';

//Components 
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";

export default function Calendario() {

    return (
        <div className="calendario-page">
            <Navbar />
            <Header title="Calendário" />
            <main className="calendario-content">
                <p>PÁGINA DO CALENDÁRIO</p>
            </main>
            <Perfil />
        </div>
    );
}