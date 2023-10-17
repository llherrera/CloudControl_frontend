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
        <div className="mx-10 mt-4 pb-10
                        h-96
                        border">
            <header className=" grid grid-cols-6
                                shadow p-2
                                border-4 border-double
                                bg-gray-400">
                <h1 className=" col-start-2 col-span-4
                                text-3xl
                                font-bold
                                text-blue-700">
                    Alcalcia Municipal, Nombre Plan, PISAMI
                </h1>
                {rol === '' ? <div></div>:
                    <button type='submit'
                            className='bg-red-500 hover:bg-red-300
                                        rounded shadow'
                            onClick={handleLogout}>
                        <p>Cerrar sesion</p>
                    </button>
                }
            </header>
            <div className='flex justify-center'>
                <ButtonPlan text="Plan indicativo" 
                            handleButton={handleButton}
                            x={Math.cos(2 * Math.PI * 1 / 5) * 200}
                            y={Math.sin(2 * Math.PI * 1 / 5) * 200} />
                <ButtonPlan text="Banco de proyectos"
                            handleButton={handleButton}
                            x={Math.cos(2 * Math.PI * 2 / 5) * 100}
                            y={Math.sin(2 * Math.PI * 2 / 5) * 100} />
                <div className="shadow px-32
                                bg-gray-400
                                rounded-b-3xl"
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
