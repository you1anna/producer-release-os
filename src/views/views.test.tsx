import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import { useAppState } from '../hooks/useAppState';
import { load } from '../storage/store';
import { releaseTone } from './ReleasesView';
import { STAGE_TONE, stageProgress, PipelineView } from './PipelineView';
import { StudioResetView } from './StudioResetView';
import { GigPrepView } from './GigPrepView';

function Harness({ View }: { View: typeof PipelineView }) {
  const handle = useAppState();
  return <View {...handle} />;
}

describe('releaseTone', () => {
  const today = new Date('2026-07-05T00:00:00');
  it('is danger for past, warning within 14 days, success beyond', () => {
    expect(releaseTone('2026-07-01', today)).toBe('danger');
    expect(releaseTone('2026-07-12', today)).toBe('warning');
    expect(releaseTone('2026-09-01', today)).toBe('success');
  });
});

describe('pipeline', () => {
  it('maps stages to tones and progress', () => {
    expect(STAGE_TONE.sketch).toBe('neutral');
    expect(STAGE_TONE.mix).toBe('warning');
    expect(STAGE_TONE.promo).toBe('success');
    expect(stageProgress('sketch')).toBe(0);
    expect(stageProgress('promo')).toBe(100);
  });

  it('adds a track and advances its stage', async () => {
    const user = userEvent.setup();
    render(<Harness View={PipelineView} />);
    await user.type(screen.getByLabelText('Track title'), 'Basement Heat');
    await user.click(screen.getByRole('button', { name: 'Add track' }));
    expect(screen.getAllByText('Basement Heat').length).toBeGreaterThan(0);
    expect(load().tracks[0].stage).toBe('sketch');
    await user.click(screen.getByRole('button', { name: 'Advance' }));
    expect(load().tracks[0].stage).toBe('arrangement');
    expect(screen.getAllByText('arrangement').length).toBeGreaterThan(0);
  });
});

describe('studio reset', () => {
  it('tracks progress and resets all', async () => {
    const user = userEvent.setup();
    render(<Harness View={StudioResetView} />);
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes.length).toBeGreaterThanOrEqual(8);
    await user.click(boxes[0]);
    expect(load().studioReset.filter((i) => i.done)).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Reset all' }));
    expect(load().studioReset.filter((i) => i.done)).toHaveLength(0);
  });
});

describe('gig prep', () => {
  it('adds a gig with the default checklist', async () => {
    const user = userEvent.setup();
    render(<Harness View={GigPrepView} />);
    await user.type(screen.getByLabelText('Venue'), 'Corsica Studios');
    await user.type(screen.getByLabelText('Date'), '2026-08-01');
    await user.click(screen.getByRole('button', { name: 'Add gig' }));
    const card = screen.getByText(/Corsica Studios/).closest('div')!;
    expect(load().gigs[0].checklist).toHaveLength(7);
    expect(within(card.parentElement as HTMLElement).getAllByRole('checkbox').length).toBe(7);
  });
});

describe('useAppState', () => {
  it('persists updates', () => {
    const { result } = renderHook(() => useAppState());
    act(() =>
      result.current.update((s) => ({
        ...s,
        tracks: [
          { id: 'x', title: 'T', stage: 'mix', updatedAt: '2026-07-05T00:00:00.000Z' },
        ],
      })),
    );
    expect(load().tracks[0].title).toBe('T');
  });
});
