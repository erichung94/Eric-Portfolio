import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(import.meta.dirname, '../../src');
const EXTS = ['.ts', '.tsx', '.astro', '.css'];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return EXTS.some((e) => full.endsWith(e)) ? [full] : [];
  });
}

describe('house style', () => {
  // Eric's standing rule, and it applies to anything that ships. Em dashes are
  // easy to reintroduce by accident: editors autocorrect them, and pasted copy
  // carries them in invisibly. A failing test is cheaper than spotting one on
  // the live site.
  it('no em dashes anywhere in src', () => {
    const offenders = sourceFiles(SRC).flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => ({ file, line: i + 1, text: line }))
        .filter(({ text }) => text.includes('\u2014'))
        .map(({ file, line, text }) => `${file}:${line} ${text.trim()}`),
    );
    expect(offenders).toEqual([]);
  });
});
