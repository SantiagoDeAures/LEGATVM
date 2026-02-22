import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { VolumeProvider } from './context/VolumeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VolumeProvider>
        <App />
        </VolumeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
