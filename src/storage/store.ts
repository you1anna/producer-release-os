import type { AppState } from '../domain/types';
import { seedState } from '../domain/seed';

export const STORAGE_KEY = 'producer-release-os/v1';

export function load(): AppState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedState();
  try {
    const parsed = JSON.parse(raw) as AppState;
    if (parsed?.v !== 1) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function save(state: AppState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportJson(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importJson(raw: string): AppState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('unsupported file');
  }
  const state = parsed as AppState;
  if (state?.v !== 1 || !Array.isArray(state.releases) || !Array.isArray(state.tracks)) {
    throw new Error('unsupported file');
  }
  return state;
}
