import {useRef,useState} from 'react';
import {ArrowRight,Check} from 'lucide-react';
import {usePanelMotion} from '../../app/usePanelMotion';
import MotionHeading from '../../components/MotionHeading';
import styles from './process.module.css';
const stages=[
 {name:'Briefing',title:'Entender o que precisa funcionar.',description:'Conversamos sobre seu negócio, as pessoas que usam o processo e a entrega que você precisa. Exemplos e materiais existentes ajudam a tornar o objetivo concreto.',result:'Um resumo do problema, do público e das prioridades.',client:'Você traz o contexto e os acessos que fizerem sentido para a avaliação.'},
 {name:'Escopo',title:'Combinar a entrega antes de construir.',description:'A proposta define funcionalidades, responsabilidades, prazo e investimento. Os pontos que dependem de sistemas ou serviços externos ficam identificados.',result:'Proposta com entregáveis, etapas e condições.',client:'Você revisa as prioridades e confirma o que faz parte do projeto.'},
 {name:'Desenvolvimento',title:'Dar forma e testar no caminho.',description:'Interfaces e funcionalidades avançam com alinhamentos. Você acompanha a evolução e revisa o que está sendo construído.',result:'Versões navegáveis e integrações conforme o escopo.',client:'Você avalia os pontos combinados e reúne os ajustes de cada etapa.'},
 {name:'Validação',title:'Conferir com situações de uso.',description:'Verificamos conteúdo, navegação, dados e regras. Os testes acompanham o tipo de projeto: site, sistema, automação ou operação.',result:'Entrega revisada com os fluxos do projeto conferidos.',client:'Você participa da conferência do que será usado pela sua equipe.'},
 {name:'Entrega',title:'Colocar o trabalho em uso.',description:'Publicação ou implantação, orientação e materiais de uso conforme a proposta. Evoluções e acompanhamento podem ser combinados para a próxima etapa.',result:'Projeto entregue e próximos passos claros.',client:'Você recebe a orientação necessária para começar a usar.'}
];
export default function ProcessExplorer(){
 const [active,setActive]=useState(0);
 const stage=stages[active];
 const panel=useRef<HTMLDivElement>(null);
 usePanelMotion(panel,active);

 return <section className={`section ${styles.section}`} id="processo">
  <div className="container">
   <div className="section-top">
    <div>
     <span className="eyebrow" data-motion-panel>Do primeiro contato à entrega</span>
     <MotionHeading className="section-title" lines={['Você acompanha','cada decisão.']}/>
    </div>
    <p data-motion-panel>Percorra as etapas para ver o que produzimos e como você participa.</p>
   </div>
   <div className={styles.steps} role="group" aria-label="Etapas do projeto" data-motion-group>
    {stages.map((s,i)=><button key={s.name} className={i===active?styles.active:''} aria-pressed={i===active} onClick={()=>setActive(i)} data-motion-item>
     <span>{String(i+1).padStart(2,'0')}</span>{s.name}<ArrowRight size={18}/>
    </button>)}
    <span className={styles.progressTrack} aria-hidden="true" data-motion-rule>
     <span className={styles.progress} style={{transform:`scaleX(${(active+1)/stages.length})`}}/>
    </span>
   </div>
   <div data-motion-panel>
    <div className={styles.detail} aria-live="polite" ref={panel}>
     <div>
      <span className="eyebrow">{String(active+1).padStart(2,'0')} / {stage.name}</span>
      <h3>{stage.title}</h3>
      <p>{stage.description}</p>
     </div>
     <div className={styles.deliverable}>
      <span><Check size={18}/>O que fica pronto</span>
      <p>{stage.result}</p>
      <hr/>
      <span>Sua participação</span>
      <p>{stage.client}</p>
     </div>
    </div>
   </div>
  </div>
 </section>;
}
