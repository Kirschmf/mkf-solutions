import type { ProjectRecord } from '../../app/types';

export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
export const wrapIndex = (index: number, length: number) => ((index % length) + length) % length;

export function filterProjects(projects: readonly ProjectRecord[], query: string, category: string) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return projects.filter(project => {
    if (category !== 'Todos' && project.category !== category) return false;
    const searchable = normalizeSearch([project.name, project.category, project.description, ...(project.tags ?? [])].join(' '));
    return terms.every(term => searchable.includes(term));
  });
}

export function reconcileSelection(projects: readonly ProjectRecord[], selectedId: string | null): string | null {
  return projects.some(project => project.id === selectedId) ? selectedId : projects[0]?.id ?? null;
}

export function stepSelection(projects: readonly ProjectRecord[], selectedId: string | null, delta: number): string | null {
  if (!projects.length) return null;
  const current = Math.max(0, projects.findIndex(project => project.id === selectedId));
  return projects[wrapIndex(current + delta, projects.length)].id;
}

export function visibleProjectSlots(projects: readonly ProjectRecord[], selectedId: string | null): {project: ProjectRecord; offset:number}[] {
  if (!projects.length) return [];
  const count = Math.min(9, projects.length);
  const current = Math.max(0, projects.findIndex(project => project.id === selectedId));
  const start = -Math.floor((count - 1) / 2);
  return Array.from({length:count}, (_, slot) => {
    const offset = start + slot;
    return {project:projects[wrapIndex(current + offset, projects.length)], offset};
  });
}
