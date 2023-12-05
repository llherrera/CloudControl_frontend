import { Route, Routes } from 'react-router-dom'

import { useAppSelector } from '../store'

import { PrivateRouter } from './adminRouter'
import { PublicRouter } from './publicRouter'

export const AppRouter = () => {
    const { logged } = useAppSelector(store => store.auth)

    return logged ? (
        <Routes>
            <Route path="*" element={<PrivateRouter />} />
        </Routes>
    ):(
        <Routes>
            <Route path="*" element={<PublicRouter />} />
        </Routes>
    )
}