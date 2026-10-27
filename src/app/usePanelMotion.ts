import {useLayoutEffect, useRef, type RefObject} from 'react';
import {gsap} from 'gsap';
import {useMotionPreference} from './useMotionPreference';

export function usePanelMotion(
  ref: RefObject<HTMLElement | null>,
  key: string | number,
  options: {direction?: number; index?: number} = {},
) {
  const {reducedMotion} = useMotionPreference();
  const previousKey = useRef(key);
  const previousIndex = useRef(options.index);
  const direction = options.direction;
  const index = options.index;

  useLayoutEffect(() => {
    const changed = previousKey.current !== key;
    const travel = direction ?? (index !== undefined && previousIndex.current !== undefined ? Math.sign(index - previousIndex.current) : 0);
    previousKey.current = key;
    previousIndex.current = index;
    if (!changed || reducedMotion || !ref.current) return;
    const element = ref.current;
    const context = gsap.context(() => {
      gsap.fromTo(Array.from(element.children).filter(child => !(child instanceof HTMLElement) || !child.hidden), {
        opacity: 0,
        x: travel ? Math.sign(travel) * 18 : 0,
        y: travel ? 0 : 12,
      }, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: .4,
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
  }, [key, reducedMotion, direction, index, ref]);
}
