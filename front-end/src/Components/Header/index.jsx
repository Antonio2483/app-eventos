import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';

// Components
import NotificacaoButton from "../../Components/NotificacaoButton"

const Header = (props) => (
    <header className="header-container">
        {props.title}
        <NotificacaoButton />
    </header>
);

export default Header;