import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import "@/i18n"
import { UserProvider } from './contexts/userContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
    <Toaster position="top-center" />
  </StrictMode>
)
