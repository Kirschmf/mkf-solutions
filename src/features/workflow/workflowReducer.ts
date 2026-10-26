import type { OrderInput, WorkflowEvent, WorkflowState, Stage } from './workflow.types';
import { calculateOrderTotal, money, validateOrder } from './orderRules';

export const createWorkflow = (input:OrderInput,runId:string):WorkflowState=>({
  input:{...input},runId,stage:'edit',status:'idle',order:null,remainingStock:input.stock,
  pendingDecision:null,error:null,fieldErrors:{},history:[],registered:null,dirty:false,message:'',approval:null,
});

function transition(state:WorkflowState,to:Stage,event:string,detail:string,patch:Partial<WorkflowState>={},payload:Record<string,unknown>={}):WorkflowState {
  return {...state,stage:to,error:null,...patch,history:[...state.history,{sequence:state.history.length+1,from:state.stage,to,event,detail,payload}]};
}
const waitPayment=(state:WorkflowState,event:string,approval:WorkflowState['approval'])=>transition(state,'payment',event,'Aguardando uma decisão de pagamento de teste.',{status:'blocked',pendingDecision:'payment',approval},{totalCents:state.order!.totalCents});

/** Pure engine: clocks, identifiers, registration outcomes and scheduling belong to its caller. */
export function workflowReducer(state:WorkflowState,event:WorkflowEvent):WorkflowState {
  if (event.runId!==state.runId) return state;
  if (event.type==='RESET') {
    if (event.newRunId===state.runId) return state;
    return createWorkflow(event.input??state.input,event.newRunId);
  }
  if (event.type==='UPDATE_INPUT') {
    if(state.status==='idle') return {...state,input:{...event.input},remainingStock:event.input.stock,fieldErrors:{}};
    return {...state,input:{...event.input},dirty:true,status:'paused',error:'Os dados mudaram. Reinicie para aplicar a nova entrada.'};
  }
  if (state.dirty) return state;
  if (event.type==='CANCEL') {
    if(state.registered||state.status==='completed'||state.status==='cancelled')return state;
    return transition(state,state.stage,event.type,'Demonstração cancelada; estoque preservado.',{status:'cancelled',pendingDecision:null});
  }
  if (event.type==='PAUSE') return state.status==='running'?{...state,status:'paused'}:state;
  if (event.type==='RESUME') return state.status==='paused'?{...state,status:state.pendingDecision?'blocked':'running'}:state;
  if (state.status==='paused'||state.status==='cancelled'||state.status==='completed')return state;
  if(event.type==='START') {
    if(state.status!=='idle')return state;
    return transition(state,'validate',event.type,'Pedido recebido para validação.',{status:'running'},{...state.input});
  }
  if(event.type==='NEXT') {
    if(state.status!=='running')return state;
    if(state.stage==='validate') {
      const fieldErrors=validateOrder(state.input);
      if(Object.keys(fieldErrors).length) return transition(state,'validate','INVALID','Corrija os campos indicados e reinicie.',{status:'failed',fieldErrors,error:'A entrada contém valores inválidos.'});
      const order={...state.input,product:state.input.product.trim(),totalCents:calculateOrderTotal(state.input)};
      return transition(state,'stock',event.type,'Pedido validado e valores normalizados em centavos.',{order},{...order});
    }
    if(state.stage==='stock'&&state.order) {
      if(state.order.quantity>state.remainingStock) return transition(state,'stock','STOCK_SHORT','A quantidade solicitada excede o estoque.',{status:'blocked',pendingDecision:'stock'},{requested:state.order.quantity,available:state.remainingStock});
      return transition(state,'approval',event.type,'Quantidade disponível; nenhuma unidade foi descontada.',{pendingDecision:null},{quantity:state.order.quantity,stock:state.remainingStock});
    }
    if(state.stage==='approval'&&state.order) {
      if(state.order.totalCents>30000) return transition(state,'approval','APPROVAL_REQUIRED','Total acima de R$ 300,00: aprovação necessária.',{status:'blocked',pendingDecision:'approval'},{totalCents:state.order.totalCents,thresholdCents:30000});
      return waitPayment(state,event.type,'not-required');
    }
    if(state.stage==='message'&&state.order&&state.registered) {
      const message=`Prévia de acompanhamento: pedido ${state.registered.id} registrado nesta demonstração. ${state.order.quantity} × ${state.order.product}. Total ${money(state.order.totalCents)}, incluindo ${money(state.order.shippingCents)} de frete. Pagamento de teste confirmado. Estoque local restante: ${state.remainingStock}.`;
      return transition(state,'report',event.type,'Mensagem preparada e resultado consolidado.',{status:'completed',message},{message,recordId:state.registered.id,remainingStock:state.remainingStock});
    }
    return state;
  }
  if(event.type==='RESOLVE_STOCK'&&state.pendingDecision==='stock'&&state.order) {
    const input={...state.order,quantity:event.quantity,stock:event.stock};
    if(Object.keys(validateOrder(input)).length||event.quantity>event.stock)return state;
    const order={...input,totalCents:calculateOrderTotal(input)};
    return transition(state,'approval',event.type,'Estoque resolvido; total recalculado.',{input:{...state.input,quantity:event.quantity,stock:event.stock},order,remainingStock:event.stock,status:'running',pendingDecision:null},{quantity:event.quantity,stock:event.stock,totalCents:order.totalCents});
  }
  if(event.type==='APPROVE'&&state.pendingDecision==='approval')return waitPayment(state,event.type,'approved');
  if(event.type==='REJECT_APPROVAL'&&state.pendingDecision==='approval')return transition(state,'approval',event.type,'Regra comercial recusada; pedido cancelado.',{status:'cancelled',pendingDecision:null});
  if(event.type==='PAYMENT'&&state.pendingDecision==='payment'&&state.status==='blocked') {
    if(!event.confirmed)return transition(state,'payment',event.type,'Pagamento de teste recusado.',{status:'failed',pendingDecision:null,error:'Pagamento recusado. Você pode tentar novamente ou cancelar.'},{confirmed:false});
    return transition(state,'register',event.type,'Pagamento de teste confirmado manualmente.',{status:'running',pendingDecision:null},{confirmed:true});
  }
  if(event.type==='REGISTER_RESULT'&&state.stage==='register'&&state.status==='running'&&!state.registered&&state.order) {
    if(!event.success)return transition(state,'register',event.type,'Falha simulada de registro; estoque preservado.',{status:'failed',error:'Falha de registro demonstrativa. Corrija e tente novamente.'},{success:false});
    if(!event.recordId||!event.at)return state;
    const registered={id:event.recordId,at:event.at};
    return transition(state,'message',event.type,'Registro local criado uma única vez; estoque descontado.',{registered,remainingStock:state.remainingStock-state.order.quantity},{registered,stockBefore:state.remainingStock,stockAfter:state.remainingStock-state.order.quantity});
  }
  if(event.type==='RETRY'&&state.status==='failed') {
    if(state.stage==='payment')return transition(state,'payment',event.type,'Nova tentativa aguarda confirmação manual.',{status:'blocked',pendingDecision:'payment'});
    if(state.stage==='register')return transition(state,'register',event.type,'Registro pronto para nova tentativa.',{status:'running'});
  }
  return state;
}
