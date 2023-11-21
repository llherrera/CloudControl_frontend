import { Route, Routes } from 'react-router-dom'
import * as pages from '../pages';
//To do: Borrar el path PDT
export const PublicRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage />} />
            <Route path="/lobby" element={<pages.LobbyPage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path='/pdt' element={<pages.PDT/>} />
            <Route path='/pdt/:id' element={<pages.PDTid/>} />
            <Route path="/pdt/:idPDT/:idNodo" element={<pages.UnitNodePage/>} />
            <Route path="/pdt/:idPDT/:idNodo" element={<pages.EvidencePage/>} />
        </Routes>
    )
}
