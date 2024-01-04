import './App.css';
import 'tailwindcss/tailwind.css';

import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routers';

const App = () => {
    localStorage.setItem('UnitNode', JSON.stringify([]))
    localStorage.setItem('YearDeta', JSON.stringify([]))

    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
}

export default App;