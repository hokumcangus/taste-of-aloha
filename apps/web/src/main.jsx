import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from '../src/pages/Home'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    <h1>Main.jsx</h1>
    <Home />
  </StrictMode>,
)