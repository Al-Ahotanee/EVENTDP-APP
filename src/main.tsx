import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize dark mode from storage
const stored = localStorage.getItem('frameit-storage');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.darkMode === false) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch { document.documentElement.classList.add('dark'); }
} else {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
