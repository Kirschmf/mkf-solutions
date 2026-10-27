import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BriefDraft, NeedId } from './types';
const initialBrief: BriefDraft = { need:'sites', name:'', objective:'' };
type Journey = {
  need: NeedId; setNeed: (need:NeedId)=>void; brief:BriefDraft;
  updateBrief:(patch:Partial<BriefDraft>)=>void;
};
const JourneyContext = createContext<Journey|null>(null);
export function JourneyProvider({children}:{children:ReactNode}) {
  const [brief,setBrief]=useState(initialBrief);
  const updateBrief=(patch:Partial<BriefDraft>)=>setBrief(old=>({...old,...patch}));
  return <JourneyContext.Provider value={{need:brief.need,setNeed:need=>updateBrief({need}),brief,updateBrief}}>{children}</JourneyContext.Provider>;
}
export function useJourney(){const value=useContext(JourneyContext);if(!value)throw new Error('JourneyProvider ausente');return value;}
