import * as THREE from 'three';
import { gsap } from 'gsap';
import type { ProjectRecord } from '../../app/types';
import { wrapIndex } from './portfolioNavigation';

const STEP = Math.PI * 2 / 9;
const RADIUS = 8.1;
type Slot = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  image: HTMLImageElement | null;
  absolute: number;
  projectId: string;
};

/** Nine reusable planes on one cylinder. Images are released as their slot leaves the ring. */
export function createPortfolioScene(host: HTMLElement, onSelect: (id:string)=>void) {
  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 80);
  camera.position.set(0, .15, 16.4);
  camera.lookAt(0, 0, RADIUS);
  const ring = new THREE.Group();
  scene.add(ring);
  const geometry = new THREE.PlaneGeometry(5.6, 3.5);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let projects: readonly ProjectRecord[] = [];
  let slots: Slot[] = [];
  let activeIndex = 0;
  let absoluteIndex = 0;
  let targetAngle = 0;
  let disposed = false;
  let motionEnabled = true;
  let tween: gsap.core.Tween | null = null;

  function render() {
    if (disposed || !motionEnabled) return;
    for (const slot of slots) {
      const theta = slot.absolute * STEP + ring.rotation.y;
      const frontal = Math.cos(theta);
      slot.mesh.visible = frontal > -.12;
      slot.mesh.material.color.setScalar(.72 + .28 * Math.max(0, frontal));
    }
    renderer.render(scene, camera);
    host.dataset.slots = String(slots.length);
    host.dataset.textures = String(renderer.info.memory.textures);
  }

  function drawPreview(slot:Slot, project:ProjectRecord, image?:HTMLImageElement) {
    const ctx=slot.canvas.getContext('2d');
    if (!ctx) return;
    const w=slot.canvas.width, h=slot.canvas.height, bar=36;
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#E8EBED';ctx.fillRect(0,0,w,bar);
    ['#C6CBD0','#C6CBD0','#C6CBD0'].forEach((color,i)=>{
      ctx.fillStyle=color;ctx.beginPath();ctx.arc(20+i*17,18,4,0,Math.PI*2);ctx.fill();
    });
    ctx.fillStyle='#626873';ctx.font='16px sans-serif';ctx.textBaseline='middle';
    ctx.fillText(project.domain || project.name,94,19,w-120);
    if (image) {
      const scale=Math.max(w/image.naturalWidth,(h-bar)/image.naturalHeight);
      ctx.save();ctx.beginPath();ctx.rect(0,bar,w,h-bar);ctx.clip();
      ctx.drawImage(image,0,bar,image.naturalWidth*scale,image.naturalHeight*scale);ctx.restore();
    } else {
      ctx.fillStyle='#F0F1ED';ctx.fillRect(0,bar,w,h-bar);
      ctx.fillStyle='#2548F4';ctx.font='22px sans-serif';ctx.fillText(project.category.toUpperCase(),66,120);
      ctx.fillStyle='#17191D';ctx.font='54px sans-serif';
      const words=project.name.split(' ');let line='',y=230;
      for(const word of words){if(ctx.measureText(line+word).width>w-132){ctx.fillText(line,66,y);line='';y+=68;}line+=word+' ';}
      ctx.fillText(line,66,y);
      ctx.font='24px sans-serif';ctx.fillStyle='#626873';ctx.fillText('Prévia visual indisponível',66,h-100);
      ctx.strokeStyle='#D7DCE1';ctx.lineWidth=1;ctx.strokeRect(.5,bar+.5,w-1,h-bar-1);
    }
    slot.texture.needsUpdate=true;
    render();
  }

  function assign(slot:Slot, absolute:number) {
    const project=projects[wrapIndex(absolute,projects.length)];
    slot.absolute=absolute;
    const theta=absolute*STEP;
    slot.mesh.position.set(Math.sin(theta)*RADIUS,0,Math.cos(theta)*RADIUS);
    slot.mesh.rotation.y=theta;
    slot.mesh.userData.projectId=project.id;
    if (slot.projectId===project.id) return;
    slot.projectId=project.id;
    if(slot.image){slot.image.onload=null;slot.image.onerror=null;slot.image=null;}
    drawPreview(slot,project);
    if(project.image){
      const image=new Image();slot.image=image;
      image.onload=()=>{if(!disposed&&slot.image===image)drawPreview(slot,project,image);};
      image.onerror=()=>{if(!disposed&&slot.image===image)drawPreview(slot,project);};
      image.src=project.image;
    }
  }

  function reconcileSlots() {
    const count=Math.min(9,projects.length);
    const start=absoluteIndex-Math.floor((count-1)/2);
    for(let i=0;i<count;i++) {
      const absolute=start+i;
      const slot=slots[wrapIndex(absolute,count)];
      assign(slot,absolute);
    }
    render();
  }

  function clearSlots() {
    for (const slot of slots) {
      if(slot.image){slot.image.onload=null;slot.image.onerror=null;}
      ring.remove(slot.mesh);slot.mesh.material.dispose();slot.texture.dispose();
      slot.canvas.width=1;slot.canvas.height=1;
    }
    slots=[];
  }

  function setCards(next:readonly ProjectRecord[]) {
    tween?.kill();clearSlots();projects=next;
    activeIndex=0;absoluteIndex=0;targetAngle=0;ring.rotation.y=0;
    for(let i=0;i<Math.min(9,next.length);i++) {
      const canvas=document.createElement('canvas');canvas.width=1120;canvas.height=700;
      const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
      texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
      ring.add(mesh);slots.push({mesh,texture,canvas,image:null,absolute:0,projectId:''});
    }
    if(next.length)reconcileSlots();else render();
  }

  function setActive(id:string|null) {
    const next=projects.findIndex(project=>project.id===id);
    if(next<0)return;
    let delta=next-activeIndex;
    if(delta>projects.length/2)delta-=projects.length;
    if(delta< -projects.length/2)delta+=projects.length;
    activeIndex=next;absoluteIndex+=delta;targetAngle=-absoluteIndex*STEP;
    reconcileSlots();tween?.kill();
    if(!motionEnabled){ring.rotation.y=targetAngle;render();return;}
    tween=gsap.to(ring.rotation,{y:targetAngle,duration:.85,ease:'power3.out',onUpdate:render});
  }

  function setMotion(enabled:boolean) {
    motionEnabled=enabled;
    if(!enabled){tween?.pause();}
    else if(tween?.paused()){tween.resume();}
    if(enabled)render();
  }

  function drag(distance:number|null) {
    tween?.kill();
    if(distance===null){tween=gsap.to(ring.rotation,{y:targetAngle,duration:.55,ease:'power3.out',onUpdate:render});}
    else {ring.rotation.y=targetAngle+distance*.0025;render();}
  }

  function pick(clientX:number,clientY:number) {
    const bounds=renderer.domElement.getBoundingClientRect();
    pointer.set((clientX-bounds.left)/bounds.width*2-1,-(clientY-bounds.top)/bounds.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects(slots.filter(slot=>slot.mesh.visible).map(slot=>slot.mesh))[0];
    if(hit)onSelect(hit.object.userData.projectId);
  }

  function resize() {
    if(disposed)return;
    const width=host.clientWidth,height=host.clientHeight;
    if(!width||!height)return;
    renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();render();
  }
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  function contextLost(event:Event){event.preventDefault();host.dispatchEvent(new CustomEvent('portfolio:webgl-lost'));}
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  return {
    setCards,setActive,setMotion,drag,pick,
    dispose(){
      if(disposed)return;
      disposed=true;tween?.kill();observer.disconnect();clearSlots();geometry.dispose();
      renderer.domElement.removeEventListener('webglcontextlost',contextLost);
      renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
      delete host.dataset.slots;delete host.dataset.textures;
    },
  };
}

export type PortfolioScene = ReturnType<typeof createPortfolioScene>;
