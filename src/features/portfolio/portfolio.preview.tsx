import { createRoot } from 'react-dom/client';
import { JourneyProvider } from '../../app/JourneyContext';
import Portfolio from './Portfolio';
import '../../styles/tokens.css';
import '../../styles/global.css';
createRoot(document.getElementById('root')!).render(<JourneyProvider><Portfolio/></JourneyProvider>);
