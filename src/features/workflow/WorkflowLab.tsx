import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createWorkflow, workflowReducer } from './workflowReducer';
import { calculateOrderTotal, money, validateOrder } from './orderRules';
import { defaultInput, presets } from './presets';
import { stageTitle } from './stages';
import WorkflowInspector, { type Inspection } from './WorkflowInspector';
import WorkflowResult from './WorkflowResult';
import WorkflowJourney from './WorkflowJourney';
import LeadRoute from './LeadRoute';
import type { OrderInput, Stage, WorkflowEvent } from './workflow.types';
import MotionHeading from '../../components/MotionHeading';
import InteractiveTabs from '../../components/InteractiveTabs';
import { usePanelMotion } from '../../app/usePanelMotion';
import styles from './workflow.module.css';

const WorkflowGraph=lazy(()=>import('./WorkflowGraph'));
const statusLabels={idle:'Pronto para começar',running:'Execução em andamento',paused:'Execução pausada',blocked:'Aguardando sua decisão',failed:'Ação necessária',completed:'Rodada concluída',cancelled:'Demonstração cancelada'};
function MapDialog({children,onClose}:{children:React.ReactNode;onClose:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);
  const closeButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement;ref.current?.showModal();closeButton.current?.focus();return()=>{previous?.focus();};},[]);
  return createPortal(<dialog ref={ref} className={styles.mapDialog} aria-label="Mapa da demonstração" onCancel={onClose}><div className={styles.dialogHeader}><h3>Mapa da demonstração</h3><button ref={closeButton} type="button" onClick={onClose}>Fechar ×</button></div>{children}</dialog>,document.body);
}

export default function WorkflowLab(){
  const [state,dispatch]=useReducer(workflowReducer,undefined,()=>createWorkflow(defaultInput,'rodada-1'));
  const [auto,setAuto]=useState(false);
  const [preset,setPreset]=useState('normal');
  const [failRegistration,setFailRegistration]=useState(false);
  const [inspection,setInspection]=useState<Inspection>({stage:'edit'});
  const [route,setRoute]=useState<'order'|'lead'>('order');
  const [leadOpened,setLeadOpened]=useState(false);
  const routePanels=useRef<HTMLDivElement>(null);
  usePanelMotion(routePanels,route,{index:route==='order'?0:1});
  useEffect(()=>{if(route==='lead')setLeadOpened(true);},[route]);
  const [mapOpen,setMapOpen]=useState(false);
  const runSequence=useRef(1);
  const emit=(event:Omit<WorkflowEvent,'runId'>)=>dispatch({...event,runId:state.runId} as WorkflowEvent);
  function next(){
    if(state.status==='idle'){emit({type:'START'});return;}
    if(state.stage==='register')dispatch({type:'REGISTER_RESULT',runId:state.runId,success:!failRegistration,recordId:`DEMO-${state.runId.replace('rodada-','').padStart(3,'0')}`,at:new Date().toISOString()});
    else emit({type:'NEXT'});
  }
  useEffect(()=>{
    if(!auto||state.status!=='running'||state.dirty)return;
    const runId=state.runId;
    const event:WorkflowEvent=state.stage==='register'?{type:'REGISTER_RESULT',runId,success:!failRegistration,recordId:`DEMO-${runId.replace('rodada-','').padStart(3,'0')}`,at:new Date().toISOString()}:{type:'NEXT',runId};
    const timer=window.setTimeout(()=>dispatch(event),950);
    return()=>window.clearTimeout(timer);
  },[auto,state.status,state.stage,state.runId,state.history.length,state.dirty,failRegistration]);
  useEffect(()=>{setInspection({stage:state.stage});},[state.stage]);
  useEffect(()=>{if(state.status==='completed'||state.status==='cancelled'||state.status==='failed')setAuto(false);},[state.status]);
  useEffect(()=>{if(route==='lead'){setAuto(false);dispatch({type:'PAUSE',runId:state.runId});}},[route,state.runId]);
  function reset(input=state.input){setAuto(false);dispatch({type:'RESET',runId:state.runId,newRunId:`rodada-${++runSequence.current}`,input});setInspection({stage:'edit'});}
  function changeInput(key:keyof OrderInput,value:string){
    setAuto(false);
    const isMoney=key==='unitPriceCents'||key==='shippingCents';
    const parsed=key==='product'?value:value.trim()===''?NaN:isMoney?( /^-?\d+(\.\d{0,2})?$/.test(value)?Math.round(Number(value)*100):NaN):Number(value);
    dispatch({type:'UPDATE_INPUT',runId:state.runId,input:{...state.input,[key]:parsed}});
  }
  function selectPreset(id:string){const chosen=presets.find(item=>item.id===id)!;setPreset(id);setFailRegistration(chosen.failRegistration);reset(chosen.input);}
  function startAuto(){setAuto(true);if(state.status==='idle')emit({type:'START'});else if(state.status==='paused')emit({type:'RESUME'});}
  function inspectStage(stage:Stage){setInspection({stage});if(mapOpen)setMapOpen(false);}
  const errors=validateOrder(state.input);
  const inputTotal=calculateOrderTotal(state.input);
  const graph=<Suspense fallback={<p className={styles.loading}>Carregando mapa operacional…</p>}><WorkflowGraph state={state} onInspectStage={inspectStage} onInspectEdge={(source,target)=>{setInspection({stage:target,edge:{source,target}});setMapOpen(false);}}/></Suspense>;
  const execution=(<div className={styles.execution}><div className={styles.executionStatus} aria-live="polite"><span className={`${styles.statusMark} ${state.status==='blocked'||state.status==='failed'?styles.markBlocked:''}`}/><div><strong data-testid="workflow-status">{statusLabels[state.status]}</strong><span>{state.dirty?'Reinicie para aplicar a nova entrada.':stageTitle(state.stage)}</span></div></div><div className={styles.controls}>
          {state.dirty?<button className={styles.primary} type="button" onClick={()=>reset()}>Reiniciar com estes dados</button>:<>
          {(state.status==='idle'||state.status==='running')&&<button type="button" onClick={()=>{setAuto(false);next();}} disabled={auto}>Próximo passo <span aria-hidden="true">→</span></button>}
          {auto?<button className={styles.primary} type="button" onClick={()=>{setAuto(false);emit({type:'PAUSE'});}}>Pausar <span aria-hidden="true">Ⅱ</span></button>:(state.status==='idle'||state.status==='running'||state.status==='paused')&&<button className={styles.primary} type="button" onClick={startAuto}>{state.status==='paused'?'Retomar':'Executar automaticamente'} <span aria-hidden="true">▶</span></button>}
          {state.status!=='idle'&&<button type="button" onClick={()=>reset()}>Reiniciar demonstração <span aria-hidden="true">↻</span></button>}
          {!state.registered&&state.status!=='idle'&&state.status!=='cancelled'&&<button className={styles.cancel} type="button" onClick={()=>{setAuto(false);emit({type:'CANCEL'});}}>Cancelar</button>}</>}
        </div></div>);
  const decisions=(<>{state.error&&<p className={styles.errorNotice} role="alert">{state.error}</p>}
        {!state.dirty&&state.pendingDecision&&<div className={styles.decision} aria-label="Decisão operacional"><div><h4>{state.pendingDecision==='stock'?'Faltou estoque. Como seguir?':state.pendingDecision==='approval'?'Este pedido precisa de aprovação.':'Simule o resultado do pagamento.'}</h4><p>{state.pendingDecision==='stock'?`${state.order?.quantity} unidades pedidas; ${state.remainingStock} disponíveis. O estoque continua intacto.`:state.pendingDecision==='approval'?`${money(state.order!.totalCents)} supera o limite de R$ 300,00.`:'O modo automático aguarda sua confirmação. Nenhuma transação financeira acontece.'}</p></div><div className={styles.decisionActions}>
          {state.pendingDecision==='stock'&&<><button type="button" disabled={state.remainingStock<1} onClick={()=>emit({type:'RESOLVE_STOCK',quantity:state.remainingStock,stock:state.remainingStock} as Omit<WorkflowEvent,'runId'>)}>Reduzir para {state.remainingStock} unidade(s)</button><button className={styles.primary} type="button" onClick={()=>emit({type:'RESOLVE_STOCK',quantity:state.order!.quantity,stock:Math.max(state.order!.quantity,state.remainingStock)+3} as Omit<WorkflowEvent,'runId'>)}>Simular reposição</button></>}
          {state.pendingDecision==='approval'&&<><button type="button" onClick={()=>emit({type:'REJECT_APPROVAL'})}>Recusar aprovação</button><button className={styles.primary} type="button" onClick={()=>emit({type:'APPROVE'})}>Aprovar pedido</button></>}
          {state.pendingDecision==='payment'&&<><button type="button" onClick={()=>emit({type:'PAYMENT',confirmed:false} as Omit<WorkflowEvent,'runId'>)}>Recusar pagamento</button><button className={styles.primary} type="button" onClick={()=>emit({type:'PAYMENT',confirmed:true} as Omit<WorkflowEvent,'runId'>)}>Confirmar pagamento de teste</button></>}
        </div></div>}
        {!state.dirty&&state.status==='failed'&&(state.stage==='register'||state.stage==='payment')&&<div className={styles.recovery}><p>{state.stage==='register'?'O registro não foi criado e nenhuma unidade foi descontada. A correção desliga a falha simulada.':'A recusa preservou o pedido e o estoque. Uma nova tentativa exige nova confirmação.'}</p><button className={styles.primary} type="button" onClick={()=>{setFailRegistration(false);emit({type:'RETRY'});setAuto(true);}}>{state.stage==='register'?'Corrigir falha e tentar novamente':'Tentar pagamento novamente'} <span aria-hidden="true">→</span></button></div>}</>);
  return <section id="automacoes" className={`section ${styles.section}`} aria-labelledby="workflow-heading">
    <div className="container">
      <div className={styles.heading}><div><p className="eyebrow">Experimente uma operação</p><MotionHeading id="workflow-heading" lines={['Acompanhe o caminho', 'de um pedido.']}/></div><div className={styles.intro} data-motion-group><p data-motion-item>Edite um pedido, acompanhe as regras e decida o próximo passo. Veja o que uma automação faz com cada dado.</p><p className={styles.localNote} data-motion-item>Demonstração local. Dados, regras e arquivos funcionam no navegador; pagamento, ERP e mensagens são demonstrativos.</p></div></div>
      <InteractiveTabs activeKey={route} className={styles.routeTabs} role="tablist" aria-label="Rotina para experimentar" onKeyDown={event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'order':event.key==='End'?'lead':route==='order'?'lead':'order';setRoute(next);document.getElementById(`${next}-route-tab`)?.focus();}}}><button type="button" role="tab" id="order-route-tab" aria-controls="order-route" tabIndex={route==='order'?0:-1} aria-selected={route==='order'} onClick={()=>setRoute('order')}>01 <span>Do pedido ao acompanhamento</span><span aria-hidden="true">↗</span></button><button type="button" role="tab" id="lead-route-tab" aria-controls="lead-route" tabIndex={route==='lead'?0:-1} aria-selected={route==='lead'} onClick={()=>setRoute('lead')}>02 <span>Do contato ao briefing</span><span aria-hidden="true">↗</span></button></InteractiveTabs>
      <div ref={routePanels} className={styles.routePanels}>
      {(route==='lead'||leadOpened)&&<div role="tabpanel" id="lead-route" hidden={route!=='lead'} aria-labelledby="lead-route-tab"><LeadRoute/></div>}<div role="tabpanel" id="order-route" hidden={route!=='order'} aria-labelledby="order-route-tab">
        <div className={styles.benchTop}><div><label htmlFor="workflow-preset">Experimente com</label><select id="workflow-preset" aria-label="Cenário da demonstração" value={preset} onChange={event=>selectPreset(event.target.value)}>{presets.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></div><p>{presets.find(item=>item.id===preset)?.description}</p><div className={styles.roundLabel}>Rodada {state.runId.replace('rodada-','').padStart(2,'0')}</div></div>
        <div className={styles.bench} data-motion-panel>
          <div className={styles.editor}><h3>Monte seu pedido.</h3><p className={styles.editorIntro}>Mude os dados e veja como a operação responde.</p>
            <div className={styles.fields}><label htmlFor="order-product">Produto<input id="order-product" value={state.input.product} maxLength={120} onChange={event=>changeInput('product',event.target.value)} aria-invalid={!!errors.product} aria-describedby={errors.product?'error-product':undefined}/>{errors.product&&<span id="error-product" className={styles.fieldError}>{errors.product}</span>}</label>
            {([{key:'unitPriceCents',label:'Preço unitário (R$)',money:true},{key:'quantity',label:'Quantidade'},{key:'stock',label:'Estoque disponível'},{key:'shippingCents',label:'Frete (R$)',money:true}] as const).map(field=><label key={field.key} htmlFor={`order-${field.key}`}>{field.label}<input id={`order-${field.key}`} type="number" inputMode={'money' in field?'decimal':'numeric'} min="0" step={'money' in field?'.01':'1'} value={Number.isFinite(state.input[field.key])?state.input[field.key]/('money' in field?100:1):''} onChange={event=>changeInput(field.key,event.target.value)} aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key]?`error-${field.key}`:undefined}/>{errors[field.key]&&<span id={`error-${field.key}`} className={styles.fieldError}>{errors[field.key]}</span>}</label>)}</div>
            <div className={styles.orderTotal}><span>Total com frete</span><strong data-testid="order-total">{money(inputTotal)}</strong><small>{state.input.quantity||0} unidade(s) + frete</small></div>
            <label className={styles.checkbox}><input type="checkbox" checked={failRegistration} onChange={event=>{setFailRegistration(event.target.checked);setAuto(false);if(state.status==='running')emit({type:'PAUSE'});}}/>Simular falha de registro</label>
          </div>
          <div className={styles.journeyColumn}><WorkflowJourney state={state} inspection={inspection.stage} onInspectStage={inspectStage}/><button className={styles.mapOverview} type="button" onClick={()=>setMapOpen(true)}>Visão geral do mapa <span aria-hidden="true">↗</span></button></div>
        </div>
        {execution}
        {decisions}
        <WorkflowInspector state={state} inspection={inspection}/>
        <WorkflowResult state={state}/>
      </div>
      </div>
      {mapOpen&&<MapDialog onClose={()=>setMapOpen(false)}>{graph}</MapDialog>}
    </div>
  </section>;
}
