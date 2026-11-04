import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// The journey is scroll-driven, so always start it from the top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
