import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('tokens.css', () => {
  const css = readFileSync('src/styles/tokens.css', 'utf8');
  it('defines both mode scopes', () => {
    expect(css).toContain(':root {');
    expect(css).toContain(":root[data-mode='dance']");
  });
  it('defines the required custom properties', () => {
    for (const name of ['--bg', '--fg', '--fg-muted', '--accent', '--accent-strong', '--accent-on', '--rule', '--container-max', '--container-pad']) {
      expect(css).toContain(name);
    }
  });
  it('reduced-motion disables the theme transition', () => {
    expect(css).toContain('prefers-reduced-motion: reduce');
  });
});
