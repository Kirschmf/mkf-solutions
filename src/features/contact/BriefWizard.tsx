import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Check,Plus,Minus} from 'lucide-react';
import {gsap} from 'gsap';
import {useJourney} from '../../app/JourneyContext';
import {useMotionPreference} from '../../app/useMotionPreference';
import {usePanelMotion} from '../../app/usePanelMotion';
import {ScrollTrigger} from '../../app/reveal';
import {MotionHeading} from '../../components/MotionHeading';
import {needs} from '../../data/services';
import {buildBriefMessage,createWhatsappUrl,validateBrief} from './briefMessage';
import {CopyButton} from '../../components/spell/copy-button';
import InteractiveTabs from '../../components/InteractiveTabs';
import styles from './contact.module.css';

const faqs=[
 ['Você atende empresas de outras cidades?','Sim. O trabalho pode ser acompanhado remotamente, com reuniões e versões para revisão. Minha base é Canoas e Porto Alegre, no Rio Grande do Sul.'],
 ['Já tenho um site ou sistema. Você consegue trabalhar nele?','Podemos avaliar a plataforma, a implementação e os acessos disponíveis. A proposta define quais melhorias e integrações são viáveis nesse contexto.'],
 ['Como você define prazo e investimento?','A partir do escopo: páginas, funções, conteúdo, integrações e responsabilidades. A proposta apresenta a entrega, as etapas, o prazo e o investimento antes do início.'],
 ['A gestão pode incluir toda a operação da loja?','Sim. Podemos combinar catálogo, preços, estoque, pedidos, logística, anúncios, atendimento e indicadores. As responsabilidades e os canais atendidos ficam definidos no escopo.']
];

function FaqItem({question,answer,index,open,onToggle}:{question:string;answer:string;index:number;open:boolean;onToggle:()=>void}){
 const answerElement=useRef<HTMLDivElement>(null);
 const animation=useRef<gsap.Context|null>(null);
 const mounted=useRef(false);
 const {reducedMotion}=useMotionPreference();

 useLayoutEffect(()=>{
  const element=answerElement.current;
  if(!element)return;
  if(reducedMotion)return;
  const context=gsap.context(()=>{
   gsap.set(element,{height:open?'auto':0,autoAlpha:open?1:0});
  },element);
  animation.current=context;
  return()=>{context.revert();if(animation.current===context)animation.current=null;};
 },[reducedMotion]);

 useLayoutEffect(()=>{
  if(!mounted.current){mounted.current=true;return;}
  const element=answerElement.current;
  if(!element)return;
  if(reducedMotion){ScrollTrigger.refresh();return;}
  animation.current?.add(()=>{
   gsap.killTweensOf(element);
   gsap.to(element,{
    height:open?'auto':0,autoAlpha:open?1:0,duration:.32,ease:'power2.inOut',
    onComplete:()=>{ScrollTrigger.refresh();}
   });
  });
 },[open,reducedMotion]);

 return <div className={styles.faq} data-motion-item>
  <h3><button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`faq-answer-${index}`}>{question}{open?<Minus size={18}/>:<Plus size={18}/>}</button></h3>
  <div ref={answerElement} id={`faq-answer-${index}`} className={styles.faqAnswer} data-open={open} aria-hidden={!open} inert={!open}>
   <p>{answer}</p>
  </div>
 </div>;
}

export default function BriefWizard(){
 const {need,setNeed,brief,updateBrief}=useJourney();
 const [step,setStep]=useState(0);
 const [errors,setErrors]=useState<{name?:string;objective?:string}>({});
 const [copyError,setCopyError]=useState(false);
 const [faq,setFaq]=useState<number|null>(null);
 const fallback=useRef<HTMLTextAreaElement>(null);
 const objective=useRef<HTMLTextAreaElement>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 const stepContent=useRef<HTMLDivElement>(null);
 const direction=useRef(1);
 const hasRendered=useRef(false);
 const message=buildBriefMessage(brief);
 usePanelMotion(stepContent,step,{direction:direction.current});
 useEffect(()=>{if(!hasRendered.current){hasRendered.current=true;return;}heading.current?.focus();},[step]);
 useEffect(()=>{if(copyError){fallback.current?.focus();fallback.current?.select();}},[copyError]);

 function next(){
  if(step===1){
   const found=validateBrief(brief);
   setErrors(found);
   if(Object.keys(found).length){objective.current?.focus();return;}
  }
  direction.current=1;
  setStep(s=>Math.min(2,s+1));
 }
 function back(){
  direction.current=-1;
  setStep(s=>Math.max(0,s-1));
  setCopyError(false);
 }

 return <>
  <section className={`section ${styles.faqSection}`} aria-labelledby="faq-title">
   <div className={`container ${styles.faqLayout}`}>
    <div>
     <span className="eyebrow">Antes de começar</span>
     <MotionHeading id="faq-title" className="section-title" lines={['Perguntas de','quem vai contratar.']}/>
    </div>
    <div data-motion-group>
     {faqs.map(([question,answer],index)=><FaqItem key={question} question={question} answer={answer} index={index} open={faq===index} onToggle={()=>setFaq(faq===index?null:index)}/>)}
    </div>
   </div>
  </section>
  <section className={`section ${styles.contact}`} id="contato" aria-labelledby="contact-title">
   <div className={`container ${styles.layout}`}>
    <div className={styles.intro} data-motion-group>
     <span className="eyebrow" data-motion-item>Conte o que precisa</span>
     <MotionHeading id="contact-title" lines={['Vamos','trabalhar','na sua ideia?']}/>
     <p data-motion-item>Um contexto claro é um bom começo. Prepare seu briefing e continuamos a conversa pelo WhatsApp.</p>
     <a href="https://wa.me/5551991629355" target="_blank" rel="noreferrer" data-motion-item><span>WhatsApp comercial</span><strong>+55 51 99162-9355</strong><ArrowUpRight size={24}/></a>
     <div className={styles.author} data-motion-item><img src="/assets/matheus-kirsch.png" alt="Matheus Kirsch" loading="lazy"/><div><strong>Matheus Kirsch</strong><span>Você conversa direto com quem desenvolve.</span></div></div>
    </div>
    <div className={styles.wizard} data-motion-panel>
     <div className={styles.steps} aria-label="Etapas do briefing">
      {['Necessidade','Contexto','Revisão'].map((label,index)=><span key={label} aria-current={step===index?'step':undefined} className={step===index?styles.current:step>index?styles.done:''}><i>{step>index?<Check size={12}/>:index+1}</i>{label}</span>)}
     </div>
     <div className={styles.formBody}>
      <p className={styles.stepCount}>Etapa {step+1} de 3</p>
      <h3 ref={heading} tabIndex={-1}>{['O que você quer construir?','Qual é o seu contexto?','Sua mensagem está pronta.'][step]}</h3>
      <div ref={stepContent} className={styles.stepContent}>
       {step===0&&<>
        <p>Selecione a frente que mais se aproxima do seu projeto.</p>
        <InteractiveTabs activeKey={need} className={styles.needOptions} role="group" aria-label="Necessidade do projeto">{needs.map(item=><button key={item.id} type="button" aria-pressed={need===item.id} onClick={()=>setNeed(item.id)} className={need===item.id?styles.selected:''}>{item.intent}{need===item.id?<Check size={17}/>:<ArrowRight size={17}/>}</button>)}</InteractiveTabs>
       </>}
       {step===1&&<div className={styles.fields}>
        <label htmlFor="brief-name">Seu nome ou empresa <span>(opcional)</span></label>
        <input id="brief-name" value={brief.name} maxLength={120} onChange={event=>{updateBrief({name:event.target.value});setErrors({});}} placeholder="Como podemos chamar você?" aria-invalid={!!errors.name}/>
        {errors.name&&<p className={styles.error} role="alert">{errors.name}</p>}
        <label htmlFor="brief-objective">O que você precisa resolver?</label>
        <textarea id="brief-objective" ref={objective} rows={5} value={brief.objective} maxLength={1500} onChange={event=>{updateBrief({objective:event.target.value});setErrors({});}} placeholder="Conte seu momento, o problema e o que gostaria de ter funcionando." aria-invalid={!!errors.objective} aria-describedby={errors.objective?'brief-error':undefined}/>
        {errors.objective&&<p className={styles.error} id="brief-error" role="alert">{errors.objective}</p>}
        <small>{brief.objective.length} / 1.500 caracteres</small>
       </div>}
       {step===2&&<>
        <p>Confira o texto. Você pode voltar para ajustar qualquer detalhe.</p>
        <div className={styles.message}>{message}</div>
        <CopyButton className={styles.copy} value={message} onCopyError={()=>setCopyError(true)}/>
        {copyError&&<div className={styles.copyFallback}><label htmlFor="brief-fallback">A cópia automática não está disponível. Selecione o texto abaixo:</label><textarea ref={fallback} id="brief-fallback" readOnly value={message} rows={7}/></div>}
       </>}
       <div className={styles.actions}>
        {step>0?<button className={styles.back} onClick={back}><ArrowLeft size={16}/>Voltar</button>:<span/>}
        {step<2?<button className="button" onClick={next}>Continuar<ArrowRight size={17}/></button>:<a className="button button-blue" href={createWhatsappUrl(brief)} target="_blank" rel="noopener noreferrer">Abrir conversa no WhatsApp<ArrowUpRight size={17}/></a>}
       </div>
       <p className={styles.note}>O briefing fica no seu navegador. A mensagem é enviada por você no WhatsApp.</p>
      </div>
     </div>
    </div>
   </div>
  </section>
 </>;
}
