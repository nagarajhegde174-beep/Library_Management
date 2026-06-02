import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './index.css'
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';


try {
  const token = localStorage.getItem('authToken');
  if (token) {
    const decoded = jwtDecode(token);
    if (!decoded?.id) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('role');
      console.warn('[Auth] Stale token detected (no id) — cleared. Please log in again.');
    }
  }
} catch {
  localStorage.removeItem('authToken');
  localStorage.removeItem('role');
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
  </StrictMode>
)   
