import { describe, it, expect } from 'vitest';
import { MODES, modeFromPath, pathForMode, otherMode, labelForMode } from '../../src/lib/mode';

describe('mode helpers', () => {
  it('MODES is dev then dance', () => {
    expect(MODES).toEqual(['dev', 'dance']);
  });

  it('modeFromPath maps /dancer variants to dance', () => {
    expect(modeFromPath('/dancer')).toBe('dance');
    expect(modeFromPath('/dancer/')).toBe('dance');
    expect(modeFromPath('/DANCER')).toBe('dance');
  });

  it('modeFromPath maps everything else to dev', () => {
    expect(modeFromPath('/')).toBe('dev');
    expect(modeFromPath('')).toBe('dev');
    expect(modeFromPath('/anything')).toBe('dev');
  });

  it('pathForMode is the inverse for the two canonical paths', () => {
    expect(pathForMode('dev')).toBe('/');
    expect(pathForMode('dance')).toBe('/dancer');
    expect(modeFromPath(pathForMode('dance'))).toBe('dance');
    expect(modeFromPath(pathForMode('dev'))).toBe('dev');
  });

  it('otherMode flips', () => {
    expect(otherMode('dev')).toBe('dance');
    expect(otherMode('dance')).toBe('dev');
  });

  it('labelForMode', () => {
    expect(labelForMode('dev')).toBe('Developer');
    expect(labelForMode('dance')).toBe('Dancer');
  });
});
