import { useRef, useState } from 'react';
import { Button, Stack, Tabs } from '@you1anna/design-system';
import { useAppState } from './hooks/useAppState';
import { exportJson, importJson } from './storage/store';
import { ReleasesView } from './views/ReleasesView';
import { PipelineView } from './views/PipelineView';
import { StudioResetView } from './views/StudioResetView';
import { GigPrepView } from './views/GigPrepView';

export default function App() {
  const handle = useAppState();
  const [tab, setTab] = useState('releases');
  const fileRef = useRef<HTMLInputElement>(null);

  function download() {
    const blob = new Blob([exportJson(handle.state)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `producer-release-os-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function onImportFile(file: File | undefined) {
    if (!file) return;
    try {
      handle.replace(importJson(await file.text()));
    } catch {
      window.alert('Unsupported file — expected a Producer Release OS JSON export.');
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Producer Release OS</h1>
        <p>Finish tracks, plan releases, reset the studio, prep gigs — data stays in your browser.</p>
      </header>

      <Tabs
        value={tab}
        onValueChange={setTab}
        items={[
          { value: 'releases', label: 'Releases', content: <ReleasesView {...handle} /> },
          { value: 'pipeline', label: 'Pipeline', content: <PipelineView {...handle} /> },
          { value: 'studio', label: 'Studio reset', content: <StudioResetView {...handle} /> },
          { value: 'gigs', label: 'Gig prep', content: <GigPrepView {...handle} /> },
        ]}
      />

      <footer className="app-footer">
        <Stack direction="row" gap="sm">
          <Button variant="secondary" size="sm" onClick={download}>
            Export JSON
          </Button>
          <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            Print / PDF
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            aria-label="Import file"
            onChange={(e) => onImportFile(e.target.files?.[0])}
          />
        </Stack>
      </footer>
    </div>
  );
}
