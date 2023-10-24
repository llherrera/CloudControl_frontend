import { ButtonComponent } from "../../components"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/Header"
import { removeToken } from "@/utils"
import React from "react"

export const HomePage = () => {
    const navigate = useNavigate()

    const handleBtnCiudadano = () => {
        try {
            removeToken()
            navigate('/lobby')
        } catch (error) {}
    }

    const buttons: React.ReactNode[] = [
        <ButtonComponent 
            inside={false} 
            text='Funcionario' 
            src="\src\assets\images\Funcionario.png" 
            onClick={() => navigate('/login')}
            bgColor="greenBtn"/>,
        <ButtonComponent 
            inside={false} 
            text='Ciudadano' 
            src="\src\assets\images\Ciudadano.png" 
            onClick={handleBtnCiudadano}
            bgColor="greenBtn"/>
    ]

    return (
        <Header componentes={buttons} />
    )
}
