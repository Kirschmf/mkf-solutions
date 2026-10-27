import {useLayoutEffect, useRef, type HTMLAttributes} from 'react';
import {gsap} from 'gsap';
import {useMotionPreference} from '../app/useMotionPreference';
import './interactiveTabs.css';

type Props = HTMLAttributes<HTMLElement> & {
  activeKey: string | number;
  variant?: 'fill' | 'underline';
  as?: 'div' | 'nav';
};

type Box = {x: number; y: number; width: number; height: number};

export default function InteractiveTabs({activeKey, variant = 'fill', as: Container = 'div', children, ...props}: Props) {
  const root = useRef<HTMLElement>(null);
  const controller = useRef<{sync: (animate: boolean) => void} | null>(null);
  const previousKey = useRef(activeKey);
  const {reducedMotion} = useMotionPreference();

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const active = element.querySelector<HTMLElement>(':scope > [data-tab-active]')!;
    const hover = element.querySelector<HTMLElement>(':scope > [data-tab-hover]')!;
    const ripple = element.querySelector<HTMLElement>(':scope > [data-tab-ripple]')!;
    const circle = ripple.firstElementChild as HTMLElement;
    const controls = Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.matches('button, a'));
    let activeTween: gsap.core.Tween | undefined;
    let hoverTween: gsap.core.Tween | undefined;
    let rippleTween: gsap.core.Tween | undefined;
    let hovered: HTMLElement | null = null;
    let disposed = false;

    const boxFor = (control: HTMLElement): Box => ({
      x: control.offsetLeft,
      y: control.offsetTop + (variant === 'underline' ? control.offsetHeight - 3 : 0),
      width: control.offsetWidth,
      height: variant === 'underline' ? 3 : control.offsetHeight,
    });
    const sync = (animate: boolean) => {
      const selected = controls.find(control => control.matches('[aria-selected="true"], [aria-pressed="true"], [aria-current]'));
      activeTween?.kill();
      if (!selected || !selected.offsetWidth || !element.getClientRects().length) {
        gsap.set(active, {opacity: 0});
        return;
      }
      const target = {...boxFor(selected), opacity: 1};
      if (animate && !reducedMotion) activeTween = gsap.to(active, {...target, duration: .42, ease: 'power3.out', overwrite: true});
      else gsap.set(active, target);
    };
    controller.current = {sync};
    sync(false);

    const controlFor = (target: EventTarget | null) => {
      const control = target instanceof Element ? target.closest<HTMLElement>('button, a') : null;
      return control?.parentElement === element ? control : null;
    };
    const showHover = (control: HTMLElement) => {
      if (reducedMotion || hovered === control) return;
      hoverTween?.kill();
      if (!hovered) gsap.set(hover, {...boxFor(control), opacity: 0});
      hovered = control;
      hoverTween = gsap.to(hover, {...boxFor(control), opacity: 1, duration: .24, ease: 'power3.out', overwrite: true});
    };
    const hideHover = () => {
      hovered = null;
      hoverTween?.kill();
      if (reducedMotion) gsap.set(hover, {opacity: 0});
      else hoverTween = gsap.to(hover, {opacity: 0, duration: .16, overwrite: true});
    };
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const control = controlFor(event.target);
      if (control) showHover(control);
      else hideHover();
    };
    const focus = (event: FocusEvent) => {
      const control = controlFor(event.target);
      if (control) showHover(control);
    };
    const blur = (event: FocusEvent) => {
      if (!element.contains(event.relatedTarget as Node | null)) hideHover();
    };
    const click = (event: MouseEvent) => {
      const control = controlFor(event.target);
      if (!control || reducedMotion) return;
      rippleTween?.kill();
      const rect = control.getBoundingClientRect();
      const diameter = Math.hypot(control.offsetWidth, control.offsetHeight) * 2;
      const x = event.detail ? (event.clientX - rect.left) * control.offsetWidth / rect.width : control.offsetWidth / 2;
      const y = event.detail ? (event.clientY - rect.top) * control.offsetHeight / rect.height : control.offsetHeight / 2;
      gsap.set(ripple, {x: control.offsetLeft, y: control.offsetTop, width: control.offsetWidth, height: control.offsetHeight});
      gsap.set(circle, {x: x - diameter / 2, y: y - diameter / 2, width: diameter, height: diameter, scale: 0, opacity: .38});
      rippleTween = gsap.to(circle, {scale: 1, opacity: 0, duration: .58, ease: 'power3.out'});
    };
    const resize = new ResizeObserver(() => {
      sync(false);
      hoverTween?.kill();
      if (hovered) gsap.set(hover, {...boxFor(hovered), opacity: 1});
      rippleTween?.kill();
      gsap.set(circle, {opacity: 0});
    });
    resize.observe(element);
    controls.forEach(control => resize.observe(control));
    document.fonts.ready.then(() => {if (!disposed) sync(false);});
    element.addEventListener('pointermove', pointerMove);
    element.addEventListener('pointerleave', hideHover);
    element.addEventListener('focusin', focus);
    element.addEventListener('focusout', blur);
    element.addEventListener('click', click, true);

    return () => {
      disposed = true;
      controller.current = null;
      resize.disconnect();
      element.removeEventListener('pointermove', pointerMove);
      element.removeEventListener('pointerleave', hideHover);
      element.removeEventListener('focusin', focus);
      element.removeEventListener('focusout', blur);
      element.removeEventListener('click', click, true);
      activeTween?.kill();
      hoverTween?.kill();
      rippleTween?.kill();
      gsap.set([active, hover, ripple, circle], {clearProps: 'all'});
    };
  }, [reducedMotion, variant]);

  useLayoutEffect(() => {
    const changed = previousKey.current !== activeKey;
    previousKey.current = activeKey;
    if (changed) controller.current?.sync(true);
  }, [activeKey]);

  return <Container {...props} ref={node => {root.current = node;}} data-interactive-tabs="" data-tab-style={variant}>
    {children}
    <div data-tab-active="" aria-hidden="true"/>
    <div data-tab-hover="" aria-hidden="true"/>
    <div data-tab-ripple="" aria-hidden="true"><div/></div>
  </Container>;
}
