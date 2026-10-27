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
import Portfolio from './features/portfolio/Portfolio';
import WorkflowLab from './features/workflow/WorkflowLab';
import ProfileExplorer from './features/profile/ProfileExplorer';
import ProcessExplorer from './features/process/ProcessExplorer';
import BriefWizard from './features/contact/BriefWizard';
function Shell(){
  const {reducedMotion}=useMotionPreference();
  useEffect(()=>initScrollReveal(reducedMotion),[reducedMotion]);
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><ScrollProgress/><Header/><main id="conteudo"><Hero/><Marquee/><ServiceExplorer/><Portfolio/><WorkflowLab/><ProfileExplorer/><ProcessExplorer/><BriefWizard/></main><Footer/></>;
}
export default function App(){return <JourneyProvider><Shell/></JourneyProvider>;}
