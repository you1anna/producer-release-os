import { useMemo, useState } from 'react';
import { Badge, Button, Calendar, Dialog, Input, Stack, Table } from '@you1anna/design-system';
import type { CalendarDay } from '@you1anna/design-system';
import type { AppStateHandle } from '../hooks/useAppState';
import type { Release } from '../domain/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function releaseTone(dateIso: string, today: Date): 'success' | 'warning' | 'danger' {
  const date = new Date(dateIso + 'T00:00:00');
  const days = Math.floor((date.getTime() - today.getTime()) / MS_PER_DAY);
  if (days < 0) return 'danger';
  if (days <= 14) return 'warning';
  return 'success';
}

function monthDays(year: number, month: number, releases: Release[], today: Date): CalendarDay[] {
  const releaseByDate = new Map(releases.map((r) => [r.date, r]));
  const last = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];
  for (let d = 1; d <= last; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const release = releaseByDate.get(iso);
    days.push({
      date: iso,
      dayLabel: String(d),
      eyebrow: release ? release.title : undefined,
      tone: release ? releaseTone(iso, today) : 'neutral',
    });
  }
  return days;
}

export function ReleasesView({ state, update }: AppStateHandle) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | undefined>();

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const monthLabel = today.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const days = monthDays(today.getFullYear(), today.getMonth(), state.releases, today);
  const sorted = [...state.releases].sort((a, b) => a.date.localeCompare(b.date));

  function addRelease() {
    if (!title.trim() || Number.isNaN(new Date(date + 'T00:00:00').getTime())) {
      setError('Title and a valid date are required');
      return;
    }
    update((s) => ({
      ...s,
      releases: [
        ...s.releases,
        { id: crypto.randomUUID(), title: title.trim(), date, tracks: [] },
      ],
    }));
    setTitle('');
    setDate('');
    setError(undefined);
    setOpen(false);
  }

  return (
    <Stack direction="column" gap="lg" className="view">
      <Stack direction="row" gap="md" justify="between" align="center">
        <h2>Release calendar</h2>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>Add release</Button>}
          title="Add release"
          description="Title and target date. Everything else can wait."
        >
          <Stack direction="column" gap="md">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Night Drive EP"
            />
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={error}
            />
            <Stack direction="row" gap="sm" justify="end">
              <Button onClick={addRelease}>Save release</Button>
            </Stack>
          </Stack>
        </Dialog>
      </Stack>

      <Calendar monthLabel={monthLabel} days={days} />

      {sorted.length === 0 ? (
        <p className="empty-state">No releases planned yet — add the next one.</p>
      ) : (
        <Table density="compact">
          <Table.Header>
            <Table.Row>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell aria-label="actions" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorted.map((r) => (
              <Table.Row key={r.id}>
                <Table.Cell>{r.title}</Table.Cell>
                <Table.Cell>{r.date}</Table.Cell>
                <Table.Cell>
                  <Badge tone={releaseTone(r.date, today)}>
                    {releaseTone(r.date, today) === 'danger'
                      ? 'overdue'
                      : releaseTone(r.date, today) === 'warning'
                        ? 'soon'
                        : 'planned'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        releases: s.releases.filter((x) => x.id !== r.id),
                      }))
                    }
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Stack>
  );
}
