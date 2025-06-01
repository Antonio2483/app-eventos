import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import callout from '../../services/api';
import 'leaflet/dist/leaflet.css';
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';



// Componentes

import Header from "../../Components/HeaderEmpresa"
import Perfil from "../../Components/Perfil";
import CriarEventoButton from "../../Components/criarEventoButton";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function EventoDetail() {
    const { id } = useParams();
    const [evento, setEvento] = useState([]);
    const [edicao, setEdicao] = useState(false);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [totalInscricoes, SetTotalInscricoes] = useState([]);
    const [confirmados, SetConfirmados] = useState([]);
    const [pendente, SetPendente] = useState([]);
    const [cancelados, SetCancelados] = useState([]);

    useEffect(() => {
        getEventos();
        // getGrafico();
        getGraficoMock();

    }, [id]);

    const getEventos = () => {
        callout.get(`http://localhost:5000/eventos/obterEvento/${id}`)
            .then(response => {

                setEvento(response.data)
            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }

    const getGrafico = () => {
        callout.get(`http://localhost:5000/inscricoes/getInfoGrafico?eventoId=${id}`)
            .then(response => {
                console.log("RESPONSE", response)
                setChartData({
                    labels: response.data.labels,
                    datasets: [
                        {
                            label: 'Inscrições por dia',
                            data: response.data.data,
                            borderColor: 'rgba(75,192,192,1)',
                            fill: false
                        }
                    ]
                });
            })
            .catch(error => console.error('Erro ao buscar dados do gráfico:', error));
    }

    const getGraficoMock = () => {
        const hoje = new Date();

        const formatarData = (data) => {
            return data.toISOString().slice(0, 10); // "YYYY-MM-DD"
        }

        const labels = [];
        const data = [];

        for (let i = 0; i < 5; i++) {
            const dia = new Date(hoje);
            dia.setDate(hoje.getDate() + i);
            labels.push(formatarData(dia));
            // números aleatórios de inscrições para exemplo
            data.push(Math.floor(Math.random() * 20) + 1);
        }

        const chartDataMock = {
            labels,
            datasets: [
                {
                    label: "Inscrições por dia",
                    data,
                    borderColor: "rgba(75,192,192,1)",
                    fill: false,
                }
            ]
        };

        calcularMediaInscricoes(chartDataMock);
        setChartData(chartDataMock);
    }

    const calcularMediaInscricoes = (chartData) => {

        const inscricoes = chartData.datasets[0].data;
        const total = inscricoes.reduce((sum, valor) => sum + valor, 0);
        console.log("total",total);
        calcularInscricoesMock(total);
        const numeroDeDias = chartData.labels.length;

        const media = numeroDeDias > 0 ? (total / numeroDeDias) : 0;

        return media.toFixed(2); // arredonda para 2 casas decimais

        
    }

    const calcularInscricoesMock = (totalInscricoes) => {
        SetConfirmados(totalInscricoes);
        SetPendente((totalInscricoes * 0.4).toFixed(0));
        SetCancelados((totalInscricoes * 0.2).toFixed(0));
    }

    const formatarData = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <div className="EventoDetail-page">
            <Header title={evento.titulo} />
            <CriarEventoButton />
            <main className="EventoDetail-content">
                <div className="divCard-body">
                    <div className="divCard-header">
                        Métricas
                    </div>
                    <div className="divCard-descricao">
                        <div className="eventoDetail-metricas-grafico">
                            <Line data={chartData} />
                        </div>
                        <div className="eventoDetail-metricas-outras informacoes">
                            <table className="eventoDetail-dataTable">
                                <colgroup>
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '75%' }} />
                                </colgroup>
                                <tr>
                                    <td colSpan={2} className="data-table-outrasInformacoes titulo">
                                        Outras informações
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Total de inscricoes confirmadas:
                                    </td>
                                    <td>
                                        {confirmados}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Total de inscricoes pendentes:
                                    </td>
                                    <td>
                                        {pendente}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Total de inscricoes canceladas:
                                    </td>
                                    <td>
                                        {cancelados}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="divCard-body">
                    <div className="divCard-header">
                        Dados do evento {!edicao && <button className='dadosEvento-editar-button' style={{ color: "gray" }}><FontAwesomeIcon icon={faPencil} /></button>}
                    </div>
                    <div className="divCard-descricao">
                        {!edicao ? (
                            // Tabela dos dados
                            <table className="eventoDetail-dataTable">
                                <colgroup>
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '85%' }} />
                                </colgroup>
                                <tr>
                                    <td className="titulo">
                                        Data Início:
                                    </td>
                                    <td>
                                        {new Date(evento.dataMarcada).toLocaleString('pt-BR', {
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
                                        {new Date(evento.dataTermino).toLocaleString('pt-BR', {
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
                                        {evento.gratuito ? (<>Gratuito</>) :
                                            (<>{evento.mediaValor}</>)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Endereço:
                                    </td>
                                    <td>
                                        {evento.localizacao?.endereco?.rua}, {evento.localizacao?.endereco?.numero}. {evento.localizacao?.endereco?.bairro} . {evento.localizacao?.endereco?.cidade}, {evento.localizacao?.endereco?.estado}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="titulo">
                                        Descrição:
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        {evento.descricao}
                                    </td>
                                </tr>
                            </table>
                        ) : (
                            // Tabela de edição
                            <table className="eventoDetail-dataTable">
                                <colgroup>
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '85%' }} />
                                </colgroup>
                                <tr>
                                    <td className="titulo">
                                        Data Início:
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="datetime-local" placeholder="Data Inicio" value={formatarData(evento.dataMarcada)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Data Término:
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="datetime-local" placeholder="Data Termino" value={formatarData(evento.dataTermino)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Gratuito?
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="checkbox" placeholder="Gratuito?" value={evento.gratuito} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Média de preço:
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="number" placeholder="Média de valor" value={evento.mediaValor} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Endereço:
                                    </td>
                                    <td>
                                        {evento.localizacao?.endereco?.rua}, {evento.localizacao?.endereco?.numero}. {evento.localizacao?.endereco?.bairro} . {evento.localizacao?.endereco?.cidade}, {evento.localizacao?.endereco?.estado}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="titulo">
                                        Descrição:
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <textarea
                                            id="evento-descricao"
                                            name="evento-descricao"
                                            rows="4"
                                            cols="50"
                                            placeholder="Descrição do evento"
                                            value={evento.descricao}
                                        ></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className='evento-editar-botoes'>
                                        <button className='salvar-botao'>Salvar</button>
                                        <button className='cancelar-botao'>Cancelar</button>
                                    </td>
                                </tr>
                            </table>
                        )}
                    </div>
                </div>
            </main>
            <Perfil />
        </div>
    );
}