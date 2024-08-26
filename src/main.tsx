import './index.css';
import 'leaflet/dist/leaflet.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import Modal from 'react-modal';
import App from './App';

import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        '2xl': true;
    }
}
  

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536
        },
    },
});

Modal.setAppElement('#root');
const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
    <ThemeProvider theme={theme}>
        <StrictMode>
            <Provider store={setupStore()}>
                <App />
            </Provider>
        </StrictMode>
    </ThemeProvider>
);

//<script src="https://cdn.tailwindcss.com"></script>