import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeContextProvider } from './contexts/ThemeContextProvider.jsx'
import AuthContextProvider from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContextProvider>
        <App /> 
    </ThemeContextProvider>
  </StrictMode>,
)