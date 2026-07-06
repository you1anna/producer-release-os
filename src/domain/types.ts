export type TrackStage =
  | 'sketch'
  | 'arrangement'
  | 'mix'
  | 'master'
  | 'artwork'
  | 'distributor'
  | 'promo';

export const TRACK_STAGES: TrackStage[] = [
  'sketch',
  'arrangement',
  'mix',
  'master',
  'artwork',
  'distributor',
  'promo',
];

export interface Track {
  id: string;
  title: string;
  stage: TrackStage;
  note?: string;
  updatedAt: string;
}

export interface Release {
  id: string;
  title: string;
  /** ISO yyyy-mm-dd */
  date: string;
  tracks: string[];
  note?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Gig {
  id: string;
  venue: string;
  /** ISO yyyy-mm-dd */
  date: string;
  checklist: ChecklistItem[];
  notes?: string;
}

export interface AppState {
  v: 1;
  releases: Release[];
  tracks: Track[];
  studioReset: ChecklistItem[];
  gigs: Gig[];
}
