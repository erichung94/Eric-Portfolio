import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { profile } from '../../src/data/profile';
import { work } from '../../src/data/work';
import { skills } from '../../src/data/skills';
import { lessons } from '../../src/data/lessons';

describe('tokens.css', () => {
  const css = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
  it('defines both mode scopes', () => {
    expect(css).toContain(':root {');
    expect(css).toContain(":root[data-mode='dance']");
  });
  it('defines the required custom properties', () => {
    for (const name of ['--bg', '--fg', '--fg-muted', '--accent', '--accent-strong', '--accent-on', '--rule', '--container-max', '--container-pad']) {
      expect(css).toContain(name);
    }
  });
  it('sets the container max width to 1100px', () => {
    const match = css.match(/--container-max:\s*([^;]+);/);
    expect(match?.[1].trim()).toBe('1100px');
  });
  it('reduced-motion disables the theme transition', () => {
    expect(css).toContain('prefers-reduced-motion: reduce');
  });
});

describe('content data', () => {
  it('profile has both mode blocks and all links keys', () => {
    expect(profile.dev.eyebrow).toBeTruthy();
    expect(profile.dev.tagline).toContain('…');
    expect(profile.dance.tagline).toContain('…');
    for (const k of ['email', 'github', 'linkedin', 'instagram']) {
      expect(k in profile.links).toBe(true);
    }
    expect(profile.links.email).toBe('erichung.94@gmail.com');
  });

  // A floor rather than an exact count. The real invariants are that nothing is
  // half-filled and no slug collides; pinning the number just means editing this
  // test every time a project is added or cut, which teaches you to ignore it.
  it('every case study is fully populated, with unique slugs', () => {
    expect(work.length).toBeGreaterThanOrEqual(3);
    const slugs = new Set(work.map((w) => w.slug));
    expect(slugs.size).toBe(work.length);
    for (const w of work) {
      for (const field of ['title', 'org', 'year', 'problem', 'build', 'result'] as const) {
        expect(w[field].length).toBeGreaterThan(0);
      }
      expect(w.tags.length).toBeGreaterThan(0);
    }
  });

  it('skills has 3 non-empty groups', () => {
    expect(skills).toHaveLength(3);
    for (const g of skills) {
      expect(g.label.length).toBeGreaterThan(0);
      expect(g.items.length).toBeGreaterThan(0);
    }
  });

  it('lessons has a booking email and subject', () => {
    expect(lessons.bookingEmail).toBe('erichung.94@gmail.com');
    expect(lessons.bookingSubject.length).toBeGreaterThan(0);
  });
});
