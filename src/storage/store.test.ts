import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, exportJson, importJson, load, save } from './store';
import { seedState } from '../domain/seed';

describe('store', () => {
  it('returns seed state when storage is empty', () => {
    const s = load();
    expect(s.v).toBe(1);
    expect(s.releases).toEqual([]);
    expect(s.studioReset.length).toBeGreaterThan(0);
  });

  it('round-trips through save/load', () => {
    const s = seedState();
    s.tracks.push({
      id: 't1',
      title: 'Night Drive',
      stage: 'mix',
      updatedAt: '2026-07-05T00:00:00.000Z',
    });
    save(s);
    expect(load().tracks[0].title).toBe('Night Drive');
  });

  it('falls back to seed on corrupt json', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    expect(load().v).toBe(1);
    expect(load().tracks).toEqual([]);
  });

  it('importJson rejects unsupported versions and garbage', () => {
    expect(() => importJson(JSON.stringify({ v: 2 }))).toThrow('unsupported file');
    expect(() => importJson('nope')).toThrow('unsupported file');
  });

  it('importJson accepts exported state', () => {
    const s = seedState();
    expect(importJson(exportJson(s)).v).toBe(1);
  });
});
