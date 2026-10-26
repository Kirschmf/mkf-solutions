import { useCallback, useMemo, useState } from 'react';
import type { ProjectRecord } from '../../app/types';
import { filterProjects, reconcileSelection, stepSelection } from './portfolioNavigation';

export function usePortfolioNavigation(projects: readonly ProjectRecord[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [requestedId, setRequestedId] = useState<string | null>(projects[Math.min(2, projects.length - 1)]?.id ?? null);
  const filteredProjects = useMemo(() => filterProjects(projects, query, category), [projects, query, category]);
  const selectedId = reconcileSelection(filteredProjects, requestedId);
  const selectedIndex = filteredProjects.findIndex(project => project.id === selectedId);
  const select = useCallback((id: string) => {
    if (filteredProjects.some(project => project.id === id)) setRequestedId(id);
  }, [filteredProjects]);
  const next = useCallback(() => setRequestedId(id => stepSelection(filteredProjects, reconcileSelection(filteredProjects, id), 1)), [filteredProjects]);
  const previous = useCallback(() => setRequestedId(id => stepSelection(filteredProjects, reconcileSelection(filteredProjects, id), -1)), [filteredProjects]);
  return { filteredProjects, selectedId, selectedIndex, query, category, setQuery, setCategory, select, next, previous };
}
