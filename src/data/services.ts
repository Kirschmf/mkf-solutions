import type {NeedId} from '../app/types';
export const needs: {id:NeedId;label:string;intent:string;title:string;description:string;deliverables:string[];kind:string}[]=[
 {id:'sites',label:'Sites',intent:'Criar meu site',title:'Uma apresentação que representa seu negócio.',description:'Sites institucionais e landing pages com conteúdo organizado, identidade própria e um caminho claro até o contato.',deliverables:['Design e desenvolvimento responsivo','Conteúdo, serviços e páginas do negócio','Formulários, WhatsApp e publicação'],kind:'Site institucional'},
 {id:'automations',label:'Automações',intent:'Automatizar uma rotina',title:'As ferramentas conversam. A equipe ganha tempo.',description:'Integrações entre sistemas e rotinas para cadastros, relatórios e atendimento. A regra do negócio orienta o que deve acontecer em cada etapa.',deliverables:['Mapeamento do processo e das regras','Integrações com APIs e ferramentas existentes','Validação, tratamento de falhas e acompanhamento'],kind:'Automação de cadastro'},
 {id:'apps',label:'Sistemas',intent:'Desenvolver um sistema',title:'Uma ferramenta desenhada para o seu processo.',description:'Aplicações web, CRMs e painéis com as funções que a operação precisa. Desenvolvimento da interface às integrações.',deliverables:['Interfaces e fluxos de trabalho','Dados, permissões e integrações','Validação, implantação e orientação de uso'],kind:'Aplicação web'},
 {id:'ecommerce',label:'Lojas',intent:'Montar minha loja',title:'Uma loja com identidade e operação conectadas.',description:'Desenvolvimento e personalização em Nuvemshop, Shopify e Tray. Navegação, catálogo e experiência de compra tratados em conjunto.',deliverables:['Tema, páginas e experiência mobile','Catálogo, categorias e páginas de produto','Conexão com ERP e canais de venda'],kind:'E-commerce'},
 {id:'operations',label:'Operação',intent:'Organizar minhas vendas',title:'Da qualidade do cadastro ao acompanhamento das vendas.',description:'Gestão de e-commerce e marketplaces com visão do processo inteiro: catálogo, preços, estoque, pedidos, logística, anúncios e atendimento.',deliverables:['Organização de catálogo, preços e estoque','Rotinas de pedidos, logística e atendimento','Indicadores, anúncios e plano de ação'],kind:'Entrega de catálogo'}
];
export const scopeNotes:Record<NeedId,string>={
 sites:'Páginas, conteúdo e integrações são definidos para o seu projeto.',
 automations:'As regras e os acessos disponíveis nos sistemas definem o fluxo que podemos integrar.',
 apps:'Funcionalidades, perfis de acesso e integrações são priorizados junto com você.',
 ecommerce:'Plataforma, personalização, catálogo e migração entram no escopo conforme a situação da loja.',
 operations:'Canais, rotinas e responsabilidades da gestão são combinados antes do início.'
};
