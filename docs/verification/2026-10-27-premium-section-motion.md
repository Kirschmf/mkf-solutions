# Animações das seções — 27/10/2026

## Escopo

O usuário aprovou a hero e pediu as mesmas animações premium nas próximas partes, com pesquisa nas mesmas fontes, planejamento e implementação. Foram revisitados os três vídeos Dribbble indicados. Atribuição e trechos observados em `THIRD_PARTY_MOTION.md`; intenção e plano em `docs/superpowers/specs/2026-10-27-premium-section-motion-design.md` e `docs/superpowers/plans/2026-10-27-premium-section-motion.md`.

Hero preservada sem alteração. A remoção de projetos/portfólio em ff6cac9 continua vigente. Sem novas dependências ou alteração de backend, regras do laboratório, destinos externos e conteúdo comercial.

## Resultado implementado

- Títulos de seção em Instrument Serif, revelados por linhas mascaradas; painéis e grupos entram em sequência com deslocamentos menores no celular.
- Soluções transitam entre escolhas; linhas divisórias entram separadamente.
- Laboratório ganha título, introdução e entrada do enquadramento; nós, conexões e estado continuam sob sua própria lógica.
- Perfil recebe retrato com máscara/escala e parallax de 24 px no desktop, em camadas distintas; perspectiva, atividades e trajetória transitam localmente.
- Processo tem progresso proporcional e transição de descrição/entregáveis.
- FAQ expande/recolhe altura e mantém respostas fechadas com `aria-hidden` e `inert`.
- Briefing entra por camadas; próximo/voltar usa deslocamento direcional e preserva valores e foco.
- GSAP Context reverte estilos na redução de movimento e desmontagem. Foco conclui entradas imediatamente; navegação de teclado reposiciona controles fora da tela, sem mover o alvo entre pressionar e soltar o ponteiro.

## Regressões reproduzidas e corrigidas

1. Reduzir movimento no meio da seleção de serviço deixava opacidade e deslocamento intermediários. Teste falhou antes da correção e passou com limpeza por `context.revert()`.
2. Foco antes da entrada podia deixar a CTA transparente ou fora da tela. Teste cobre opacidade imediata e alcance dos quatro cantos após foco.
3. Reativar animações pelo rodapé podia provocar `Cannot read properties of undefined (reading 'end')` no recálculo do ScrollTrigger e desmontar a aplicação. Entradas agora mantêm os triggers registrados, com `toggleActions: 'play none none none'`, em vez de removê-los durante recálculos com `once`.
4. No laboratório mobile, um limite fracionário de 0,328 px fazia o reposicionamento por foco mover o botão entre pointerdown e pointerup. Reprodução isolada falhava por clique e funcionava por Enter; a proteção de foco agora distingue ponteiro pressionado e admite 1 px de arredondamento.
5. Ao sair do breakpoint desktop, o parallax restaurava a escala inicial de 1,06 da imagem. Escala e deslocamento agora usam elementos separados.

## Evidências locais

Capturas e relatórios ficam em `qa/`, ignorado pelo Git e fora da aplicação. Incluem baseline, vídeos e folhas de frames das referências, capturas das seis seções em 390/768/1440 px, matriz de layout em sete larguras, revisão independente e traces dos testes de regressão.

Validação no build de produção servido em `http://127.0.0.1:5178`:

- `npm run build`: exit 0. Bundle principal 415,18 KB (137,92 KB gzip). Permanecem apenas avisos de diretivas `use client` das bibliotecas React Flow/Lucide; nenhum aviso de chunk acima de 500 KB.
- `npm run test:types`: exit 0.
- `npm run test:unit`: 22 testes em dois arquivos passaram.
- `npm run test:e2e -- --output=qa/premium-final-e2e`: 21 testes passaram em 53,5 s, na árvore final. Inclui os seis novos cenários de movimento e todo o laboratório, inclusive reposição de estoque no celular.
- `git diff --check`: exit 0.
- Matriz visual em 320, 390, 601, 768, 1024, 1440 e 1920 px com animação explicitamente ativada: seis seções por largura, sem overflow, títulos cortados ou erros de página. Relatório: `qa/premium-visual-report.json`.
- Revisão independente visual em 390/1440 px: três ciclos pelo rodapé e três pela preferência do sistema, em perfil/processo, mantiveram as sete seções e zero erros. Foco antecipado na CTA e redução durante máscara de imagem aprovados. Frames confirmaram movimento ativo e conclusão limpa.
- Revisão independente de código e reteste do retrato em 1440 → 600 → 1440 → redução: escala final 1, parallax apenas desktop, estilos limpos em redução e zero erros de página. Sem achados pendentes.

Publicação e conferência no domínio público são realizadas após integrar esta árvore validada.
