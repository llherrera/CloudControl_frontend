import { Route, Routes } from 'react-router-dom'
import * as pages from '../pages';

export const PublicRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<pages.HomePage />} />
            <Route path="/lobby" element={<pages.LobbyPage/>} />
            <Route path="/login" element={<pages.LoginPage/>} />
            <Route path='/pdt/PlanIndicativo' element={<pages.PDTid/>} />
            <Route path="/pdt/PlanIndicativo/Meta" element={<pages.UnitNodePage/>} />
            <Route path="/pdt/PlanIndicativo/Meta/evidencia" element={<pages.EvidencePage/>} />
        </Routes>
    )
}
