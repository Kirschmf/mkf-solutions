import {useEffect,useState} from 'react';
let memoryPreference:boolean|null=null;
function savedPreference(){if(memoryPreference!==null)return memoryPreference;try{return localStorage.getItem('mkf-reduced-motion')==='true';}catch{return false;}}
function readPreference(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches||savedPreference();}
export function useMotionPreference(){
 const [reducedMotion,setReducedMotion]=useState(readPreference);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{const reduced=readPreference();setReducedMotion(reduced);document.documentElement.dataset.reducedMotion=String(reduced);};
  media.addEventListener('change',update);window.addEventListener('mkf-motionchange',update);update();
  return()=>{media.removeEventListener('change',update);window.removeEventListener('mkf-motionchange',update);};
 },[]);
 const toggleMotion=()=>{memoryPreference=!reducedMotion;try{localStorage.setItem('mkf-reduced-motion',String(memoryPreference));}catch{/* The choice remains available in memory when browser storage is blocked. */}window.dispatchEvent(new Event('mkf-motionchange'));};
 return {reducedMotion,toggleMotion,systemReducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches};
}
