# Cards de serviços e jornada do pedido — 27/10/2026

Pedido: substituir o seletor de serviços por cards individuais e reformular a demonstração com animação pesquisada no 21st.dev/CodePen.

## Entrega

- Cinco artigos de serviço visíveis juntos: Sites, Automações, Sistemas, E-commerce e Operação. Cada um tem composição SVG própria, descrição, três entregáveis, escopo expansível e ação específica para o briefing. A escolha preserva nome e contexto já preenchidos.
- Grade de dois cards maiores e três menores no desktop; duas colunas no tablet, com Operação horizontal; uma coluna no celular. A paleta navy/azul e a hero aprovada foram preservadas.
- A demonstração passa a editor + percurso de oito checkpoints em torno de um comprovante com o pedido real. O pacote percorre o trilho somente após uma transição efetiva do reducer, sem animação infinita. Clicar em um checkpoint apenas inspeciona a etapa.
- O mapa técnico continua disponível em modal. Escape fecha e restaura o foco. A inspeção de uma conexão fecha o mapa e mostra os dados transferidos abaixo da jornada.
- Regras de preço, aprovação, estoque, pagamento, pausa, reinício, recuperação, downloads e encaminhamento de contato permanecem no motor existente. Nenhuma dependência nova.

Referências consultadas: [Animated Beam no 21st.dev](https://21st.dev/@dillionverma/components/animated-beam), [Card Beam Animation](https://codepen.io/blacklead-studio/pen/xbwaqxE) e [Order confirm animation](https://codepen.io/aaroniker/pen/eYOVrNa). Implementação original; proveniência detalhada em `THIRD_PARTY_MOTION.md`.

## Revisão visual e correções

A revisão independente verificou os cards em 320, 390, 768, 1024 e 1440 px, sem achados de ajuste de conteúdo ou ilustrações. Na jornada, identificamos e corrigimos os rótulos próximos ao comprovante: agora ficam do lado externo dos trilhos, com nomes visuais curtos e nomes acessíveis completos. Os checkpoints têm 44 × 44 px em todas as larguras.

Nomes de produto de 120 caracteres ocupam até duas linhas no comprovante; o conteúdo completo permanece no título e no inspetor. Valores extremos ficam contidos no editor e no comprovante, com rolagem interna quando necessária, sem alterar a validação do total seguro. Movimento reduzido interrompe o pacote e as transições do comprovante e das ilustrações.

## Verificação local final

- `npm run build`: exit 0. Avisos existentes de `use client` de React Flow/Lucide; sem erro de compilação.
- `npm run test:types`: exit 0 após a fonte final congelada.
- `npm run test:unit`: 22 testes passaram.
- `npm run test:e2e -- --output=qa/cards-journey-final-e2e`: 33 testes passaram em 1,7 min sobre a compilação final.
- Matriz final em 320, 390, 601, 768, 1024, 1440 e 1920 px: cinco cards presentes, sem overflow de página/cards e sem erros de página/requisições. Editor de produto tem 244 px em 320 px de viewport.
- Novo teste comprova que inspecionar não executa o pedido, avançar movimenta o pacote e reduzir movimento durante o percurso o interrompe. Testes dos cinco CTAs confirmam categoria correta na mensagem e preservação do briefing.
- Revisão React: hooks com limpeza das animações/timers, ilustrações decorativas ocultas da árvore acessível, links/botões nativos, IDs SVG únicos e React Flow carregado apenas quando o mapa é aberto.

Compilação final: `index-B4mHxeJf.css` / `index-CFm83IUx.js`.
Capturas e relatórios ficam ignorados em `qa/cards-journey-*`, `qa/journey-detail-*`, `qa/workflow-detail-*`, `qa/review-*` e `qa/workflow-*-report.json`.

## Publicação

Publicação pelo fluxo Git/Vercel existente, seguida de repetição dos testes de serviços, demonstração, navegação, briefing e responsividade no endereço público.
