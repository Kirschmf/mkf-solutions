# Portfólio

`Portfolio.tsx` exporta o componente sem propriedades obrigatórias. Consome `JourneyProvider`, `useMotionPreference` e `ProjectRecord`. Navegação do palco é local; `selectedProjectId` do contexto abre o caso solicitado por outra seção. Fechar ou voltar no histórico limpa esse contexto.

`usePortfolioNavigation` controla busca, categoria e seleção. Busca normalizada aceita acentos, múltiplos termos e tecnologias. `createPortfolioScene` importa Three.js sob demanda: nove planos em um cilindro, nove texturas no máximo, slots reutilizados, rotação GSAP e descarte completo. Não há cena ambiental. O renderizador só desenha em mudança de estado, carregamento e animação; fora da tela/documento, a animação e os desenhos param.

Mobile, movimento reduzido, erro de contexto e falta de WebGL usam HTML/CSS com os mesmos dados e controles. O palco trata arraste horizontal; a rolagem vertical permanece nativa. O botão ativo, setas, contador, instruções e texto do projeto são HTML. Autoplay de seis segundos pausa com hover/foco, fora da tela, documento oculto e case aberto; uma interação o desliga até acionamento de Reproduzir.

Casos usam dialog nativo com foco contido, Escape, ampliação, galeria por setas/toque e retorno de foco. `?projeto=<id>#portfolio` preserva parâmetros existentes e navegação Voltar. ID desconhecido oferece retorno ao catálogo. Todas as 55 entradas estão imediatamente disponíveis em Todos os projetos.

## Verificação

- RED: seis falhas comportamentais observadas antes da implementação, em `portfolioNavigation.test.ts`.
- `npm run test:unit -- src/features/portfolio`: onze testes, incluindo imagem principal + extras de AICA e preservação da ordem antes/depois de Linda Casa sem duplicação.
- `npm run test:types` e `npm run build`.
- `PORTFOLIO_QA_URL=http://127.0.0.1:5178/ node src/features/portfolio/portfolio.browser-test.mjs` executa os testes de browser do site integrado. Requer Chrome local e `playwright` disponível. Sem variável usa o harness isolado em `portfolio.preview.html`, servido por Vite em 5191.
- Browser cobre WebGL real; limite de nove slots/texturas após navegação por 55; teclado e wrap; case/ampliação/Escape/Back; catálogo 55; busca vazia e única; mobile swipe por mouse e toque CDP real; galeria troca sem zoom involuntário e preserva rolagem vertical; imagem abortada oferece ausência explícita e recupera ao mudar/retornar; fallback negando WebGL; movimento reduzido; autoplay real 6s, hover e pausa persistente; ausência de overflow em 320/390/768/1440/1920.
- Capturas em `qa/portfolio/` na raiz (ignorado pelo Git): desktop, anel desktop e mobile. Elementos fixos de navegação são ocultados somente no instante da captura da seção para não cobrir a composição.

## Fontes e autoria

Geometria e controle desenvolvidos para MKF. Referências comportamentais: Truth Commerce (`https://truthcommerce.com.br`), Arc Flow Carousel (`https://21st.dev/@hyperiux/components/arc-flow-carousel`) e 3D Carousel w/ GSAP Draggable (`https://codepen.io/Prowhiz/pen/PwovQNP`). O arquivo local de Truth foi observado; nenhum código, ativo ou dado comercial foi transplantado. O acesso à fonte completa de Arc Flow requer conta; foi utilizado como referência visual de mecanismo.

`src/components/spell/kbd.tsx` adapta o mapa de símbolos e a apresentação de Keyboard Shortcuts do registro oficial `https://spell.sh/r/kbd.json`, obtido em 26/10/2026. O controle de teclado fica no palco focado, dispensando hotkeys globais e a dependência `react-hotkeys-hook`. Fonte e licença: `https://github.com/xxtomm/spell-ui` e `https://raw.githubusercontent.com/xxtomm/spell-ui/main/LICENSE`.

MIT License

Copyright (c) 2025 Spell UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
