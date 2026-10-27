# Movimento editorial nas seções da MKF

## Intenção

O usuário aprovou a hero e pediu explicitamente planejar e implementar a mesma qualidade de animação no restante do site, pesquisando nas mesmas fontes. As três referências foram revisitadas e os vídeos locais inspecionados: Dribbble 25949833 (painéis expansíveis, 3,8–9,5 s), 26995447 (serviços, experiência e fechamento, 8,5–16,25 s), 27214848 (composições editoriais em camadas, 3–5 e 9,8–11,8 s). São referências de aparência e sequência, sem afirmação sobre o código original. Links completos em THIRD_PARTY_MOTION.md.

## Decisões de implementação

- Preservar a hero aprovada, textos, ações e estado da jornada. Preservar a remoção do portfólio em ff6cac9; não restaurar projetos ou mídia de projetos.
- Usar React, GSAP e ScrollTrigger já instalados. Não adicionar dependências, scroll artificial, pin, cursor obrigatório ou animação infinita nova.
- Conservar a paleta atual: navy #0D101D, texto claro #F3EEE7, azul #2548F4, papel #F4F5F2, grafite #17191D. Instrument Serif nos grandes títulos de seção conecta o restante à hero; Instrument Sans continua no conteúdo e nos controles.
- Títulos com linhas explícitas em máscaras. Entrada de 750 ms, stagger 90 ms; painéis com máscara e deslocamento de 18 px; grupos com stagger de 75 ms. Uma entrada por elemento, seguida de navegação normal.
- Soluções: lista de opções em sequência, divisores revelados, painel estável por fora e conteúdo transitando por dentro na seleção.
- Laboratório: título e enquadramento da bancada entram em sequência; não transformar nós, arestas nem viewport do React Flow. As conexões continuam refletindo exclusivamente o estado real.
- Perfil: retrato com máscara e leve redução de escala; imagem interna com deslocamento máximo de 24 px apenas em desktop. Abas, atividades e trajetória respondem à seleção em 320 ms. Título/controles não participam do parallax.
- Processo: linha de progresso acompanha a etapa selecionada; texto e entregáveis transitam em camadas. Marcadores continuam clicáveis, com seus nomes acessíveis.
- FAQ: respostas expandem/recolhem altura, mantendo aria-expanded/aria-controls e removendo conteúdo fechado da navegação. Contato: título, texto e formulário entram em ordem; próximo/voltar desloca o conteúdo 12 px conforme a direção, preservando foco e preenchimento.

## Resiliência e limites

Base HTML/CSS legível sem animação. Ao reduzir movimento, reverter contextos GSAP e mostrar integralmente máscaras, textos e controles. Ao focar conteúdo antes do fim da entrada, concluir imediatamente a animação correspondente. Não recortar foco com wrappers de entrada. Recalcular ScrollTrigger após mudanças reais de layout, carregamento da fonte e imagem. Não observar todas as mutações do mapa operacional.

Mobile recebe as mesmas entradas com deslocamento menor, sem parallax ou sobreposição de conteúdo. Não mudar regras comerciais, mensagens, destinos externos nem a máquina de estados do laboratório. Sem alteração no backend.

## Aceitação

Movimento visualmente coerente com a hero, com funções específicas por seção; nenhuma dupla animação dos antigos data-reveal. Troca rápida de opções não deixa estilos intermediários. Redução de movimento e navegação por teclado funcionam durante as transições. Sem overflow em 320, 390, 601, 768, 1024, 1440 e 1920 px. Suítes existentes de tipos, unidade e navegação passam; revisão independente e checagem da publicação concluem a entrega.
