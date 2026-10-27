# Animações interativas — 27/10/2026

Pedido: pesquisar referências de componentes e criar animações interativas em todas as abas.

## Entrega

Oito grupos usam o componente original `InteractiveTabs`: navegação, necessidades na hero, soluções, rotas de demonstração, perspectivas, trajetória, etapas do projeto e necessidades do briefing. O destaque azul/sublinhado viaja até a seleção; hover não altera a escolha; clique/toque/ativação por teclado produzem onda de luz. Conteúdo acompanha a direção da troca. A paleta azul/navy, hero editorial e ausência de projetos/cases foram preservadas.

Botões/links continuam filhos diretos, com os mesmos estados ARIA e comportamentos. Camadas decorativas têm `aria-hidden` e `pointer-events:none`. Nenhuma dependência nova. Referências e proveniência em `THIRD_PARTY_MOTION.md`.

## Revisão e correções

- A revisão independente encontrou uma corrida entre a animação de hover e o redimensionamento. O observador agora cancela a animação anterior antes de atualizar a geometria; reprodução corrigida com erro final de 0,5 px. Regressão automatizada aguarda o tempo em que a animação antiga poderia sobrescrever a posição.
- A conferência em 320 px encontrou o rótulo Desenvolvimento apertado em duas colunas. O processo passa a uma coluna até 380 px.
- A revisão de navegação identificou que a carga tardia do retrato interrompia a rolagem suave: o listener chamava refresh imediato e o GSAP restaurava a posição intermediária. Instrumentação de `scrollTo` e comparação com a imagem bloqueada confirmaram a causa. O refresh solicitado pelo observador/imagens/fontes agora usa `ScrollTrigger.refresh(true)`: o runtime GSAP 3.15 agenda o recálculo e aguarda `scrollEnd` quando há rolagem em curso. A navegação mobile passa a terminar com `#sobre` a 167,7 px do topo e Matheus ativo, em vez de parar mais de 1.200 px antes. Dois testes reproduziram a falha antes da correção.

## Evidências

- `npm run test:types`: exit 0.
- `npm run test:unit`: 22 testes passaram.
- Build de produção passou; avisos existentes sobre `use client` das bibliotecas React Flow/Lucide permanecem.
- Matriz em 320, 390, 601, 768, 1024, 1440 e 1920 px: sem overflow de página/controles; indicadores selecionados com erro máximo de 0,5 px. Nenhum erro de página.
- Revisão visual independente em 390/768/1440: preenchimentos, sublinhado, foco, textos, briefing e estado persistente entre rotas conferidos. Menu mobile reaberto mantém indicador alinhado.

Capturas, diagnósticos e relatórios locais ficam ignorados em `qa/interactive-*`, `qa/tabs-review-*`, `qa/tabs-visual-review.json` e `qa/anchor-diagnostic.mjs`.

## Verificação final

- `npm run test:e2e -- --output=qa/interactive-e2e`: 29 testes passaram em 1,3 min na compilação final. Inclui oito novos testes de seletores/navegação e todos os fluxos existentes de briefing, perfil, FAQ, responsividade, pagamento, falha/recuperação, estoque, reinício e encaminhamento de contato.
- Compilação final: `index-ki2pjJrH.css` / `index-BuTWsOiX.js`. `npm run test:types` e `git diff --check` passaram após as correções.
- Revisão final de navegação em seis contextos novos: 390/768/1440 px, menu Matheus e ação de contato da hero. Retrato efetivamente carregado; destinos a 167,7–168,4 px do topo; sem erro de página ou overflow. Clique real para reabrir o menu mobile conserva a posição e o sublinhado correto.
- A publicação usa o fluxo existente Git/Vercel. A conferência pública repete os testes de abas, teclado, preferência de movimento, perfil/briefing e responsividade, além da matriz de sete larguras. Os artefatos ficam em `qa/interactive-production-e2e/` e `qa/interactive-responsive-public.*`.
