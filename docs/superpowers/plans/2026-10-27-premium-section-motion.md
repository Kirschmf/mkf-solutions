# Premium Section Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax for tracking.

**Goal:** Estender o movimento editorial aprovado da hero às seções atuais, preservando navegação, acessibilidade e dados.

**Architecture:** Um motor opt-in de entradas por viewport substitui o fade genérico. Cabeçalhos usam máscaras React explícitas; transições de seleção usam contextos locais independentes dos wrappers de entrada. Estados comerciais e controles permanecem nas features.

**Tech Stack:** React 19, TypeScript, GSAP 3.15, ScrollTrigger, CSS Modules, Playwright, Vitest.

**Spec:** docs/superpowers/specs/2026-10-27-premium-section-motion-design.md

## Global Constraints

- Hero intacta; não restaurar portfólio removido em ff6cac9.
- Sem dependências novas, pin ou scroll artificial.
- Entradas 750 ms, stagger de títulos 90 ms, grupos 75 ms; seleção 320 ms.
- Todo contexto deve usar revert na limpeza e em movimento reduzido.
- Não animar internos do React Flow nem o ancestral do WhatsApp fixo.

## Review Focus

- Reduzir movimento no meio de uma entrada ou seleção deixa o conteúdo totalmente visível.
- Focar um controle antes do fim do reveal não deixa o foco oculto por máscara.
- Trocas rápidas de abas, etapas ou FAQ não deixam conteúdo residual ou altura errada.
- Mudança de largura e abertura de FAQ/formação recalculam o layout sem overflow.
- Campos do briefing mantêm valor e ordem de foco após próximo/voltar.

## Task 1: Motor comum e laboratório — root

**Files:** src/app/reveal.ts, src/app/usePanelMotion.ts, src/components/MotionHeading.tsx, src/styles/global.css, src/features/workflow/WorkflowLab.tsx.

**Interfaces:**
- MotionHeading({lines: string[], className?: string, id?: string, as?: 'h2'|'h3'}) produz heading semântico com data-motion-heading e filhos [data-motion-line]. Texto acessível contém espaços.
- usePanelMotion(ref: RefObject<HTMLElement|null>, key: string|number, options?: {direction?: number}) anima filhos diretos após mudança de key, pula a montagem e consome useMotionPreference internamente.
- initScrollReveal(reducedMotion:boolean):()=>void mantém a API atual e export ScrollTrigger; processa data-motion-heading, data-motion-panel, data-motion-group (filhos [data-motion-item]), data-motion-image, data-motion-parallax='24', data-motion-rule. Não seleciona a hero.
- Wrappers data-motion-panel recebem clip/transform; transições locais devem usar um filho diferente. data-motion-group pode ser o próprio grupo sem animar seu transform.

- [x] Registrar capturas de baseline e confirmar fonte/mídia de referência.
- [x] Implementar headings com máscara e motor de entradas opt-in, cleanup completo e conclusão em focusin.
- [x] Implementar hook local com fromTo, contexto/revert e ScrollTrigger.refresh após transições de layout.
- [x] Marcar título, texto e wrapper estável da bancada; preservar a lógica operacional.
- [x] Conferir manualmente entrada, redução durante scroll e teclado; executar testes de tipos.

## Task 2: Soluções e processo — worker A

**Files:** src/features/services/ServiceExplorer.tsx, services.module.css, src/features/process/ProcessExplorer.tsx, process.module.css.

**Consumes:** MotionHeading e usePanelMotion definidos na Task 1; atributos do motor comum.
**Produces:** seleção existente com entradas por camada, linhas e progresso responsivos.

- [x] Trocar data-reveal por MotionHeading/grupos/painéis sem animar duas vezes o mesmo nó.
- [x] Usar usePanelMotion em um conteúdo interno de soluções e no detalhe do processo.
- [x] Adicionar indicador/progresso de etapas com transformação CSS; estado aria-pressed e cliques preservados.
- [x] Definir tipografia editorial e divisores sem mudar texto e dados.
- [x] Verificar escolhas rápidas, mobile e movimento reduzido; reportar arquivos e verificações.

## Task 3: Perfil, FAQ e briefing — worker B

**Files:** src/features/profile/ProfileExplorer.tsx, ProfileExplorer.module.css, src/features/contact/BriefWizard.tsx, contact.module.css.

**Consumes:** Mesmas interfaces da Task 1.
**Produces:** retrato e headings revelados, trocas locais, FAQ com altura fluida e briefing direcional sem perder foco.

- [x] Usar MotionHeading e alvos opt-in; retrato tem máscara externa e imagem interna com parallax24 desktop.
- [x] Usar usePanelMotion em perspectiva/atividades/carreira com refs distintas das entradas globais.
- [x] Animar FAQ aberto/fechado sem conteúdo fechado focável; manter aria-expanded/controls e estados.
- [x] Marcar título e painel estável do contato, animar o corpo interno conforme step e direção, preservando o efeito de foco existente e inputs.
- [x] Atualizar ScrollTrigger após formação/FAQ mudar de altura; verificar navegação e redução.

## Task 4: Verificação e publicação — root + revisão independente

**Files:** tests/e2e/premium-motion.spec.ts, documentação de referências e verificação.

- [x] Reproduzir o cleanup incompleto do painel de soluções com teste de redução no meio da troca antes da correção.
- [x] Cobrir troca rápida de abas/processo, FAQ e conteúdo fechado, briefing preenchido e teclado durante entrada; testes focam comportamento observável.
- [x] Build, tipos, unidade e navegação completa; capturas nos sete viewports; revisar composição e erros de página.
- [x] Revisão independente de código/movimento, corrigir achados e verificar novamente os pontos alterados.
- [x] Atualizar documentação, commit, integrar e publicar pelo Git na Vercel conforme autorização persistente; conferir commit, assets e fluxos no domínio público.
