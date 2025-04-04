import React from 'react';
import './Style.css';

const EventoCard = (props) => (

    <div className="eventoCard-container">
        <div className="eventoCard-body">
            <div className="eventoCard-header">
            <img src='/img/user-template.png' className='eventoCard-img'></img>
                {props.titulo}
            </div>
            <div className="eventoCard-descricao">
                {props.descricao}
            </div>
        </div>
    </div>
);

export default EventoCard;