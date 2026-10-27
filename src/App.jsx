import {useEffect} from 'react';
import {JourneyProvider} from './app/JourneyContext';
import {useMotionPreference} from './app/useMotionPreference';
import {initScrollReveal} from './app/reveal';
import Header from './components/Header';
import Footer from './components/Footer';
import Marquee from './components/Marquee';
import ScrollProgress from './components/ScrollProgress';
import Hero from './features/intro/Hero';
import ServiceExplorer from './features/services/ServiceExplorer';

import WorkflowLab from './features/workflow/WorkflowLab';
import ProfileExplorer from './features/profile/ProfileExplorer';
import ProcessExplorer from './features/process/ProcessExplorer';
import BriefWizard from './features/contact/BriefWizard';
function Shell(){
  const {reducedMotion}=useMotionPreference();
  useEffect(()=>initScrollReveal(reducedMotion),[reducedMotion]);
  useEffect(()=>{const url=new URL(window.location.href);if(url.searchParams.has('projeto')||url.hash==='#portfolio'){url.searchParams.delete('projeto');if(url.hash==='#portfolio')url.hash='';window.history.replaceState(window.history.state,'',url);}},[]);
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><ScrollProgress/><Header/><main id="conteudo"><Hero/><Marquee/><ServiceExplorer/><WorkflowLab/><ProfileExplorer/><ProcessExplorer/><BriefWizard/></main><Footer/></>;
}
export default function App(){return <JourneyProvider><Shell/></JourneyProvider>;}
