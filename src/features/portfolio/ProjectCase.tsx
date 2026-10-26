import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from 'lucide-react';
import type { ProjectRecord } from '../../app/types';
import { projectMedia } from './projectGallery';
import styles from './portfolio.module.css';

export default function ProjectCase({project,onClose}:{project:ProjectRecord;onClose:()=>void}) {
  const dialogRef=useRef<HTMLDialogElement>(null);
  const closeRef=useRef(onClose);closeRef.current=onClose;
  const [imageIndex,setImageIndex]=useState(0);
  const [zoom,setZoom]=useState(false);
  const [failedImage,setFailedImage]=useState<string|null>(null);
  const swipe=useRef<{x:number;y:number;horizontal:boolean}|null>(null);
  const suppressGalleryClick=useRef(false);
  const media=projectMedia(project);
  const image=media[imageIndex];
  const changeImage=(delta:number)=>setImageIndex(index=>(index+delta+media.length)%media.length);
  useEffect(()=>setFailedImage(null),[image?.src]);
  useEffect(()=>{
    const dialog=dialogRef.current;if(!dialog)return;
    const previouslyFocused=document.activeElement as HTMLElement|null;
    dialog.showModal();
    const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{dialog.close();document.body.style.overflow=oldOverflow;previouslyFocused?.focus({preventScroll:true});};
  },[]);
  const pointerUp=(event:PointerEvent)=>{
    const start=swipe.current;swipe.current=null;if(!start||media.length<2)return;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    const dx=event.clientX-start.x,dy=event.clientY-start.y;
    suppressGalleryClick.current=start.horizontal;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){suppressGalleryClick.current=true;changeImage(dx<0?1:-1);}
  };
  return <dialog ref={dialogRef} className={`${styles.caseDialog} ${zoom?styles.zoomDialog:''}`} aria-labelledby="project-case-title"
    onCancel={event=>{event.preventDefault();if(zoom)setZoom(false);else closeRef.current();}}
    onClick={event=>{if(event.target===event.currentTarget)onClose();}}
    onKeyDown={event=>{if(event.key==='ArrowRight'&&media.length>1){event.preventDefault();changeImage(1);}if(event.key==='ArrowLeft'&&media.length>1){event.preventDefault();changeImage(-1);}}}>
    <article className={styles.caseContent}>
      <div className={styles.caseToolbar}>
        <span>{zoom?'Imagem ampliada':`${project.category} / ${project.status}`}</span>
        <button type="button" className={styles.textButton} onClick={()=>zoom?setZoom(false):onClose()}>{zoom?'Voltar ao projeto':'Fechar projeto'} <X size={20}/></button>
      </div>
      <header className={styles.caseHeader}><p className={styles.meta}>{project.status}</p><h2 id="project-case-title">{project.name}</h2><p>{project.description}</p></header>
      {image?<div className={styles.gallery} onPointerDown={event=>{swipe.current={x:event.clientX,y:event.clientY,horizontal:false};suppressGalleryClick.current=false;}}
        onPointerMove={event=>{const start=swipe.current;if(!start||media.length<2)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.5){start.horizontal=true;suppressGalleryClick.current=true;event.currentTarget.setPointerCapture(event.pointerId);}}}
        onPointerUp={pointerUp} onPointerCancel={()=>{swipe.current=null;suppressGalleryClick.current=false;}}>
        {failedImage===image.src?<div className={styles.caseNoPreview} role="status"><span>Prévia visual indisponível</span><p>Não foi possível carregar esta imagem. O escopo do projeto continua disponível abaixo.</p></div>:<button className={styles.galleryImage} onClick={event=>{if(suppressGalleryClick.current&&event.detail!==0){suppressGalleryClick.current=false;event.preventDefault();return;}suppressGalleryClick.current=false;setZoom(!zoom);}} aria-label={zoom?'Reduzir imagem':`Ampliar imagem: ${image.label}`}>
          <img src={image.src} alt={image.label} loading="eager" onError={()=>setFailedImage(image.src)}/>
          <span className={styles.zoomLabel}><Maximize2 size={16}/>{zoom?'Reduzir':'Ampliar'}</span>
        </button>}
        <div className={styles.galleryBar}><span>{image.label}</span><div><button disabled={media.length<2} aria-label="Imagem anterior" onClick={()=>changeImage(-1)}><ArrowLeft size={20}/></button><span>{imageIndex+1} / {media.length}</span><button disabled={media.length<2} aria-label="Próxima imagem" onClick={()=>changeImage(1)}><ArrowRight size={20}/></button></div></div>
        {media.length>1&&<div className={styles.thumbnails} aria-label="Imagens do projeto">{media.map((item,index)=><button key={item.src} aria-label={`Ver imagem ${index+1}: ${item.label}`} aria-pressed={index===imageIndex} onClick={()=>setImageIndex(index)}><img src={item.src} alt="" loading="lazy"/></button>)}</div>}
      </div>:<div className={styles.caseNoPreview}><span>Prévia visual indisponível</span><p>O escopo e a participação estão descritos abaixo.</p></div>}
      {!zoom&&<div className={styles.caseDetails}>
        <div><h3>Contexto e entrega</h3><p>{project.details||project.description}</p>{project.captureNote&&<p className={styles.captureNote}>{project.captureNote}</p>}</div>
        <dl><div><dt>Participação</dt><dd>{project.role||'Participação descrita no escopo do projeto.'}</dd></div><div><dt>Estágio</dt><dd>{project.status}</dd></div><div><dt>Entregáveis e ferramentas</dt><dd>{project.tags?.length?project.tags.join(' · '):project.category}</dd></div></dl>
      </div>}
      {!zoom&&<footer className={styles.caseFooter}><button className={styles.textButton} onClick={onClose}><ArrowLeft size={18}/>Voltar à galeria</button>{project.url&&<a href={project.url} target="_blank" rel="noopener noreferrer">Abrir projeto <ArrowUpRight size={18}/></a>}</footer>}
    </article>
  </dialog>;
}
