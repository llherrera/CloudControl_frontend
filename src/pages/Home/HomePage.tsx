import { ButtonComponent } from "../../components"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/Header"
import React from "react"
import { thunkLogout } from "@/store/auth/thunks"

import { useAppDispatch, useAppSelector } from '../../store'

export const HomePage = () => {
    const dispatch = useAppDispatch()
    const { logged } = useAppSelector(store => store.auth)
    const navigate = useNavigate()

    const handleBtnCiudadano = () => {
        try {
            if (logged) {
                dispatch(thunkLogout())
                    .unwrap()
                    .then(() => navigate('/lobby'))
            }else {
                navigate('/lobby')
            }
        } catch (error) {}
    }

    const buttons: React.ReactNode[] = [
        <ButtonComponent 
            inside={false} 
            text='Funcionario' 
            src="\src\assets\images\Funcionario.png" 
            onClick={() => navigate('/login')}
            bgColor="tw-bg-greenBtn"/>,
        <ButtonComponent 
            inside={false} 
            text='Ciudadano' 
            src="\src\assets\images\Ciudadano.png" 
            onClick={handleBtnCiudadano}
            bgColor="tw-bg-greenBtn"/>
    ]

    return (
        <div>
            <Header componentes={buttons} />
        </div>
    )
}
