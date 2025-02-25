import React from "react";
import Header from "../../Components/Header"
import { Link } from 'react-router-dom'; 

export default function Home() {

    return (
        <div>
            <Header />
            <p>PÁGINA HOME</p>
            <Link to="/login">Login</Link>
        </div>
    );
}