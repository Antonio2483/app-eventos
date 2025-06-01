import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./privateRoutes"
import EventoRoute from "./empresasRoutes"
import PessoaRoute from './pessoasRoutes';
// Pages

import Home from '../Pages/HomePage';
import Login from '../Pages/LoginPage';
import Mapa from '../Pages/MapaPage';
import Calendario from '../Pages/CalendarioPage';
import CriarConta from "../Pages/CriarContaPage"
import SeusEventos from "../Pages/SeusEventosPage"
import Redirect from '../Pages/RedirectPage';
import EventosDetail from '../Pages/EventoDetailPage'
import TorneseMembro from "../Pages/MembroPage"

export default function Rotas() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* rotas privadas */}
                    <Route element={<PrivateRoute />}>
                        {/* rotas de pessoa */}
                        <Route element={<PessoaRoute />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/calendario" element={<Calendario />} />
                            <Route path="/mapa" element={<Mapa />} />
                            <Route path="/torne-se-membro" element={<TorneseMembro />} />
                        </Route>
                        {/* rotas de empresa */}
                        <Route element={<EventoRoute />}>
                            <Route path="/eventos/todos" element={<SeusEventos />} />
                            <Route path="/eventos/:id" element={<EventosDetail />} />
                        </Route>
                    </Route>
                    {/* paginas publicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/CriarConta" element={<CriarConta />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/logon" element={<Redirect />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}