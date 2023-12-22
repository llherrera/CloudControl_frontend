import { Route, Routes } from 'react-router-dom'
import * as pages from '../pages';

export const OfficerRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path="/lobby" element={<pages.LobbyPage/>} />
            <Route path='/pdt/:id' element={<pages.PDTid/>} />
            <Route path="/pdt/:idPDT/:idNodo" element={<pages.UnitNodePage/>} />
            <Route path="/pdt/:idPDT/:idNodo/EvidencePage" element={<pages.EvidencePage/>} />
        </Routes>
  )
}
