import type { AppState, ChecklistItem } from './types';

const STUDIO_RESET_TEMPLATE = [
  'Close all open sessions',
  'Bounce stems for finished work',
  'File loose samples into the library',
  'Clear the desktop and downloads',
  'Label new hardware presets',
  'Empty the record bin',
  'Back up project folders',
  'Five-minute physical tidy',
];

export const GIG_CHECKLIST_TEMPLATE = [
  'USB exported and tested',
  'Backup USB packed',
  'Headphones',
  'Earplugs',
  'Cables and adapters',
  'Set notes reviewed',
  'Crate refreshed this week',
];

export function checklistFrom(labels: string[]): ChecklistItem[] {
  return labels.map((label) => ({ id: crypto.randomUUID(), label, done: false }));
}

export function seedState(): AppState {
  return {
    v: 1,
    releases: [],
    tracks: [],
    studioReset: checklistFrom(STUDIO_RESET_TEMPLATE),
    gigs: [],
  };
}
