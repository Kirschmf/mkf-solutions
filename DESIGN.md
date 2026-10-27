# MKF Solutions — experiência interativa

Refatoração de 26/10/2026. Identidade: papel #F4F5F2, grafite #17191D e azul #2548F4. Instrument Sans e IBM Plex Mono hospedadas localmente, com licenças em public/fonts.

Rodada visual de 27/10/2026: navegação e contato escuros; faixa de serviços em gradiente; mapa operacional escuro. Superfícies claras do formulário e dos nós mantêm texto grafite. Procedência das imagens decorativas da rodada inicial em `docs/content/ai-imagery.md`.

A abertura foi redesenhada após o feedback de 27/10 e três referências Dribbble fornecidas pelo usuário. Retrato real recortado ao centro, nome em Instrument Serif, base navy #0D101D e texto #F3EEE7. Textos laterais curtos e um projeto real completam a composição. O fundo anterior de ondas foi substituído por luz azul discreta em CSS. Nenhuma mídia das referências foi incorporada ao site.

O nome entra por máscara, seguido pelo retrato e pelo conteúdo lateral. No desktop, nome e retrato se deslocam em ritmos diferentes com o scroll, sem prender a rolagem; a prévia responde ao cursor. Tudo é descartado ao ativar redução de movimento. Mobile empilha retrato, apresentação e prévia sem sobreposição. As cinco necessidades ficam numa faixa compacta e sincronizam prévia, soluções e briefing. A prévia abre o case correspondente no portfólio. Foto recortada com alpha em WebP de 68 KB; original preservado.

O portfólio usa nove planos reutilizáveis Three.js para apresentar 55 projetos/entregas/estudos. Há arraste, teclado, reprodução interrompível, catálogo HTML e cases com URL própria. Mobile e ausência de WebGL usam cartões HTML em perspectiva. O comportamento foi estudado na Truth Commerce, no Arc Flow do 21st e em exemplos CodePen, com implementação própria.

O laboratório executa regras em reducer puro: pedido, validação, estoque, aprovação, pagamento de teste, registro, mensagem e relatório. O mapa React Flow e a transferência GSAP refletem o estado. JSON/CSV são gerados no navegador; não há execução em serviços externos. Uma rota de contato prepara um briefing.

O perfil tem três perspectivas selecionáveis, capturas reorganizadas com GSAP Flip, trajetória e formação. Processo de contratação e contato também são exploráveis. O contato tem três etapas, revisão da mensagem e WhatsApp comercial +55 51 99162-9355.

Conteúdo verificado: 55 registros, com distinção de autoria, colaboração, personalização, operação, protótipo e estudo. A cobertura visual passou de 26 a 31 registros. Os 24 sem artefato visual disponível permanecem identificados; a matriz completa está em docs/content/portfolio-media-matrix.csv.

Acessibilidade inclui teclado, foco, textos legíveis, redução de movimento e alternativas a imagens/WebGL. Dados reais de clientes e resultados comerciais não comprovados não fazem parte da demonstração.

Atualização de 27/10/2026: todos os projetos, cases, capturas e links do portfólio foram removidos a pedido do usuário. A descrição anterior registra o histórico da versão anterior. Permanecem apresentação pessoal, competências, serviços, demonstração genérica de automação, processo e contato.

As seções seguintes agora acompanham a direção editorial da hero aprovada. Instrument Serif nos títulos, linhas entrando por máscaras em 750 ms, grupos em sequência e painéis com deslocamentos curtos. Soluções, perspectivas, atividades e trajetória respondem à seleção em 320 ms; o processo tem linha de progresso; o retrato do perfil usa revelação por máscara e parallax limitado a 24 px no desktop. A bancada preserva sua própria máquina de estados e animação operacional.

Após o feedback de que o restante continuava branco e sem cor, os grandes fundos claros foram substituídos por navy e azul. Soluções usa painel azul sobre navy; o laboratório tem painéis slate e campos escuros; o perfil ocupa um bloco azul profundo; processo e FAQ alternam navy/azul; o formulário também é escuro. Azul claro serve aos links, foco e seleção; royal com texto branco serve às ações. Cores de erro, decisão e conclusão foram ajustadas em conjunto. Hero, textos e animações permanecem preservados. Direção e evidências em `docs/superpowers/specs/2026-10-27-color-continuity-design.md` e `docs/verification/2026-10-27-color-continuity.md`.

Perguntas expandem a altura, com respostas fechadas fora da árvore acessível e do teclado. O briefing mantém os valores e o foco entre etapas, com deslocamento conforme próximo/voltar. Movimento reduzido reverte os contextos e expõe todo o conteúdo; focar um controle conclui sua entrada imediatamente e o mantém na tela. Não há pin nem alteração artificial da rolagem. Referências, decisões e validação estão em `docs/superpowers/specs/2026-10-27-premium-section-motion-design.md` e `docs/verification/2026-10-27-premium-section-motion.md`.
