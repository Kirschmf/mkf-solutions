import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { perspectives, career, credentials, type PerspectiveId } from '../../data/profile';
import styles from './ProfileExplorer.module.css';

export default function ProfileExplorer() {
  const [perspectiveId, setPerspectiveId] = useState<PerspectiveId>('build');
  const [careerId, setCareerId] = useState<string>('truth-mkf');
  const perspective = perspectives.find(item => item.id === perspectiveId)!;
  const moment = career.find(item => item.id === careerId)!;

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
          {perspectives.map(item => <button key={item.id} type="button" role="tab" id={`perspective-${item.id}`} aria-controls="perspective-panel" aria-selected={item.id === perspectiveId} tabIndex={item.id === perspectiveId ? 0 : -1} onClick={() => setPerspectiveId(item.id)} onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const current = perspectives.findIndex(p => p.id === perspectiveId);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? perspectives.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : perspectives.length - 1)) % perspectives.length;
            setPerspectiveId(perspectives[next].id);
            document.getElementById(`perspective-${perspectives[next].id}`)?.focus();
          }}>{item.label}</button>)}
        </div>
        <div role="tabpanel" id="perspective-panel" aria-labelledby={`perspective-${perspectiveId}`} className={styles.perspective}>
          <h3>{perspective.title}</h3><p>{perspective.description}</p>
        </div>
      </div>
      <div className={styles.activitiesSection} aria-labelledby="profile-activities-title">
        <h3 id="profile-activities-title">O que faço na prática.</h3>
        <ul className={styles.activitiesGrid} aria-live="polite">
          {perspective.activities.map(activity => <li key={activity.title}>
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
          </li>)}
        </ul>
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
