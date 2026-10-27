export type PerspectiveId = 'build' | 'connect' | 'operate';

export const perspectives = [
  {
    id: 'build',
    label: 'Construir',
    title: 'Da interface ao sistema que sustenta o negócio.',
    description: 'Desenvolvimento Full Stack com React, TypeScript, Node.js e APIs. A experiência em equipe na Object Edge se soma à atuação na MKF com sites, aplicações e ferramentas de escopo definido.',
    activities: [
      { title: 'Interfaces', description: 'Desenvolvimento de páginas, formulários e interações para aplicações web.' },
      { title: 'Aplicações', description: 'Implementação de funcionalidades e regras que dão suporte às rotinas do negócio.' },
      { title: 'Integrações', description: 'Conexão entre interfaces, serviços e APIs para consultar e enviar informações.' },
    ],
  },
  {
    id: 'connect',
    label: 'Conectar',
    title: 'Fazer a informação chegar ao próximo passo.',
    description: 'Desenvolvimento de automações e integração de ferramentas. O trabalho começa na entrada: entender o dado, preparar a transformação e conferir a saída antes de conectar a próxima etapa.',
    activities: [
      { title: 'Entrada de dados', description: 'Levantamento dos campos, formatos e informações necessários para cada rotina.' },
      { title: 'Organização', description: 'Preparação de cadastros, códigos e campos para que os dados possam ser usados em outras ferramentas.' },
      { title: 'Conferência', description: 'Comparação entre a entrada e a saída da automação para acompanhar o resultado de cada etapa.' },
    ],
  },
  {
    id: 'operate',
    label: 'Operar',
    title: 'Conhecer o que acontece depois da entrega.',
    description: 'Atuação com lojas, catálogo, precificação e rotinas de marketplaces na Truth Commerce. Essa vivência aproxima o desenvolvimento de quem cadastra produtos, acompanha pedidos e mantém a operação funcionando.',
    activities: [
      { title: 'Catálogo', description: 'Organização de cadastros e informações de produtos para as rotinas de comércio digital.' },
      { title: 'Rotinas comerciais', description: 'Acompanhamento de preços, pedidos e atividades do dia a dia da operação.' },
      { title: 'Evolução de lojas', description: 'Ajustes em funcionalidades e integrações a partir das necessidades de quem usa a loja.' },
    ],
  },
] as const;

export const career = [
  { id: 'army', company: 'Exército Brasileiro', period: 'jan. 2022 — jul. 2024', shortPeriod: '2022–2024', role: 'Oficial', description: 'Liderança de equipes, planejamento e logística. Uma base de organização e responsabilidade que acompanha a condução dos projetos.', relation: 'Planejar, comunicar e acompanhar a execução.' },
  { id: 'object-edge', company: 'Object Edge', period: 'jan. 2025 — mai. 2026', shortPeriod: '2025–2026', role: 'Full Stack Developer', description: 'Participação em equipe de desenvolvimento e manutenção de e-commerce B2B, com React, TypeScript e integrações.', relation: 'Desenvolvimento em equipe e manutenção de uma plataforma de comércio digital.' },
  { id: 'truth-mkf', company: 'Truth Commerce / MKF', period: 'mai. 2026 — atual', shortPeriod: '2026–atual', role: 'Desenvolvimento e operação digital', description: 'Sites, aplicações, automações e evolução de lojas. Trabalho com catálogo, integrações e acompanhamento de operações digitais.', relation: 'A MKF reúne desenvolvimento e experiência prática em comércio digital.' },
] as const;

export const credentials = [
  { title: 'Formação', text: 'Ciência da Computação em andamento. Inglês avançado.' },
  { title: 'Salesforce', text: 'Certified Associate, Administrator, Platform App Builder, Platform Developer I e JavaScript Developer I.' },
  { title: 'Dados e desenvolvimento', text: 'IBM — Databases and SQL for Data Science with Python. Edureka — Modern Web Development with TypeScript.' },
  { title: 'Produto e métodos', text: 'University of Virginia / Darden — Product Analytics and AI e Agile Development.' },
] as const;
