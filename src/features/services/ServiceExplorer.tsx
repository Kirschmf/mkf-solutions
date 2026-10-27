import {useRef} from 'react';
import {ArrowRight,ArrowUpRight,Check} from 'lucide-react';
import {needs,scopeNotes} from '../../data/services';
import {useJourney} from '../../app/JourneyContext';
import {usePanelMotion} from '../../app/usePanelMotion';
import MotionHeading from '../../components/MotionHeading';
import styles from './services.module.css';

export default function ServiceExplorer(){
 const {need,setNeed}=useJourney();
 const service=needs.find(n=>n.id===need)!;
 const panel=useRef<HTMLDivElement>(null);
 usePanelMotion(panel,need);

 return <section className={`section ${styles.section}`} id="solucoes">
  <div className="container">
   <div className="section-top">
    <div>
     <span className="eyebrow" data-motion-panel>O que podemos construir</span>
     <MotionHeading className="section-title" lines={['Um projeto começa','pelo que precisa resolver.']}/>
    </div>
    <p data-motion-panel>Escolha uma frente de trabalho para conhecer os serviços e o escopo de cada solução.</p>
   </div>
   <div className={styles.explorer}>
    <div className={styles.options} role="group" aria-label="Frentes de trabalho" data-motion-group>
     {needs.map(n=><button key={n.id} aria-pressed={n.id===need} onClick={()=>setNeed(n.id)} className={n.id===need?styles.active:''} data-motion-item>
      {n.label}<ArrowRight size={21}/>
      <span className={styles.optionRule} data-motion-rule aria-hidden="true"/>
     </button>)}
    </div>
    <div className={styles.content} data-motion-panel>
     <div className={styles.description} ref={panel}>
      <span>{service.kind}</span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <ul>{service.deliverables.map(d=><li key={d}><Check size={15}/>{d}</li>)}</ul>
      <p className={styles.scope}><strong>Escopo combinado</strong>{scopeNotes[need]}</p>
      <a className="button" href="#contato">Começar por aqui<ArrowUpRight size={17}/></a>
     </div>
    </div>
   </div>
  </div>
 </section>;
}
