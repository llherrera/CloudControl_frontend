import React from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from '..'
import * as svg from '../../assets/icons'

interface Props {
    data: React.ReactNode;
}

export const Frame = (props: Props) => {
    const navigate = useNavigate();
    
    const bgcolor='greenBtn'
    const logocolor='#FFFFFF'
    const textcolor='white'

    const buttons = [
        {
            inside: true,
            onClick: () => navigate('/'), 
            text: 'Plan indicativo', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.PlanIndicativoIcon('#008432')
        },
        {
            inside: true, 
            onClick: () => navigate('/'), 
            text: 'Banco de proyectos', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.BancoProyectoIcon(logocolor)
        },
        {
            inside: true, 
            onClick: () => navigate('/'), 
            text: 'POAI', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.POAIIcon(logocolor)
        },
        {
            inside: true, 
            onClick: () => navigate('/'), 
            text: 'Plan de accion', 
            bgColor: bgcolor,
            textColor: textcolor,
            icon: ()=>svg.PlanAccionIcon(logocolor)
        }
    ]

    return (
        <div className='tw-h-screen'>
            <header className={`tw-flex tw-justify-between tw-bg-header tw-drop-shadow-xl`}>
                <img src="\src\assets\images\Logo.png" alt="" width={100} height={100}/>
                <img src="\src\assets\images\Logo-municipio.png" alt="" width={300} />
                <div>salir</div>
            </header>
            <div className='tw-flex tw-h-5/6'>
                <NavBar buttons={buttons}/>
                <div className='tw-flex-grow'>
                    {props.data}
                </div>
            </div>
        </div>
    )
}