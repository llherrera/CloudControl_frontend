import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { resetEvidence, setEvidence } from "@/store/evidence/evidenceSlice";

import { BackBtn, EvidenceForm } from "@/components";

export const EvidencePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { namesTree } = useAppSelector((state) => state.plan);
    const { unit } = useAppSelector((state) => state.unit);
    const { id_plan } = useAppSelector((state) => state.content);
    
    const [cargar, setCargar] = useState(false);

    const handleBack = () => {
        dispatch(setEvidence(undefined));
        dispatch(resetEvidence());
        navigate(-1)
    };

    const handleSubmitButton = () => setCargar(!cargar);

    const memorias = () => {
        if (unit === undefined) 
            return <div className="tw-text-center">
                No hay una meta seleccionada
                </div>;
        return(
            <div className="tw-mx-3 tw-mt-2">
                <header className=" tw-border-4 tw-border-double
                                    tw-border-gray-500 
                                    tw-flex tw-bg-slate-200">
                    <BackBtn handle={handleBack} id={id_plan}/>
                    <h1 className=" tw-text-3xl tw-text-center 
                                    tw-font-bold tw-text-blue-700
                                    tw-grow">
                        Memoria de avance del Plan
                    </h1>
                </header>
                <table className="  tw-mt-3 tw-w-full 
                                    tw-text-center
                                    tw-bg-slate-200">
                    <thead>
                        <tr>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Código de la meta</label>
                            </th>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500 ">
                                <label className="tw-font-bold">{ unit.code }</label>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Descripción de la meta</label>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500 ">
                                <label className="tw-font-bold">{ unit.description }</label>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {namesTree.map((name, index) => (
                            <tr key={index}>
                                <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ name[1] }</label>
                                </td>
                                <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ name[0] }</label>
                                </td>
                                <td className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ index === 0 ? 'Linea base': index === 1 ? 'Meta' : null }</label>
                                </td>
                                <td className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ index === 0 ? unit.base: index === 1 ? unit.goal : null }</label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <section className="tw-bg-slate-200
                                    tw-border-4 tw-border-double
                                    tw-border-gray-500
                                    tw-mt-3 tw-px-3">
                    <p className="tw-mt-3">
                        Fecha: { new Date().toLocaleDateString()} &nbsp;&nbsp;&nbsp;&nbsp;
                        Hora: { new Date().toLocaleTimeString()}
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
                                        tw-break-words ">
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
                    <div className="tw-flex tw-justify-center tw-my-4">
                        <button className=" tw-bg-blue-500
                                            tw-p-4
                                            tw-rounded
                                            tw-text-white tw-font-bold"
                                onClick={()=>handleSubmitButton()}
                                type="button">
                            cargar evidencias de esta meta
                        </button>
                    </div>
                </section>
            </div>
        );
    };

    const evidencias = () => {
        if (unit === undefined) 
            return <div className="tw-text-center">
                No hay una meta seleccionada
                </div>;
        return(
            <div className="tw-mx-3 tw-mt-2">
                <header className=" tw-flex tw-flex-col
                                    tw-border-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                    <h1 className=" tw-text-3xl tw-font-bold tw-text-center tw-text-blue-700">
                        Evidencias de la meta
                    </h1>
                    <button className="inline-block" 
                            onClick={()=>handleSubmitButton()}
                            type="button">
                        return
                    </button>
                </header>
                <EvidenceForm />
            </div>
        );
    };

    return (
        cargar ? evidencias() : memorias()
    );
}
