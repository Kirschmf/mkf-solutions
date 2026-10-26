import { useState } from 'react';
import { useJourney } from '../../app/JourneyContext';
import type { NeedId } from '../../app/types';
import styles from './workflow.module.css';
const routing:Record<NeedId,{label:string;service:string;deliverable:string}>={
  sites:{label:'Criar um site',service:'Site e presença digital',deliverable:'Estrutura de páginas, conteúdo e referências visuais.'},
  automations:{label:'Automatizar uma rotina',service:'Automação e integração',deliverable:'Rotina atual, sistemas envolvidos e regra de transformação.'},
  apps:{label:'Desenvolver um sistema',service:'Sistema sob medida',deliverable:'Pessoas usuárias, problema e funções essenciais.'},
  ecommerce:{label:'Montar uma loja',service:'E-commerce',deliverable:'Produtos, canais de venda e operação da loja.'},
  operations:{label:'Organizar vendas',service:'Operação de e-commerce',deliverable:'Canais, catálogo, estoque e rotina de gestão.'},
};
export default function LeadRoute(){
  const journey=useJourney();
  const [need,setNeed]=useState<NeedId>(journey.need);
  const [context,setContext]=useState(journey.brief.objective);
  const [step,setStep]=useState(0);
  const route=routing[need];
  function carry(){journey.setNeed(need);journey.updateBrief({need,objective:context});window.location.hash='contato';}
  return <div className={styles.leadRoute}>
    <div className={styles.leadIntro}><span className={styles.panelLabel}>OUTRA ROTINA, A MESMA LÓGICA</span><h3>Do contato ao briefing.</h3><p>Uma regra simples encaminha a necessidade. O contexto fica pronto para a conversa comercial.</p><ol className={styles.leadSteps} aria-label="Etapas do encaminhamento">{['Contato','Encaminhamento','Briefing'].map((label,index)=><li key={label} className={step===index?styles.leadStepActive:''}><span>{index+1}</span>{label}</li>)}</ol><small>Demonstração local · sem cadastro externo ou IA</small></div>
    <div className={styles.leadPanel}>
      {step===0&&<><label htmlFor="lead-need">O que você precisa?</label><select id="lead-need" value={need} onChange={event=>setNeed(event.target.value as NeedId)}>{Object.entries(routing).map(([id,item])=><option key={id} value={id}>{item.label}</option>)}</select><label htmlFor="lead-context">Contexto da rotina</label><textarea id="lead-context" rows={3} maxLength={1500} value={context} onChange={event=>setContext(event.target.value)} placeholder="Por exemplo: copiar pedidos da loja para uma planilha todos os dias."/><small>{context.length}/1.500 caracteres</small><button className={styles.primary} type="button" disabled={context.trim().length<3} onClick={()=>setStep(1)}>Aplicar regra de encaminhamento <span aria-hidden="true">→</span></button></>}
      {step===1&&<><span className={styles.panelLabel}>CARTÃO DEMONSTRATIVO DE CRM</span><h4>{route.service}</h4><dl className={styles.leadData}><div><dt>Necessidade recebida</dt><dd>{route.label}</dd></div><div><dt>Regra aplicada</dt><dd>Necessidade “{route.label}” → atendimento de {route.service.toLowerCase()}.</dd></div><div><dt>Contexto preservado</dt><dd>{context}</dd></div></dl><p className={styles.localNote}>Cartão criado apenas nesta tela. Nenhum CRM real foi atualizado.</p><div className={styles.inlineActions}><button type="button" onClick={()=>setStep(0)}>Voltar</button><button className={styles.primary} type="button" onClick={()=>setStep(2)}>Preparar briefing →</button></div></>}
      {step===2&&<><span className={styles.panelLabel}>RESUMO PARA A CONVERSA</span><h4>{route.label}</h4><p>{context}</p><div className={styles.messagePreview}><span className={styles.panelLabel}>O QUE VAMOS DETALHAR</span><p>{route.deliverable}</p></div><p className={styles.localNote}>A próxima etapa abre o briefing do site com estes dados. Você revisa a mensagem inteira antes de abrir o WhatsApp.</p><div className={styles.inlineActions}><button type="button" onClick={()=>setStep(1)}>Voltar</button><button className={styles.primary} type="button" onClick={carry}>Levar contexto ao contato →</button></div></>}
    </div>
  </div>;
}
