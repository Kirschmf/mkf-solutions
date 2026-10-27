import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useJourney } from '../../app/JourneyContext';
import { useMotionPreference } from '../../app/useMotionPreference';
import { perspectives, career, credentials, type PerspectiveId } from '../../data/profile';
import projects from '../../data/projects.json';
import styles from './ProfileExplorer.module.css';

gsap.registerPlugin(Flip);

type Props = { onOpenProject?: (id: string) => void };

export default function ProfileExplorer({ onOpenProject }: Props) {
  const { selectProject } = useJourney();
  const { reducedMotion } = useMotionPreference();
  const [perspectiveId, setPerspectiveId] = useState<PerspectiveId>('build');
  const [careerId, setCareerId] = useState<string>('truth-mkf');
  const stage = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const perspective = perspectives.find(item => item.id === perspectiveId)!;
  const moment = career.find(item => item.id === careerId)!;

  useLayoutEffect(() => {
    if (!flipState.current || !stage.current) return;
    const animation = Flip.from(flipState.current, { duration: .42, ease: 'power2.inOut', absolute: true, scale: true });
    flipState.current = null;
    return () => { animation.kill(); };
  }, [perspectiveId]);

  function changePerspective(id: PerspectiveId) {
    if (id === perspectiveId) return;
    if (stage.current && !reducedMotion) {
      flipState.current = Flip.getState(stage.current.querySelectorAll('[data-evidence]'));
    }
    setPerspectiveId(id);
  }

  function openProject(id: string) {
    if (onOpenProject) onOpenProject(id);
    else {
      selectProject(id);
      document.getElementById('portfolio')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }

  return <section id="sobre" className={`section ${styles.profile}`} aria-labelledby="profile-title">
    <div className={`container ${styles.layout}`}>
      <div className={styles.identity} data-reveal>
        <figure className={styles.portrait}>
          <img src="/assets/matheus-kirsch.png" alt="Matheus Kirsch, desenvolvedor e fundador da MKF Solutions" loading="lazy" width="640" height="800" />
          <figcaption>Matheus Kirsch <span>Canoas / Porto Alegre, RS</span></figcaption>
        </figure>
        <div className={styles.socials}>
          <a href="https://www.linkedin.com/in/kirschmf" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16} /></a>
          <a href="https://github.com/Kirschmf" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className={styles.introduction} data-reveal>
        <p className="eyebrow">Quem desenvolve o seu projeto</p>
        <h2 id="profile-title">Sou Matheus.<br />Desenvolvo com<br />visão de operação.</h2>
        <p className={styles.lead}>Full Stack, automação e comércio digital. Experiência técnica e contato direto com o dia a dia de quem usa.</p>
        <div className={styles.tabs} role="tablist" aria-label="Perspectivas da experiência">
          {perspectives.map(item => <button key={item.id} type="button" role="tab" id={`perspective-${item.id}`} aria-controls="perspective-panel" aria-selected={item.id === perspectiveId} tabIndex={item.id === perspectiveId ? 0 : -1} onClick={() => changePerspective(item.id)} onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const current = perspectives.findIndex(p => p.id === perspectiveId);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (current + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
            changePerspective(perspectives[next].id);
            document.getElementById(`perspective-${perspectives[next].id}`)?.focus();
          }}>{item.label}</button>)}
        </div>
        <div role="tabpanel" id="perspective-panel" aria-labelledby={`perspective-${perspectiveId}`} className={styles.perspective}>
          <h3>{perspective.title}</h3><p>{perspective.description}</p>
          {perspectiveId === 'connect' && <button type="button" className={styles.transformation} onClick={() => openProject('linda-casa')} aria-label="Ver o case Linda Casa: modelo de entrada e catálogo organizado">
            <span><small>Entrada: modelo do catálogo</small><img src="/assets/projects/linda-casa-template.png" alt="Planilha modelo com campos de código e nome ainda vazios" /></span>
            <span><small>Saída: SKU e produtos organizados</small><img src="/assets/projects/linda-casa-sku.png" alt="Catálogo Linda Casa preenchido com SKU e nomes de produtos" /></span>
            <strong>Conferir a entrega de catálogo <ArrowUpRight size={15} /></strong>
          </button>}
        </div>
      </div>
      <div className={styles.evidenceSection}>
        <div className={styles.evidenceHeading}><h3>O trabalho, em contexto.</h3><p aria-live="polite">{perspective.note}</p></div>
        <div ref={stage} className={styles.evidenceGrid}>
          {perspective.evidence.map((id, index) => {
            const project = projects.find(item => item.id === id)!;
            return <button type="button" key={id} data-evidence data-flip-id={`profile-${id}`} className={`${styles.evidence} ${index === 0 ? styles.primaryEvidence : ''}`} onClick={() => openProject(id)} aria-label={`Ver este projeto: ${project.name}`}>
              <span className={styles.imageFrame}><img src={project.image || ''} alt={`Captura real de ${project.name}`} loading="lazy" /></span>
              <span className={styles.evidenceCaption}><span><small>{project.category}</small><strong>{project.name}</strong></span><span className={styles.openLabel}>Ver este projeto <ArrowUpRight size={17} /></span></span>
            </button>;
          })}
        </div>
      </div>
      <div className={styles.trajectory}>
        <div className={styles.trajectoryTitle}><p className="eyebrow">Trajetória</p><h3>Experiências que<br />se conectam.</h3></div>
        <div className={styles.history}>
          <div className={styles.timeline} role="group" aria-label="Momentos da trajetória">
            {career.map(item => <button type="button" key={item.id} aria-pressed={item.id === careerId} onClick={() => setCareerId(item.id)}><span>{item.shortPeriod}</span><strong>{item.company}</strong></button>)}
          </div>
          <article className={styles.careerPanel} aria-live="polite"><span>{moment.period}</span><h4>{moment.role}</h4><p>{moment.description}</p><p className={styles.relation}>{moment.relation}</p></article>
        </div>
      </div>
      <details className={styles.education}><summary><span>Formação e certificações</span><ChevronDown size={22} /></summary><div className={styles.credentialGrid}>{credentials.map(item => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</div></details>
    </div>
  </section>;
}
