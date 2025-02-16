import React from 'react';
import { Link } from 'react-router-dom'; 
import './Style.css';

const Header = ()  => (
        <header>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/calendario">Calendário</Link></li>
                    <li><Link to="/eventos">Eventos</Link></li>
                </ul>
            </nav>
        </header>
    );

export default Header;