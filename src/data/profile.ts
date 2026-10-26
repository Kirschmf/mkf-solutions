export type PerspectiveId = 'build' | 'connect' | 'operate';

export const perspectives = [
  { id: 'build', label: 'Construir', title: 'Da interface ao sistema que sustenta o negócio.', description: 'Desenvolvimento Full Stack com React, TypeScript, Node.js e APIs. Pela Object Edge, participei da equipe da plataforma B2B global da Specialized, em Oracle CX Commerce. Na MKF, essa experiência se traduz em sites, aplicações e ferramentas com escopo definido.', evidence: ['truthcommerce-site', 'easy-fichas', 'perpacks'], note: 'Sites e sistemas: experiência de produto, implementação e integração.' },
  { id: 'connect', label: 'Conectar', title: 'Fazer a informação chegar ao próximo passo.', description: 'Desenvolvo automações como o Easy Fichas e colaboro no AutomaTruth. O trabalho começa na entrada: entender o dado, preparar a transformação e conferir a saída antes de conectar outras ferramentas.', evidence: ['easy-fichas', 'perpacks', 'truthcommerce-site'], note: 'Entrada e saída reais: organização de catálogo e códigos SKU da Linda Casa.' },
  { id: 'operate', label: 'Operar', title: 'Conhecer o que acontece depois da entrega.', description: 'Atuação com lojas, catálogo, precificação e rotinas de marketplaces na Truth Commerce. Essa vivência aproxima o desenvolvimento de quem cadastra produtos, acompanha pedidos e mantém a operação funcionando.', evidence: ['perpacks', 'truthcommerce-site', 'easy-fichas'], note: 'Perpacks: personalização e evolução de uma loja existente.' },
] as const;

export const career = [
  { id: 'army', company: 'Exército Brasileiro', period: 'jan. 2022 — jul. 2024', shortPeriod: '2022–2024', role: 'Oficial', description: 'Liderança de equipes, planejamento e logística. Uma base de organização e responsabilidade que acompanha a condução dos projetos.', relation: 'Planejar, comunicar e acompanhar a execução.' },
  { id: 'object-edge', company: 'Object Edge', period: 'jan. 2025 — mai. 2026', shortPeriod: '2025–2026', role: 'Full Stack Developer · equipe Specialized', description: 'Participação na equipe de desenvolvimento e manutenção do e-commerce B2B global da Specialized Bikes, com React, TypeScript e Oracle CX Commerce.', relation: 'Experiência profissional em equipe; a plataforma não é uma criação de autoria exclusiva.' },
  { id: 'truth-mkf', company: 'Truth Commerce / MKF', period: 'mai. 2026 — atual', shortPeriod: '2026–atual', role: 'Desenvolvimento e operação digital', description: 'Sites, aplicações, automações e evolução de lojas. Trabalho com catálogo, integrações e acompanhamento de operações digitais.', relation: 'A MKF reúne desenvolvimento e experiência prática em comércio digital.' },
] as const;

export const credentials = [
  { title: 'Formação', text: 'Ciência da Computação em andamento. Inglês avançado.' },
  { title: 'Salesforce', text: 'Certified Associate, Administrator, Platform App Builder, Platform Developer I e JavaScript Developer I.' },
  { title: 'Dados e desenvolvimento', text: 'IBM — Databases and SQL for Data Science with Python. Edureka — Modern Web Development with TypeScript.' },
  { title: 'Produto e métodos', text: 'University of Virginia / Darden — Product Analytics and AI e Agile Development.' },
] as const;
