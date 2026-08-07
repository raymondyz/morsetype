import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '../src/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='w-full h-dvh'>
      <App />
    </div>
  </StrictMode>,
)
