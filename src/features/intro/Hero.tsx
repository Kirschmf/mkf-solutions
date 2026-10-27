import {useEffect, useRef} from 'react';
import {ArrowDown, ArrowUpRight, Check} from 'lucide-react';
import {gsap} from 'gsap';
import {ScrollTrigger} from '../../app/reveal';
import {needs} from '../../data/services';
import projects from '../../data/projects.json';
import {useJourney} from '../../app/JourneyContext';
import {useMotionPreference} from '../../app/useMotionPreference';
import type {NeedId} from '../../app/types';
import styles from './intro.module.css';

const labels: Record<NeedId, string> = {sites: 'Sites', automations: 'Automações', apps: 'Sistemas', ecommerce: 'E-commerce', operations: 'Operação'};

export default function Hero() {
  const {need, setNeed, selectProject} = useJourney();
  const service = needs.find(item => item.id === need)!;
  const project = projects.find(item => item.id === service.projectId)!;
  const {reducedMotion} = useMotionPreference();
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(min-width: 601px)', () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: .6,
        }});
        timeline.to('.' + styles.name, {y: -55, opacity: .25, ease: 'none'}, 0)
          .to('.' + styles.portrait, {y: 35, ease: 'none'}, 0);
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.timeline({defaults: {ease: 'power3.out'}})
        .from('[data-hero-word]', {yPercent: 110, duration: 1.15, stagger: .12, ease: 'power4.out'})
        .from('.' + styles.portrait, {opacity: 0, y: 65, duration: 1.2}, .3)
        .from('[data-hero-copy]', {opacity: 0, y: 16, duration: .7, stagger: .09}, .65)
        .from('.' + styles.work, {opacity: 0, y: 24, duration: .8}, .9)
        .from('.' + styles.services, {opacity: 0, duration: .6}, 1);
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.fromTo(preview.current, {opacity: .4, y: 8}, {opacity: 1, y: 0, duration: .3, ease: 'power2.out'});
    });
    return () => context.revert();
  }, [need, reducedMotion]);

  useEffect(() => {
    const element = preview.current;
    if (!element || reducedMotion) return;
    let rotateX: ReturnType<typeof gsap.quickTo>, rotateY: ReturnType<typeof gsap.quickTo>;
    const context = gsap.context(() => {
      rotateX = gsap.quickTo(element, 'rotationX', {duration: .45, ease: 'power2.out'});
      rotateY = gsap.quickTo(element, 'rotationY', {duration: .45, ease: 'power2.out'});
      gsap.set(element, {transformPerspective: 1100});
    });
    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      rotateY(((event.clientX - rect.left) / rect.width - .5) * 5);
      rotateX(-((event.clientY - rect.top) / rect.height - .5) * 4);
    };
    const leave = () => {rotateX(0); rotateY(0);};
    element.addEventListener('mousemove', move);
    element.addEventListener('mouseleave', leave);
    return () => {
      element.removeEventListener('mousemove', move);
      element.removeEventListener('mouseleave', leave);
      context.revert();
    };
  }, [reducedMotion]);

  function openProject() {
    selectProject(project.id);
    document.getElementById('portfolio')?.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth'});
  }

  return <section className={styles.hero} id="inicio" ref={root} aria-labelledby="intro-title">
    <div className={'container ' + styles.stage}>
      <div className={styles.intro} data-hero-copy><span>Desenvolvedor & fundador da MKF</span><span>Da ideia à operação.</span></div>
      <h1 id="intro-title" className={styles.name}><span><span data-hero-word>Matheus</span></span>{' '}<span><span data-hero-word>Kirsch</span></span></h1>
      <div className={styles.light} aria-hidden="true"/>
      <figure className={styles.portrait}>
        <img src="/assets/matheus-kirsch-cutout.webp" alt="Matheus Kirsch, desenvolvedor e fundador da MKF Solutions" width="1125" height="1222" fetchPriority="high"/>
      </figure>
      <div className={styles.copy}>
        <h2 data-hero-copy>Sites, sistemas<br/> e automações.</h2>
        <p className={styles.description} data-hero-copy>Desenvolvimento com experiência real em e-commerce e na rotina de empresas.</p>
        <div className={styles.actions} data-hero-copy>
          <a className={styles.primary} href="#contato">Falar do meu projeto<ArrowUpRight size={17}/></a>
        </div>
      </div>
      <div className={styles.work}>
          <p className={styles.workLabel}>Do meu portfólio<ArrowUpRight size={14}/></p>
          <div className={styles.preview} ref={preview}>
            <div className={styles.previewImage}>
              <button type="button" onClick={openProject} aria-label={'Explorar ' + project.name}>
                {project.image ? <img key={project.id} src={project.image} alt={'Projeto ' + project.name} width="720" height="450"/> : <span className={styles.unavailable}>Conheça a entrega de {project.name}</span>}
              </button>
            </div>
            <button type="button" className={styles.projectCaption} onClick={openProject}><span><small>{service.kind}</small><strong>{project.name}</strong></span><ArrowUpRight size={18}/></button>
          </div>
          <a className={styles.allProjects} href="#portfolio">Ver todos os projetos<ArrowDown size={14}/></a>
      </div>
    </div>

    <div className={'container ' + styles.services} role="group" aria-label="O que você quer desenvolver?">
      <p className={styles.servicePrompt}>O que vamos criar?</p>
      {needs.map(item => {
        return <button type="button" key={item.id} aria-label={item.intent} aria-pressed={need === item.id} onClick={() => setNeed(item.id)} className={need === item.id ? styles.active : ''}>
          <span>{labels[item.id]}</span>{need === item.id ? <Check size={14}/> : <ArrowUpRight size={14}/>}
        </button>;
      })}
    </div>
  </section>;
}
