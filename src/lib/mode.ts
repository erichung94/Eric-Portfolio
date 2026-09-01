export type Mode = 'dev' | 'dance';

export const MODES: readonly Mode[] = ['dev', 'dance'] as const;

export function modeFromPath(pathname: string): Mode {
  const clean = pathname.toLowerCase().replace(/\/+$/, '');
  return clean === '/dancer' ? 'dance' : 'dev';
}

export function pathForMode(mode: Mode): string {
  return mode === 'dance' ? '/dancer' : '/';
}

export function otherMode(mode: Mode): Mode {
  return mode === 'dev' ? 'dance' : 'dev';
}

export function labelForMode(mode: Mode): string {
  return mode === 'dance' ? 'Dancer' : 'Developer';
}
