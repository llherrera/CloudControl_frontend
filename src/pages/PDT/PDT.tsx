import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { getPDTs } from "../../services/api";
import { Token, PDTInterface } from "../../interfaces";
import { getToken, decode } from "@/utils";
import { Frame } from "@/components";

interface Props {
    data: PDTInterface[];
    rol: string;
}


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

const ListPDT = ( props: Props ) => {
    const navigate = useNavigate();

    const handleAddPdt = () => {
        navigate('/anadirPDT')
    }

    const handlePdtid = ( id: number ) => {
        navigate(`/pdt/${id}`)
    }

    const handleAdd = (id: number) => {
        navigate(`/${id}/register`)
    }

    const backIconButton = () => {
        return (
            <IconButton aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={()=>navigate(-1)}
                        title="Regresar">
                <ArrowBackIosIcon/>
            </IconButton>
        )
    }

    return (
        <div className="tw-flex tw-relative tw-justify-center tw-mt-10">
            <div className="tw-absolute tw-left-1">
                {backIconButton()}
            </div>
            {props.rol === "admin" ? 
            <ul className="tw-shadow-2xl tw-p-4 tw-rounded">
            <button className="tw-bg-green-300 tw-rounded tw-w-full tw-py-2 tw-mb-4"
                    onClick={handleAddPdt}
                    title="Agregar un nuevo plan">
                Añadir Plan +
            </button>
            { props.data!.map(( e:PDTInterface )=>
            <div className="tw-flex">
                <button className="tw-flex tw-justify-between tw-w-full tw-mb-4 tw-p-2 tw-rounded tw-bg-gray-200"
                        onClick={(event) => handlePdtid(e.id_plan!)}
                        title={e.Descripcion}>
                    <p className="tw-mr-4">{e.Nombre}</p>
                    <p className="tw-ml-4">{e.Alcaldia}</p>
                </button>
                <IconButton color="success"
                            aria-label="delete"
                            onClick={(event) => handleAdd(e.id_plan!)}
                            title="Agregar funcionario al plan">
                    <PersonAddAltIcon/>
                </IconButton>
            </div> 
            )}
            </ul> 
            : <p className="tw-text-3xl tw-font-bold">No tiene suficientes permisos</p>}
        </div>
    )
}