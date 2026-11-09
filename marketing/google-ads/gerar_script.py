"""Gera o Script do Google Ads (JavaScript) a partir de campanhas.json. Uso: python3 gerar_script.py > fundo_funil.ads.js
O script roda em Google Ads > Ferramentas > Ações em massa > Scripts. MODO 'CRIAR' monta tudo PAUSADO; 'ATIVAR' liga e ajusta a aberta."""
import json
cfg = json.load(open("campanhas.json"))
js = r"""// Cursos de Unhas · campanhas fundo de funil (gerado por marketing/google-ads/gerar_script.py; não edite à mão)
// MODO: 'CRIAR' cria tudo PAUSADO (seguro). 'ATIVAR' liga F1–F3 e ajusta a campanha aberta (só com OK do Lucas).
var MODO = 'CRIAR';
var CFG = __CFG__;

function q(gaql) { var it = AdsApp.search(gaql), out = []; while (it.hasNext()) out.push(it.next()); return out; }
function esc(s) { return s.replace(/'/g, "\\'"); }
function kw(text, match) { return { text: text, matchType: match }; }

function main() {
  var cid = AdsApp.currentAccount().getCustomerId().replace(/-/g, '');
  var C = 'customers/' + cid;
  var existentes = q("SELECT campaign.id, campaign.name, campaign.resource_name, campaign.campaign_budget, campaign.status FROM campaign WHERE campaign.status != 'REMOVED'");
  var porNome = {}; existentes.forEach(function (r) { porNome[r.campaign.name] = r.campaign; });
  var aberta = porNome[CFG.aberta.nome];
  if (!aberta) throw new Error('Campanha aberta não encontrada: ' + CFG.aberta.nome);
  var ops = [];
  if (MODO === 'CRIAR') {
    CFG.campanhas.forEach(function (c) { if (porNome[c.nome]) throw new Error('Já existe: ' + c.nome + ' (nada foi criado)'); });
    var t = -1, nid = function () { return t--; };
    // lista compartilhada de negativas
    var ss = C + '/sharedSets/' + nid();
    var existeLista = q("SELECT shared_set.resource_name, shared_set.name FROM shared_set WHERE shared_set.name = 'Base negativas v6' AND shared_set.status = 'ENABLED'");
    if (existeLista.length) { ss = existeLista[0].sharedSet.resourceName; }
    else {
      ops.push({ sharedSetOperation: { create: { resourceName: ss, name: 'Base negativas v6', type: 'NEGATIVE_KEYWORDS' } } });
      CFG.base_negativas.ampla.forEach(function (w) { ops.push({ sharedCriterionOperation: { create: { sharedSet: ss, keyword: kw(w, 'BROAD') } } }); });
      CFG.base_negativas.frase.forEach(function (w) { ops.push({ sharedCriterionOperation: { create: { sharedSet: ss, keyword: kw(w, 'PHRASE') } } }); });
    }
    // lista Base também na aberta (só negativas: melhora a aberta sem tirar tráfego bom)
    ops.push({ campaignSharedSetOperation: { create: { campaign: aberta.resourceName, sharedSet: ss } } });
    CFG.campanhas.forEach(function (c) {
      var b = C + '/campaignBudgets/' + nid(), cp = C + '/campaigns/' + nid(), ag = C + '/adGroups/' + nid();
      ops.push({ campaignBudgetOperation: { create: { resourceName: b, name: c.nome + ' · orçamento', amountMicros: String(Math.round(c.orcamento * 1e6)), deliveryMethod: 'STANDARD', explicitlyShared: false } } });
      ops.push({ campaignOperation: { create: {
        resourceName: cp, name: c.nome, status: 'PAUSED', advertisingChannelType: 'SEARCH', campaignBudget: b,
        targetSpend: { cpcBidCeilingMicros: String(Math.round(c.cpc_max * 1e6)) },
        networkSettings: { targetGoogleSearch: true, targetSearchNetwork: false, targetContentNetwork: false, targetPartnerSearchNetwork: false },
        geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE', negativeGeoTargetType: 'PRESENCE' },
        finalUrlSuffix: 'src=' + c.src,
        containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING' } } });
      ops.push({ campaignCriterionOperation: { create: { campaign: cp, location: { geoTargetConstant: 'geoTargetConstants/2076' } } } });
      ops.push({ campaignCriterionOperation: { create: { campaign: cp, language: { languageConstant: 'languageConstants/1014' } } } });
      ops.push({ campaignSharedSetOperation: { create: { campaign: cp, sharedSet: ss } } });
      c.negativas_frase.forEach(function (w) { ops.push({ campaignCriterionOperation: { create: { campaign: cp, negative: true, keyword: kw(w, 'PHRASE') } } }); });
      ops.push({ adGroupOperation: { create: { resourceName: ag, campaign: cp, name: c.id + ' · ' + c.path1, status: 'ENABLED', type: 'SEARCH_STANDARD' } } });
      ops.push({ adGroupCriterionOperation: { create: { adGroup: ag, negative: true, gender: { type: 'MALE' } } } });
      c.exata.forEach(function (w) { ops.push({ adGroupCriterionOperation: { create: { adGroup: ag, status: 'ENABLED', keyword: kw(w, 'EXACT') } } }); });
      c.frase.forEach(function (w) { ops.push({ adGroupCriterionOperation: { create: { adGroup: ag, status: 'ENABLED', keyword: kw(w, 'PHRASE') } } }); });
      ops.push({ adGroupAdOperation: { create: { adGroup: ag, status: 'ENABLED', ad: { finalUrls: [c.url], responsiveSearchAd: {
        headlines: c.titulos.map(function (x) { return { text: x }; }), descriptions: c.descricoes.map(function (x) { return { text: x }; }),
        path1: c.path1, path2: c.path2 } } } } });
    });
  } else if (MODO === 'ATIVAR') {
    CFG.campanhas.forEach(function (c) {
      var x = porNome[c.nome]; if (!x) throw new Error('Não achei ' + c.nome + ': rode CRIAR antes');
      ops.push({ campaignOperation: { update: { resourceName: x.resourceName, status: 'ENABLED' }, updateMask: 'status' } });
    });
    ops.push({ campaignBudgetOperation: { update: { resourceName: aberta.campaignBudget, amountMicros: String(Math.round(CFG.aberta.orcamento * 1e6)) }, updateMask: 'amount_micros' } });
    ops.push({ campaignOperation: { update: { resourceName: aberta.resourceName, finalUrlSuffix: 'src=' + CFG.aberta.src }, updateMask: 'final_url_suffix' } });
    CFG.aberta.negativas_cruzadas_frase.forEach(function (w) { ops.push({ campaignCriterionOperation: { create: { campaign: aberta.resourceName, negative: true, keyword: kw(w, 'PHRASE') } } }); });
    q("SELECT ad_group.resource_name FROM ad_group WHERE campaign.id = " + aberta.id + " AND ad_group.name = '" + esc(CFG.aberta.pausar_grupo) + "'").forEach(function (r) {
      ops.push({ adGroupOperation: { update: { resourceName: r.adGroup.resourceName, status: 'PAUSED' }, updateMask: 'status' } });
    });
  } else throw new Error('MODO inválido');
  Logger.log('Operações: ' + ops.length + ' (modo ' + MODO + ')');
  var res = AdsApp.mutateAll(ops, { partialFailure: false });
  var falhas = 0;
  res.forEach(function (r, i) { if (!r.isSuccessful()) { falhas++; Logger.log('FALHA op ' + i + ': ' + JSON.stringify(ops[i]).slice(0, 200) + ' -> ' + r.getErrorMessages().join(' | ')); } });
  Logger.log(falhas ? ('Com falhas: ' + falhas) : 'Tudo certo.');
}
"""
print(js.replace("__CFG__", json.dumps(cfg, ensure_ascii=False)))
