import type { mountSolarSystem } from './solar-system';

export const flightStops = [
  { planet: 0, name: '01 / SIGNAL FOUND', title: 'AI systems under real constraints.', copy: 'I build backend AI systems that keep moving when inference is limited, jobs fail, or data needs clear boundaries.' },
  { planet: 2, name: '02 / ASTEROID FIELD', title: 'Production work, not demos.', copy: 'A CPU-only therapy service handled 300+ daily sessions. A student companion reduced session context from 100K to 10K tokens.' },
  { planet: 1, name: '03 / RESEARCH LOCK', title: 'GraphRAG-Causal and IntentLens.', copy: 'I use graph retrieval and multi-agent workflows to make model behaviour inspectable, testable and useful.' },
  { planet: 2, name: '04 / MISSION LOG', title: 'Kafka, FastAPI, Azure, pgvector and Neo4j.', copy: 'The work connects real-time reporting, retrieval systems and production service design. The route map is ready when you are.' },
];

export function initGuidedFlight() {
  const trigger = document.querySelector<HTMLButtonElement>('#tutorial-trigger');
  const dialog = document.querySelector<HTMLDialogElement>('#tutorial-dialog');
  if (!trigger || !dialog || trigger.dataset.flightReady) return;
  trigger.dataset.flightReady = 'true';
  const modal = dialog;
  const button = trigger;
  const host = modal.querySelector<HTMLElement>('#flight-scene')!;
  const title = modal.querySelector<HTMLElement>('#tutorial-title')!;
  const copy = modal.querySelector<HTMLElement>('#tutorial-copy')!;
  const status = modal.querySelector<HTMLElement>('#flight-status')!;
  const events = new AbortController();
  let scene: ReturnType<typeof mountSolarSystem>;
  let visit = 0, stop = 0, advance = 0;
  function caption() {
    const current = flightStops[stop];
    title.textContent = current.title;
    copy.textContent = current.copy;
    status.textContent = current.name;
    scene?.flyTo(current.planet);
  }
  function queueAdvance(request: number) {
    clearTimeout(advance);
    if (stop === flightStops.length - 1) return;
    advance = window.setTimeout(() => {
      if (request !== visit || !modal.open) return;
      stop += 1;
      caption();
      queueAdvance(request);
    }, 4100);
  }
  function fallback() {
    scene?.dispose(); scene = undefined;
    modal.classList.remove('has-spaceship');
    status.textContent = `${flightStops[stop].name}. Text tour available.`;
  }
  function release() {
    visit++;
    clearTimeout(advance);
    scene?.dispose(); scene = undefined;
    button.removeAttribute('aria-busy');
    modal.classList.remove('has-spaceship');
    document.documentElement.classList.remove('is-flight-open');
  }
  async function open() {
    if (modal.open) return;
    document.body.classList.remove('is-guided-focus');
    document.querySelector('#guided-first-note')?.setAttribute('hidden', '');
    button.classList.add('is-launching');
    stop = 0; caption();
    modal.classList.add('has-spaceship');
    modal.showModal();
    document.documentElement.classList.add('is-flight-open');
    const request = ++visit;
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Preparing spaceship…';
    try {
      const { mountSolarSystem } = await import('./solar-system');
      if (request !== visit || !modal.open || !modal.isConnected) return;
      scene = mountSolarSystem(host, fallback);
      if (!scene) fallback();
      else { caption(); queueAdvance(request); }
    } catch { if (request === visit) fallback(); }
    finally {
      if (request === visit) button.removeAttribute('aria-busy');
      button.classList.remove('is-launching');
    }
  }
  document.body.classList.add('is-guided-focus');
  document.querySelector('#guided-first-note')?.removeAttribute('hidden');
  requestAnimationFrame(() => button.focus({ preventScroll: true }));
  button.addEventListener('click', open, { signal: events.signal });
  modal.querySelector('#tutorial-close')!.addEventListener('click', () => modal.close(), { signal: events.signal });
  modal.addEventListener('close', () => { release(); if (button.isConnected) button.focus({ preventScroll: true }); }, { signal: events.signal });
  document.addEventListener('astro:before-swap', () => {
    events.abort(); release(); modal.close();
  }, { once: true });
}
