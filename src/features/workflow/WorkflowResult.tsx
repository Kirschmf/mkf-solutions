import { useState } from 'react';
import type { WorkflowState } from './workflow.types';
import { buildOrderArtifacts } from './orderArtifacts';
import { money } from './orderRules';
import styles from './workflow.module.css';

export default function WorkflowResult({state}:{state:WorkflowState}){
  const [showJson,setShowJson]=useState(false);
  if(state.status!=='completed'||!state.order||!state.registered||state.dirty)return null;
  const artifacts=buildOrderArtifacts(state);
  function download(filename:string,text:string,type:string){const url=URL.createObjectURL(new Blob([text],{type}));const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);}
  return <div className={styles.result} data-testid="workflow-result">
    <div className={styles.resultHeader}><div><span className={styles.panelLabel}>RESULTADO DA RODADA</span><h3>Um pedido, um registro.</h3><p>Dados calculados aqui, prontos para conferir.</p></div><span className={styles.recordId}>{state.registered.id}</span></div>
    <dl className={styles.resultValues}><div><dt>Total do pedido</dt><dd>{money(state.order.totalCents)}</dd></div><div><dt>Estoque antes → depois</dt><dd data-testid="stock-result">{state.order.stock} → {state.remainingStock} unidades</dd></div><div><dt>Regra comercial</dt><dd>{state.approval==='approved'?'Aprovado manualmente':'Dentro do limite'}</dd></div><div><dt>Pagamento</dt><dd>Teste confirmado</dd></div></dl>
    <div className={styles.messagePreview}><span className={styles.panelLabel}>PRÉVIA DE COMUNICAÇÃO</span><p>{state.message}</p><small>Prévia local. Nenhuma mensagem foi enviada.</small></div>
    <div className={styles.downloads}><button type="button" onClick={()=>download('pedido.json',artifacts.orderJson,'application/json;charset=utf-8')}>Baixar pedido.json <span aria-hidden="true">↓</span></button><button type="button" onClick={()=>download('itens.csv',artifacts.itemsCsv,'text/csv;charset=utf-8')}>Baixar itens.csv <span aria-hidden="true">↓</span></button><button type="button" onClick={()=>setShowJson(!showJson)} aria-expanded={showJson}>Conferir JSON {showJson?'−':'+'}</button></div>
    {showJson&&<pre className={styles.jsonPreview}>{artifacts.orderJson}</pre>}
    <details className={styles.history}><summary>Conferir as {state.history.length} decisões e transições</summary><ol>{state.history.map(entry=><li key={entry.sequence}><span>{String(entry.sequence).padStart(2,'0')}</span><p>{entry.detail}</p></li>)}</ol></details>
  </div>;
}
