const cron = require('node-cron');
const Inscricao = require('../models/inscricaoModel');
const Notificacao = require('../models/notificacaoModel');

const criarNotificacoesDeEventos = async () => {
  try {
    const hoje = new Date();
    const diasAviso = [3, 2, 1, 0];

    for (let dias of diasAviso) {
      const dataAlvo = new Date(hoje);
      dataAlvo.setDate(hoje.getDate() + dias);
      dataAlvo.setHours(0, 0, 0, 0);

      const proximoDia = new Date(dataAlvo);
      proximoDia.setDate(dataAlvo.getDate() + 1);

      // Buscar inscrições com evento na data alvo
      const inscricoes = await Inscricao.find({
        'evento.dataMarcada': { $gte: dataAlvo, $lt: proximoDia }
      }).populate('evento').populate('usuario');

      for (let inscricao of inscricoes) {
        let message;
        if(dias != 0){
            message = `Faltam ${dias} dia(s) para o evento ${inscricao.evento.titulo}`;
        }else{
            message = `O evento ${inscricao.evento.titulo} é hoje!`;
        }

        const existe = await Notificacao.exists({
          usuarioId: inscricao.usuario,
          eventoId: inscricao.evento._id,
          tipo: 'lembrete',
          mensagem:message
        });

        if (!existe) {
          const novaNotificacao = new Notificacao({
            usuarioId: inscricao.usuario,
            eventoId: inscricao.evento._id,
            mensagem:message,
            read: false,
            tipo: 'lembrete'
          });

          await novaNotificacao.save();
          console.log(`Notificação criada: ${message}`);
        } else {
          console.log(`Notificação já existe: ${message}`);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao criar notificações de eventos:', error);
  }
};

const iniciarCronNotificacoes = () => {
  cron.schedule('0 * * * *', () => {
    console.log('Executando cronjob de notificações...');
    criarNotificacoesDeEventos();
  });
};

module.exports = iniciarCronNotificacoes;
