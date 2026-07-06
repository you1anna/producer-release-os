import { useCallback, useState } from 'react';
import type { AppState } from '../domain/types';
import { load, save } from '../storage/store';

export interface AppStateHandle {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  replace: (next: AppState) => void;
}

export function useAppState(): AppStateHandle {
  const [state, setState] = useState<AppState>(() => load());

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const replace = useCallback((next: AppState) => {
    save(next);
    setState(next);
  }, []);

  return { state, update, replace };
}
