import {useEffect,useRef} from 'react';
import {ArrowDownRight,ArrowRight,ArrowUpRight} from 'lucide-react';
import {gsap} from 'gsap';
import {needs} from '../../data/services';
import projects from '../../data/projects.json';
import {useJourney} from '../../app/JourneyContext';
import {useMotionPreference} from '../../app/useMotionPreference';
import styles from './intro.module.css';
export default function Hero(){
 const {need,setNeed,selectProject}=useJourney();const service=needs.find(n=>n.id===need)!;const project=projects.find(p=>p.id===service.projectId)!;
 const preview=useRef<HTMLDivElement>(null);const {reducedMotion}=useMotionPreference();
 useEffect(()=>{if(reducedMotion)return;const animation=gsap.fromTo(preview.current,{opacity:.3,y:12},{opacity:1,y:0,duration:.32,ease:'power2.out'});return()=>{animation.kill();};},[need,reducedMotion]);
 function openProject(){selectProject(project.id);document.getElementById('portfolio')?.scrollIntoView({behavior:reducedMotion?'instant':'smooth'});}
 return <section className={styles.hero} id="inicio"><div className="container"><div className={styles.heroMeta}><span>Desenvolvimento para empresas</span><a href="#sobre"><img src="/assets/matheus-kirsch.png" alt=""/>Matheus Kirsch<ArrowUpRight size={14}/></a></div><div className={styles.headline}><h1>Sites, sistemas<br/>e automações<span>.</span></h1><div className={styles.introduction}><p>Desenvolvimento, integrações e gestão de e-commerce por quem também conhece a operação.</p><a href="#portfolio" className="text-action">Ver os projetos<ArrowDownRight size={22}/></a></div></div><div className={styles.workbench}><div className={styles.selector}><span className={styles.selectorLabel}>O que precisa funcionar melhor?</span>{needs.map((n,i)=><button key={n.id} onClick={()=>setNeed(n.id)} aria-pressed={need===n.id} className={need===n.id?styles.active:''}><span>{String(i+1).padStart(2,'0')}</span>{n.intent}<ArrowRight size={18}/></button>)}<a href="#automacoes" className={styles.try}>Experimente uma automação<ArrowUpRight size={16}/></a></div><div className={styles.preview} ref={preview}><div className={styles.previewImage}><button onClick={openProject} aria-label={`Explorar ${project.name}`}><img key={project.image} src={project.image||'/assets/projects/truthanalytics.webp'} alt={`Projeto ${project.name}`} fetchPriority="high"/></button></div><div className={styles.previewCaption}><div><span>{service.kind}</span><strong>{project.name}</strong></div><button onClick={openProject}>Explorar projeto<ArrowUpRight size={20}/></button></div></div></div><div className={styles.heroBottom}><p>Canoas / Porto Alegre, RS</p><a href="#solucoes">Conheça as soluções<ArrowDownRight size={16}/></a></div></div></section>;
}
