import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouteList from './routes.tsx'
import { ToastContainer } from 'react-toastify'
import { persistedStore, store } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_KEY}>
          <RouteList />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>

    <ToastContainer position="top-center" theme="colored" />
  </StrictMode>,
)
