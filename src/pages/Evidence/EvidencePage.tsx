import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/store";
import { resetEvidence, setEvidence } from "@/store/evidence/evidenceSlice";

import { BackBtn, EvidenceForm, Memory } from "@/components";

export const EvidencePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { rootTree } = useAppSelector(store => store.plan);
    const { unit } = useAppSelector(store => store.unit);
    const { id_plan } = useAppSelector(store => store.content);
    
    const [cargar, setCargar] = useState(false);

    const handleBack = () => {
        dispatch(setEvidence(undefined));
        dispatch(resetEvidence());
        navigate(-1);
    };

    const handleSubmitButton = () => setCargar(!cargar);

    const Memorias = () => {
        if (unit === undefined)
            return <div className="tw-text-center">
                No hay una meta seleccionada
            </div>;
        return(
            <div className="tw-mx-3 tw-mt-2">
                <header className=" tw-flex tw-border-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
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
                                <p className="tw-font-bold">Código de la meta</p>
                            </th>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500 ">
                                <p className="tw-font-bold">{ unit.code }</p>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                <p className="tw-font-bold">Descripción de la meta</p>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500 ">
                                <p className="tw-font-bold">{ unit.description }</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rootTree.map((name, index) => (
                            <tr key={name[1]}>
                                <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                    <p className="tw-font-bold">{ name[1] }</p>
                                </td>
                                <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                    <p className="tw-font-bold">{ name[0] }</p>
                                </td>
                                <td className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                    <p className="tw-font-bold">{ index === 0 ? 'Linea base' : index === 1 ? 'Meta' : null }</p>
                                </td>
                                <td className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                    <p className="tw-font-bold">{ index === 0 ? unit.base : index === 1 ? unit.goal : null }</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Memory callback={handleSubmitButton}/>
            </div>
        );
    };

    const Evidencias = () => {
        if (unit === undefined) 
            return <div className="tw-text-center">
                No hay una meta seleccionada
                </div>;
        return(
            <div className="tw-mx-3 tw-mt-2">
                <header className=" tw-flex tw-border-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                    <BackBtn handle={handleSubmitButton} id={id_plan}/>
                    <h1 className=" tw-text-3xl tw-text-center
                                    tw-font-bold tw-text-blue-700
                                    tw-grow">
                        Evidencias de la meta
                    </h1>
                </header>
                <EvidenceForm />
            </div>
        );
    };

    return (
        cargar ? <Evidencias/> : <Memorias/>
    );
}
