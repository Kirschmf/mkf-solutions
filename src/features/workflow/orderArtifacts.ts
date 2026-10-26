import type { WorkflowState } from './workflow.types';
export function buildOrderArtifacts(state:WorkflowState):{orderJson:string;itemsCsv:string} {
  if(state.status!=='completed'||!state.order||!state.registered||state.dirty)throw new Error('Conclua a demonstração antes de exportar.');
  const {order}=state;
  const snapshot={environment:'Demonstração local',runId:state.runId,registered:state.registered,order,stock:{before:order.stock,after:state.remainingStock},approval:state.approval,payment:'confirmed-test',messagePreview:state.message,decisions:state.history};
  // Every text cell is quoted and escaped. Leading formula characters are neutralized for spreadsheet readers.
  const safeProduct=order.product.replace(/^[=+@\-\t\r]/,"'$&");
  const cell=`"${safeProduct.replaceAll('"','""')}"`;
  return {orderJson:JSON.stringify(snapshot,null,2),itemsCsv:`\uFEFFproduto,quantidade,preco_unitario_centavos,frete_centavos,total_centavos\r\n${cell},${order.quantity},${order.unitPriceCents},${order.shippingCents},${order.totalCents}\r\n`};
}
