import './App.css';
import 'tailwindcss/tailwind.css';

import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routers';
import { Route, Routes } from 'react-router-dom'
import * as pages from './pages';

const App = () => {
    localStorage.setItem('pesosNodo', JSON.stringify([]))
    localStorage.setItem('detalleAño', JSON.stringify([]))

    /*return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<pages.HomePage/>} />
                <Route path="/ping" element={<pages.PingPage/>} />
                <Route path="/login" element={<pages.LoginPage/>} />
                <Route path='/:id/register' element={<pages.RegisterPage/>} />
                <Route path="/lobby" element={<pages.LobbyPage/>} />
                <Route path='/pdt' element={<pages.PDT/>} />
                <Route path='/pdt/:id' element={<pages.PDTid/>} />
                <Route path="/pdt/:idPDT/:idNodo" element={<pages.AñadirNodoUni/>} />
                <Route path="/pdt/:idPDT/:idNodo/añadirEvidencia" element={<pages.AñadirEvidencia/>} />
                <Route path="/anadirPDT" element={<pages.AñadirPDT/>} />
            </Routes>
        </BrowserRouter>
    );*/
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
}

export default App;