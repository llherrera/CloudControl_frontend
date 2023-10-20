import { ButtonComponent } from "../../components"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/Header"
import React from "react"

export const HomePage = () => {
    const navigate = useNavigate()

    const buttons: React.ReactNode[] = [
        <ButtonComponent inside={false} text='Funcionario' src="\src\assets\images\Funcionario.png" onClick={() => navigate('/login')}/>,
        <ButtonComponent inside={false} text='Ciudadano' src="\src\assets\images\Ciudadano.png" onClick={() => navigate('/lobby')}/>
    ]

    return (
        <Header componentes={buttons} />
    )
}
