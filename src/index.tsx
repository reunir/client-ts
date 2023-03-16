import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import { AppProviders } from './context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AppProviders>
    <App />
  </AppProviders>
);
