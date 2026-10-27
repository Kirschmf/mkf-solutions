import {ArrowUpRight,Check,ChevronDown} from 'lucide-react';
import {needs,scopeNotes} from '../../data/services';
import {useJourney} from '../../app/JourneyContext';
import MotionHeading from '../../components/MotionHeading';
import ServiceArtwork from './ServiceArtwork';
import styles from './services.module.css';

export default function ServiceExplorer(){
 const {need,setNeed}=useJourney();
 return <section className={`section ${styles.section}`} id="solucoes" aria-labelledby="services-title">
  <div className="container">
   <div className={`section-top ${styles.heading}`}>
    <div>
     <span className="eyebrow" data-motion-panel>O que podemos construir</span>
     <MotionHeading id="services-title" className="section-title" lines={['Um projeto começa','pelo que precisa resolver.']}/>
    </div>
    <p data-motion-panel>Do site aos processos da operação. Conheça o trabalho por trás de cada solução.</p>
   </div>
   <div className={styles.cards} data-motion-group>
    {needs.map(service=>{
     const label=service.id==='ecommerce'?'E-commerce':service.label;
     return <article key={service.id} className={styles.card} data-service-card={service.id} data-selected={need===service.id} data-motion-item aria-labelledby={`service-${service.id}-title`}>
      <div className={styles.artwork}><ServiceArtwork need={service.id}/></div>
      <div className={styles.body}>
       <div className={styles.cardHeading}>
        <h3 id={`service-${service.id}-title`}>{label}</h3>
        <span className={styles.selected} aria-hidden={need!==service.id}><Check size={15}/><span className="sr-only">Serviço selecionado</span></span>
       </div>
       <p className={styles.promise}>{service.title}</p>
       <p className={styles.description}>{service.description}</p>
       <ul className={styles.deliverables}>{service.deliverables.map(item=><li key={item}><Check size={14}/>{item}</li>)}</ul>
       <details className={styles.scope}>
        <summary>Escopo do projeto<ChevronDown size={15}/></summary>
        <p>{scopeNotes[service.id]}</p>
       </details>
       <a className={styles.action} href="#contato" onClick={()=>setNeed(service.id)}>Conversar sobre {label}<ArrowUpRight size={18}/></a>
      </div>
     </article>;
    })}
   </div>
  </div>
 </section>;
}
