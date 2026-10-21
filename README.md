# Versátil Agência de IA — landing page

Página estática (`index.html`) + função `api/lead.js` que repassa o formulário ao webhook do Make.

- Variável de ambiente necessária na Vercel: `MAKE_WEBHOOK_URL` (não versionar).
- Sem build: a Vercel serve `index.html` e executa `api/lead.js`.
