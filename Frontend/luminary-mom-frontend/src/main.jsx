import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LovesProvider } from './context/LovesContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import NotificationProvider from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LovesProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </LovesProvider>
    </AuthProvider>
  </StrictMode>,
)
