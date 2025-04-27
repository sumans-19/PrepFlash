
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Log the environment variables for debugging (remove in production)
console.log('Environment variables loaded:', {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ? "exists" : "missing",
  vapiApiKey: import.meta.env.VITE_VAPI_API_KEY ? "exists" : "missing"
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
