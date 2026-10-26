import { describe, expect, it } from 'vitest';
import catalog from '../../data/projects.json';
import type { ProjectRecord } from '../../app/types';
import { projectMedia } from './projectGallery';

const projects=catalog as ProjectRecord[];
describe('project case gallery',()=>{
  it('includes the AICA main image before its additional product image',()=>{
    const aica=projects.find(project=>project.id==='aica')!;
    expect(projectMedia(aica).map(item=>item.src)).toEqual([aica.image,aica.gallery![0].src]);
  });
  it('preserves Linda Casa before/after order without duplicating the main image',()=>{
    const linda=projects.find(project=>project.id==='linda-casa')!;
    expect(projectMedia(linda)).toEqual(linda.gallery);
    expect(projectMedia(linda)).toHaveLength(2);
  });
  it('keeps a standalone image and provides a readable caption',()=>{
    expect(projectMedia({name:'Ferranti',image:'/ferranti.webp'})).toEqual([{src:'/ferranti.webp',label:'Visão principal — Ferranti'}]);
  });
  it('returns no invented image for an unavailable preview',()=>{
    expect(projectMedia({name:'Método',image:null})).toEqual([]);
  });
});
