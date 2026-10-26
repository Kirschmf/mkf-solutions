# MKF Solutions — nova experiência de apresentação e portfólio

Data: 26/10/2026. Estado: planejamento; o site hospedado permanece privado e inalterado.

## Decisão de produto

Reconstruir a apresentação comercial como uma vitrine de trabalho explorável: o visitante escolhe uma necessidade, manipula projetos reais, experimenta uma operação e conhece a experiência de Matheus por evidências. A identidade vem do trabalho e da interação, com o carrossel do portfólio como principal gesto visual.

O pedido cobre identidade visual, composição, conteúdo, navegação, animações, interações, mobile e organização do código. Não é uma troca isolada de cores ou componentes. Os dados verificados, a foto fornecida e o número comercial continuam sendo os insumos da nova apresentação.

## Base observada

| Superfície atual | Evidência | Mudança necessária |
| --- | --- | --- |
| Esfera atrás da foto | `src/NetworkScene.jsx`: pontos, segmentos e rotação contínua em `requestAnimationFrame` | Remover componente e cena; apresentar a pessoa e seus projetos diretamente. |
| Abertura e texto comercial | `src/App.jsx`: promessa ampla, cartão flutuante e frase de efeito | Reescrever com serviços concretos e seletor de necessidade que muda a apresentação. |
| Serviços | Cinco accordions com ícones e textos | Exploração por necessidade, com exemplo real, entregáveis e próximo passo. |
| Portfólio | Grade de seis destaques, seguida de arquivo inicialmente limitado a 12 entradas | Anel de sites em movimento, catálogo integral e casos com navegação própria. |
| Demonstração | `setInterval` incrementa um contador; não há pedido, estoque ou decisão operacional | Executar regras com dados editáveis; representar os resultados no mapa. |
| Apresentação | Foto, biografia, blocos técnicos e timeline principalmente estáticos | Três perspectivas selecionáveis, evidências e trajetória clicável. |
| Contato | Formulário único sobre linhas animadas | Briefing guiado com revisão da mensagem e reaproveitamento das escolhas anteriores. |
| Código | `App.jsx` com aproximadamente 29 KB em 77 linhas; CSS com aproximadamente 39 KB em 14 linhas | Separar os domínios de interação e escrever estilos legíveis por seção. |

O catálogo contém 55 registros: 49 projetos/entregas e seis estudos/métodos. Há 26 registros com imagem principal e 29 sem imagem. Os 37 arquivos de mídia incluem complementos e galerias; não representam 37 projetos cobertos.

## Direção visual escolhida

**Conceito:** estúdio de desenvolvimento e operação, com uma mesa de projetos que o visitante consegue explorar.

- Base clara `#F4F5F2`, texto grafite `#17191D`, azul principal `#2548F4`, cinza secundário `#626873`, divisórias `#D7DCE1` e branco `#FFFFFF`. Validar contraste em cada aplicação.
- Tipografia proposta: Instrument Sans variável para conteúdo e títulos; IBM Plex Mono apenas em valores e registros da demonstração. Hospedar os arquivos localmente e preservar licenças.
- Títulos com formas e escala marcantes, texto de leitura entre 16 e 18 px; informações secundárias a partir de 13 px. Evitar o corpo de 9–11 px da versão atual.
- Composição assimétrica, imagens maiores e alternância deliberada entre leitura, exploração e experimentação. Retirar a repetição de blocos com título à esquerda e complemento à direita em todas as seções.
- Foto em enquadramento natural e retangular; sem arco, esfera ou etiqueta flutuante sobre o retrato.
- Retirar fundos de partículas, órbitas, linhas ambientais, contornos luminosos e revelação de letras por desfoque. Ícones entram nos controles e estados em que ajudam a reconhecer uma ação.
- Reservar profundidade 3D ao portfólio. O restante usa mudanças de estado, composição e continuidade espacial.
- Reescrever todas as frases comerciais. Proposta para a abertura: **“Sites, sistemas e automações para empresas.”** Complemento: **“Desenvolvimento, integrações e gestão de e-commerce por Matheus Kirsch.”**

Foram consideradas uma interface de cockpit operacional e uma apresentação cinematográfica toda em 3D. A primeira daria peso excessivo à ferramenta; a segunda repetiria o problema de efeitos dominando o conteúdo. A direção escolhida favorece projetos reconhecíveis e ações claras.

## Jornada e contrato de interação

IDs estáveis de necessidade: `sites`, `automations`, `apps`, `ecommerce`, `operations`.

| Seção | O visitante faz | Resposta observável |
| --- | --- | --- |
| Abertura | Escolhe o que precisa | Troca a prévia por um projeto ou processo relacionado; ajusta a ação principal. |
| Soluções | Seleciona uma necessidade | Vê escopo, exemplo real, entregáveis e como começar. |
| Portfólio | Gira, arrasta, filtra e seleciona | Traz um projeto à frente, consulta imagens e abre um estudo de caso. |
| Automação | Edita dados, executa e toma decisões | Muda o caminho, o pedido, o estoque local e o resultado baixável. |
| Apresentação | Escolhe uma perspectiva ou momento da trajetória | Reorganiza evidências e explica a experiência ligada a elas. |
| Processo de contratação | Percorre as etapas | Vê exemplos de entregáveis e o que precisa fornecer em cada etapa. |
| Contato | Preenche contexto e revisa | Gera mensagem coerente com suas escolhas e abre o WhatsApp por ação explícita. |

A leitura principal permanece disponível sem depender de passar o cursor. Escolher uma necessidade não bloqueia a consulta às demais. Trocar de seção conserva somente contexto útil para o briefing.

### R1 — Abertura

- O seletor exibe cinco intenções: criar um site, automatizar uma rotina, desenvolver um sistema, montar uma loja e organizar vendas.
- Seleção inicial explícita: criar um site. Mostra uma captura real e um resumo curto, sem começar uma simulação operacional automaticamente.
- Uma seleção do visitante reorganiza a prévia em 200–350 ms por GSAP; movimento reduzido troca o conteúdo diretamente.
- Ações: `Ver projetos relacionados`, `Testar uma automação` e acesso ao contato. O rótulo principal acompanha a escolha sem criar ações redundantes.
- A foto identifica Matheus e estabelece presença pessoal; o retrato não responde ao cursor com movimentos gratuitos.

### R2 — Soluções

- Substituir os cinco accordions por explorador com painel compartilhado.
- Cada intenção revela: situação atendida, entregáveis, limites do escopo, caso real relacionado e botão `Começar por aqui`.
- Exemplos: Ferranti para site institucional; Perpacks/Digital para e-commerce; Easy Fichas para automação; CRM para sistemas; Fersil para gestão operacional.
- Comparar entrada e saída quando o case tiver evidência: imagem original e imagem produzida, dado de catálogo e resultado organizado. Não criar indicadores de ganho sem medição.
- `Começar por aqui` preenche a necessidade no briefing e mantém o visitante no mesmo site.

### R3 — Portfólio giratório, prioridade máxima

**Referência principal de comportamento:** anel de sites da Truth Commerce. **Referências complementares:** Arc Flow Carousel no 21st e 3D Carousel w/ GSAP Draggable no CodePen.

- Apresentar capturas em cartões horizontais num anel 3D aberto, com cartão ativo frontal e laterais inclinadas. Título, resumo e ações ficam fora da superfície em rotação, sempre legíveis.
- Desktop: cartão central com cerca de 560 × 360 px, ajustado ao espaço disponível. A área não exige milhares de pixels de rolagem para continuar a página.
- Renderizar nove posições visuais reutilizáveis e navegar pelos 55 registros filtrados. Não criar três cópias de todo o catálogo nem carregar 165 texturas.
- Controles: arraste, setas visíveis, teclado com foco no palco, contador `projeto atual / total` e controle de reprodução.
- Reprodução automática inicial: avançar um projeto a cada seis segundos enquanto o palco estiver visível e sem interação. Pausar ao passar o cursor, receber foco, arrastar, abrir um case ou ativar movimento reduzido. Depois de uma interação, retomar somente pelo botão `Reproduzir`.
- Roda vertical continua rolando a página. Arraste horizontal e gesto horizontal podem navegar pelo anel; não capturar globalmente a rolagem.
- Filtro e busca controlam simultaneamente anel e catálogo. Sem resultados, mostrar ação para limpar filtros. Com um resultado, desligar repetição e desabilitar setas. Sem imagem carregada, identificar a prévia indisponível sem travar a seleção.
- Catálogo completo imediatamente acessível no modo `Todos os projetos`, com as 55 entradas e sem o limite inicial de 12. Imagens são carregadas conforme a proximidade de leitura.
- Alternar `Galeria 3D` e `Todos os projetos` preserva filtro e seleção.
- Cada case abre com URL compartilhável `?projeto=<id>#portfolio`; o botão Voltar restaura o estado anterior. Conteúdo: contexto, participação, entregáveis, galeria, estágio e link externo somente quando disponível.
- Clique na imagem permite ampliação. A navegação das galerias funciona por toque e teclado.
- Mobile: um cartão com aproximadamente 86% da largura disponível e vizinhos parciais, swipe e setas. Usar profundidade CSS leve e a mesma seleção; não reduzir o trabalho a uma miniatura ilegível.
- Movimento reduzido ou falha de WebGL mantém carrossel HTML, catálogo e casos completos. Three.js é importado sob demanda para o palco, sem cena ambiental.
- Acessibilidade: os controles HTML são a interface semântica; meshes não recebem responsabilidade por foco ou conteúdo essencial. Atualizações anunciam somente a seleção concluída.

#### Cobertura das 29 prévias ausentes

Criar matriz por ID com tipo de entrega, origem, disponibilidade, estágio e imagem aprovada.

1. Sites e protótipos: capturar a implementação existente, pública ou local.
2. Sistemas internos: capturar a interface real em ambiente com dados demonstrativos, identificando a demonstração.
3. Automações e ferramentas sem interface: registrar execução real com entrada demonstrativa e saída correspondente.
4. Operações: usar entregáveis reais sanitizados, comparativos de catálogo e peças produzidas.
5. Estudos: mostrar o trabalho efetivamente desenvolvido com o estágio visível.

Onde não houver artefato visual verificável, manter o case com identificação `Prévia visual indisponível`. Não inventar telas ou atribuir a ele a miniatura de outro projeto. As 26 imagens existentes passam por revisão de enquadramento e resolução.

### R4 — Laboratório operacional, prioridade máxima

O fluxo principal será **“Do pedido ao acompanhamento”**. O visitante manipula dados de uma operação demonstrativa e acompanha sua transformação num mapa. React Flow apresenta nós e conexões; o motor de regras roda num reducer puro. GSAP representa a transferência de dados entre etapas.

**Entrada padrão:** produto `Produto de demonstração`, preço de R$ 120,00, duas unidades, cinco em estoque e frete demonstrativo de R$ 18,00. Total: R$ 258,00. Valores monetários armazenados em centavos.

**Etapas e resultados:**

1. Editar pedido: produto, preço, quantidade, estoque disponível e frete.
2. Validar: bloquear quantidade/preço inválidos com instrução no campo; mostrar o pedido normalizado.
3. Conferir estoque: falta bloqueia o fluxo. A pessoa reduz quantidade, simula reposição ou cancela.
4. Avaliar regra comercial: total acima de R$ 300,00 exige aprovação. No limite de R$ 300,00, seguir sem aprovação.
5. Simular pagamento: aguardar `Confirmar pagamento de teste` ou `Recusar`. Execução automática também aguarda essa escolha.
6. Registrar pedido: criar um registro e descontar o estoque local uma única vez. Opção `Simular falha de registro` exige correção e nova tentativa, sem desconto duplicado.
7. Preparar comunicação: compor uma mensagem com dados do pedido. A interface identifica a mensagem como prévia.
8. Consolidar: exibir pedido, estoque antes/depois, decisões e arquivos `pedido.json` e `itens.csv` gerados pelos dados atuais.

**Controles:** executar próximo passo, executar automaticamente, pausar, retomar, reiniciar e cancelar. Presets: pedido normal, estoque insuficiente, pagamento recusado, aprovação necessária e falha de registro.

**Inspeção:** clicar num nó mostra entrada, regra e saída. Selecionar uma conexão mostra o dado transferido. Um pequeno cartão representando o pedido percorre somente a ligação da transição ocorrida.

**Consistência:** mudar entradas após o início pausa a execução e pede `Reiniciar com estes dados`. Reiniciar invalida eventos atrasados por `runId`. Nova tentativa não recria um registro já concluído. Cancelamento anterior ao registro não desconta estoque. Cancelar depois do registro não desfaz silenciosamente um resultado já mostrado; a ação passa a ser `Reiniciar demonstração` e restaura a base local.

**Modo de execução:** cada clique conclui uma transição válida. O modo automático agenda a próxima transição, respeita pausas e para em decisões e erros. Terminar uma animação não aprova pagamentos nem altera estoque.

**Apresentação:** desktop com editor, mapa e inspetor; mobile com etapas verticais selecionáveis e o mesmo motor. Visão geral do mapa disponível por botão.

O texto permanente `Demonstração local` explica o ambiente. Dados, arquivos e regras funcionam no navegador. A simulação não declara pedido registrado em ERP real, pagamento processado ou mensagem enviada externamente.

Uma segunda rota curta, **“Do contato ao briefing”**, reaproveita o briefing comercial: necessidade e contexto → regra simples de encaminhamento por serviço → cartão demonstrativo de CRM → resumo → revisão da mensagem de WhatsApp. O contexto pode ser levado ao contato; envio continua sendo uma ação explícita da pessoa.

### R5 — Apresentação pessoal, prioridade máxima

- Foto presente em composição editorial; texto principal identifica Matheus e sua atuação sem depender de interação.
- Três perspectivas: **Construir**, **Conectar** e **Operar**.
- `Construir`: desenvolvimento Full Stack e participação na plataforma B2B da Specialized pela Object Edge; projetos de site e sistema relacionados.
- `Conectar`: Easy Fichas, colaboração no AutomaTruth e integrações; exemplo real de entrada e saída.
- `Operar`: lojas, catálogo e marketplaces; evidências de entregas e responsabilidade exercida.
- Trocar perspectiva reorganiza uma pequena composição de capturas reais com GSAP Flip e altera a explicação. Botões `Ver este projeto` levam ao case correspondente.
- Linha do tempo clicável: Exército → Object Edge → Truth Commerce/MKF. Seleção mostra período, função e relação com a atuação atual. Formação e certificações ficam disponíveis em painel legível.
- Preservar distinção entre participação em equipe, personalização de uma loja existente e autoria de um sistema. Não usar percentuais de habilidades ou resultados inventados.

### R6 — Processo, navegação e contato

- Processo com etapas selecionáveis: briefing, definição de escopo, desenvolvimento, validação e entrega. Cada etapa mostra o que é produzido e como o cliente participa.
- Navegação leve, com seção atual identificada e ações que mantêm o contexto. O menu mobile fecha ao escolher destino e devolve foco ao controle adequado.
- Contato em três etapas: necessidade → contexto → revisão. Necessidade reaproveitada da jornada; nome/empresa opcional de até 120 caracteres; objetivo entre 3 e 1.500 caracteres.
- Revisão mostra a mensagem inteira antes de `Abrir conversa no WhatsApp`.
- Número obrigatório: `5551991629355` / **+55 51 99162-9355**.
- Voltar um passo preserva os campos. Falha de clipboard oferece mensagem selecionável; não falha silenciosamente.
- FAQ reescrita com respostas diretas e visual coerente. Remover frases vazias de rodapé e o fundo de linhas do contato.

## Arquitetura e limites

- Manter React 19.3.1, Vite 8.3.5, GSAP 3.15.0 e Three.js 0.186.1. React Flow proposto: `@xyflow/react@12.12.0`, versão consultada nesta pesquisa. Verificar compatibilidade no lockfile da execução.
- Componentes novos em TSX, dados tipados nas fronteiras e CSS Modules por domínio. `App.jsx` fica responsável pela composição da página.
- Um contexto pequeno mantém necessidade, rascunho do briefing e seleção do projeto. Estado operacional fica isolado no laboratório.
- Sem nova biblioteca global de estado. XState fica dispensado enquanto os fluxos não exigirem atores paralelos.
- Um controlador de navegação serve tanto o anel Three.js quanto a versão HTML; filtros e seleção têm fonte única.
- Carregar sob demanda o palco Three.js, o grafo e as galerias ampliadas. Limitar texturas às nove posições ativas; liberar geometria, material e textura substituídos. Pausar renderização fora da tela e quando o documento estiver oculto.
- Usar Spell UI em funções concretas: `Copy Button` na revisão do briefing e `Keyboard Shortcuts` nas instruções do portfólio. Adaptar feedback e movimento reduzido ao desenho da MKF. Remover Blur Reveal, Tilt Card e Background Paths da experiência antiga.
- Usar 21st/CodePen como fonte de mecanismos e referências, com autoria/licença registrada. A fonte completa do Arc Flow exige conta gratuita; isso não bloqueia reconstruir o comportamento observado com as bibliotecas já disponíveis. Não copiar o site inteiro da Truth nem importar seus números comerciais.
- Manter `project_id=appgprj_6adf6ab49ea88191b5a1ef2439853d53`, o endereço do site e acesso privado durante a execução e revisão.

## Aceite da refatoração

- R1–R6 implementados e cada ação da tabela de interação verificada no navegador.
- Esfera, rede de pontos e fundo de linhas removidos do código entregue; nenhuma cena ambiental substituta.
- As 55 entradas continuam acessíveis. Busca, categorias, galeria e URL de case concordam com o projeto ativo.
- Arraste, setas, teclado, toque e alternativa sem WebGL funcionam; autoplay pausa corretamente.
- Demonstração executa as regras especificadas, bloqueia decisões e permite recuperação. Arquivos baixados correspondem exatamente ao resultado mostrado.
- Alterar quantidade realmente muda totais, aprovação quando aplicável, estoque e mensagem.
- Retry e clique duplicado não duplicam pedido/desconto. Reiniciar cancela eventos antigos. Movimento reduzido produz os mesmos resultados operacionais.
- Perfil selecionável apresenta evidências e participação corretas.
- Sem sobreposição ou rolagem horizontal em 320, 390, 768, 1.440 e 1.920 px. Testar texto a 200%, teclado e preferência por movimento reduzido.
- Nenhuma imagem privada de cliente, prova social fictícia ou resultado comercial não medido é incorporado.
- Build, tipos e testes de regras/jornadas passam; console sem erro e nenhuma imagem obrigatória quebrada.
- Comparativo visual registra abertura, soluções, portfólio, laboratório, perfil, processo e contato antes/depois. Todas essas superfícies precisam mudar em composição, conteúdo e interação.

## Referências consultadas e limites de verificação

- Truth Commerce: https://truthcommerce.com.br — página publicada vista em navegador; fonte local analisada em `C:/Users/makfo/Projetos/TruthCommerce/src/components/CarrosselCases.jsx`, `three/Carousel3D.jsx`, `three/CarouselCanvas.tsx`, `CasesCarousel2D.jsx` e `CaseDetailPanel.tsx`.
- Arc Flow Carousel: https://21st.dev/@hyperiux/components/arc-flow-carousel — preview inspecionado em desktop/mobile, teclado e movimento reduzido; página declara MIT e GSAP. Ajustar proporção e tamanho para screenshots de sites.
- 3D Carousel w/ GSAP Draggable: https://codepen.io/Prowhiz/pen/PwovQNP — código público consultado; preview automatizado bloqueado pelo CodePen. Referência de geometria/arraste, não de qualidade já validada em todos os dispositivos.
- Circular cards carrousel: https://codepen.io/pixelmary/pen/vYPXYZr — referência complementar de arco e inércia; não é a base recomendada.
- React Flow Custom Nodes: https://reactflow.dev/learn/customization/custom-nodes
- React Flow Computing Flows: https://reactflow.dev/learn/advanced-use/computing-flows
- React Flow Animating Edges: https://reactflow.dev/examples/edges/animating-edges
- React Flow Accessibility: https://reactflow.dev/learn/advanced-use/accessibility
- Animated Beam: https://21st.dev/@dillionverma/components/animated-beam e https://magicui.design/docs/components/animated-beam — efeito de conexão; não é motor de execução.
- GSAP Flip: https://gsap.com/docs/v3/Plugins/Flip/
- GSAP MotionPath: https://gsap.com/docs/v3/Plugins/MotionPathPlugin/
- Spell Copy Button: https://spell.sh/docs/copy-button — componente e propriedades consultados.
- Spell Keyboard Shortcuts: https://spell.sh/docs/kbd — componente e propriedades consultados.
- Apresentação/interação: https://rauno.me/craft/exclusion-tabs e https://dennissnellenberg.com/about — páginas/fontes consultadas; animações não auditadas visualmente nesta pesquisa.

Os componentes e bibliotecas seguem suas licenças próprias. O repositório da Truth não apresenta uma licença geral na raiz; reconstruir o comportamento, preservando autoria e ativos específicos de cada marca.
