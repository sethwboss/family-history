import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AnimationTestPage from './components/Test/AnimationTestPage.jsx'

const currentPath = window.location.pathname.replace(/\/$/, '')
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const isAnimationTestPage = currentPath === `${basePath}/test` || currentPath === '/test'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAnimationTestPage ? <AnimationTestPage /> : <App />}
  </StrictMode>,
)
