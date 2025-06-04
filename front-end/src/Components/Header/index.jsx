import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';

// Components
import NotificacaoButton from "../../Components/NotificacaoButton"
import LogoutButton from "../../Components/LogoutButton"


const Header = (props) => (
    <header className="header-container">
        {props.title}
        <div className='header-buttons'>
            <NotificacaoButton />
            <LogoutButton />
        </div>
    </header>
);

export default Header;