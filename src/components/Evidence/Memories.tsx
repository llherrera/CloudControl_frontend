import React, { useState, useEffect } from 'react';
import SaveAsIcon from '@mui/icons-material/SaveAs';

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkUpdateExecution } from "@/store/unit/thunks";

import { decode } from '@/utils';
import { PropsCallback } from '@/interfaces';

export const Memory = ({callback}: PropsCallback) => {
    const dispatch = useAppDispatch();
    const { token_info } = useAppSelector(store => store.auth);
    const { unit } = useAppSelector(store => store.unit);
    const { plan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);
    const [value, setValue] = useState(0);
    const [id, setId] = useState(0);
    const today = new Date();

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setId(decoded.id);
        }
    }, [token_info]);

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const newData = parseInt(value);
        setValue(newData);
    };

    const handleSave = () => dispatch(thunkUpdateExecution({date: today, value, code: unit.id_node, user_id: id, plan_id: id_plan}));

    if (plan === undefined) return <div>No hay un plan seleccionado</div>;
    const deadline = plan.deadline !== null ? plan.deadline.split('-').slice(1).reverse().join('/') : 'No hay fecha de corte';
    let temp = new Date(plan.deadline!);

    const year = today.getMonth() < temp.getMonth() ? today.getFullYear() :
        today.getDate() <= temp.getDate() + 1 && today.getMonth() < temp.getMonth() ? today.getFullYear() :
        today.getFullYear() + 1;
    temp = new Date(year, temp.getMonth(), temp.getDate() + 1);

    if (unit === undefined) return <div>No hay una meta seleccionada</div>;

    return (
        <section className="tw-bg-slate-200
                            tw-border-4 tw-border-double
                            tw-border-gray-500
                            tw-mt-3 tw-px-3">
            <p className="tw-mt-3">
                Fecha: { new Date().toLocaleDateString()} &nbsp;&nbsp;&nbsp;&nbsp;
                Hora: { new Date().toLocaleTimeString()} &nbsp;&nbsp;&nbsp;&nbsp;
                Fecha de Corte: { deadline } &nbsp;&nbsp;&nbsp;&nbsp;
                Fecha hoy : {today.toISOString()}
            </p>
            <div className="tw-flex tw-flex-col md:tw-flex-row">
                <p className="tw-font-bold tw-mt-4">
                    Lugar:
                </p>
                <input  className=" tw-py-4 tw-px-2 tw-mt-4
                                    tw-grow
                                    tw-border-4 tw-border-gray-400
                                    tw-rounded
                                    md:tw-ml-2"
                        type="text"
                        value={unit.indicator??""}
                        readOnly
                        name=""
                        id=""/>
            </div>
            <div className="tw-flex">
                <p className="  tw-font-bold tw-mt-4
                                tw-justify-self-start
                                tw-break-words">
                    Responsable del cargo:
                </p>
                <input  className=" tw-py-4 tw-px-2 tw-mt-4
                                    tw-grow
                                    tw-border-4 tw-border-gray-400
                                    tw-rounded
                                    md:tw-ml-2"
                        type="text"
                        value={unit.responsible??"Por asignar"}
                        readOnly
                        name=""
                        id="" />
            </div>
            <div className="tw-flex">
                <p className="  tw-font-bold tw-mt-4
                                tw-justify-self-start
                                tw-break-words">
                    Descripción:
                </p>
                <input  className=" tw-py-4 tw-px-2 tw-mt-4
                                    tw-grow
                                    tw-border-4 tw-border-gray-400
                                    tw-rounded
                                    md:tw-ml-2"
                        type="text"
                        value={unit.description??"Por asignar"}
                        readOnly
                        name=""
                        id=""/>
            </div>
            <ul className=" tw-flex tw-flex-row
                            tw-mt-3 tw-gap-2">
                <li className="tw-basis-1/5">
                    <p className="tw-text-center tw-bg-gray-400 tw-rounded">Año</p>
                    <p className="tw-text-center">Programado</p>
                    <p className="tw-text-center tw-font-bold tw-border-t tw-border-black">Ejecutado</p>
                </li>
                {unit.years.map((item, index) =>
                    <li className="tw-basis-1/5" key={item.year}>
                        <p className="tw-bg-gray-400 tw-text-center tw-rounded
                                        tw-text-blue-800 tw-font-bold">{item.year}</p>
                        <p className="tw-text-center">{item.physical_programming}</p>
                        <p className="tw-text-center tw-border-t tw-border-black">{item.physical_execution}</p>
                        {today >= (index === 0 ? new Date(item.year, 0, 1) : new Date(item.year, temp.getMonth(), temp.getDate() + 1) ) && today < new Date(item.year+ 1, temp.getMonth(), temp.getDate() + 1) ?
                        <div>
                            <input  type="number"
                                    className=" tw-bg-green-300 tw-border tw-border-black
                                                tw-px-2 tw-w-1/2"
                                    onChange={(e)=>handleChangeValue(e)}/>
                            <button type="button"
                                    onClick={handleSave}
                                    title="Guardar solo el valor ejecutado... Recuerde que esta ejecución sera aprobada por el responsable">
                                <SaveAsIcon/>
                            </button>
                        </div>
                        : null}
                    </li>
                    )}
            </ul>
            <div className="tw-flex tw-justify-center tw-my-4">
                <button className=" tw-bg-blue-500
                                    tw-p-4
                                    tw-rounded
                                    tw-text-white tw-font-bold"
                        onClick={callback}
                        type="button">
                    cargar evidencias de esta meta
                </button>
            </div>
        </section>
    );
}