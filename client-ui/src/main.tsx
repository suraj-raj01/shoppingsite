import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import "@/i18n"
import { UserProvider } from './contexts/userContext.tsx'
import { Provider } from 'react-redux'
import { persistor, store as Store } from './redux-toolkit/Store.tsx'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </UserProvider>
    <Toaster position="top-center" />
  </StrictMode>
)
