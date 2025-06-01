import React, { useState, useEffect } from "react";
import './Style.css';
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import callout from '../../services/api';


export default function EventoModal(props) {

    function SetViewOnUserLocation({ position }) {
        const map = useMap();
        useEffect(() => {
            if (position) {
                map.setView(position, 13);
            }
        }, [position, map]);
        return null;
    }

    const handleCancelarEvento = () => {
        callout.patch(`http://localhost:5000/inscricoes/cancelarInscricao/${props.inscricaoId}`)
            .then(response => {
                alert("Inscrição cancelada");
                props.atualizarEventos();
            })
            .catch(error => {
                alert("Erro ao cancelar a inscrição");
            });
    }

    const handleCriarInscricao = () => {

        callout.patch(`http://localhost:5000/inscricoes/confirmarInscricao/${props.inscricaoId}`)
            .then(response => {
                alert("Inscrição confirmada");
                props.atualizarEventos();
            })
            .catch(error => {
                alert("Erro ao confirmar a inscrição");
                console.log(error)
            });

    }

    return (
        <div className="eventoModal-container">
            <div className="eventoModal-body">
                <div className="eventoModal-header">

                    <div className="eventoModal-esquerda">
                        {props.evento.titulo}
                    </div>
                    <div className="eventoModal-direita">
                        <button className='eventoModal-fecharModalButton-icon' onClick={props.handleFecharModal}><FontAwesomeIcon icon={faX} /></button>
                    </div>
                </div>
                <div className="eventoModal-content">
                    <div className="eventoModal-data">
                        <div className="eventoModal-dadosEvento">
                            <table className="eventoModal-dataTable">
                                <tr>
                                    <td className="titulo">
                                        Data Início:
                                    </td>
                                    <td>
                                        {new Date(props.evento.dataMarcada).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Data Término:
                                    </td>
                                    <td>
                                        {new Date(props.evento.dataTermino).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Média de preço:
                                    </td>
                                    <td>
                                        {props.evento.gratuito ? ( <>Gratuito</>) : 
                                        (<>{props.evento.mediaValor}</>)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Endereço:
                                    </td>
                                    <td>
                                        {props.evento.localizacao?.endereco?.rua}, {props.evento.localizacao?.endereco?.numero}. {props.evento.localizacao?.endereco?.bairro} . {props.evento.localizacao?.endereco?.cidade}, {props.evento.localizacao?.endereco?.estado}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="titulo">
                                        Descrição:
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        {props.evento.descricao}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="eventoModal-Mapa">
                            <div className="eventoModal-Mapa-Container">
                                <MapContainer
                                    center={[
                                        props.evento?.localizacao?.coordinates[1], // latitude
                                        props.evento?.localizacao?.coordinates[0], // longitude
                                    ]}
                                    zoom={15}
                                    style={{ height: "100%", width: "100%" }}
                                    dragging={false}           // Desativa arrastar
                                    touchZoom={false}          // Desativa zoom por toque
                                    scrollWheelZoom={false}    // Desativa zoom com scroll do mouse
                                    doubleClickZoom={false}    // Desativa zoom por duplo clique
                                    keyboard={false}>

                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker
                                        position={[
                                        props.evento?.localizacao?.coordinates[1], // latitude
                                        props.evento?.localizacao?.coordinates[0], // longitude
                                    ]}
                                    >
                                    </Marker>


                                    <SetViewOnUserLocation position={[
                                        props.evento?.localizacao?.coordinates[1], // latitude
                                        props.evento?.localizacao?.coordinates[0], // longitude
                                    ]} /></MapContainer>

                            </div>
                        </div>
                    </div>
                    <div className="eventoModal-botoesContainer">
                        {props.isConfirmado ? (
                            <button className='eventoModal-CancelarBotao' onClick={handleCancelarEvento}>Cancelar evento</button>
                        ) : (
                            <button className='eventoModal-ComparecerBotao' onClick={handleCriarInscricao}>Vou participar!</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}