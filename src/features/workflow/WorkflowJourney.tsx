import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMotionPreference } from '../../app/useMotionPreference';
import { calculateOrderTotal, money } from './orderRules';
import { stages } from './stages';
import type { Stage, WorkflowState } from './workflow.types';
import styles from './workflowJourney.module.css';

const points = [
  { x: 100, y: 75 }, { x: 367, y: 75 }, { x: 633, y: 75 }, { x: 900, y: 75 },
  { x: 900, y: 525 }, { x: 633, y: 525 }, { x: 367, y: 525 }, { x: 100, y: 525 },
];
const checkpointLabels = ['Entrada', 'Validação', 'Estoque', 'Aprovação', 'Pagamento', 'Registro', 'Mensagem', 'Resultado'];
const statusCopy = {
  idle: 'Pronto para começar', running: 'Pedido em movimento', paused: 'Execução pausada',
  blocked: 'Aguardando sua decisão', failed: 'Ação necessária', completed: 'Pedido concluído', cancelled: 'Demonstração cancelada',
};

export default function WorkflowJourney({ state, inspection, onInspectStage }: {
  state: WorkflowState; inspection: Stage; onInspectStage: (stage: Stage) => void;
}) {
  const { reducedMotion } = useMotionPreference();
  const packet = useRef<SVGGElement>(null);
  const ticketBody = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const lastEvent = state.history.at(-1);
  const eventKey = `${state.runId}:${lastEvent?.sequence ?? 0}`;
  const previousEvent = useRef(eventKey);
  const activeIndex = stages.findIndex(stage => stage.id === state.stage);
  const order = state.order ?? { ...state.input, totalCents: calculateOrderTotal(state.input) };

  useLayoutEffect(() => {
    const node = packet.current;
    if (!node) return;
    gsap.killTweensOf(node);
    const current = points[activeIndex];
    gsap.set(node, { opacity: 0, attr: { transform: `translate(${current.x},${current.y})` } });
    if (previousEvent.current === eventKey) return;
    previousEvent.current = eventKey;
    if (!lastEvent || lastEvent.from === lastEvent.to || reducedMotion) return;
    const from = stages.findIndex(stage => stage.id === lastEvent.from);
    const to = stages.findIndex(stage => stage.id === lastEvent.to);
    const adjacent = Math.abs(to - from) === 1;
    const path = adjacent ? paths.current[Math.min(from, to)] : null;
    if (!path) return;
    const length = path.getTotalLength();
    const position = { progress: to > from ? 0 : 1 };
    const draw = () => {
      const point = path.getPointAtLength(length * position.progress);
      gsap.set(node, { attr: { transform: `translate(${point.x},${point.y})` } });
    };
    draw();
    gsap.set(node, { opacity: 1 });
    const timeline = gsap.timeline();
    timeline.to(position, { progress: to > from ? 1 : 0, duration: .65, ease: 'power2.inOut', onUpdate: draw })
      .to(node, { opacity: 0, duration: .12 });
    return () => { timeline.kill(); gsap.set(node, { opacity: 0 }); };
  }, [eventKey, reducedMotion, lastEvent, activeIndex]);

  useLayoutEffect(() => {
    const node = ticketBody.current;
    if (!node || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.fromTo(node, { y: 9, opacity: .35 }, { y: 0, opacity: 1, duration: .38, ease: 'power2.out', clearProps: 'transform,opacity' });
    }, node);
    return () => context.revert();
  }, [state.stage, state.status, state.runId, reducedMotion]);

  return <div className={styles.journey} data-testid="workflow-journey" data-stage={state.stage} data-state={state.status} data-transition={lastEvent?.sequence ?? 0}>
    <div className={styles.journeyHeader}><p>O caminho deste pedido</p><span>{String(activeIndex + 1).padStart(2, '0')} / 08</span></div>
    <div className={styles.canvas}>
      <svg className={styles.rails} viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1];
          const done = state.history.some(entry => entry.from === stages[index].id && entry.to === stages[index + 1].id);
          const path = index === 3 ? 'M 900 75 Q 990 75 990 155 V 445 Q 990 525 900 525' : `M ${point.x} ${point.y} L ${next.x} ${next.y}`;
          return <path key={index} ref={node => { paths.current[index] = node; }} d={path} className={done ? styles.railDone : styles.rail} vectorEffect="non-scaling-stroke" />;
        })}
        <g ref={packet} data-workflow-packet data-transition={lastEvent?.sequence ?? 0} opacity="0" className={styles.packet}>
          <rect x="-27" y="-18" width="54" height="36" rx="4" fill="#85e4ef" />
          <path d="M -13 -6 H 13 M -13 2 H 13 M -13 10 H 3" stroke="#102849" strokeWidth="3" />
        </g>
      </svg>
      <ol className={styles.checkpoints} aria-label="Etapas do pedido">
        {stages.map((stage, index) => {
          const current = stage.id === state.stage;
          const done = state.history.some(entry => entry.from === stage.id && entry.to !== stage.id) || state.status === 'completed';
          const blocked = current && (state.status === 'blocked' || state.status === 'failed');
          return <li key={stage.id} style={{ left: `${points[index].x / 10}%`, top: `${points[index].y / 6}%` }} className={index > 3 ? styles.lowerCheckpoint : undefined}>
            <button type="button" onClick={() => onInspectStage(stage.id)} aria-label={`Etapa ${index + 1}: ${stage.title}`} aria-current={current ? 'step' : undefined} data-inspected={inspection === stage.id} data-done={done} data-blocked={blocked}>
              <span className={styles.checkpointNumber} aria-hidden="true">{done && !current ? '✓' : String(index + 1).padStart(2, '0')}</span>
              <span className={styles.checkpointLabel}>{checkpointLabels[index]}</span>
            </button>
          </li>;
        })}
      </ol>
      <div className={styles.ticket} data-blocked={state.status === 'blocked' || state.status === 'failed'} data-completed={state.status === 'completed'}>
        <div className={styles.ticketHeading}>Pedido em demonstração</div>
        <div ref={ticketBody} className={styles.ticketBody}>
          <p className={styles.product} title={order.product || undefined}>{order.product || 'Seu produto'}</p>
          <div className={styles.orderLine}><span>{Number.isFinite(order.quantity) ? order.quantity : 0} unidade(s)</span><span>{money(order.unitPriceCents)} cada</span></div>
          <div className={styles.ticketTotal}><span>Com frete</span><strong>{money(order.totalCents)}</strong></div>
          <div className={styles.ticketStatus}><span className={styles.statusDot} aria-hidden="true" /><div><strong>{statusCopy[state.status]}</strong><span>{state.dirty ? 'Reinicie para aplicar a nova entrada.' : stages[activeIndex].title}</span></div></div>
        </div>
        <div className={styles.ticketPerforation} aria-hidden="true" />
      </div>
    </div>
    <p className={styles.journeyHint}>Cada ponto abre os dados e a regra daquela etapa.</p>
  </div>;
}
