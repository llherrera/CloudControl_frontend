import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastPDT } from '../../services/api';
import { ButtonPlan } from '../../components';
import { decode } from '../../utils/decode';
import { Token } from '../../interfaces';
import Cookies from 'js-cookie';

export const LobbyPage = () => {
    const navigate = useNavigate();

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        //const token = sessionStorage.getItem('token')
        const token = Cookies.get('token')
        try {
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as Token
                setId(decoded.id_plan)
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleButton = () => {
        if (rol === "admin") {
            navigate('/pdt')
            return
        }else if (rol === "funcionario") {
            navigate(`/pdt/${id}`)
            return
        }
        getLastPDT()
            .then((e) => {
                if (e.id_plan)
                    navigate(`/pdt/${e.id_plan}`)
                else
                    alert("No hay un PDT disponible")             
            })
    }

    const handleLogout = () => {
        //sessionStorage.removeItem('token')
        Cookies.remove('token')
        navigate('/')
    }

    return (
        <div className="tw-mx-10 tw-mt-4 tw-pb-10
                        tw-h-96
                        tw-border">
            <header className=" tw-grid tw-grid-cols-6
                                tw-shadow tw-p-2
                                tw-border-4 tw-border-double
                                tw-bg-gray-400">
                <h1 className=" tw-col-start-2 tw-col-span-4
                                tw-text-3xl
                                tw-font-bold
                                tw-text-blue-700">
                    Alcalcia Municipal, Nombre Plan, PISAMI
                </h1>
                {rol === '' ? <div></div>:
                    <button type='submit'
                            className=' tw-bg-red-500 hover:tw-bg-red-300
                                        tw-rounded tw-shadow'
                            onClick={handleLogout}>
                        <p>Cerrar sesion</p>
                    </button>
                }
            </header>
            <div className='tw-flex tw-justify-center'>
                <ButtonPlan text="Plan indicativo" 
                            handleButton={handleButton}
                            x={Math.cos(2 * Math.PI * 1 / 5) * 200}
                            y={Math.sin(2 * Math.PI * 1 / 5) * 200} />
                <ButtonPlan text="Banco de proyectos"
                            handleButton={handleButton}
                            x={Math.cos(2 * Math.PI * 2 / 5) * 100}
                            y={Math.sin(2 * Math.PI * 2 / 5) * 100} />
                <div className="tw-shadow tw-px-32
                                tw-bg-gray-400
                                tw-rounded-b-3xl"
                    style={{ left: 0, top:0 }}>
                    Cloud Control
                </div>
                <ButtonPlan text="POAI" 
                            handleButton={handleButton}
                            x={Math.cos(2 * Math.PI * 3 / 5) * 100}
                            y={Math.sin(2 * Math.PI * 3 / 5) * 100} />
                <ButtonPlan text="Plan de accion"
                            handleButton={handleButton}
                            x={Math.cos(2 * Math.PI * 4 / 5) * 100}
                            y={Math.sin(2 * Math.PI * 4 / 5) * 100} />
            </div>
        </div>
    );
}
