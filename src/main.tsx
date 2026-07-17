import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseProvider } from './context/FirebaseContext';
import { ThemeProvider } from './components/ThemeToggle';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>,
);
