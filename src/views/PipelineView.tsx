import { useState } from 'react';
import { Badge, Button, Input, Progress, Select, Stack, Table } from 'design-system';
import type { BadgeTone } from 'design-system';
import type { AppStateHandle } from '../hooks/useAppState';
import { TRACK_STAGES, type TrackStage } from '../domain/types';

export const STAGE_TONE: Record<TrackStage, BadgeTone> = {
  sketch: 'neutral',
  arrangement: 'neutral',
  mix: 'warning',
  master: 'warning',
  artwork: 'success',
  distributor: 'success',
  promo: 'success',
};

export function stageProgress(stage: TrackStage): number {
  return Math.round((TRACK_STAGES.indexOf(stage) / (TRACK_STAGES.length - 1)) * 100);
}

const stageOptions = TRACK_STAGES.map((s) => ({ label: s, value: s }));

export function PipelineView({ state, update }: AppStateHandle) {
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<TrackStage>('sketch');

  const sorted = [...state.tracks].sort(
    (a, b) => TRACK_STAGES.indexOf(a.stage) - TRACK_STAGES.indexOf(b.stage),
  );

  function addTrack() {
    if (!title.trim()) return;
    update((s) => ({
      ...s,
      tracks: [
        ...s.tracks,
        {
          id: crypto.randomUUID(),
          title: title.trim(),
          stage,
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
    setTitle('');
  }

  function advance(id: string) {
    update((s) => ({
      ...s,
      tracks: s.tracks.map((t) => {
        if (t.id !== id) return t;
        const idx = TRACK_STAGES.indexOf(t.stage);
        const next = TRACK_STAGES[Math.min(idx + 1, TRACK_STAGES.length - 1)];
        return { ...t, stage: next, updatedAt: new Date().toISOString() };
      }),
    }));
  }

  return (
    <Stack direction="column" gap="lg" className="view">
      <h2>Track pipeline</h2>

      <Stack direction="row" gap="md" align="end">
        <Input
          label="Track title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled 47, but finished"
        />
        <Select
          label="Stage"
          options={stageOptions}
          value={stage}
          onValueChange={(v) => setStage(v as TrackStage)}
        />
        <Button onClick={addTrack}>Add track</Button>
      </Stack>

      {sorted.length === 0 ? (
        <p className="empty-state">No tracks in the pipeline — add what you're finishing.</p>
      ) : (
        <Table density="compact">
          <Table.Header>
            <Table.Row>
              <Table.HeadCell>Track</Table.HeadCell>
              <Table.HeadCell>Stage</Table.HeadCell>
              <Table.HeadCell>Progress</Table.HeadCell>
              <Table.HeadCell aria-label="actions" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorted.map((t) => (
              <Table.Row key={t.id}>
                <Table.Cell>{t.title}</Table.Cell>
                <Table.Cell>
                  <Badge tone={STAGE_TONE[t.stage]}>{t.stage}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Progress value={stageProgress(t.stage)} label={t.title} showValue />
                </Table.Cell>
                <Table.Cell>
                  <Stack direction="row" gap="sm">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={t.stage === 'promo'}
                      onClick={() => advance(t.id)}
                    >
                      Advance
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          tracks: s.tracks.filter((x) => x.id !== t.id),
                        }))
                      }
                    >
                      Delete
                    </Button>
                  </Stack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Stack>
  );
}
