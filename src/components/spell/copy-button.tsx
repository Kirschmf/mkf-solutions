/** Adapted from Spell UI Copy Button, MIT © 2025 Spell UI.
 * Source: https://spell.sh/r/copy-button.json
 * MKF adaptation awaits the clipboard and exposes failure instead of reporting false success.
 */
import {forwardRef,useEffect,useRef,useState,type ButtonHTMLAttributes} from 'react';
import {Check,Copy} from 'lucide-react';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{value:string;onCopyError?:()=>void};
export const CopyButton=forwardRef<HTMLButtonElement,Props>(function CopyButton({value,onCopyError,className,...props},ref){
 const [copied,setCopied]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 async function copy(){try{await navigator.clipboard.writeText(value);setCopied(true);timer.current=setTimeout(()=>setCopied(false),2000);}catch{setCopied(false);onCopyError?.();}}
 return <button {...props} ref={ref} type="button" onClick={copy} className={className} aria-label={copied?'Mensagem copiada':'Copiar mensagem'}>{copied?<Check size={16}/>:<Copy size={16}/>}<span aria-live="polite">{copied?'Mensagem copiada':'Copiar mensagem'}</span></button>;
});
