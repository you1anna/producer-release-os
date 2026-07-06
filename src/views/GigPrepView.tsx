import { useState } from 'react';
import { Button, Card, Checkbox, Input, Progress, Stack } from 'design-system';
import type { AppStateHandle } from '../hooks/useAppState';
import { GIG_CHECKLIST_TEMPLATE, checklistFrom } from '../domain/seed';

export function GigPrepView({ state, update }: AppStateHandle) {
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');

  function addGig() {
    if (!venue.trim() || !date) return;
    update((s) => ({
      ...s,
      gigs: [
        ...s.gigs,
        {
          id: crypto.randomUUID(),
          venue: venue.trim(),
          date,
          checklist: checklistFrom(GIG_CHECKLIST_TEMPLATE),
        },
      ],
    }));
    setVenue('');
    setDate('');
  }

  function toggle(gigId: string, itemId: string, next: boolean) {
    update((s) => ({
      ...s,
      gigs: s.gigs.map((g) =>
        g.id === gigId
          ? {
              ...g,
              checklist: g.checklist.map((i) => (i.id === itemId ? { ...i, done: next } : i)),
            }
          : g,
      ),
    }));
  }

  const sorted = [...state.gigs].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Stack direction="column" gap="lg" className="view">
      <h2>Gig prep</h2>

      <Stack direction="row" gap="md" align="end">
        <Input
          label="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Corsica Studios"
        />
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button onClick={addGig}>Add gig</Button>
      </Stack>

      {sorted.length === 0 ? (
        <p className="empty-state">No gigs booked — add the next one to get the checklist.</p>
      ) : (
        sorted.map((g) => {
          const done = g.checklist.filter((i) => i.done).length;
          return (
            <Card key={g.id}>
              <Card.Header>
                {g.venue} — {g.date}
              </Card.Header>
              <Card.Body>
                <Stack direction="column" gap="md">
                  <Progress value={done} max={g.checklist.length} label="Prep" showValue />
                  {g.checklist.map((i) => (
                    <Checkbox
                      key={i.id}
                      label={i.label}
                      checked={i.done}
                      onCheckedChange={(c) => toggle(g.id, i.id, c)}
                    />
                  ))}
                </Stack>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="ghost"
                  onClick={() =>
                    update((s) => ({ ...s, gigs: s.gigs.filter((x) => x.id !== g.id) }))
                  }
                >
                  Delete gig
                </Button>
              </Card.Footer>
            </Card>
          );
        })
      )}
    </Stack>
  );
}
