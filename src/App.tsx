import './App.css';
import 'tailwindcss/tailwind.css';

import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routers';
import { ToastContainer } from 'react-toastify';
import ResponseInterceptor from './utils/navigator';
import { useSessionCleanup } from './utils/sessionHooks';

/* Descomentar esto para cuando se haga el despliegue en algún sitio
function handleRightClick(event: MouseEvent) {
    event.preventDefault();
}
document.addEventListener('contextmenu', handleRightClick);
*/

const AppContent = () => {
    // Hook para manejar cierre de sesión al cerrar la aplicación
    useSessionCleanup();

    return (
        <>
            <AppRouter />
            <ToastContainer/>
            <ResponseInterceptor/>
        </>
    );
};

const App = () => {
    localStorage.setItem('UnitNode', JSON.stringify([]))
    localStorage.setItem('YearDeta', JSON.stringify([]))

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;