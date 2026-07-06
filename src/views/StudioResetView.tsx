import { useState } from 'react';
import { Button, Card, Checkbox, Input, Progress, Stack } from '@you1anna/design-system';
import type { AppStateHandle } from '../hooks/useAppState';

export function StudioResetView({ state, update }: AppStateHandle) {
  const [label, setLabel] = useState('');
  const items = state.studioReset;
  const done = items.filter((i) => i.done).length;

  function toggle(id: string, next: boolean) {
    update((s) => ({
      ...s,
      studioReset: s.studioReset.map((i) => (i.id === id ? { ...i, done: next } : i)),
    }));
  }

  function addItem() {
    if (!label.trim()) return;
    update((s) => ({
      ...s,
      studioReset: [
        ...s.studioReset,
        { id: crypto.randomUUID(), label: label.trim(), done: false },
      ],
    }));
    setLabel('');
  }

  return (
    <Stack direction="column" gap="lg" className="view">
      <h2>Studio reset</h2>
      <Progress value={done} max={items.length} label="Reset progress" showValue />
      <Card>
        <Card.Body>
          <Stack direction="column" gap="md">
            {items.map((i) => (
              <Checkbox
                key={i.id}
                label={i.label}
                checked={i.done}
                onCheckedChange={(c) => toggle(i.id, c)}
              />
            ))}
          </Stack>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              update((s) => ({
                ...s,
                studioReset: s.studioReset.map((i) => ({ ...i, done: false })),
              }))
            }
          >
            Reset all
          </Button>
        </Card.Footer>
      </Card>
      <Stack direction="row" gap="md" align="end">
        <Input
          label="Add step"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Wipe down the desk"
        />
        <Button onClick={addItem}>Add</Button>
      </Stack>
    </Stack>
  );
}
