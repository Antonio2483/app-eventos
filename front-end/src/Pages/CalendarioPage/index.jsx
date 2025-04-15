import React, { useState, useEffect } from "react";
import './Style.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

//Components 
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";
import CalendarioToolbarCustom from "../../Components/CalendarioToolbarCustom";

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const eventosIniciais = [
    {
        title: 'Reunião com equipe',
        start: new Date(2025, 3, 15, 10, 0),
        end: new Date(2025, 3, 15, 11, 0),
    },
    {
        title: 'Consulta médica',
        start: new Date(2025, 3, 16, 14, 30),
        end: new Date(2025, 3, 16, 15, 30),
    },
];

export default function Calendario() {
    const [eventos, setEventos] = useState(eventosIniciais);
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <div className="calendario-page">
            <Navbar />
            <Header title="Agenda" />
            <main className="calendario-content">
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    culture="pt-BR"
                    date={currentDate} // <- controla a data exibida
                    onNavigate={(newDate) => setCurrentDate(newDate)}
                    defaultView="month"
                    components={{
                        toolbar: CalendarioToolbarCustom,
                    }}
                />
            </main>
            <Perfil />
        </div>
    );
}