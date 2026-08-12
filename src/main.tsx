import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from '@/App'
import '@/index.css'

// Global error reporting for debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global Error Detected:', { message, source, lineno, colno, error });
  // In dev mode, show a simple overlay if things crash early
  if (import.meta.env.DEV) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.background = 'red';
    overlay.style.color = 'white';
    overlay.style.padding = '10px';
    overlay.style.zIndex = '9999';
    overlay.innerText = `Runtime Error: ${message}`;
    document.body.appendChild(overlay);
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
