import { Route, Routes } from 'react-router-dom'
import * as pages from '../pages';

export const SectorialistRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path="/escoger" element={<pages.ChooseCityPage/>} />
            <Route path="/lobby" element={<pages.LobbyPage/>} />
            <Route path='/pdt/:id' element={<pages.PDTid/>} />
            <Route path='/pdt/PlanIndicativo' element={<pages.PDTid/>} />
            <Route path="/pdt/PlanIndicativo/Meta" element={<pages.UnitNodePage/>} />
            <Route path="/pdt/PlanIndicativo/Meta/evidencia" element={<pages.EvidencePage/>} />
            <Route path="/PlanIndicativo/evidencias" element={<pages.ListEvidence/>} />
            <Route path="/PlanIndicativo/evidencia" element={<pages.UpdateEvidence/>} />
            <Route path="/PlanIndicativo/Mapa" element={<pages.InterventionMap/>} />
            <Route path='/PlanIndicativo/POAI' element={<pages.POAI/>} />
            <Route path='/PlanIndicativo/Banco-proyectos' element={<pages.ProjectBank/>} />
            <Route path='/PQRS' element={<pages.PQRSPage/>} />
            <Route path='/PQRS/radicar' element={<pages.PQRSFiledPage/>} />
            <Route path='/PQRS/consultar' element={<pages.PQRSStatePage/>} />
            <Route path='/plan/:uuid' element={<pages.SearchPage/>} />
            <Route path='*' element={<pages.NotFoundPage/>} />
        </Routes>
  )
}
