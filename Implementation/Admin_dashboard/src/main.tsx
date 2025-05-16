import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import App from './App.tsx'
import { BrowserRouter } from 'react-router'

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
