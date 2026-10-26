import { describe, expect, it } from 'vitest';
import { filterProjects, reconcileSelection, stepSelection, visibleProjectSlots } from './portfolioNavigation';
import { projectUrl, projectIdFromUrl } from './projectUrl';
import type { ProjectRecord } from '../../app/types';

const projects: ProjectRecord[] = [
  { id:'a', name:'Operação Ágil', category:'Operação', description:'Catálogo e expedição', status:'Entregue' },
  { id:'b', name:'Loja da Serra', category:'E-commerce', description:'Comércio integrado', status:'Publicado', tags:['Conexão Bling'] },
  { id:'c', name:'Ferranti', category:'Sites', description:'Site institucional', status:'Publicado' },
];
describe('portfolio navigation', () => {
  it('finds accents through unaccented queries and tags', () => {
    expect(filterProjects(projects,'operacao','Todos').map(p=>p.id)).toEqual(['a']);
    expect(filterProjects(projects,'catalogo','Operação').map(p=>p.id)).toEqual(['a']);
    expect(filterProjects(projects,'conexao bling','Todos').map(p=>p.id)).toEqual(['b']);
  });
  it('returns no selection when the filter has no results', () => {
    expect(reconcileSelection(filterProjects(projects,'inexistente','Todos'),'a')).toBe(null);
  });
  it('preserves a selection still present after filtering', () => {
    expect(reconcileSelection(projects,'b')).toBe('b');
    expect(reconcileSelection([projects[2]],'b')).toBe('c');
  });
  it('keeps a singleton selected and wraps a multi-project selection', () => {
    expect(stepSelection([projects[0]],'a',1)).toBe('a');
    expect(stepSelection(projects,'c',1)).toBe('a');
    expect(stepSelection(projects,'a',-1)).toBe('c');
    expect(stepSelection([],null,1)).toBe(null);
  });
  it('allocates at most nine unique slots around the selected project', () => {
    const many = Array.from({length:55},(_,i)=>({...projects[0],id:String(i)}));
    const slots=visibleProjectSlots(many,'54');
    expect(slots).toHaveLength(9);
    expect(new Set(slots.map(s=>s.project.id)).size).toBe(9);
    expect(slots.find(s=>s.offset===0)?.project.id).toBe('54');
    expect(visibleProjectSlots(projects,'b').map(s=>s.project.id).sort()).toEqual(['a','b','c']);
  });
});
describe('shareable project URL',()=>{
  it('preserves unrelated parameters and opens at the portfolio anchor',()=>{
    const url=projectUrl('https://mkf.test/?origem=perfil#sobre','operacao-á');
    expect(projectIdFromUrl(url)).toBe('operacao-á');
    expect(new URL(url).searchParams.get('origem')).toBe('perfil');
    expect(new URL(url).hash).toBe('#portfolio');
  });
  it('removes only the project parameter on close',()=>{
    const url=projectUrl('https://mkf.test/?origem=perfil&projeto=a#portfolio',null);
    expect(projectIdFromUrl(url)).toBe(null);
    expect(new URL(url).searchParams.get('origem')).toBe('perfil');
  });
});
