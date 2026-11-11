// Trava do teste de 11/11/2026 (link direto Nail Academy + faca R2). Google Ads > Ferramentas > Scripts, programar "a cada hora".
// Pausa a campanha quando o gasto acumulado desde DATA_INICIO ou o gasto do dia passa do teto, e manda um resumo por e-mail.
// A trava rígida continua sendo o crédito pré-pago e a data de término de cada campanha; este script é a segunda camada.
var DATA_INICIO = 'AAAA-MM-DD';   // preencher no dia da ativação (formato 2026-11-12)
var EMAIL = '';                     // opcional: e-mail para o resumo (vazio = só registro do script)
var TETOS = [
  { id: '24446203806', nome: 'D4 link direto Nail Academy', total: 120, dia: 30 },
  { id: '24451648946', nome: 'US Faca dedo Search Ampla', total: 60, dia: 20 },
];

function custo(id, de, ate) {
  var r = AdsApp.search("SELECT metrics.cost_micros, metrics.clicks, metrics.impressions FROM campaign WHERE campaign.id = " + id +
                        " AND segments.date BETWEEN '" + de + "' AND '" + ate + "'");
  var c = 0, k = 0, i = 0;
  while (r.hasNext()) { var x = r.next().metrics; c += Number(x.costMicros || 0); k += Number(x.clicks || 0); i += Number(x.impressions || 0); }
  return { reais: c / 1e6, cliques: k, impressoes: i };
}

function main() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(DATA_INICIO)) throw new Error('Preencha DATA_INICIO');
  var hoje = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  var linhas = [];
  TETOS.forEach(function (t) {
    var tot = custo(t.id, DATA_INICIO, hoje), dia = custo(t.id, hoje, hoje);
    var it = AdsApp.campaigns().withIds([Number(t.id)]).get();
    if (!it.hasNext()) { linhas.push(t.nome + ': campanha não encontrada'); return; }
    var camp = it.next(), acao = '';
    if (camp.isEnabled() && (tot.reais >= t.total || dia.reais >= t.dia)) { camp.pause(); acao = ' -> PAUSADA pela trava'; }
    linhas.push(t.nome + ': total R$ ' + tot.reais.toFixed(2) + '/' + t.total + ' · hoje R$ ' + dia.reais.toFixed(2) + '/' + t.dia +
                ' · ' + tot.cliques + ' cliques · ' + tot.impressoes + ' impressões · CPC médio R$ ' +
                (tot.cliques ? (tot.reais / tot.cliques).toFixed(2) : '-') + (camp.isEnabled() ? '' : ' · pausada') + acao);
  });
  Logger.log(linhas.join('\n'));
  if (EMAIL) MailApp.sendEmail(EMAIL, 'Trava Google Ads ' + hoje, linhas.join('\n'));
}
