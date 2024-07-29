import './App.css';
import 'tailwindcss/tailwind.css';

import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routers';
import { ToastContainer } from 'react-toastify';

/* Descomentar esto para cuando se haga el despliegue en algún sitio
function handleRightClick(event: MouseEvent) {
    event.preventDefault();
}
document.addEventListener('contextmenu', handleRightClick);
*/

const App = () => {
    localStorage.setItem('UnitNode', JSON.stringify([]))
    localStorage.setItem('YearDeta', JSON.stringify([]))

    return (
        <BrowserRouter>
            <AppRouter />
            <ToastContainer/>
        </BrowserRouter>
    );
}

export default App;