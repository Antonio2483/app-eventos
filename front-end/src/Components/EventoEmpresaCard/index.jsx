import React from 'react';
import './Style.css';
import { Link } from 'react-router-dom';


const EventoEmpresaCard = (props) => (

    <div className="eventoEmpresaCard-container">
        <Link className= "link-eventosEmpresaCard" to={`/eventos/${props.id}`}>
        <div className="eventoEmpresaCard-body">
            <div className="eventoEmpresaCard-header">
            <img src='/img/user-template.png' className='eventoEmpresaCard-img'></img>
                {props.titulo}
            </div>
            <div className="eventoEmpresaCard-descricao">
                {props.descricao}
            </div>
        </div>
        </Link>
    </div>
);

export default EventoEmpresaCard;