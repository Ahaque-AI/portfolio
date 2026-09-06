import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client';

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const orbitPages = new Set(['/', '/onboarding/', '/about/', '/cv/', '/terms/', '/privacy/']);
let modulePromise: Promise<typeof import('./orbital-three')> | undefined;
const load = () => modulePromise ??= import('./orbital-three');
let active: ReturnType<typeof import('./orbital-three').createFlight> | undefined;
let navigation = 0;

function clear() {
  active?.dispose();
  active = undefined;
  document.querySelectorAll('[data-flight-busy]').forEach(element => {
    element.removeAttribute('aria-busy'); element.removeAttribute('data-flight-busy');
  });
  document.querySelectorAll<HTMLElement>('[data-flight-inert]').forEach(element => {
    element.inert = false; element.removeAttribute('data-flight-inert');
  });
}

function pausePage() {
  const main = document.querySelector('main');
  if (main && !main.inert) { main.inert = true; main.setAttribute('data-flight-inert', ''); }
}

// Warm the chunk on intent, without running a renderer on the introduction page.
function warm(event: Event) {
  if (!motion.matches && (event.target as Element)?.closest?.('a[href^="/"]:not([target])')) void load().catch(() => { modulePromise = undefined; });
}
document.addEventListener('pointerover', warm, { passive: true });
document.addEventListener('focusin', warm);

document.addEventListener('astro:before-preparation', (event: TransitionBeforePreparationEvent) => {
  const id = ++navigation;
  clear();
  if (motion.matches || event.navigationType === 'traverse') return;
  const betweenOrbitPages = orbitPages.has(event.from.pathname) && orbitPages.has(event.to.pathname);
  if (!betweenOrbitPages) return;
  const source = document.querySelector<SVGSVGElement>('.orbit-art, .map-art, .legal-orbit svg');
  const host = document.querySelector<HTMLElement>('#orbit-flight');
  if (!source || !host) return;
  const loader = event.loader;
  const anchor = event.sourceElement;
  anchor?.setAttribute('aria-busy', 'true');
  anchor?.setAttribute('data-flight-busy', '');
  const cancel = () => { if (id === navigation) clear(); };
  event.signal.addEventListener('abort', cancel, { once: true });
  // Prepare the actual destination first. Slow networking never leaves a covered screen.
  const ready = load().catch(() => { modulePromise = undefined; return undefined; });
  event.loader = async () => {
    try {
      await loader();
      const three = await ready;
      if (!three || event.signal.aborted || event.defaultPrevented || motion.matches || id !== navigation) { cancel(); return; }
      active = three.createFlight(host, source);
      pausePage();
      await active.cover();
    } catch {
      cancel();
      // Astro falls back to the native destination if loading or GPU setup fails.
      event.preventDefault();
    }
  };
});
document.addEventListener('astro:before-swap', (event: TransitionBeforeSwapEvent) => {
  // Let the live WebGL canvas own the visual instead of a frozen browser snapshot.
  if (active) event.viewTransition.skipTransition();
});
document.addEventListener('astro:page-load', () => {
  const flight = active;
  if (flight) {
    pausePage();
    void flight.reveal().finally(() => {
      if (active !== flight) return;
      clear();
      const main = document.querySelector('main');
      main?.setAttribute('tabindex', '-1');
      main?.focus({ preventScroll: true });
    });
  }
});
motion.addEventListener('change', clear);
document.addEventListener('keydown', event => { if (event.key === 'Escape') clear(); });
addEventListener('pagehide', clear);
