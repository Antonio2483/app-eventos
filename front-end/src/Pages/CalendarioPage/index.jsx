import React, { useState, useEffect } from "react";
import './Style.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import callout from '../../services/api';


//Components 
import Header from "../../Components/Header"
import Navbar from "../../Components/Navbar";
import Perfil from "../../Components/Perfil";
import CalendarioToolbarCustom from "../../Components/CalendarioToolbarCustom";
import EventoModal from "../../Components/EventoModal"

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



export default function Calendario() {
    const [eventos, setEventos] = useState();
    const [eventoAtual, setEventoAtual] = useState();
    const [inscricaoAtual, setInscricaoAtual] = useState();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModalEvento, setShowModalEvento] = useState(false);

    const handleFecharModal = (event) => {
        setShowModalEvento(false)
        setEventoAtual(null);
        setInscricaoAtual(null)
        
    }

    const handleShowModal = (event) => {
        
        setEventoAtual(event.eventoObj);
        setInscricaoAtual(event.inscricaoId)
        setShowModalEvento(true)
    }

    const getEventos = () => {
        callout.post('http://localhost:5000/inscricoes/GetInscricaoUserFiltro/',{status:'confirmado', coordenadas:'none'})
            .then(response => {
                const inscricoes = response.data;

                const eventosParseados = inscricoes.map(inscricao => {
                    const evento = inscricao.evento;
                    const data = new Date(evento.dataMarcada);
                    const dataTermino = new Date(evento.dataTermino);
                    return {
                        title: evento.titulo,
                        start: data,
                        end: dataTermino,
                        inscricaoId: inscricao._id,
                        status: inscricao.status,
                        eventoObj : evento
                    };
                });

                console.log("eventos",eventosParseados);

                setEventos(eventosParseados);

            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }

    useEffect(() => {
        getEventos();
    }, []);

    return (
        <div className="calendario-page">
            {showModalEvento && (
            <EventoModal 
            isConfirmado = "true"
            evento = {eventoAtual}
            inscricaoId = {inscricaoAtual}
            handleFecharModal = {handleFecharModal}
            atualizarEventos = {getEventos}
            />)}
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
                    onSelectEvent={handleShowModal}
                    components={{
                        toolbar: CalendarioToolbarCustom,
                    }}
                />
            </main>
            <Perfil />
        </div>
    );
}