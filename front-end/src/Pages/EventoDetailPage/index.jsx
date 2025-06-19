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
    const [titulo, setTitulo] = useState(""); 
    const [confirmados, SetConfirmados] = useState([]);
    const [pendente, SetPendente] = useState([]);
    const [cancelados, SetCancelados] = useState([]);
    const [descricao, setDescricao] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataTermino, setDataTermino] = useState("");
    const [mediaValor, setMediaValor] = useState("");
    const [gratuito, setGratuito] = useState(false);
    const [erro, setErro] = useState(false);

    useEffect(() => {
        getEventos();
        // getGrafico();
        getGraficoMock();

    }, [id]);

    const getEventos = async () => {
        callout.get(`http://localhost:5000/eventos/obterEvento/${id}`)
            .then(response => {

                setEvento(response.data)
            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }

    const getGrafico = async () => {
        callout.get(`http://localhost:5000/inscricoes/getInfoGrafico?eventoId=${id}`)
            .then(response => {
                console.log("RESPONSE", response)

                const data = {
                    labels: response.data.labels,
                    datasets: [
                        {
                            label: 'Inscrições por dia',
                            data: response.data.data,
                            borderColor: 'rgba(75,192,192,1)',
                            fill: false
                        }
                    ]
                }

                setChartData(data);
                calcularMediaInscricoes(data);

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
        console.log("total", total);
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

    const handleGratuitoCheck = (event) => {

        if (event.target.checked) {
            setMediaValor("");
        }

        setGratuito(event.target.checked)
    };

    const handleEdicao = (e) => {
        setEdicao(true)

        setTitulo(evento.titulo);
        setDataInicio(formatarData(evento.dataMarcada));
        setDataTermino(formatarData(evento.dataTermino));
        setGratuito(evento.gratuito)
        setMediaValor(evento.mediaValor)
        setDescricao(evento.descricao)
    };

    const handleCancelarEdicao = (e) => {
        setEdicao(false);
        setTitulo("");
        setDataInicio("");
        setDataTermino("");
        setGratuito(false)
        setMediaValor("")
        setDescricao("")
    };

    const handleSalvarEvento = (e) => {
        if (!titulo) {
            setErro("Campo título é obrigatório");
            return;
        }

        if (!dataInicio) {
            setErro("Campo data de início é obrigatório");
            return;
        }

        if (!dataTermino) {
            setErro("Campo data de término é obrigatório");
            return;
        }

        if (!gratuito && !mediaValor ) {
            setErro("Campo média de valor é obrigatório");
            return;
        }

        if (!descricao) {
            setErro("Campo descrição é obrigatório");
            return;
        }

        if(dataInicio > dataTermino){
            setErro("A data de início não pode ser depois da data de término");
            return;
        }

        atualizarEvento();

    };

    const atualizarEvento = async (e) => {
        callout.put('http://localhost:5000/eventos/atualizar', { id, titulo, dataMarcada:dataInicio, dataTermino, gratuito, mediaValor, descricao })
            .then(response => {
                handleCancelarEdicao();
                getEventos();
            })
            .catch(error => { console.error('Erro ao atualizar evento usuario:', error); setErro("Erro ao atualizar o evento") });
    }

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
                        Dados do evento {!edicao && <button className='dadosEvento-editar-button' style={{ color: "gray" }}><FontAwesomeIcon icon={faPencil} onClick={handleEdicao} /></button>}
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
                                        Título:
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Data Início:
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="datetime-local" placeholder="Data Inicio" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Data Término:
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="datetime-local" placeholder="Data Termino" value={dataTermino} onChange={(e) => setDataTermino(e.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Gratuito?
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="checkbox" placeholder="Gratuito?" checked={gratuito} onClick={handleGratuitoCheck} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="titulo">
                                        Média de preço:
                                    </td>
                                    <td>
                                        <input className="input-atualizar-evento" type="number" placeholder="Média de valor" value={mediaValor} disabled={gratuito} onChange={(e) => setMediaValor(e.target.value)} />
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
                                            value={descricao}
                                            onChange={(e) => setDescricao(e.target.value)}
                                        ></textarea>
                                    </td>
                                </tr>
                                {erro &&
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: "center" }}>
                                            <p style={{ color: "red" }}>{erro}</p>
                                        </td>
                                    </tr>
                                }
                                <tr>
                                    <td colSpan={2} className='evento-editar-botoes'>
                                        <button className='salvar-botao' onClick={handleSalvarEvento}>Salvar</button>
                                        <button className='cancelar-botao' onClick={handleCancelarEdicao}>Cancelar</button>
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