import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ // Enables wrapping state updates in React.startTransition
      v7_startTransition: true,
      
      // v7_relativeSplatPath: true,
      // // Changes partial hydration behavior (if using SSR)
      // v7_partialHydration: true,
      // // Changes revalidation behavior after 4xx/5xx errors
      // v7_skipActionErrorRevalidation: true,
      }}>
  <AuthContext>
    <UserContext>
      <ShopContext>
    <App />
    </ShopContext>
    </UserContext>
    </AuthContext>
</BrowserRouter>
  
)
