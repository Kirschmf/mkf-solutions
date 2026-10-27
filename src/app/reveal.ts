import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveal(reducedMotion: boolean) {
  if (reducedMotion) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const entries: {scope: Element; timeline: gsap.core.Timeline}[] = [];
  const mobile = window.matchMedia('(max-width: 600px)').matches;
  const distance = mobile ? 12 : 18;
  const media = gsap.matchMedia();
  let disposed = false;
  let refreshFrame = 0;
  let resizeTimer = 0;
  let pointerIsDown = false;

  const startPointer = () => { pointerIsDown = true; };
  const endPointer = () => { pointerIsDown = false; };

  function entry(scope: Element) {
    const timeline = gsap.timeline({scrollTrigger: {
      trigger: scope,
      start: 'top 91%',
      // Keep completed triggers registered while other triggers recalculate.
      toggleActions: 'play none none none',
    }});
    entries.push({scope, timeline});
    return timeline;
  }

  const context = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('[data-motion-heading]').forEach(heading => {
      const lines = heading.querySelectorAll('[data-motion-line]');
      entry(heading).fromTo(lines, {yPercent: 110}, {
        yPercent: 0, duration: .75, stagger: .09, ease: 'power4.out',
      }).set(lines, {clearProps: 'transform'});
    });

    document.querySelectorAll<HTMLElement>('[data-motion-panel]').forEach(panel => {
      entry(panel).fromTo(panel, {
        opacity: 0, y: distance, clipPath: 'inset(12% 0 0 0)',
      }, {
        opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
        duration: .75, ease: 'power3.out',
      }).set(panel, {clearProps: 'transform,opacity,clipPath'});
    });

    document.querySelectorAll<HTMLElement>('[data-motion-group]').forEach(group => {
      const items = Array.from(group.children).filter(item => item.hasAttribute('data-motion-item'));
      if (!items.length) return;
      entry(group).fromTo(items, {opacity: 0, y: distance}, {
        opacity: 1, y: 0, duration: .6, stagger: .075, ease: 'power3.out',
      }).set(items, {clearProps: 'transform,opacity'});
    });

    document.querySelectorAll<HTMLElement>('[data-motion-image]').forEach(frame => {
      const image = frame.querySelector('img');
      const timeline = entry(frame).fromTo(frame, {clipPath: 'inset(0 0 100% 0)'}, {
        clipPath: 'inset(0 0 0% 0)', duration: .95, ease: 'power4.inOut',
      });
      if (image) timeline.fromTo(image, {scale: 1.06}, {scale: 1, duration: 1.1, ease: 'power3.out'}, 0);
      timeline.set(frame, {clearProps: 'clipPath'});
    });

    document.querySelectorAll<HTMLElement>('[data-motion-rule]').forEach(rule => {
      entry(rule).fromTo(rule, {scaleX: 0, transformOrigin: 'left center'}, {
        scaleX: 1, duration: .8, ease: 'power3.inOut',
      }).set(rule, {clearProps: 'transform,transformOrigin'});
    });
  });

  media.add('(min-width: 901px)', () => {
    const parallax = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-motion-parallax]').forEach(layer => {
        const offset = Math.min(24, Math.abs(Number(layer.dataset.motionParallax) || 24)) / 2;
        gsap.fromTo(layer, {y: -offset}, {
          y: offset,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('[data-motion-image]') || layer,
            start: 'top bottom', end: 'bottom top', scrub: .6,
          },
        });
      });
    });
    return () => parallax.revert();
  });

  function revealFocusedContent(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    let revealed = false;
    for (const {scope, timeline} of entries) {
      if (scope.contains(event.target)) {
        timeline.totalProgress(1);
        timeline.scrollTrigger?.kill();
        revealed = true;
      }
    }
    if (revealed && !pointerIsDown) {
      const box = event.target.getBoundingClientRect();
      const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
      if (box.top < headerBottom - 1 || box.bottom > window.innerHeight + 1) {
        event.target.scrollIntoView({behavior: 'instant', block: 'center', inline: 'nearest'});
      }
    }
  }

  function refresh() {
    if (disposed || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      // Image loads must not interrupt a native smooth-scroll to an anchor.
      if (!disposed) ScrollTrigger.refresh(true);
    });
  }

  document.addEventListener('focusin', revealFocusedContent);
  document.addEventListener('pointerdown', startPointer, true);
  document.addEventListener('pointerup', endPointer, true);
  document.addEventListener('pointercancel', endPointer, true);
  document.addEventListener('keydown', endPointer, true);
  document.fonts?.ready.then(refresh);
  const images = Array.from(document.querySelectorAll('main img'));
  images.forEach(image => image.addEventListener('load', refresh));
  const observer = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 100);
  });
  document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  refresh();

  return () => {
    disposed = true;
    cancelAnimationFrame(refreshFrame);
    clearTimeout(resizeTimer);
    document.removeEventListener('focusin', revealFocusedContent);
    document.removeEventListener('pointerdown', startPointer, true);
    document.removeEventListener('pointerup', endPointer, true);
    document.removeEventListener('pointercancel', endPointer, true);
    document.removeEventListener('keydown', endPointer, true);
    images.forEach(image => image.removeEventListener('load', refresh));
    observer.disconnect();
    media.revert();
    context.revert();
  };
}

export {ScrollTrigger};
