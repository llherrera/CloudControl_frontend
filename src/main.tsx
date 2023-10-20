import './index.css'

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
    <StrictMode>
        <Provider store={setupStore()}>
            <App />
        </Provider>
    </StrictMode>
);

//<script src="https://cdn.tailwindcss.com"></script>