# Redesenho da abertura — 27/10/2026

## Pedido e resultado

Após rejeitar a abertura anterior, o usuário forneceu três referências de portfólio animado. As mídias foram recuperadas e inspecionadas em frames: Dribbble 25949833, 26995447 e 27214848. Referências completas e atribuição em `THIRD_PARTY_MOTION.md`.

Hero com retrato real recortado central, nome em Instrument Serif, fundo navy e textos laterais curtos. Prévia de projeto real acompanha a necessidade selecionada e abre o portfólio. Cinco serviços numa faixa compacta sincronizam a jornada existente. Nome, retrato e conteúdo entram em sequência; desktop usa deslocamento leve em camadas no scroll, sem pin. Mobile usa fluxo vertical. Foto WebP alpha de 68 KB e fonte local OFL. Original do retrato preservado.

## Verificação local

Build de produção em `http://127.0.0.1:5178`.

- `npm run test:types`: exit 0.
- `npm run test:unit`: 33 testes em quatro arquivos passaram.
- `npm run build`: exit 0; permanecem avisos conhecidos de chunks acima de 500 KB e diretivas de bibliotecas.
- `npm run test:e2e -- --output=qa/editorial-e2e`: 14 testes passaram em 46,9 s. Inclui seleção hero → soluções → briefing, movimento reduzido, menu mobile, teclado, responsividade e laboratório operacional.
- Capturas renderizadas em 320, 390, 768, 1440 e 1920 px, sem erros de página.
- Revisão independente adicional em 390, 601, 680, 900 e 1024 px: sem overflow ou erro material; CTAs e composição legíveis.
- Conferidas as cinco prévias: Ferranti e Oliveira, Easy Fichas, Truth Analytics, Perpacks e Authentic LG.
- Ao ativar movimento reduzido após rolar 350 px, o nome voltou de opacidade 0,7241 / deslocamento -20,23 px para opacidade 1 / transform none. A inclinação da prévia também é restaurada pelo teste de navegação.
- Nome acessível como “Matheus Kirsch”, imagens carregadas e foco visível. Não foram incorporadas imagens/vídeos das referências ao site.

Evidências ignoradas pelo Git: `qa/editorial-*.png`, `qa/editorial-verification.json`, `qa/reviewer-final-*.png` e `qa/editorial-e2e/`.
