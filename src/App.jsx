import {JourneyProvider} from './app/JourneyContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './features/intro/Hero';
import ServiceExplorer from './features/services/ServiceExplorer';
import Portfolio from './features/portfolio/Portfolio';
import WorkflowLab from './features/workflow/WorkflowLab';
import ProfileExplorer from './features/profile/ProfileExplorer';
import ProcessExplorer from './features/process/ProcessExplorer';
import BriefWizard from './features/contact/BriefWizard';
export default function App(){return <JourneyProvider><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header/><main id="conteudo"><Hero/><ServiceExplorer/><Portfolio/><WorkflowLab/><ProfileExplorer/><ProcessExplorer/><BriefWizard/></main><Footer/></JourneyProvider>;}