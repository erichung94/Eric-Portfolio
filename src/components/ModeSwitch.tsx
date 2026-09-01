import { useEffect } from 'react';
import { pathForMode, type Mode } from '../lib/mode';

const ORDER: Mode[] = ['dev', 'dance'];
const LABEL: Record<Mode, string> = { dev: 'Developer', dance: 'Dancer' };

function applyMode(next: Mode, animate: boolean) {
  const root = document.documentElement;
  if (root.dataset.mode === next) return;
  if (animate) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 300);
  }
  root.dataset.mode = next;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

export default function ModeSwitch({ current }: { current: Mode }) {
  useEffect(() => {
    function onPop() {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      applyMode(path === '/dancer' ? 'dance' : 'dev', false);
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function choose(next: Mode) {
    const root = document.documentElement;
    if ((root.dataset.mode as Mode) === next) return; // no-op on active side
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    applyMode(next, !reduce);
    history.pushState({}, '', pathForMode(next));
  }

  return (
    <div className="mode-switch" role="group" aria-label="Choose site mode">
      {ORDER.map((m, i) => (
        <span key={m} className="mode-switch__item">
          {i === 1 && <span className="mode-switch__seam" aria-hidden="true" />}
          <button
            type="button"
            className={`mode-switch__btn${m === current ? ' is-active' : ''}`}
            aria-pressed={m === current}
            data-mode-target={m}
            onClick={() => choose(m)}
          >
            {LABEL[m]}
          </button>
        </span>
      ))}
    </div>
  );
}
