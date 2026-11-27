import { useEffect } from 'react';

const clamp = value => Math.max(0, Math.min(1, value));
const easing = 'cubic-bezier(.22, 1, .36, 1)';

// The reference pins its hero while the hand takes a slice diagonally away.
// Scroll work is coalesced into one frame, with all geometry cached on resize.
export function useHeroMotion(ref, mode) {
  useEffect(() => {
    const hero = ref.current;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let top = 0;
    let distance = 1;
    let previous = -1;
    const paint = () => {
      frame = 0;
      const progress = media.matches ? 0 : clamp((scrollY - top) / distance);
      if (progress === previous) return;
      previous = progress;
      const eased = progress * progress * (3 - 2 * progress);
      const mobile = innerWidth <= 760;
      hero.style.setProperty('--slice-x', `${eased * innerWidth * (mobile ? 1.1 : .7)}px`);
      hero.style.setProperty('--slice-y', `${eased * innerHeight * (mobile ? .35 : .56)}px`);
      hero.style.setProperty('--type-shift', `${eased * (mobile ? 145 : 350)}px`);
      hero.style.setProperty('--pizza-scale', String(1 - eased * .035));
      hero.style.setProperty('--hero-progress', String(eased));
    };
    const schedule = () => {
      if (document.hidden || frame) return;
      if (previous === 1 && scrollY > top + distance + innerHeight) return;
      frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      top = scrollY + hero.getBoundingClientRect().top;
      distance = Math.max(1, hero.offsetHeight - hero.querySelector('.hero-stage').offsetHeight);
      previous = -1;
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(hero);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    media.addEventListener('change', measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      media.removeEventListener('change', measure);
    };
  }, [ref, mode]);
}

// Only visible strips run their CSS loops. Entrance animations run once; the
// shared passive scroll listener updates only scenes near the viewport.
export function useReferenceMotion(mode) {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let teardown = () => {};
    function setup() {
      teardown();
      if (media.matches) return;
      const records = new Map();
      const liveAnimations = new Set();
      const activeScenes = new Set();
      let frame = 0;

      function finish(record) {
        if (record.done) return;
        record.done = true;
        record.node.style.opacity = record.opacity;
        record.animation?.cancel();
        liveAnimations.delete(record.animation);
        revealObserver.unobserve(record.node);
      }

      function reveal(record) {
        if (record.started || record.done) return;
        record.started = true;
        const { node, kind, delay, base } = record;
        node.style.opacity = record.opacity;
        const frames = kind === 'wipe'
          ? [{ clipPath: 'inset(0 100% 0 0)', transform: `${base} translateX(-12px)` }, { clipPath: 'inset(0 0% 0 0)', transform: base || 'none' }]
          : kind === 'heading'
            ? [{ clipPath: 'inset(0 0 100% 0)', transform: `${base} translateY(45px)` }, { clipPath: 'inset(0 0 0% 0)', transform: base || 'none' }]
            : [{ opacity: 0, transform: `${base} translate3d(${kind === 'collage' ? '35px' : '0px'}, ${kind === 'form' ? '85px' : kind === 'collage' ? '95px' : '35px'}, 0) rotate(${kind === 'collage' ? '-9deg' : kind === 'pick' ? '3deg' : '0deg'}) scale(${kind === 'collage' ? '.86' : kind === 'pick' ? '.94' : '.99'})` }, { opacity: 1, transform: base || 'none' }];
        record.animation = node.animate(frames, { duration: kind === 'collage' ? 1100 : kind === 'form' ? 950 : 780, delay, easing, fill: 'both' });
        liveAnimations.add(record.animation);
        record.animation.finished.then(() => finish(record)).catch(() => {});
        if (node.classList.contains('menu-item')) {
          node.querySelectorAll('.menu-prices button').forEach((price, index) => {
            const animation = price.animate([{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 550, delay: delay + 120 + index * 55, easing });
            liveAnimations.add(animation);
            animation.finished.finally(() => liveAnimations.delete(animation)).catch(() => {});
          });
        }
      }

      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) reveal(records.get(entry.target)); });
      }, { threshold: .1, rootMargin: '0px 0px -25px 0px' });

      const groups = [
        ['.story-copy h2, .full-menu h2, .top-picks > .section-inner > h2, .reservation-content > h2, .testimonials > h2, .location-copy > h2, .order-callout > h2, .social-gallery > h3', 'heading', 0],
        ['.story-copy > p, .story-order, .deals .section-heading', 'rise', 90],
        ['.menu-group-heading', 'wipe', 40],
        ['.menu-item', 'rise', 0],
        ['.top-pick', 'pick', 0],
        ['.reservation-form', 'form', 100],
        ['.form-grid > label', 'rise', 80],
        ['.note, .polaroid', 'collage', 0],
        ['.location-photo, .location-copy address, .social-gallery img', 'pick', 50],
      ];
      groups.forEach(([selector, kind, initialDelay]) => {
        document.querySelectorAll(selector).forEach((node, index) => {
          const base = getComputedStyle(node).transform;
          const record = { node, kind, opacity: node.style.opacity, base: base === 'none' ? '' : base, delay: initialDelay + (index % (kind === 'rise' ? 7 : 4)) * 65, started: false, done: false };
          records.set(node, record);
          node.style.opacity = '0';
          revealObserver.observe(node);
        });
      });

      const loopNodes = [...document.querySelectorAll('.photo-collage, .offer-marquee, .footer-marquee')];
      const loopObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-inview', entry.isIntersecting)), { threshold: 0 });
      loopNodes.forEach(node => loopObserver.observe(node));

      const sceneNodes = [...document.querySelectorAll('.story, .photo-collage, .full-menu, .reservation, .testimonials, .social-gallery')];
      const paintScenes = () => {
        frame = 0;
        const reads = [...activeScenes].map(node => ({ node, rect: node.getBoundingClientRect() }));
        reads.forEach(({ node, rect }) => {
          const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
          node.style.setProperty('--scene-shift', `${(progress - .5) * 100}px`);
          node.style.setProperty('--scene-progress', String(progress));
        });
      };
      const schedule = () => { if (!frame && activeScenes.size && !document.hidden) frame = requestAnimationFrame(paintScenes); };
      const sceneObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { activeScenes.add(entry.target); entry.target.classList.add('scene-entered'); }
          else activeScenes.delete(entry.target);
        });
        schedule();
      }, { rootMargin: '120px 0px' });
      sceneNodes.forEach(node => sceneObserver.observe(node));

      const focus = event => {
        for (let node = event.target; node; node = node.parentElement) {
          const record = records.get(node);
          if (record) finish(record);
        }
      };
      const visibility = () => {
        document.documentElement.classList.toggle('motion-suspended', document.hidden);
        liveAnimations.forEach(animation => { if (document.hidden) animation.pause(); else animation.play(); });
        if (!document.hidden) schedule();
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      document.addEventListener('focusin', focus);
      document.addEventListener('visibilitychange', visibility);

      // The small nav settles into place without moving the content layout.
      document.querySelectorAll('.site-header .pill, .brand img').forEach((node, index) => {
        const animation = node.animate([{ opacity: 0, translate: '0 -24px', scale: node.tagName === 'IMG' ? .72 : 1 }, { opacity: 1, translate: '0 0', scale: 1 }], { duration: 750, delay: index * 55, easing });
        liveAnimations.add(animation);
        animation.finished.finally(() => liveAnimations.delete(animation)).catch(() => {});
      });

      teardown = () => {
        cancelAnimationFrame(frame);
        revealObserver.disconnect();
        loopObserver.disconnect();
        sceneObserver.disconnect();
        records.forEach(record => { record.node.style.opacity = record.opacity; record.animation?.cancel(); });
        liveAnimations.forEach(animation => animation.cancel());
        loopNodes.forEach(node => node.classList.remove('motion-inview'));
        sceneNodes.forEach(node => { node.style.removeProperty('--scene-shift'); node.style.removeProperty('--scene-progress'); });
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        document.removeEventListener('focusin', focus);
        document.removeEventListener('visibilitychange', visibility);
        document.documentElement.classList.remove('motion-suspended');
      };
    }
    setup();
    media.addEventListener('change', setup);
    return () => { teardown(); media.removeEventListener('change', setup); };
  }, [mode]);
}
