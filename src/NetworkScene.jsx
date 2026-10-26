import { useEffect, useRef } from 'react';

export default function NetworkScene({ reducedMotion }) {
  const host = useRef(null);
  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false, cleanup;
    import('three').then(THREE => {
      if (cancelled || !host.current) return;
      const el = host.current;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'low-power' }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.z = 7.8;
      const group = new THREE.Group(); scene.add(group);
      const points = [];
      for (let i = 0; i < 76; i++) {
        const phi = Math.acos(1 - 2 * (i + .5) / 76), theta = Math.PI * (1 + Math.sqrt(5)) * i;
        points.push(new THREE.Vector3(2.6*Math.sin(phi)*Math.cos(theta), 2.6*Math.sin(phi)*Math.sin(theta), 2.6*Math.cos(phi)));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.PointsMaterial({ color:0x8bd3fc, size:.055, transparent:true, opacity:.8 });
      group.add(new THREE.Points(geo, material));
      const segments = [];
      points.forEach((p,i) => points.slice(i+1).forEach(q => { if(p.distanceTo(q)<1.2) segments.push(p.x,p.y,p.z,q.x,q.y,q.z); }));
      const lineGeo = new THREE.BufferGeometry(); lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));
      const lineMaterial = new THREE.LineBasicMaterial({color:0x77bde7,transparent:true,opacity:.17});
      group.add(new THREE.LineSegments(lineGeo,lineMaterial));
      let visible = true, frame = 0, last = 0, pointer = {x:0,y:0};
      const resize = () => { const {width,height}=el.getBoundingClientRect(); renderer.setSize(width,height); camera.aspect=width/height; camera.updateProjectionMatrix(); };
      const observer = new ResizeObserver(resize); observer.observe(el); resize();
      const intersection = new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;}); intersection.observe(el);
      const move = e => {pointer={x:(e.clientX/window.innerWidth-.5)*.35,y:(e.clientY/window.innerHeight-.5)*.2};};
      window.addEventListener('pointermove', move, {passive:true});
      const animate = t => {frame=requestAnimationFrame(animate); if(!visible||document.hidden||t-last<32)return; last=t; group.rotation.y=t*.000045+pointer.x;group.rotation.x=pointer.y; renderer.render(scene,camera);}; frame=requestAnimationFrame(animate);
      cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();window.removeEventListener('pointermove',move);geo.dispose();material.dispose();lineGeo.dispose();lineMaterial.dispose();renderer.dispose();renderer.domElement.remove();};
    });
    return () => {cancelled=true;cleanup?.();};
  },[reducedMotion]);
  return <div ref={host} className="network-scene" aria-hidden="true" />;
}
