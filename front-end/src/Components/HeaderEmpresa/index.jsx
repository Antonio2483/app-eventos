import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HeaderEmpresa = (props) => (
    <header className="header-empresa-container">
        <div className='header-empresa-button-container'>
        <Link className="header-empresa-button-link" to="/eventos/todos"> <button className='headerempresa-btn-icon'><FontAwesomeIcon icon={faHouse} /></button></Link>
        </div>
        {props.title}
    </header>
);

export default HeaderEmpresa;