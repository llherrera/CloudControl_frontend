import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@/store';


import { uploadLogoPlan } from '@/services/api';
import { Frame, BackBtn, ColorForm, SecretaryForm } from '@/components'
import { getToken, decode } from "@/utils";
import { Token } from '@/interfaces';

export const SettingPage = () => {
    return (
        <Frame 
            data={<SettingPageWrapper/>}
        />
    )
}

const SettingPageWrapper = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const id = location.state?.id

    const { color, plan } = useAppSelector(store => store.plan)

    const [logo, setLogo] = useState<FileList | null>(null)
    
    const [showColorForm, setShowColorForm] = useState(false);
    const [colors, setColors] = useState<number[]>([]);

    const [rol, setRol] = useState("")
    const [id_, setId] = useState(0)

    useEffect(() => {
        const gettoken = getToken()
        try {
            const {token} = gettoken ? gettoken : null
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as Token
                setId(decoded.id_plan)
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleInputLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const logo = e.target.files
        if(logo)
            if (logo[0].type === 'image/png' ||
                logo[0].type === 'image/jpeg' || 
                logo[0].type === 'image/jpg') {
                setLogo(e.target.files)
            }
            else {
                e.target.value = ''
                alert('Archivo incorrecto')
            }
    }

    const handleSaveLogo = async () => {
        if (logo === null) {
            alert('No hay archivo')
            return
        }
        await uploadLogoPlan( id, logo[0])
        .then(() => {
            alert('Logo subido')
        })
        .catch((err) => {
            console.log(err);
            alert('error al subir logo')
        })
    }

    const handleBack = () => {
        navigate(-1)
    }

    const handleColor = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.preventDefault();
        setShowColorForm(!showColorForm)
    }

    return (
        <div>
            <form   id='logoForm'
                    encType='multipart/form-data'
                    onSubmit={handleSaveLogo}
                    className=' tw-mt-2 tw-ml-2 
                    '>
                <BackBtn handle={handleBack} id={id}/>
                <label htmlFor="">Subir logo: </label>
                <input 
                    type="file"
                    name='logo'
                    onChange={(e)=>handleInputLogo(e)}
                    required/>
                <button className='tw-bg-greenColory hover:tw-bg-green-400 tw-rounded tw-p-2 tw-ml-3'>Guardar</button> <hr />
            </form>
                
            {((rol === "admin") || (rol === 'funcionario' && id === plan!.id_plan!)) ?
                <button className="tw-mt-2 tw-ml-2 tw-p-2
                tw-bg-blueColory hover:tw-bg-blue-400
                                    tw-rounded"
                                    onClick={handleColor}>
                    <p className="tw-break-words tw-font-montserrat">Definir colorimetria</p>
                </button>
                :null
            }
            <div>
                {showColorForm ? 
                <div></div> 
                : <ColorForm id={plan!.id_plan!}/>}
            </div>
            <SecretaryForm/>
        </div>
    )
}