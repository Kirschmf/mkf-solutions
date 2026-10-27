import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
function ensurePlugin(){gsap.registerPlugin(ScrollTrigger);}
export function initScrollReveal(reducedMotion:boolean){
  if(reducedMotion)return()=>{};
  ensurePlugin();
  const ctx=gsap.context(()=>{
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>{
      gsap.from(el,{y:28,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach(group=>{
      gsap.from(group.children,{y:22,opacity:0,duration:.7,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:group,start:'top 88%',once:true}});
    });
  });
  return()=>ctx.revert();
}
export {ScrollTrigger};
