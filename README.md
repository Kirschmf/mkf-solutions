# MKF Solutions

Site e portfólio de desenvolvimento web com uma simulação interativa de pedidos. A interface foi construída com React, TypeScript e Vite.

[Abrir o site](https://mkf-solutions.vercel.app/)

## O que experimentar

- Na seção **Experimente**, rode o cenário de falha de registro, confirme o pagamento de teste e use **Corrigir falha e tentar novamente**. Ao concluir, o estoque é debitado uma única vez e o pedido pode ser exportado em JSON.
- No mesmo fluxo, selecione o cenário de estoque insuficiente para ver a pausa e retomar após simular a reposição.
- Na seção **Contato**, percorra o briefing pelo teclado. A mudança de etapa move o foco para o título da próxima tela.

A simulação roda no navegador com dados de demonstração.

## Onde ler o código

| Arquivo | O que mostra |
| --- | --- |
| [Reducer do fluxo](src/features/workflow/workflowReducer.ts) | Validação e transições entre etapas, incluindo pausa, reinício e recuperação. |
| [Testes do fluxo](tests/e2e/workflow.spec.ts) | Recuperação após falha, pausa e reinício, estoque insuficiente e uso por teclado. |
| [Testes de responsividade](tests/e2e/responsive.spec.ts) | Larguras de 320 a 1920 pixels, menu mobile e preferência por movimento reduzido. |
| [Teste de teclado do briefing](tests/e2e/brief-keyboard.spec.ts) | Ordem do foco ao avançar e voltar entre etapas. |

## Como rodar

```bash
npm ci
npm run dev
```

O Vite inicia em `http://127.0.0.1:5178`. Para verificar a compilação e rodar os testes unitários:

```bash
npm run build
npm run test:unit
```

Para os testes de navegador, instale os navegadores com `npx playwright install` e rode `npm run test:e2e`.
