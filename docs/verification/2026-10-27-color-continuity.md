# Continuidade de cor — 27/10/2026

Pedido: “Continua muito branco, sem cor”. Correção visual em CSS, preservando hero, animações, conteúdo e comportamento.

## Mudanças

Faixa royal uniforme; soluções navy com painel azul; laboratório com painéis e campos escuros; perfil azul profundo; processo navy com entregáveis azuis; FAQ azul; formulário slate. Nós do mapa usam azul claro como superfície funcional pequena. Rodapé navy. Tokens globais anteriores permanecem disponíveis; a inversão de texto/superfície é local para evitar branco sobre branco.

Seleção, foco, placeholders, opções de select, diálogo portal, erros, bloqueios, resultados, revisão da mensagem e fallback de cópia foram conferidos nas respectivas superfícies. Hero e arquivos de JavaScript/TypeScript não foram alterados.

## Verificação local

- `npm run build`: exit 0, build final `index-D-esLrHS.css` / `index-BNS_yFxv.js`. Avisos conhecidos de diretivas `use client` de bibliotecas permanecem.
- `npm run test:e2e -- --output=qa/color-e2e`: 21 testes passaram em 54,6 s. A última revisão ajustou apenas três declarações de cor, conferidas diretamente no navegador.
- `git diff --check`: exit 0.
- Capturas antes/depois em 390 e 1440 px; depois também em 768 px. Matriz de seis seções em 320, 390, 601, 768, 1024, 1440 e 1920 px: sem overflow ou erros de página. Varredura dos pares sólidos de texto e fundo não encontrou contraste abaixo dos limiares de texto pequeno/grande após as correções. Essa varredura não constitui auditoria completa de acessibilidade.
- Revisão independente em 390/768/1440: FAQ aberto, briefing com erro/fallback, perfil/carreira, processo, workflow bloqueado/concluído, encaminhamento de contato e mapa touch. Sem legibilidade comprometida, overflow ou erro de runtime.
- Achado corrigido: eyebrow do laboratório ainda herdava royal sobre navy. O build final usa `rgb(143,201,255)`. Foco do laboratório usa o mesmo azul claro; linha de seleção do perfil usa `rgb(165,213,255)`.

Evidências locais ignoradas pelo Git: `qa/color-before-*.png`, `qa/color-after-*.png`, `qa/color-review-*.png`, `qa/color-report.json` e `qa/color-e2e/`.

## Conferência após publicação

O fluxo Git/Vercel publica esta árvore em `https://mkf-solutions.vercel.app`. A checagem pública usa a mesma matriz de cores em 390/1440 px e os testes existentes de movimento, perfil, briefing e responsividade. Relatórios e capturas resultantes ficam em `qa/color-public-report.json`, `qa/color-public-*.png` e `qa/color-production-e2e/`.
