import fs from 'node:fs/promises';
const out=new URL('../public/fonts/',import.meta.url);await fs.mkdir(out,{recursive:true});
const url='https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600;700&display=swap';
const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'}});
if(!response.ok)throw new Error(`Font CSS ${response.status}`);
const css=await response.text();let output='';let i=0;
for(const block of css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)){
 let face=block[1];const remote=face.match(/url\(([^)]+)\)/)?.[1];if(!remote)continue;
 const name=`mkf-font-${i++}.woff2`;const file=await fetch(remote);if(!file.ok)throw new Error(`Font ${file.status}`);
 await fs.writeFile(new URL(name,out),Buffer.from(await file.arrayBuffer()));output+=face.replace(remote,`/fonts/${name}`)+'\n';
}
if(!i)throw new Error('Latin subset not found');await fs.writeFile(new URL('fonts.css',out),output);
for(const [name,path]of [['Instrument-Sans','instrumentsans'],['IBM-Plex-Mono','ibmplexmono']]){
 const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${path}/OFL.txt`);if(license.ok)await fs.writeFile(new URL(`${name}-OFL.txt`,out),await license.text());
}
console.log(`Self-hosted ${i} font faces`);
