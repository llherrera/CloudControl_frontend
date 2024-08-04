import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import { useAppSelector, useAppDispatch } from "@/store";
import { setIdPlan } from "@/store/content/contentSlice";
import { thunkGetPDTid } from "@/store/plan/thunks";

import { getPDTs } from "@/services/api";
import { PDTInterface, PDTPageProps } from "@/interfaces";
import { decode } from "@/utils";
import { BackBtn, Header } from "@/components";

export const PDT = () => {
    const [data, setData] = useState<PDTInterface[]>([]);
    const { token_info } = useAppSelector(store => store.auth);

    let rol = "";
    
    if (token_info?.token !== undefined) {
        const decoded = decode(token_info.token);
        rol = decoded.rol;
    }

    useEffect(() => {
        getPDTs()
        .then((res) => {
            setData(res);
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);

    return (
        <Header>
            <ListPDT data={data} rol={rol} key={data.length}/>
        </Header>
    );
}

const ListPDT = ( props: PDTPageProps ) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleAddPdt = () => navigate('/anadirPDT');

    const handlePdtid = (id: number) => {
        dispatch(setIdPlan(id));
        dispatch(thunkGetPDTid(id));
        navigate(`/lobby`);
    };
    
    const handleAdd = (id: number) => {
        dispatch(setIdPlan(id));
        navigate(`/register`)
    };

    return (
        <div className="tw-flex tw-relative tw-justify-center tw-mt-10">
            <div className="tw-absolute tw-left-1">
                <BackBtn handle={()=>navigate(-1)} id={props.data.length}/>
            </div>
            {props.rol === "admin" ? 
            <ul className="tw-shadow-2xl tw-p-4 tw-border-2 tw-rounded">
                <li>
                    <button className=" tw-bg-greenBtn hover:tw-bg-green-300 
                                        tw-text-white hover:tw-text-black tw-font-bold
                                        tw-rounded tw-w-full tw-py-2 tw-mb-4"
                            onClick={handleAddPdt}
                            type="button"
                            title="Agregar un nuevo plan">
                        Añadir Plan +
                    </button>
                </li>
                {props.data.length === 0 ? <p>No hay planes de momento</p> : null}
                {props.data.map((e:PDTInterface) =>
                <li className="tw-flex"
                    key={e.id_plan}>
                    <button className=" tw-flex tw-justify-between tw-w-full 
                                        tw-mb-4 tw-p-2 tw-rounded 
                                        tw-bg-gray-200 hover:tw-bg-gray-300
                                        tw-border-4 tw-border-gray-400"
                            onClick={() => handlePdtid(e.id_plan!)}
                            type="button"
                            title={e.description}>
                        <p className="tw-mr-4">{e.name}</p>
                        <p className="tw-ml-4">{e.department}</p>
                    </button>
                    <IconButton color="success"
                                aria-label="delete"
                                type="button"
                                onClick={() => handleAdd(e.id_plan!)}
                                title="Agregar funcionario al plan">
                        <PersonAddAltIcon/>
                    </IconButton>
                </li> 
                )}
            </ul> 
            : <p className="tw-text-3xl tw-font-bold">No tiene suficientes permisos</p>}
        </div>
    );
}