import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Grid2X2, Pause, Play, Search, X } from 'lucide-react';
import { useJourney } from '../../app/JourneyContext';
import { useMotionPreference } from '../../app/useMotionPreference';
import type { ProjectRecord } from '../../app/types';
import catalog from '../../data/projects.json';
import { Kbd } from '../../components/spell/kbd';
import { usePortfolioNavigation } from './usePortfolioNavigation';
import { useProjectUrl } from './useProjectUrl';
import PortfolioStage, { ProjectPreview } from './PortfolioStage';
import styles from './portfolio.module.css';

const ProjectCase=lazy(()=>import('./ProjectCase'));
const projects=catalog as ProjectRecord[];
const categories=['Todos',...new Set(projects.map(project=>project.category))];
const number=(value:number)=>String(value).padStart(2,'0');

export default function Portfolio() {
  const nav=usePortfolioNavigation(projects);
  const {selectedProjectId,selectProject}=useJourney();
  const {reducedMotion}=useMotionPreference();
  const {openProjectId,openProject,closeProject}=useProjectUrl();
  const [view,setView]=useState<'gallery'|'catalog'>('gallery');
  const [playing,setPlaying]=useState(true);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const [visible,setVisible]=useState(false);
  const [hidden,setHidden]=useState(false);
  const [announcement,setAnnouncement]=useState('');
  const sectionRef=useRef<HTMLElement>(null);
  const externalProject=useRef<string|null>(null);
  const previousUrlProject=useRef(openProjectId);
  const activeProject=nav.filteredProjects[nav.selectedIndex];
  const caseProject=projects.find(project=>project.id===openProjectId);
  const interact=useCallback(()=>setPlaying(false),[]);
  const canPlay=nav.filteredProjects.length>1&&!reducedMotion;
  const running=playing&&canPlay&&visible&&!hidden&&!hovered&&!focused&&!openProjectId&&view==='gallery';

  useEffect(()=>{
    const update=()=>setHidden(document.hidden);update();
    document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);
  },[]);
  useEffect(()=>{
    if(!running)return;
    const timer=window.setInterval(nav.next,6000);return()=>window.clearInterval(timer);
  },[running,nav.next]);
  useEffect(()=>{
    const timer=window.setTimeout(()=>setAnnouncement(activeProject?`${activeProject.name}. Projeto ${nav.selectedIndex+1} de ${nav.filteredProjects.length}.`:'Nenhum projeto encontrado.'),900);
    return()=>window.clearTimeout(timer);
  },[activeProject,nav.selectedIndex,nav.filteredProjects.length]);
  useEffect(()=>{
    if(selectedProjectId&&selectedProjectId!==externalProject.current){
      externalProject.current=selectedProjectId;setPlaying(false);openProject(selectedProjectId);
      if(!nav.filteredProjects.some(project=>project.id===selectedProjectId)){nav.setQuery('');nav.setCategory('Todos');}
    }
    if(!selectedProjectId)externalProject.current=null;
  },[selectedProjectId,openProject]);
  useEffect(()=>{
    if(openProjectId&&projects.some(project=>project.id===openProjectId))nav.select(openProjectId);
  },[openProjectId,nav.select]);
  useEffect(()=>{
    if(previousUrlProject.current&&!openProjectId){selectProject(null);externalProject.current=null;}
    previousUrlProject.current=openProjectId;
  },[openProjectId]);

  const openCase=(id:string)=>{interact();externalProject.current=id;selectProject(id);openProject(id);};
  const dismiss=()=>{selectProject(null);externalProject.current=null;closeProject();};
  const next=()=>{interact();nav.next();};
  const previous=()=>{interact();nav.previous();};
  const select=(id:string)=>{interact();if(id===nav.selectedId)openCase(id);else nav.select(id);};
  const clear=()=>{interact();nav.setQuery('');nav.setCategory('Todos');};

  return <section id="portfolio" ref={sectionRef} className={styles.portfolio} aria-labelledby="portfolio-title">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>Portfólio</p><h2 id="portfolio-title">Por dentro<br/>dos projetos.</h2></div>
        <div className={styles.headingAside}><p>Sites, sistemas e operações.<br/>Escolha um trabalho e veja o que foi entregue.</p><span>{projects.length} projetos e estudos para explorar</span></div>
      </header>
      <div className={styles.toolbar}>
        <div className={styles.viewTabs} role="group" aria-label="Visualização do portfólio">
          <button aria-pressed={view==='gallery'} onClick={()=>{interact();setView('gallery');}}>Galeria 3D <span aria-hidden="true">↻</span></button>
          <button aria-pressed={view==='catalog'} onClick={()=>{interact();setView('catalog');}}>Todos os projetos <span>{projects.length}</span></button>
        </div>
        <label className={styles.search}><Search size={18}/><span className={styles.srOnly}>Buscar projetos</span><input type="search" value={nav.query} onChange={event=>{interact();nav.setQuery(event.target.value);}} placeholder="Buscar projeto ou tecnologia"/>{nav.query&&<button aria-label="Limpar busca" onClick={()=>nav.setQuery('')}><X size={17}/></button>}</label>
      </div>
      <div className={styles.filters} role="group" aria-label="Categoria de projetos">{categories.map(category=><button key={category} aria-pressed={nav.category===category} onClick={()=>{interact();nav.setCategory(category);}}>{category}</button>)}</div>
    </div>

    {nav.filteredProjects.length===0?<div className={styles.empty}><Search size={32}/><h3>Nenhum projeto encontrado.</h3><p>Tente outro termo ou explore o catálogo completo.</p><button onClick={clear}>Limpar busca e filtros <ArrowRight size={18}/></button></div>
      :view==='gallery'?<div className={styles.galleryView} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false);}}>
        <PortfolioStage projects={nav.filteredProjects} selectedId={nav.selectedId} reducedMotion={reducedMotion} onSelect={select} onNext={next} onPrevious={previous} onOpen={()=>activeProject&&openCase(activeProject.id)} onInteract={interact} onVisibilityChange={setVisible}/>
        <div className={styles.inner}>
          <div className={styles.stageControls}>
            <div className={styles.controlArrows}><button disabled={nav.filteredProjects.length<2} onClick={previous} aria-label="Projeto anterior"><ArrowLeft size={23}/></button><span aria-label={`Projeto ${nav.selectedIndex+1} de ${nav.filteredProjects.length}`}>{number(nav.selectedIndex+1)} <span>/ {number(nav.filteredProjects.length)}</span></span><button disabled={nav.filteredProjects.length<2} onClick={next} aria-label="Próximo projeto"><ArrowRight size={23}/></button></div>
            <button className={styles.playback} disabled={!canPlay} aria-pressed={playing&&canPlay} onClick={()=>setPlaying(current=>!current)}>{playing&&canPlay?<Pause size={15}/>:<Play size={15}/>}<span>{reducedMotion?'Movimento reduzido':playing&&canPlay?'Pausar rotação':'Reproduzir'}</span></button>
          </div>
          {activeProject&&<div className={styles.activeDetails}>
            <div><p className={styles.meta}>{activeProject.category} <span>—</span> {activeProject.status}</p><h3>{activeProject.name}</h3><p>{activeProject.description}</p></div>
            <button className={styles.caseButton} onClick={()=>openCase(activeProject.id)}>Explorar projeto <ArrowUpRight size={21}/></button>
          </div>}
          <div className={styles.instructions}><span><Kbd keys={['ArrowLeft']}/> <Kbd keys={['ArrowRight']}/> girar <Kbd keys={['Enter']}/> abrir</span><button onClick={()=>{interact();setView('catalog');}}><Grid2X2 size={15}/>Ver catálogo completo</button></div>
        </div>
      </div>:<div className={styles.inner}>
        <p className={styles.catalogCount}>{nav.filteredProjects.length} {nav.filteredProjects.length===1?'projeto encontrado':'projetos encontrados'}</p>
        <ol className={styles.catalog}>{nav.filteredProjects.map((project,index)=><li key={project.id} data-project-id={project.id}>
          <button className={styles.catalogRow} onClick={()=>{nav.select(project.id);openCase(project.id);}}>
            <span className={styles.rowNumber}>{number(index+1)}</span><span className={styles.rowPreview}><ProjectPreview project={project} lazy/></span><span className={styles.rowTitle}><strong>{project.name}</strong><span>{project.category}</span></span><span className={styles.rowStatus}>{project.status}</span><ArrowUpRight size={23}/>
          </button>
        </li>)}</ol>
      </div>}
    {openProjectId&&!caseProject&&<div className={`${styles.inner} ${styles.unknownProject}`} role="status"><p>Este projeto não foi encontrado no catálogo.</p><button onClick={dismiss}>Voltar aos projetos <ArrowRight size={18}/></button></div>}
    <p className={styles.srOnly} aria-live="polite" aria-atomic="true">{announcement}</p>
    {caseProject&&<Suspense fallback={<div role="status" className={styles.loading}>Abrindo projeto…</div>}><ProjectCase key={caseProject.id} project={caseProject} onClose={dismiss}/></Suspense>}
  </section>;
}
