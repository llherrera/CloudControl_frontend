import { Route, Routes } from 'react-router-dom';
import * as pages from '../pages';

export const PrivateRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path='/register' element={<pages.RegisterPage/>} />
            <Route path="/lobby" element={<pages.LobbyPage/>} />
            <Route path='/pdt' element={<pages.PDT/>} />
            <Route path='/pdt/PlanIndicativo' element={<pages.PDTid/>} />
            <Route path='/pdt/PlanIndicativo/configuracion' element={<pages.SettingPage/>} />
            <Route path="/pdt/PlanIndicativo/Meta" element={<pages.UnitNodePage/>} />
            <Route path="/pdt/PlanIndicativo/Meta/evidencia" element={<pages.EvidencePage/>} />
            <Route path="/anadirPDT" element={<pages.AddPDTPage/>} />
            <Route path="/PlanIndicativo/evidencias" element={<pages.ListEvidence/>} />
        </Routes>
  )
}
