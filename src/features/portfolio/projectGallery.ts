import type { ProjectRecord } from '../../app/types';
export function projectMedia(project:Pick<ProjectRecord,'name'|'image'|'gallery'>):{src:string;label:string}[] {
  const gallery=project.gallery??[];
  if(project.image&&!gallery.some(item=>item.src===project.image)){
    return [{src:project.image,label:`Visão principal — ${project.name}`},...gallery];
  }
  return gallery;
}
