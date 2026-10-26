# MKF Solutions — Refatoração completa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir integralmente a experiência comercial da MKF com portfólio giratório, demonstração operacional e apresentação pessoal interativa.

**Architecture:** Página React modular, com contexto de jornada comercial, navegação de portfólio independente da renderização 3D e motor puro de demonstração. CSS Modules separa estilos por domínio; os 55 registros continuam sendo a fonte única de projetos.

**Tech Stack:** React 19.3.1, Vite 8.3.5, TypeScript, GSAP 3.15.0, Three.js 0.186.1, React Flow proposto @xyflow/react 12.12.0, componentes pontuais do Spell UI, referências 21st/CodePen. Vitest e Playwright para regras e jornadas; versões de ferramentas de teste fixadas ao instalar.

**Spec:** `docs/superpowers/specs/2026-10-26-mkf-refatoracao-completa-design.md`.

## Global Constraints

- O catálogo contém 55 registros: 49 projetos/entregas e seis estudos/métodos.
- Há 26 registros com imagem principal e 29 sem imagem.
- Número obrigatório: `5551991629355` / **+55 51 99162-9355**.
- IDs estáveis de necessidade: `sites`, `automations`, `apps`, `ecommerce`, `operations`.
- Manter `project_id=appgprj_6adf6ab49ea88191b5a1ef2439853d53`, o endereço do site e acesso privado durante a execução e revisão.
- Nenhuma cena ambiental substitui a esfera. 3D fica no portfólio.
- O fluxo demonstrativo funciona localmente e não declara integração externa executada.
- Telas, resultados e participação profissional devem corresponder às evidências do acervo.

## Review Focus

- Zero, um ou muitos resultados de busca: controles e seleção continuam válidos, sem duplicar registros.
- WebGL indisponível e movimento reduzido: todo o catálogo, conteúdo e ações continuam acessíveis.
- Pausa, reset e cliques rápidos: eventos antigos e repetições não duplicam transições, pedidos ou descontos.
- URLs diretas e Voltar: o case correto abre e o estado anterior é restaurado sem perder o filtro.
- Mobile, texto a 200% e teclado: arraste não bloqueia a página e o visitante conclui fluxo e contato.

## Estrutura proposta

Arquivos novos abaixo são destinos planejados, não componentes existentes.

```text
src/
  App.jsx                           composição da página
  app/JourneyContext.tsx            necessidade, briefing e projeto selecionado
  app/types.ts                      NeedId, BriefDraft e ProjectRecord
  styles/{tokens,global}.css         identidade e fundamentos legíveis
  data/projects.json                catálogo preservado e enriquecido
  data/profile.ts                   trajetória e evidências profissionais
  data/services.ts                  soluções e relação com projetos
  features/intro/{Hero,NeedSelector}.tsx
  features/services/ServiceExplorer.tsx
  features/portfolio/
    Portfolio.tsx                   filtros, seleção e alternância de visualização
    PortfolioRing.tsx                conexão React ↔ palco
    portfolioScene.ts                ciclo de vida Three.js e nove posições
    usePortfolioNavigation.ts        filtro, busca, seleção e índices
    useProjectUrl.ts                 URL de case e histórico
    PortfolioCatalog.tsx             catálogo HTML integral
    ProjectCase.tsx                  escopo e galeria do case
  features/workflow/
    WorkflowLab.tsx                  entradas e execução
    WorkflowGraph.tsx                apresentação React Flow
    WorkflowInspector.tsx            entrada/regra/saída da etapa
    WorkflowResult.tsx               resultado e downloads
    workflow.types.ts               estados e eventos
    workflowReducer.ts              regras de transição
    orderRules.ts                   cálculo e validação em centavos
    orderArtifacts.ts               JSON e CSV
    presets.ts                      cenários demonstrativos
  features/profile/ProfileExplorer.tsx
  features/process/ProcessExplorer.tsx
  features/contact/{BriefWizard,briefMessage}.tsx
  components/{Header,Footer,ProjectImage}.tsx
  components/spell/{copy-button,kbd}.tsx
tests/e2e/{portfolio,workflow,profile-contact,responsive}.spec.ts
docs/content/portfolio-media-matrix.csv
```

Cada domínio recebe seu próprio `*.module.css`. Funções não visuais ficam em `.ts`, inclusive `briefMessage.ts`; a árvore acima agrupa nomes para leitura. Não adicionar pasta genérica de utilitários ou abstrações de um único uso.

## Ordem de execução

Prioridade de validação: direção visual → portfólio → motor da demonstração → bancada interativa → perfil → demais seções → revisão integral. Produzir uma primeira fatia desktop/mobile representativa antes de espalhar o novo desenho pelas seções restantes.

### Task 1: Base visual, jornada e abertura

**Files:** modificar `src/App.jsx`, `src/main.jsx`, `package.json`, `tsconfig.json` e `DESIGN.md`; criar `src/app/*`, `src/styles/*`, `src/features/intro/*`, `src/components/Header.tsx` e `Footer.tsx`.

**Interfaces:**
- `NeedId = 'sites' | 'automations' | 'apps' | 'ecommerce' | 'operations'`.
- `BriefDraft = { need: NeedId; name: string; objective: string }`.
- `useJourney()` retorna `{ need, setNeed, brief, updateBrief, selectedProjectId, selectProject }`.
- `NeedSelector({value: NeedId, onChange: (need: NeedId) => void})`.

- [ ] Registrar baseline da versão atual em desktop 1440 e mobile 390; conservar o commit publicado como referência de retorno.
- [ ] Configurar scripts `test:unit` (Vitest), `test:e2e` (Playwright) e `test:types` (`tsc --noEmit`) quando necessários às tarefas de lógica. Preservar `dev`, `build` e `preview`.
- [ ] Criar tokens e fontes locais da spec; montar header, abertura e rodapé novos. Remover a dependência da esfera e do fundo de linhas dessa fatia.
- [ ] Verificar no navegador que as cinco intenções trocam a prévia e a ação; `Começar` preserva a intenção no contexto. Verificar teclado e menu mobile.
- [ ] Produzir capturas da fatia em 1440 e 390. Conferir contraste, texto e foco; `npm run build` e `npm run test:types` devem terminar com exit 0.
- [ ] Commit: `feat: rebuild MKF visual foundation and interactive introduction`.

### Task 2: Evidências e cobertura visual do portfólio

**Files:** modificar `src/data/projects.json`; criar `src/app/types.ts` (complementar ao Task 1), `docs/content/portfolio-media-matrix.csv`; adicionar somente mídia comprovada em `public/assets/projects/`.

**Interfaces:** `ProjectRecord` preserva `id`, `name`, `category`, `status`, `description`, `details`, `role`, `tags`, `url`, `image`, `gallery`, `captureNote` e `visualType`; acrescenta `mediaState: 'verified' | 'demo' | 'unavailable'` e `needIds: NeedId[]`. O CSV registra `id,artifactType,source,mediaState,capturePath,reviewNote`.

- [ ] Conferir 55 IDs únicos e a divisão 26 com imagem / 29 sem imagem antes do enriquecimento.
- [ ] Classificar cada ausência e procurar o artefato real conforme R3. Capturar interfaces/execuções com dados demonstrativos quando a implementação puder ser executada.
- [ ] Rever enquadramento e identificação das imagens existentes; manter telas privadas e dados financeiros fora das capturas.
- [ ] Atualizar matriz e catálogo; cada uma das 55 entradas termina com mídia verificada/demonstrativa ou ausência explicitamente identificada.
- [ ] Verificação de conteúdo: todos os caminhos de imagem/galeria existem; nenhum ID desapareceu; nenhum case herdou imagem de projeto diferente; `npm run build` termina com exit 0.
- [ ] Commit: `content: complete project evidence and media inventory`.

### Task 3: Portfólio giratório e casos navegáveis

**Files:** criar `src/features/portfolio/*`; modificar `src/App.jsx` e testes `tests/e2e/portfolio.spec.ts`; criar teste de navegação junto ao hook.

**Interfaces:**
- `usePortfolioNavigation(projects: readonly ProjectRecord[])` retorna `{filteredProjects, selectedId, selectedIndex, query, category, setQuery, setCategory, select, next, previous}`.
- `createPortfolioScene(host: HTMLElement, onSelect: (id: string) => void)` retorna `{setCards(projects: readonly ProjectRecord[]): void; setActive(id: string | null): void; setMotion(enabled: boolean): void; dispose(): void}`.
- `useProjectUrl()` retorna `{openProjectId, openProject(id: string), closeProject()}` e observa `popstate`.
- `ProjectCase({project: ProjectRecord, onClose: () => void})`.

- [ ] Escrever testes de comportamento que inicialmente falhem: busca acentuada seleciona o resultado correto; zero resultados retorna `selectedId=null`; um resultado mantém índice zero após `next`; filtro conserva seleção quando ela ainda existe.
- [ ] Executar `npm run test:unit -- src/features/portfolio` e registrar falhas esperadas antes de implementar navegação.
- [ ] Implementar a navegação única e o catálogo completo. Implementar URLs `?projeto=<id>#portfolio`, incluindo ID desconhecido e Voltar.
- [ ] Construir palco com nove posições, imagens horizontais e conteúdo semântico em HTML. Reproduzir o comportamento do anel da Truth e adaptar a interação do Arc Flow; não transplantar o checkout da Truth.
- [ ] Implementar setas, arraste local com captura de ponteiro, reprodução a cada seis segundos e interrupções de R3. Importar Three.js sob demanda; liberar recursos em troca/desmontagem.
- [ ] Criar fallback HTML/CSS para mobile, movimento reduzido e WebGL indisponível. Instalar/adaptar Spell `Kbd` para instruções dos controles, preservando licença.
- [ ] Escrever E2E: navegar por teclado/toque; abrir case e galeria; voltar; filtrar sem resultados; negar WebGL; ativar movimento reduzido; conferir acesso aos 55 IDs. Verificar que rolagem vertical continua funcionando.
- [ ] Executar unitários, E2E de portfólio e build. Inspecionar imagens/câmera e confirmar máximo de nove slots/texturas ativas após navegar por 55 registros.
- [ ] Commit: `feat: add interactive rotating portfolio and project cases`.

### Task 4: Motor operacional da demonstração

**Files:** criar `workflow.types.ts`, `workflowReducer.ts`, `orderRules.ts`, `orderArtifacts.ts`, `presets.ts` e testes correspondentes em `src/features/workflow/`.

**Interfaces:**
- `OrderInput = {product: string; unitPriceCents: number; quantity: number; stock: number; shippingCents: number}`.
- `WorkflowState` contém `runId`, `stage`, `status`, `input`, `order`, `remainingStock`, `pendingDecision`, `error`, `history` e `registered`.
- `stage` é `edit | validate | stock | approval | payment | register | message | report`.
- `status` é `idle | running | paused | blocked | failed | completed | cancelled`.
- `workflowReducer(state: WorkflowState, event: WorkflowEvent): WorkflowState` é puro. `WorkflowEvent` é união discriminada de `START`, `NEXT`, `PAUSE`, `RESUME`, `APPROVE`, `REJECT_APPROVAL`, `RESOLVE_STOCK`, `PAYMENT`, `REGISTER_RESULT`, `RETRY`, `CANCEL`, `RESET`. Eventos de execução carregam `runId`; IDs e relógio são fornecidos pelo emissor, nunca criados pelo reducer.
- `calculateOrderTotal(input: OrderInput): number` retorna centavos; `validateOrder(input)` retorna erros por campo.
- `buildOrderArtifacts(state: WorkflowState): {orderJson: string; itemsCsv: string}` só aceita estado concluído.

- [ ] Escrever testes que falhem para total padrão 25.800 centavos, estoque final três, limite de aprovação exatamente 30.000 e aprovação exigida em 30.001.
- [ ] Acrescentar testes: quantidade zero/negativa/fracionária; preço/frete negativos ou não finitos; estoque insuficiente; cancelamento antes de registro sem débito; recusa e retry; falha de registro e retry sem duplicação; eventos de `runId` antigo ignorados; pausa impede `NEXT`; execução só conclui com decisões exigidas.
- [ ] Executar `npm run test:unit -- src/features/workflow` e registrar falhas esperadas; implementar regras/guardas de R4.
- [ ] Criar os cinco presets como entradas e opções do motor, sem sequências de animação gravadas.
- [ ] Criar geradores JSON/CSV e testar equivalência entre valores exportados e estado concluído. `registered` impede segunda criação/desconto.
- [ ] Reexecutar o conjunto até passar, rodar tipos e build.
- [ ] Commit: `feat: implement deterministic operational demo engine`.

### Task 5: Bancada, mapa e execução interativa

**Files:** criar `WorkflowLab.tsx`, `WorkflowGraph.tsx`, `WorkflowInspector.tsx`, `WorkflowResult.tsx`, `workflow.module.css`; modificar `package.json`, lockfile e `src/App.jsx`; criar `tests/e2e/workflow.spec.ts`.

**Interfaces:** os componentes consomem o `WorkflowState` e `dispatch` do Task 4; o mapa não possui cópia própria das regras. `WorkflowGraph({state, onInspectStage})`; `WorkflowInspector({state, inspectedStage})`; `WorkflowResult({state})`.

- [ ] Adicionar `@xyflow/react@12.12.0` e CSS necessário; manter `nodeTypes` estável e campos editáveis fora da área de drag.
- [ ] Construir editor, nós, conexões e inspetor. Estados de nó são derivados de `stage`, `status` e histórico.
- [ ] Implementar controles de execução e decisões humanas. O scheduler emite eventos com `runId`; limpa timers na pausa, reset, troca de cenário e desmontagem.
- [ ] Animar o dado percorrendo a conexão da transição usando SVG/GSAP. Usar Animated Beam como referência de conexão, sem loop luminoso desligado da execução.
- [ ] Implementar resultados e downloads reais. Criar a rota curta de contato → encaminhamento → cartão de CRM demonstrativo → briefing, com dados reutilizados no contato.
- [ ] Testar no browser: mudar duas para três unidades altera total de R$ 258,00 para R$ 378,00 e exige aprovação; reduzir estoque para dois bloqueia; corrigir permite prosseguir; auto para em pagamento; pausar/reset não gera etapa tardia; retry não debita duas vezes.
- [ ] Testar mobile com a visão vertical, teclado, movimento reduzido e ausência de chamadas externas durante a simulação; baixar e conferir JSON/CSV.
- [ ] Executar `npm run test:e2e -- tests/e2e/workflow.spec.ts`, unitários do motor, tipos e build.
- [ ] Commit: `feat: build interactive workflow lab and inspectable results`.

### Task 6: Apresentação pessoal e evidências

**Files:** criar `src/data/profile.ts`, `src/features/profile/ProfileExplorer.tsx`, `profile.module.css`; modificar `src/App.jsx` e `tests/e2e/profile-contact.spec.ts`.

**Interfaces:** `ProfilePerspective = 'build' | 'connect' | 'operate'`; cada perspectiva contém `title`, `description` e `projectIds` válidos no catálogo. `ProfileExplorer({onOpenProject: (id: string) => void})`.

- [ ] Modelar os fatos já verificados: Exército, Object Edge/Specialized, Truth/MKF, formação e certificações. Separar participação em equipe e autoria de produto.
- [ ] Construir as três perspectivas e timeline selecionável. Preservar a foto, variar composição e evidências conforme a escolha e usar GSAP Flip para continuidade.
- [ ] Adicionar navegação de cada evidência ao case correto. Todo texto essencial fica em HTML, com seleção perceptível também por teclado/toque.
- [ ] Escrever E2E: cada perspectiva muda descrição e evidências; timeline revela períodos/funções corretos; links resolvem um ID existente; movimento reduzido conserva informações e seleção.
- [ ] Executar o teste de perfil, tipos e build; revisar screenshots desktop/mobile.
- [ ] Commit: `feat: make professional profile explorable through project evidence`.

### Task 7: Soluções, processo e briefing completos

**Files:** criar `src/data/services.ts`, `ServiceExplorer.tsx`, `ProcessExplorer.tsx`, `BriefWizard.tsx`, `briefMessage.ts` e CSS Modules; adaptar Spell `copy-button.tsx`; modificar `src/App.jsx`, `THIRD_PARTY_MOTION.md` e `tests/e2e/profile-contact.spec.ts`.

**Interfaces:** `ServiceExplorer({need: NeedId, onNeedChange, onStartBrief})`; `buildBriefMessage(draft: BriefDraft): string`; `BriefWizard({initialDraft: BriefDraft, onDraftChange})`. O contexto conserva campos ao voltar.

- [ ] Substituir a lista de accordions pelo explorador de R2; cada serviço mostra case, escopo e ação preenchida.
- [ ] Montar o processo de contratação com entregáveis por etapa; reescrever FAQ e rodapé conforme a nova voz.
- [ ] Construir o briefing em três etapas. Validar objetivo de 3–1.500 caracteres e nome opcional de até 120; mostrar a mensagem final inteira.
- [ ] Adaptar Spell Copy Button e implementar fallback quando `navigator.clipboard` falhar. O botão que abre conversa gera URL somente para `https://wa.me/5551991629355` com a mensagem codificada.
- [ ] Escrever testes de `buildBriefMessage` para nomes com acentos, caracteres `&`/`?`, objetivo longo e campos opcionais. E2E verifica contexto vindo da abertura/serviços/laboratório, preservação ao voltar, validação e URL final.
- [ ] Executar unitários, E2E de perfil/contato, tipos e build; testar clipboard bloqueado sem perder o texto.
- [ ] Commit: `feat: connect solution exploration to guided commercial brief`.

### Task 8: Revisão integral, remoção de legado e versão privada

**Files:** revisar os módulos; remover `src/NetworkScene.jsx`, componentes antigos sem uso e `src/style.css` depois da migração; atualizar `DESIGN.md`, `THIRD_PARTY_MOTION.md`, testes e evidências em `qa/` ignorado pelo Git.

- [ ] Confirmar cobertura de R1–R6 e dos cinco itens de Review Focus. Remover imports/estilos de esfera, rede, Blur Reveal, Tilt Card e Background Paths; não deixar as duas apresentações coexistindo.
- [ ] Executar `npm run test:unit`, `npm run test:types`, `npm run test:e2e` e `npm run build`; todos precisam terminar com exit 0.
- [ ] Revisar 320, 390, 768, 1.440 e 1.920 px; texto a 200%; teclado; toque; movimento reduzido; falha de WebGL; erro de imagem; estados zero/um resultado; controle de auto-rotação e integridade dos downloads.
- [ ] Capturar antes/depois das sete superfícies principais. Revisão independente deve identificar mudanças em composição, conteúdo e interação em todas elas, e confirmar ausência de decoração ambiental genérica.
- [ ] Confirmar 55 IDs, participação correta e imagens/galerias com origens registradas. Revalidar número comercial e acesso privado.
- [ ] Commit: `refactor: finalize MKF interactive experience and remove legacy presentation`.
- [ ] Executar o workflow do Sites para o mesmo `project_id`, construir/pacotar o commit exato, salvar e implantar em privado. Renovar credencial se necessário; preservar IDs de versão/deployment em retomadas.
- [ ] Confirmar `status=succeeded`, abrir o endereço existente e entregar a versão privada com evidências da revisão. Uma mudança posterior de audiência depende de pedido do usuário.

## Paralelismo e pontos de integração

- Depois do contrato do Task 1: Task 2 (mídia) e Task 4 (motor) podem avançar em paralelo ao Task 3 (portfólio).
- Task 5 consome o motor do Task 4; Task 6 consome os IDs estabilizados do catálogo; Task 7 consome o contexto do Task 1.
- Cada responsável possui somente seu domínio e seus testes. Alterações em `App.jsx`, dependências e contexto passam pelo integrador para evitar conflito.
- A primeira revisão visual deve acontecer na fatia abertura + carrossel, antes do restante da migração. Não aguardar a página inteira para descobrir que a direção ainda parece genérica.

## Revisão do planejamento

Cobertura conferida: esfera removida (Tasks 1/8), interatividade em todas as superfícies (1/3/5/6/7), sites girando e pesquisa 21st/CodePen (3), fluxo completo com decisões/resultados (4/5), apresentação pessoal interativa (6), substituição visual/editorial/estrutural completa (1–8).

Este documento planeja a implementação. Nenhuma mudança no site hospedado foi executada nesta etapa.
