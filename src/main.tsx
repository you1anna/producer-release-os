import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@you1anna/design-system/styles.css';
import './app.css';
import './print.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
