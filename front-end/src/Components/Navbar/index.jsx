import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faMap } from '@fortawesome/free-solid-svg-icons'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => (

    <nav className="navbar-container">
        <div className="navbar-body">
            <ul>
                <li><Link to="/home"> <button className='navbar-btn-icon'><FontAwesomeIcon icon={faHouse} /></button></Link></li>
                <li><Link to="/calendario"><button className='navbar-btn-icon'><FontAwesomeIcon icon={faCalendarDays} /></button></Link></li>
                <li><Link to="/mapa"><button className='navbar-btn-icon'><FontAwesomeIcon icon={faMap} /></button></Link></li>
            </ul>
        </div>
    </nav>
);

export default Navbar;