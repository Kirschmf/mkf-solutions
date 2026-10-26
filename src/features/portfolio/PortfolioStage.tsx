import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type KeyboardEvent } from 'react';
import type { ProjectRecord } from '../../app/types';
import type { PortfolioScene } from './createPortfolioScene';
import { visibleProjectSlots } from './portfolioNavigation';
import styles from './portfolio.module.css';

type Props = {
  projects:readonly ProjectRecord[]; selectedId:string|null; reducedMotion:boolean;
  onSelect:(id:string)=>void; onNext:()=>void; onPrevious:()=>void; onOpen:()=>void;
  onInteract:()=>void; onVisibilityChange:(visible:boolean)=>void;
};

export default function PortfolioStage({projects,selectedId,reducedMotion,onSelect,onNext,onPrevious,onOpen,onInteract,onVisibilityChange}:Props) {
  const stageRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLDivElement>(null);
  const sceneRef=useRef<PortfolioScene|null>(null);
  const latest=useRef({projects,selectedId,onSelect});latest.current={projects,selectedId,onSelect};
  const [desktop,setDesktop]=useState(false);
  const [inView,setInView]=useState(false);
  const [entered,setEntered]=useState(false);
  const [hidden,setHidden]=useState(false);
  const [failed,setFailed]=useState(false);
  const [ready,setReady]=useState(false);
  const [dragX,setDragX]=useState(0);
  const pointer=useRef<{id:number;x:number;y:number;dx:number;horizontal:boolean}|null>(null);
  const suppressClick=useRef(false);
  const slots=visibleProjectSlots(projects,selectedId);

  useEffect(()=>{
    const media=window.matchMedia('(min-width: 768px)');
    const update=()=>setDesktop(media.matches);update();media.addEventListener('change',update);
    const visibility=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',visibility);
    return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{
    const target=stageRef.current;if(!target)return;
    const observer=new IntersectionObserver(entries=>{
      const visible=entries[0].isIntersecting;
      setInView(visible);if(visible)setEntered(true);onVisibilityChange(visible);
    },{threshold:.15});
    observer.observe(target);return()=>observer.disconnect();
  },[onVisibilityChange]);

  useEffect(()=>{
    if(!desktop||reducedMotion||!entered||failed)return;
    let cancelled=false;const host=canvasRef.current;if(!host)return;
    const lost=()=>{setFailed(true);setReady(false);};
    host.addEventListener('portfolio:webgl-lost',lost);
    import('./createPortfolioScene').then(({createPortfolioScene})=>{
      if(cancelled)return;
      const scene=createPortfolioScene(host,id=>latest.current.onSelect(id));
      sceneRef.current=scene;scene.setCards(latest.current.projects);scene.setActive(latest.current.selectedId);setReady(true);
    }).catch(()=>{if(!cancelled)setFailed(true);});
    return()=>{cancelled=true;host.removeEventListener('portfolio:webgl-lost',lost);sceneRef.current?.dispose();sceneRef.current=null;setReady(false);};
  },[desktop,reducedMotion,entered,failed]);
  useEffect(()=>{const scene=sceneRef.current;if(scene){scene.setCards(projects);scene.setActive(selectedId);}},[projects,ready]);
  useEffect(()=>{sceneRef.current?.setActive(selectedId);},[selectedId]);
  useEffect(()=>{sceneRef.current?.setMotion(inView&&!hidden);},[inView,hidden,ready]);

  const down=(event:PointerEvent<HTMLDivElement>)=>{
    if(event.button!==0||projects.length<2)return;
    pointer.current={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,horizontal:false};
    suppressClick.current=false;onInteract();
  };
  const move=(event:PointerEvent<HTMLDivElement>)=>{
    const start=pointer.current;if(!start||start.id!==event.pointerId)return;
    const dx=event.clientX-start.x,dy=event.clientY-start.y;
    if(!start.horizontal&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2){
      start.horizontal=true;event.currentTarget.setPointerCapture(event.pointerId);
    }
    if(!start.horizontal)return;
    start.dx=dx;suppressClick.current=true;
    if(event.cancelable)event.preventDefault();
    if(sceneRef.current)sceneRef.current.drag(dx);else setDragX(dx*.65);
  };
  const up=(event:PointerEvent<HTMLDivElement>)=>{
    const start=pointer.current;if(!start||start.id!==event.pointerId)return;
    pointer.current=null;setDragX(0);
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    if(start.horizontal&&Math.abs(start.dx)>42){if(start.dx<0)onNext();else onPrevious();}
    else sceneRef.current?.drag(null);
  };
  const keyboard=(event:KeyboardEvent<HTMLDivElement>)=>{
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();onInteract();event.key==='ArrowRight'?onNext():onPrevious();
    } else if(event.key==='Enter'&&event.target===event.currentTarget){event.preventDefault();onInteract();onOpen();}
  };
  return <div ref={stageRef} className={styles.stage} data-stage-mode={ready?'webgl':'css'} data-active-project={selectedId??''} data-dragging={dragX!==0||undefined}
    role="group" aria-roledescription="carrossel" aria-label="Galeria de projetos. Use as setas para girar e Enter para abrir o projeto." tabIndex={0}
    onKeyDown={keyboard} onPointerDown={down} onPointerMove={move} onPointerUp={up}
    onPointerCancel={()=>{pointer.current=null;setDragX(0);sceneRef.current?.drag(null);}}
    onClick={event=>{if(!suppressClick.current&&ready){onInteract();sceneRef.current?.pick(event.clientX,event.clientY);}suppressClick.current=false;}}>
    <div ref={canvasRef} className={styles.canvasHost} aria-hidden="true" />
    <div className={`${styles.htmlDeck} ${ready?styles.deckHidden:''}`} style={{'--drag-x':`${dragX}px`} as CSSProperties} aria-hidden={ready||undefined}>
      {slots.map(({project,offset})=><button key={project.id} className={styles.previewCard} tabIndex={ready?-1:offset===0?0:-1}
        style={{'--offset':offset,'--distance':Math.abs(offset),'--stack':10-Math.abs(offset)} as CSSProperties}
        onClick={event=>{event.stopPropagation();if(!suppressClick.current)onSelect(project.id);suppressClick.current=false;}}
        aria-label={`${project.name}${offset===0?' — abrir projeto':' — trazer para frente'}`}>
        <span className={styles.browserBar}><span aria-hidden="true">● ● ●</span><span>{project.domain||project.name}</span></span>
        <ProjectPreview project={project}/>
      </button>)}
    </div>
    <span className={styles.dragHint} aria-hidden="true">← Arraste para explorar →</span>
  </div>;
}

export function ProjectPreview({project,lazy=false}:{project:ProjectRecord;lazy?:boolean}) {
  const [broken,setBroken]=useState(false);
  useEffect(()=>setBroken(false),[project.image]);
  return project.image&&!broken?<img src={project.image} alt={`Captura de ${project.name}`} draggable={false} loading={lazy?'lazy':'eager'} onError={()=>setBroken(true)}/>
    :<span className={styles.noPreview}><span>{project.category}</span><strong>{project.name}</strong><span>Prévia visual indisponível</span></span>;
}
