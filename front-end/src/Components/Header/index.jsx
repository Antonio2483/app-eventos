import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';

const Header = (props) => (
    <header className="header-container">
        {props.title}
    </header>
);

export default Header;