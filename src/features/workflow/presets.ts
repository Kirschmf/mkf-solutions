import type { OrderInput } from './workflow.types';
export const defaultInput:OrderInput={product:'Produto de demonstração',unitPriceCents:12000,quantity:2,stock:5,shippingCents:1800};
export const presets=[
  {id:'normal',label:'Pedido normal',description:'Duas unidades, pagamento por confirmar.',input:defaultInput,failRegistration:false},
  {id:'stock',label:'Estoque insuficiente',description:'Há uma unidade para um pedido de duas.',input:{...defaultInput,stock:1},failRegistration:false},
  {id:'refused',label:'Pagamento recusado',description:'Avance e escolha recusar para testar a recuperação.',input:defaultInput,failRegistration:false},
  {id:'approval',label:'Aprovação necessária',description:'Três unidades: total de R$ 378,00.',input:{...defaultInput,quantity:3},failRegistration:false},
  {id:'failure',label:'Falha de registro',description:'A primeira tentativa preserva o estoque e pede correção.',input:defaultInput,failRegistration:true},
] as const;
