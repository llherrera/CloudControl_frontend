import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useAppSelector } from '../store'

import { PrivateRouter } from './adminRouter'
import { PublicRouter } from './publicRouter'
import { OfficerRouter } from './funcionarioRoutes'
import { SecretaryRouter } from './secretaryRouter'
import { SectorialistRouter } from './sectorialistRouter'

import { decode } from '@/utils'
import { Token } from '@/interfaces'

export const AppRouter = () => {
    const { logged, token_info } = useAppSelector(store => store.auth)
    let token;
    if (token_info) 
        token = decode(token_info.token).rol

    return logged ? (
        token === 'admin' ? (
            <Routes>
                <Route path="*" element={<PrivateRouter />} />
            </Routes>
        ): token === 'funcionario' ? (
            <Routes>
                <Route path="*" element={<OfficerRouter />} />
            </Routes>
        ): token === 'planeacion' ? (
            <Routes>
                
            </Routes>
        ): token === 'sectorialista' ? (
            <Routes>
                <Route path="*" element={<SectorialistRouter />} />
            </Routes>
        ):(
            <Routes>
                <Route path="*" element={<PublicRouter />} />
            </Routes>
        )
    ):(
        <Routes>
            <Route path="*" element={<PublicRouter />} />
        </Routes>
    )
}