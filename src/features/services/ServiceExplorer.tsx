import {useRef,useEffect} from 'react';
import {ArrowRight,ArrowUpRight,Check} from 'lucide-react';
import {gsap} from 'gsap';
import {needs,scopeNotes} from '../../data/services';
import projects from '../../data/projects.json';
import {useJourney} from '../../app/JourneyContext';
import {useMotionPreference} from '../../app/useMotionPreference';
import styles from './services.module.css';
export default function ServiceExplorer(){
 const {need,setNeed,selectProject}=useJourney();const service=needs.find(n=>n.id===need)!;const project=projects.find(p=>p.id===service.projectId)!;
 const panel=useRef<HTMLDivElement>(null);const {reducedMotion}=useMotionPreference();
 useEffect(()=>{if(reducedMotion)return;const animation=gsap.fromTo(panel.current,{opacity:.3,y:8},{opacity:1,y:0,duration:.25});return()=>{animation.kill();};},[need,reducedMotion]);
 return <section className={`section ${styles.section}`} id="solucoes"><div className="container"><div className="section-top" data-reveal><div><span className="eyebrow">O que podemos construir</span><h2 className="section-title">Um projeto começa<br/>pelo que precisa resolver.</h2></div><p>Escolha uma frente de trabalho. Veja o escopo e um exemplo de como isso já ganhou forma.</p></div><div className={styles.explorer} data-reveal><div className={styles.options} role="group" aria-label="Frentes de trabalho">{needs.map(n=><button key={n.id} aria-pressed={n.id===need} onClick={()=>setNeed(n.id)} className={n.id===need?styles.active:''}>{n.label}<ArrowRight size={21}/></button>)}</div><div className={styles.content} ref={panel}><div className={styles.description}><span>{service.kind}</span><h3>{service.title}</h3><p>{service.description}</p><ul>{service.deliverables.map(d=><li key={d}><Check size={15}/>{d}</li>)}</ul><p className={styles.scope}><strong>Escopo combinado</strong>{scopeNotes[need]}</p><a className="button" href="#contato">Começar por aqui<ArrowUpRight size={17}/></a></div><button className={styles.case} onClick={()=>{selectProject(project.id);document.getElementById('portfolio')?.scrollIntoView({behavior:reducedMotion?'instant':'smooth'});}}><img src={project.image||'/assets/projects/authentic-lg.webp'} alt={`Entrega do projeto ${project.name}`} loading="lazy"/><span><small>Veja no portfólio</small><strong>{project.name}</strong><ArrowUpRight size={22}/></span></button></div></div></div></section>;
}
