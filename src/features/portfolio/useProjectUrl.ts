import { useCallback, useEffect, useState } from 'react';
import { projectIdFromUrl, projectUrl } from './projectUrl';

const readId = () => typeof window === 'undefined' ? null : projectIdFromUrl(window.location.href);
export function useProjectUrl() {
  const [openProjectId, setOpenProjectId] = useState(readId);
  useEffect(() => {
    const sync = () => setOpenProjectId(readId());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  const openProject = useCallback((id: string) => {
    if (readId() === id) return;
    const state = {...window.history.state, mkfProjectOverlay:true};
    window.history.pushState(state, '', projectUrl(window.location.href, id));
    setOpenProjectId(id);
  }, []);
  const closeProject = useCallback(() => {
    if (window.history.state?.mkfProjectOverlay) window.history.back();
    else {
      window.history.replaceState(window.history.state, '', projectUrl(window.location.href, null));
      setOpenProjectId(null);
    }
  }, []);
  return {openProjectId, openProject, closeProject};
}
