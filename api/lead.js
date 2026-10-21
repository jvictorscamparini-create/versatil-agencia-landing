// Recebe o formulário do site e repassa ao webhook do Make (URL fica em variável de ambiente).
module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }
  var url = process.env.MAKE_WEBHOOK_URL;
  if (!url) { return res.status(503).json({ ok: false, error: "nao configurado" }); }
  var b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== "object") { return res.status(400).json({ ok: false }); }
  var s = function (v, n) { return String(v == null ? "" : v).slice(0, n); };
  if (!s(b.nome, 120) || b.consentimento !== true) { return res.status(400).json({ ok: false, error: "dados incompletos" }); }
  var out = {
    nome: s(b.nome, 120), nome_negocio: s(b.nome_negocio, 160), segmento: s(b.segmento, 80),
    dificuldade: s(b.dificuldade, 120), ferramentas: Array.isArray(b.ferramentas) ? b.ferramentas.slice(0, 20).map(function (x) { return s(x, 60); }) : [],
    servico: s(b.servico, 120), descricao: s(b.descricao, 300), canal: s(b.canal, 20),
    whatsapp: s(b.whatsapp, 20), email: s(b.email, 160),
    consentimento: true, consentimento_privacidade: true, consentimento_marketing: b.consentimento_marketing === true,
    origem: "landing-versatil", pagina: s(b.pagina, 300), enviado_em: s(b.enviado_em, 40)
  };
  // nomes esperados pelo cenário do Make
  out.tipo = out.segmento;
  out.mensagem = [out.nome_negocio && ("Negócio: " + out.nome_negocio), out.dificuldade && ("Dificuldade: " + out.dificuldade),
    out.servico && ("Serviço: " + out.servico), out.descricao].filter(Boolean).join(" | ");
  try {
    var r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(out) });
    if (!r.ok) { return res.status(502).json({ ok: false }); }
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(502).json({ ok: false }); }
};
