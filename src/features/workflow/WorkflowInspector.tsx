import { money } from './orderRules';
import { stageTitle, stages } from './stages';
import type { Stage, WorkflowState } from './workflow.types';
import styles from './workflow.module.css';

export type Inspection={stage:Stage;edge?:{source:Stage;target:Stage}};
export default function WorkflowInspector({state,inspection}:{state:WorkflowState;inspection:Inspection}){
  const {stage,edge}=inspection;
  const info=stages.find(item=>item.id===stage)!;
  const order=state.order;
  const relevant=state.history.filter(entry=>edge?entry.from===edge.source&&entry.to===edge.target:stage==='report'&&state.status==='completed'?entry.to==='report':entry.from===stage);
  const last=relevant.at(-1);
  const input=stage==='edit'||stage==='validate'?`${state.input.quantity||0} × ${state.input.product||'Produto sem nome'}`:order?`${order.quantity} × ${order.product} · ${money(order.totalCents)}`:'O pedido ainda não chegou aqui.';
  return <aside className={styles.inspector} aria-label="Inspetor da demonstração">
    <div className={styles.panelLabel}>03 / INSPECIONAR</div>
    <h4>{edge?'Dados em trânsito':info.title}</h4>
    {edge&&<p className={styles.edgeTitle}>{stageTitle(edge.source)} → {stageTitle(edge.target)}</p>}
    <dl>
      <div><dt>Entrada</dt><dd>{input}</dd></div>
      <div><dt>{edge?'Transferência':'Regra'}</dt><dd>{edge?'Uma conexão transporta somente o resultado da etapa anterior. Selecione os nós para ver suas regras.':info.rule}</dd></div>
      <div><dt>Saída</dt><dd>{last?.detail??'Ainda não executada nesta rodada.'}</dd></div>
    </dl>
    {last&&<details className={styles.payload} open={!!edge}><summary>Ver dados {edge?'transferidos':'da saída'}</summary><pre>{JSON.stringify(last.payload,null,2)}</pre></details>}
    <div className={styles.inspectorNote}><span aria-hidden="true">↳</span><p>Selecione uma etapa ou uma conexão no mapa para acompanhar o que mudou.</p></div>
  </aside>;
}
