import { useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { MotionHeading } from '../../components/MotionHeading';
import InteractiveTabs from '../../components/InteractiveTabs';
import { usePanelMotion } from '../../app/usePanelMotion';
import { ScrollTrigger } from '../../app/reveal';
import { perspectives, career, credentials, type PerspectiveId } from '../../data/profile';
import styles from './ProfileExplorer.module.css';

export default function ProfileExplorer() {
  const [perspectiveId, setPerspectiveId] = useState<PerspectiveId>('build');
  const [careerId, setCareerId] = useState<string>('truth-mkf');
  const perspective = perspectives.find(item => item.id === perspectiveId)!;
  const moment = career.find(item => item.id === careerId)!;
  const perspectiveContent = useRef<HTMLDivElement>(null);
  const activitiesContent = useRef<HTMLUListElement>(null);
  const careerContent = useRef<HTMLDivElement>(null);
  const perspectiveIndex = perspectives.findIndex(item => item.id === perspectiveId);
  usePanelMotion(perspectiveContent, perspectiveId, { index: perspectiveIndex });
  usePanelMotion(activitiesContent, perspectiveId, { index: perspectiveIndex });
  usePanelMotion(careerContent, careerId, { index: career.findIndex(item => item.id === careerId) });

  return <section id="sobre" className={`section ${styles.profile}`} aria-labelledby="profile-title">
    <div className={`container ${styles.layout}`}>
      <div className={styles.identity}>
        <figure className={styles.portrait}>
          <div className={styles.portraitMedia} data-motion-image>
            <div className={styles.portraitLayer} data-motion-parallax="24">
              <img src="/assets/matheus-kirsch.png" alt="Matheus Kirsch, desenvolvedor e fundador da MKF Solutions" loading="lazy" width="640" height="800" />
            </div>
          </div>
          <figcaption>Matheus Kirsch <span>Canoas / Porto Alegre, RS</span></figcaption>
        </figure>
        <div className={styles.socials} data-motion-group>
          <a href="https://www.linkedin.com/in/kirschmf" target="_blank" rel="noopener noreferrer" data-motion-item>LinkedIn <ArrowUpRight size={16} /></a>
          <a href="https://github.com/Kirschmf" target="_blank" rel="noopener noreferrer" data-motion-item>GitHub <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className={styles.introduction} data-motion-group>
        <p className="eyebrow" data-motion-item>Quem desenvolve o seu projeto</p>
        <MotionHeading id="profile-title" lines={['Sou Matheus.', 'Desenvolvo com', 'visão de operação.']} />
        <p className={styles.lead} data-motion-item>Full Stack, automação e comércio digital. Experiência técnica e contato direto com o dia a dia de quem usa.</p>
        <InteractiveTabs activeKey={perspectiveId} variant="underline" className={styles.tabs} role="tablist" aria-label="Perspectivas da experiência" data-motion-item>
          {perspectives.map(item => <button key={item.id} type="button" role="tab" id={`perspective-${item.id}`} aria-controls="perspective-panel" aria-selected={item.id === perspectiveId} tabIndex={item.id === perspectiveId ? 0 : -1} onClick={() => setPerspectiveId(item.id)} onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const current = perspectives.findIndex(p => p.id === perspectiveId);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? perspectives.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : perspectives.length - 1)) % perspectives.length;
            setPerspectiveId(perspectives[next].id);
            document.getElementById(`perspective-${perspectives[next].id}`)?.focus();
          }}>{item.label}</button>)}
        </InteractiveTabs>
        <div role="tabpanel" id="perspective-panel" aria-labelledby={`perspective-${perspectiveId}`} className={styles.perspective} data-motion-panel>
          <div ref={perspectiveContent}>
            <h3>{perspective.title}</h3><p>{perspective.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.activitiesSection} aria-labelledby="profile-activities-title">
        <MotionHeading as="h3" id="profile-activities-title" lines={['O que faço na prática.']} />
        <div data-motion-panel><ul className={styles.activitiesGrid} aria-live="polite" ref={activitiesContent}>
          {perspective.activities.map(activity => <li key={activity.title}>
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
          </li>)}
        </ul></div>
      </div>
      <div className={styles.trajectory}>
        <div className={styles.trajectoryTitle}><p className="eyebrow">Trajetória</p><MotionHeading as="h3" lines={['Experiências que', 'se conectam.']} /></div>
        <div className={styles.history}>
          <InteractiveTabs activeKey={careerId} className={styles.timeline} role="group" aria-label="Momentos da trajetória" data-motion-group>
            {career.map(item => <button type="button" key={item.id} aria-pressed={item.id === careerId} onClick={() => setCareerId(item.id)} data-motion-item><span>{item.shortPeriod}</span><strong>{item.company}</strong></button>)}
          </InteractiveTabs>
          <article className={styles.careerPanel} aria-live="polite" data-motion-panel><div ref={careerContent} className={styles.careerContent}><span>{moment.period}</span><h4>{moment.role}</h4><p>{moment.description}</p><p className={styles.relation}>{moment.relation}</p></div></article>
        </div>
      </div>
      <details className={styles.education} onToggle={() => ScrollTrigger.refresh()}><summary><span>Formação e certificações</span><ChevronDown size={22} /></summary><div className={styles.credentialGrid}>{credentials.map(item => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</div></details>
    </div>
  </section>;
}
