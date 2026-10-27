# Cards de soluções e jornada do pedido

O usuário pediu um card para cada serviço e rejeitou a bancada técnica como visual genérico de IA. A mudança concentra-se em `#solucoes` e na demonstração de pedido de `#automacoes`.

## Direção adotada

Mostrar os cinco serviços simultaneamente, com ilustrações próprias e ações que levam o contexto correto ao briefing. Apresentar a automação como um pedido percorrendo etapas reais, com detalhes disponíveis sem três colunas apertadas.

- Cores: navy `#0D101D`, slate `#142343`, cobalt `#2548F4`, blue `#15378D`, cyan `#78DBE8`, warm white `#F3EEE7`.
- Tipografia: Instrument Serif nas chamadas editoriais; sans-serif existente para conteúdo e controles.
- Serviços: duas colunas amplas na primeira linha e três cards na segunda; duas colunas em tablet e uma em celular. Cada card é um artigo com composição gráfica ligada ao serviço, título, descrição, entregáveis, escopo e CTA próprio. Todos os dados essenciais ficam visíveis. O escopo detalhado pode ser expandido.
- Pedido: editor confortável à esquerda e percurso visual à direita. Oito checkpoints pequenos ao redor de um único ticket; um sinal luminoso avança pela linha com a execução. Inspeção abaixo, mapa técnico em diálogo opcional.

```text
Soluções
[ Sites: navegador editorial ][ Automações: dados conectados ]
[ Sistemas: interface ][ E-commerce: loja ][ Operação: expedição ]

Demonstração
[ Dados do pedido ] [ checkpoints → → → ]
[ total / edição  ] [   ticket do pedido ]
[                ] [ checkpoints ← ← ← ]
                   [ controles e decisão ]
                   [ dados da etapa       ]
```

## Referências verificadas

- 21st / Magic UI, Animated Beam: https://21st.dev/@dillionverma/components/animated-beam — sinal luminoso que percorre conexões.
- BL/S Studio, Card Beam Animation: https://codepen.io/blacklead-studio/pen/xbwaqxE — desenho e passagem de luz entre superfícies.
- Aaron Iker, Order confirm animation: https://codepen.io/aaroniker/pen/eYOVrNa — feedback ligado ao pedido e conclusão.

Implementação original com React, CSS e GSAP existentes. Nenhum iframe, imagem de projeto, código de terceiros ou dependência nova é necessário. A movimentação acompanha hover/foco nos serviços e transições reais no pedido; nenhum indicador operacional é inventado.

## Comportamento preservado

Escolha compartilhada hero → serviço → briefing, nome/objetivo já preenchidos, teclado, foco e movimento reduzido. Os cards mantêm o conteúdo dos cinco serviços; o CTA define a necessidade antes de navegar ao contato. A hero, perfil, processo e paleta aprovada continuam.

O reducer do pedido, regras, timer de 950 ms, decisões de estoque/aprovação/pagamento, erro/retry, débito único, edição que exige reinício, downloads e histórico permanecem. A rota de contato continua montada ao alternar as abas. O mapa mantém teclado, Escape e restauração do foco.

## Critérios de conferência

Cinco cards sem depender de seleção; CTAs específicos e contexto correto no briefing. Percurso legível em 320–1920 px, ticket sem dados fictícios, animação interrompida corretamente com movimento reduzido. O mapa deixa de ser a aparência padrão. Verificar caminhos de pagamento, estoque insuficiente, falha, retry, reinício, downloads e contato. Atualizar os testes que pressupõem o antigo painel único, preservando a intenção dos cenários.
