import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastPDT } from '../../services/api';
import { ButtonPlan } from '../../components';
import { decode } from '../../utils/decode';

export const LobbyPage = () => {
    const navigate = useNavigate();

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        try {
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as any
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

    return (
        <div className="container 
                        grid grid-cols-12
                        mx-auto my-4 pb-10
                        border">
            <header className=" col-start-2 col-end-12
                                row-start-1
                                shadow
                                border-4 
                                border-double border-gray-500">
                <h1 className=" text-3xl 
                                font-bold 
                                bg-gray-400
                                text-blue-700">
                    Alcalcia Municipal, Nombre Plan, PISAMI
                </h1>
            </header>
            <div className="col-start-5 col-span-4
                            row-start-2
                            shadow 
                            bg-gray-400
                            rounded-b-3xl">
                Cloud Control
            </div>
            <ButtonPlan text="Plan indicativo" 
                        handleButton={handleButton} />
            <ButtonPlan text="Banco de proyectos"
                        handleButton={handleButton} />
            <ButtonPlan text="POAI" 
                        handleButton={handleButton} />
            <ButtonPlan text="Plan de accion"
                        handleButton={handleButton} />
                
        </div>
    );
}
