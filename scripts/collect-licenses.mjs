import fs from 'node:fs/promises';
import path from 'node:path';
const names=['react','react-dom','gsap','three','motion','framer-motion','lucide-react','@xyflow/react','@xyflow/system','zustand','d3-drag','d3-zoom','d3-selection','d3-interpolate','d3-transition','d3-dispatch','d3-color','d3-ease','d3-timer','classcat','use-sync-external-store'];
let output='MKF Solutions — Third-party software notices\n\n';
for(const name of names){const root=path.join('node_modules',name);try{const files=await fs.readdir(root);const file=files.find(file=>/^licen[sc]e(?:\.md|\.txt)?$/i.test(file));if(file)output+=`\n===== ${name} =====\n${await fs.readFile(path.join(root,file),'utf8')}\n`;}catch{}}
await fs.mkdir('public/licenses',{recursive:true});await fs.writeFile('public/licenses/third-party-notices.txt',output);
console.log(`Notices collected for ${names.length} runtime packages`);
