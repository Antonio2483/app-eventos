import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./privateRoutes"
// Pages

import Home from '../Pages/HomePage';
import Login from '../Pages/LoginPage';
import Eventos from '../Pages/EventosPage';
import Calendario from '../Pages/CalendarioPage';

export default function Rotas() {
    return(
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>} />

                {/* rotas privadas */}
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Home/>} />
                    <Route path="/eventos" element={<Eventos/>} />
                    <Route path="/calendario" element={<Calendario/>} />
                </Route>
                {/* paginas publicas */}

                <Route path="/" element={<Login/>} />

            </Routes>
        </BrowserRouter>
    </AuthProvider>
    );
}