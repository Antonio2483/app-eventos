import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages

import Home from '../Pages/HomePage';
import Login from '../Pages/LoginPage';
import Eventos from '../Pages/EventosPage';
import Calendario from '../Pages/CalendarioPage';

export default function Rotas() {
    return(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/eventos" element={<Eventos/>} />
            <Route path="/calendario" element={<Calendario/>} />
        </Routes>
    </BrowserRouter>
    );
}