import React from "react";
import './Style.css';

//Components 
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";

export default function Calendario() {

    return (
        <div className="calendario-page">
            <Navbar />
            <div className="calendario-content">
                <Header title="Calendário" />
                <p>PÁGINA DO CALENDÁRIO</p>
            </div>
        </div>
    );
}