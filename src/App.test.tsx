import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App shell', () => {
  it('renders the title and all four tabs', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Producer Release OS' })).toBeInTheDocument();
    for (const label of ['Releases', 'Pipeline', 'Studio reset', 'Gig prep']) {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument();
    }
  });

  it('switches views when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('tab', { name: 'Pipeline' }));
    expect(
      screen.getByText("No tracks in the pipeline — add what you're finishing."),
    ).toBeInTheDocument();
  });

  it('has export, import, and print actions', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Export JSON' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import JSON' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print / PDF' })).toBeInTheDocument();
  });
});
