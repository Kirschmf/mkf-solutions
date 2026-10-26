import type { HTMLAttributes } from 'react';

/** Adapted from Spell UI Keyboard Shortcuts, https://spell.sh/r/kbd.json.
 * Native key handling belongs to the focused carousel; no global hotkey dependency.
 */
const symbols: Record<string,string> = { command:'⌘', cmd:'⌘', control:'⌃', ctrl:'⌃', alt:'⌥', option:'⌥', space:'␣', arrowleft:'←', left:'←', arrowright:'→', right:'→', arrowup:'↑', arrowdown:'↓' };
type KeyItem = string | {display:string; key:string};
export function Kbd({keys=[],active=false,className,...props}:HTMLAttributes<HTMLElement> & {keys:KeyItem[];active?:boolean}) {
  return <kbd {...props} className={className} data-active={active || undefined} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:3,minWidth:27,padding:'2px 7px',border:'1px solid #c5cad0',borderBottomWidth:2,borderRadius:4,fontSize:13,lineHeight:1.4,fontFamily:'inherit',background:'#fff',...props.style}}>
    {keys.map((item,index)=>{const label=typeof item==='string'?item:item.display;return <span key={index}>{symbols[label.toLowerCase()]??label.toUpperCase()}</span>})}
  </kbd>;
}
