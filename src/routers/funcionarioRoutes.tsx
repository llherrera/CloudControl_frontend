import { Route, Routes } from 'react-router-dom'
import * as pages from '../pages';

export const OfficerRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path='/register' element={<pages.RegisterPage/>} />
            <Route path="/lobby" element={<pages.LobbyPage/>} />
            <Route path='/pdt/PlanIndicativo' element={<pages.PDTid/>} />
            <Route path='/pdt/PlanIndicativo/configuracion' element={<pages.SettingPage/>} />
            <Route path="/pdt/PlanIndicativo/Meta" element={<pages.UnitNodePage/>} />
            <Route path='/pdt/PlanIndicativo/Meta/configuracion' element={<pages.SettingsPage/>} />
            <Route path="/pdt/PlanIndicativo/Meta/evidencia" element={<pages.EvidencePage/>} />
            <Route path="/PlanIndicativo/evidencias" element={<pages.ListEvidence/>} />
            <Route path="/PlanIndicativo/evidencia" element={<pages.UpdateEvidence/>} />
            <Route path="/PlanIndicativo/Mapa" element={<pages.InterventionMap/>} />
            <Route path='/PlanIndicativo/POAI' element={<pages.POAI/>}/>
            <Route path='/PlanIndicativo/Banco-proyectos' element={<pages.ProjectBank/>}/>
            <Route path='*' element={<pages.NotFoundPage/>}/>
        </Routes>
  )
}
