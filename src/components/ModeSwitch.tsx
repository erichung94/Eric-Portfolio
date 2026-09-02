import { useEffect, useState } from 'react';
import { pathForMode, type Mode } from '../lib/mode';

const ORDER: Mode[] = ['dev', 'dance'];
const LABEL: Record<Mode, string> = { dev: 'Developer', dance: 'Dancer' };

function applyMode(next: Mode, animate: boolean) {
  const root = document.documentElement;
  if (root.dataset.mode === next) return;
  if (animate) {
    root.classList.add('theme-transition');
    // Must outlast the 750ms transition in tokens.css, or the class is removed
    // mid-fade and the remaining colour change snaps.
    window.setTimeout(() => root.classList.remove('theme-transition'), 850);
  }
  root.dataset.mode = next;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function modeFromLocation(): Mode {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  return path === '/dancer' ? 'dance' : 'dev';
}

export default function ModeSwitch({ current }: { current: Mode }) {
  const [mode, setMode] = useState<Mode>(current);

  useEffect(() => {
    function onPop() {
      const next = modeFromLocation();
      applyMode(next, false);
      setMode(next);
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function choose(next: Mode) {
    if (mode === next) return; // no-op on active side
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    applyMode(next, !reduce);
    history.pushState({}, '', pathForMode(next));
    setMode(next);
  }

  return (
    <div className="mode-switch" role="group" aria-label="Choose site mode">
      <div className="mode-switch__group">
        {ORDER.map((m) => (
          <button
            key={m}
            type="button"
            className="mode-switch__btn"
            aria-pressed={m === mode}
            data-mode-target={m}
            onClick={() => choose(m)}
          >
            {LABEL[m]}
          </button>
        ))}
        <span className="mode-switch__seam" aria-hidden="true" />
      </div>
    </div>
  );
}
