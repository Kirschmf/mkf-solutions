import type { Stage } from './workflow.types';
export const stages:{id:Stage;title:string;short:string;rule:string}[]=[
  {id:'edit',title:'Editar pedido',short:'Entrada',rule:'Produto, preço, quantidade, estoque e frete ficam nesta demonstração.'},
  {id:'validate',title:'Validar dados',short:'Validação',rule:'Quantidade inteira positiva; dinheiro em centavos; produto obrigatório; estoque e frete não negativos.'},
  {id:'stock',title:'Conferir estoque',short:'Estoque',rule:'A quantidade deve caber no estoque. Faltou? Reduza, reponha ou cancele antes de registrar.'},
  {id:'approval',title:'Avaliar regra comercial',short:'Regra comercial',rule:'Somente totais acima de R$ 300,00 exigem aprovação. R$ 300,00 segue diretamente.'},
  {id:'payment',title:'Simular pagamento',short:'Pagamento',rule:'Uma pessoa confirma ou recusa o pagamento de teste. O automático sempre aguarda essa escolha.'},
  {id:'register',title:'Registrar pedido local',short:'Registro local',rule:'Crie um único registro e desconte o estoque uma única vez. Falha preserva o estoque para uma nova tentativa.'},
  {id:'message',title:'Preparar comunicação',short:'Comunicação',rule:'Componha uma prévia com o produto, as quantidades, o total e o registro demonstrativo.'},
  {id:'report',title:'Consolidar resultado',short:'Resultado',rule:'Reúna o pedido, estoque, decisões e arquivos gerados pelos dados desta execução.'},
];
export const stageTitle=(id:Stage)=>stages.find(stage=>stage.id===id)!.title;
