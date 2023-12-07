import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetLocations, thunkGetSecretaries } from '@/store/plan/thunks';

import { Frame, BackBtn, ColorForm, SecretaryForm, 
        UploadImage, 
        LocationsForm} from '@/components'
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
    const dispatch = useAppDispatch()

    const id = location.state?.id

    const { plan, secretaries } = useAppSelector(store => store.plan)
    
    const [showColorForm, setShowColorForm] = useState(false);
    const [hasSecretaries, setHasSecretaries] = useState(false);

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

    useEffect(() => {
        if (id) {
            dispatch(thunkGetSecretaries(id))
            dispatch(thunkGetLocations(id))
        }
    }, [])

    useEffect(() => {
        if (secretaries.length > 0) {
            setHasSecretaries(true)
        }
    }, [secretaries])

    const handleBack = () => {
        navigate(-1)
    }

    const handleColor = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.preventDefault();
        setShowColorForm(!showColorForm)
    }

    return (
        (plan === null || plan === undefined) ? <div className='tw-text-center'>No hay un plan seleccionado</div> :
        <div>
            <BackBtn handle={handleBack} id={id}/><br />
            <UploadImage id={id_}/>
            <div className='tw-border-t-4 tw-mt-4'>
                {((rol === "admin") || (rol === 'funcionario' && id === plan!.id_plan!)) ?
                    <div className='tw-flex tw-justify-center'>
                        <button className=" tw-mt-2 tw-ml-2 tw-p-2
                                            tw-bg-blueColory hover:tw-bg-blue-400
                                            tw-text-white hover:tw-text-black tw-font-bold
                                            tw-rounded"
                                            onClick={handleColor}>
                            <p className="tw-break-words tw-font-montserrat">
                                Definir colorimetria
                            </p>
                        </button>
                    </div>
                    :null
                }
                <div>
                    {showColorForm ? 
                    <div></div> 
                    : <div className='tw-flex tw-justify-center tw-pt-2'>
                        <ColorForm id={plan!.id_plan!}/>
                        </div>}
                </div>
            </div>
            
            {((rol === "admin") || (rol === 'funcionario' && id === plan!.id_plan!)) ?
            <SecretaryForm/>
            : null}

            {((rol === "admin") || (rol === 'funcionario' && id === plan!.id_plan!)) ?
            <LocationsForm/>
            : null}
        </div>
    )
}