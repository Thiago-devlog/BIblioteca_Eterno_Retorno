import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Registra o Service Worker do Vite PWA para caching e leitura 100% offline
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
