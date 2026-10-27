import {useEffect,useState} from 'react';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import styles from './chrome.module.css';
export function Brand(){return <a className={styles.brand} href="#inicio" aria-label="MKF Solutions, início"><svg viewBox="0 0 48 44" aria-hidden="true"><path d="M1 40V25l11-10v25zm17 0V14L29 4v36zm17 0V25l11-10v25z" fill="currentColor"/></svg><span>MKF<span>solutions</span></span></a>;}
export default function Header(){
 const [open,setOpen]=useState(false),[active,setActive]=useState('');
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id);});},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(el=>observer.observe(el));return()=>observer.disconnect();},[]);
 const links=[['solucoes','Soluções'],['automacoes','Experimente'],['sobre','Matheus']];
 return <header className={styles.header}><div className={`container ${styles.headerInner}`}><Brand/><nav className={`${styles.nav} ${open?styles.open:''}`} aria-label="Navegação principal">{links.map(([id,label])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)} aria-current={active===id?'location':undefined}>{label}</a>)}</nav><a href="#contato" className={styles.contact}>Vamos conversar<ArrowUpRight size={16}/></a><button className={styles.menu} onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Fechar menu':'Abrir menu'}>{open?<X size={22}/>:<Menu size={22}/>}</button></div></header>;
}
