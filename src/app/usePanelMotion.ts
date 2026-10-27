import {useLayoutEffect, useRef, type RefObject} from 'react';
import {gsap} from 'gsap';
import {useMotionPreference} from './useMotionPreference';

export function usePanelMotion(
  ref: RefObject<HTMLElement | null>,
  key: string | number,
  options: {direction?: number} = {},
) {
  const {reducedMotion} = useMotionPreference();
  const previousKey = useRef(key);
  const direction = options.direction ?? 0;

  useLayoutEffect(() => {
    const changed = previousKey.current !== key;
    previousKey.current = key;
    if (!changed || reducedMotion || !ref.current) return;
    const element = ref.current;
    const context = gsap.context(() => {
      gsap.fromTo(Array.from(element.children), {
        opacity: 0,
        x: direction ? Math.sign(direction) * 12 : 0,
        y: direction ? 0 : 12,
      }, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: .32,
        stagger: .035,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, element);
    const showFocusedContent = () => context.getTweens().forEach(tween => tween.totalProgress(1));
    element.addEventListener('focusin', showFocusedContent);
    return () => {
      element.removeEventListener('focusin', showFocusedContent);
      context.revert();
    };
  }, [key, reducedMotion, direction, ref]);
}
