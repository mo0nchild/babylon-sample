import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import './index.css'
import { SceneProvider } from '@contexts/SceneContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SceneProvider>
      <App />
    </SceneProvider>
    
  </StrictMode>,
)
