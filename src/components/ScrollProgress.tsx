import {useEffect,useRef} from 'react';
import styles from './scrollProgress.module.css';
export default function ScrollProgress(){
  const bar=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let raf=0;
    const update=()=>{const el=bar.current;if(!el)return;const max=document.documentElement.scrollHeight-window.innerHeight;const p=max>0?Math.min(1,window.scrollY/max):0;el.style.transform=`scaleX(${p})`;};
    const onScroll=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update);};
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
    update();
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(raf);};
  },[]);
  return <div className={styles.progress} aria-hidden="true"><div ref={bar} className={styles.bar}/></div>;
}
