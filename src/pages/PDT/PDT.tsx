import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import { getPDTs } from "../../services/api";
import { Token, PDTInterface, PDTPageProps } from "../../interfaces";
import { getToken, decode } from "@/utils";
import { Frame, BackBtn } from "@/components";

export const PDT = () => {
    const [data, setData] = useState<PDTInterface[]>([])
    const [rol, setRol] = useState("")

    useEffect(() => {
        const gettoken = getToken();
        try {
            const {token} = gettoken;

            if (token !== null || token !== undefined) {
                const decoded = decode(token!) as Token
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
        getPDTs()
            .then((res) => {
                setData(res)
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return (
        <Frame data={
            <ListPDT data={data} rol={rol}/>
        }/>
    )
}

const ListPDT = ( props: PDTPageProps ) => {
    const navigate = useNavigate();

    const handleAddPdt = () => {
        navigate('/anadirPDT')
    }

    const handlePdtid = ( id: number ) => {
        navigate(`/pdt/PlanIndicativo`, {state: {id}})
    }

    const handleAdd = (id: number) => {
        navigate(`/register`, {state: {id}})
    }

    return (
        <div className="tw-flex tw-relative tw-justify-center tw-mt-10">
            <div className="tw-absolute tw-left-1">
                <BackBtn handle={()=>navigate(-1)} id={props.data!.length}/>
            </div>
            {props.rol === "admin" ? 
            <ul className="tw-shadow-2xl tw-p-4 tw-border-2 tw-rounded">
                <button className=" tw-bg-greenBtn hover:tw-bg-green-300 
                                    tw-text-white hover:tw-text-black tw-font-bold
                                    tw-rounded tw-w-full tw-py-2 tw-mb-4"
                        onClick={handleAddPdt}
                        title="Agregar un nuevo plan">
                    Añadir Plan +
                </button>
                { props.data!.map(( e:PDTInterface, index: number )=>
                <li className="tw-flex"
                    key={index}>
                    <button className=" tw-flex tw-justify-between tw-w-full 
                                        tw-mb-4 tw-p-2 tw-rounded 
                                        tw-bg-gray-200 hover:tw-bg-gray-300
                                        tw-border-4 tw-border-gray-400"
                            onClick={() => handlePdtid(e.id_plan!)}
                            title={e.Descripcion}>
                        <p className="tw-mr-4">{e.Nombre}</p>
                        <p className="tw-ml-4">{e.Departamento}</p>
                    </button>
                    <IconButton color="success"
                                aria-label="delete"
                                onClick={() => handleAdd(e.id_plan!)}
                                title="Agregar funcionario al plan">
                        <PersonAddAltIcon/>
                    </IconButton>
                </li> 
                )}
            </ul> 
            : <p className="tw-text-3xl tw-font-bold">No tiene suficientes permisos</p>}
        </div>
    )
}