import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LovesProvider } from './context/LovesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LovesProvider>
      <App />
    </LovesProvider>
  </StrictMode>,
)