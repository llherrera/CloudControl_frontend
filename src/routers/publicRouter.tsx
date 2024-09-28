import { Route, Routes } from 'react-router-dom'
import * as pages from '../pages';

export const PublicRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage/>} />
            <Route path="/lobby" element={<pages.LobbyPage/>} />
            <Route path="/escoger" element={<pages.ChooseCityPage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path='/pdt/PlanIndicativo' element={<pages.PDTid/>} />
            <Route path="/pdt/PlanIndicativo/Meta" element={<pages.UnitNodePage/>} />
            <Route path="/pdt/PlanIndicativo/Meta/evidencia" element={<pages.EvidencePage/>} />
            <Route path="/PlanIndicativo/Mapa" element={<pages.InterventionMap/>} />
            <Route path='/PlanIndicativo/POAI' element={<pages.POAI/>} />
            <Route path='/PlanIndicativo/Banco-proyectos' element={<pages.ProjectBank/>} />
            <Route path='/PQRS' element={<pages.PQRSPage/>} />
            <Route path='/PQRS/radicar' element={<pages.PQRSFiledPage/>} />
            <Route path='/PQRS/consultar' element={<pages.PQRSStatePage/>} />
            <Route path='/plan/:uuid' element={<pages.SearchPage/>} />
            <Route path='/meta/:uuid' element={<pages.SearchUnitPage/>} />
            <Route path='*' element={<pages.NotFoundPage/>} />
        </Routes>
    )
}
