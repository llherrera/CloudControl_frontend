import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkGetPDTByUuid, thunkUpdateYears } from "@/store/plan/thunks";
import { thunkGetEvidence } from '@/store/evidence/thunks';
import { thunkGetUnit } from "@/store/unit/thunks";
import { setIdPlan } from "@/store/content/contentSlice";

import { Header, UnitFrame, HvBtn, ShowEvidence } from "@/components";
import { validateUUID, notify, getYears } from "@/utils";

import { Box, CircularProgress } from '@mui/material';

export const SearchPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { plan, loadingPlan } = useAppSelector(store => store.plan);
    const [find, setFind] = useState(false);

    if (uuid == undefined) return <Header><div>No se ha enviado un id</div></Header>;

    if (!validateUUID(uuid)) return <Header><div>El id enviado no es válido</div></Header>;

    useEffect(() => {
        dispatch(thunkGetPDTByUuid(uuid))
        .then(() => setFind(true))
        .catch(() => setFind(false));
    }, []);

    useEffect(() => {
        if (!find) return;
        if (plan == undefined) {
            notify('No se ha encontrado un Plan de Desarrollo en esta localidad');
            navigate(`/`);
        } else {
            dispatch(setIdPlan(plan!.id_plan!));
            navigate(`/lobby`);
        }
    }, [find]);

    if (loadingPlan) return <Header>
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
            <div className="tw-animate-pulse tw-mx-auto">Cargando...</div>
        </Box>
    </Header>;

    if (plan == undefined) return <Header><div>No se ha encontrado un plan de desarrollo</div></Header>;

    return (<Header><div>redirigiendo</div></Header>);
}

export const SearchUnitPage = () => {
    const { uuid } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    const { unit, loadingUnit } = useAppSelector(store => store.unit);
    const { plan, years } = useAppSelector(store => store.plan);
    const { evidences } = useAppSelector(store => store.evidence);

    const [find, setFind] = useState(false);
    const [showEvidence, setShowEvidence] = useState(false);
    const [acum, setAcum] = useState(0);
    const [acumFinan, setAcumFinan] = useState(0);

    if (uuid == undefined) return <UnitFrame><div>No se ha enviado un id</div></UnitFrame>;

    if (!validateUUID(uuid)) return <UnitFrame><div>El id enviado no es válido</div></UnitFrame>;

    useEffect(() => {
        dispatch(thunkGetPDTByUuid(uuid))
        .then(() => setFind(true))
        .catch(() => setFind(false));
    }, []);

    
    if (plan == undefined) return <UnitFrame><div>No se ha encontrado un plan de desarrollo</div></UnitFrame>;
    
    useEffect(() => {
        if (code == null) return;
        let years = getYears(plan.start_date);
        dispatch(thunkUpdateYears(years));
        dispatch(thunkGetUnit({
            id_plan: plan.id_plan.toString(),
            id_node: code
        }));
    }, [plan]);

    useEffect(() => {
        if (!find) return;
        if (unit.code == '') {
            notify('No se ha encontrado la meta de producto');
            navigate(`/`);
        } else {
            //dispatch(setIdPlan(plan!.id_plan!));
            //navigate(`/lobby`);
        }
    }, [find]);

    useEffect(() => {
        if (unit === undefined || unit === null || unit.code == '') return;
        let acumProgramed = 0;
        let acumPhisical = 0;
        let acumFinalcial = 0;
        for (const element of unit.years) {
            acumProgramed += element.physical_programming;
            acumPhisical += element.physical_execution;
            acumFinalcial += parseInt(element.financial_execution.toString());
        }
        setAcum( acumPhisical/acumProgramed );
        setAcumFinan( acumFinalcial );
    }, [unit]);

    if (loadingUnit) return <UnitFrame>
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
            <div className="tw-animate-pulse tw-mx-auto">Cargando...</div>
        </Box>
    </UnitFrame>;

    if (unit.code == '') return <UnitFrame><div>No se ha encontrado la meta de producto</div></UnitFrame>;

    const handleEvidence = () => {
        const id_ = plan.id_plan;
        dispatch(thunkGetEvidence({id_plan: id_, code: unit.code}))
        .unwrap()
        .then((res) => {
            if (res.length === 0)
                notify('No hay evidencias para esta meta');
            else
                setShowEvidence(true);
        })
    };

    const TernaryIndicatorShow = () => (
        (unit.hv_indicator === '' || 
        unit.hv_indicator === null || 
        unit.hv_indicator === undefined) ?
        null : <HvBtn link={unit.hv_indicator}/>
    );

    const UnidadForm = () => {
        if (unit === undefined || unit === null) return;
        return (
            <div className="tw-border tw-border-slate-500 
                            tw-bg-white tw-mx-2 md:tw-mx-10">
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold">
                        Codigo: {unit.code}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold tw-text-justify">
                        Descripcion: {unit.description}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold">
                        Línea base: {unit.base}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold">
                        Meta: {unit.goal}
                    </p>
                </div>
                <div className="tw-px-1 tw-border-b tw-border-black">
                    <p className="tw-text-2xl tw-font-bold tw-text-justify">
                        Indicador: {unit.indicator}
                    </p>
                </div>
                <div className="tw-px-1">
                    <div className="tw-text-2xl tw-font-bold tw-text-justify">
                        Hoja de Vida Indicador:
                        <TernaryIndicatorShow/>
                    </div>
                </div>
            </div>
        );
    };

    const YearsForm = () => {
        if (unit === undefined || unit === null) return;
        return(
            <div className="tw-border tw-border-slate-500
                            tw-rounded tw-bg-white
                            tw-px-2 tw-mt-3 tw-mx-2 md:tw-mx-10">
                <div className="tw-flex tw-flex-wrap tw-justify-center">
                {unit.years.map((item, index) => (
                        <div key={index}
                            className="tw-my-2">
                            <p className="  tw-mx-2 
                                            tw-border-x tw-border-t tw-border-black 
                                            tw-text-xl tw-text-center
                                            tw-bg-yellow-300
                                            tw-rounded-t">
                                {years[index]}
                            </p>
                            <div className="tw-flex tw-justify-between 
                                            tw-mx-2 
                                            tw-bg-gray-200
                                            tw-border tw-border-black">
                                <div className="tw-flex tw-flex-col tw-justify-center 
                                                tw-border-r tw-border-black
                                                tw-px-2
                                                tw-relative
                                                md:tw-block">
                                    <p className="  tw-text-center">
                                        Programación
                                    </p>
                                    <p className="  tw-text-center
                                                    tw-border-t tw-border-black
                                                    tw-mx-2
                                                    tw-absolute
                                                    tw-bottom-0 tw-inset-x-0">
                                        {item.physical_programming}
                                    </p>
                                </div>
                                <div className="tw-flex tw-flex-col tw-justify-center 
                                                tw-border-r tw-border-black
                                                tw-px-2">
                                    <p className="  tw-text-center ">
                                        Ejecución física
                                    </p>
                                    <p className="  tw-text-center
                                                    tw-border-t tw-border-black">
                                        {item.physical_execution}
                                    </p>
                                </div>
                                <div className="tw-flex tw-flex-col tw-justify-center
                                                tw-px-2">
                                    <p className="tw-text-center">
                                        Ejecución financiera
                                    </p>
                                    <p className="  tw-text-center
                                                    tw-border-t tw-border-black">
                                        ${item.financial_execution.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                    </p>
                                </div>
                            </div>
                        </div>
                ))}
                <div className="tw-my-2">
                    <p className="  tw-mx-2
                                    tw-border-x tw-border-t tw-border-black
                                    tw-text-xl tw-text-center
                                    tw-bg-yellow-300
                                    tw-rounded-t">
                        Total
                    </p>
                    <div className="tw-flex tw-justify-between
                                    tw-mx-2
                                    tw-bg-gray-200
                                    tw-border tw-border-black">
                        <div className="tw-flex tw-flex-col tw-justify-center
                                        tw-border-r tw-border-black
                                        tw-px-2">
                            <p className="tw-text-center">
                                Ejecución física
                            </p>
                            <p className="  tw-text-center
                                            tw-border-t tw-border-black">
                                {isNaN(acum) ? 0 : parseFloat((acum*100).toFixed(2))}%
                            </p>
                        </div>
                        <div className="tw-flex tw-flex-col tw-justify-center
                                        tw-px-2">
                            <p className="tw-text-center">
                                Ejecución financiera
                            </p>
                            <p className="  tw-text-center
                                            tw-border-t tw-border-black">
                                ${acumFinan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                            </p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    };

    const Ternary = () => (
        evidences.length > 0 ?
        <div className="tw-mb-4">
            <p className="tw-text-2xl tw-font-bold tw-flex tw-justify-center">Evidencias</p>
            <table>
                <thead>
                    <tr>
                        <th className={`tw-bg-black tw-border`}>
                            <p className="tw-text-white">Fecha de seguimiento</p>
                        </th>
                        <th className={`tw-bg-black tw-border 
                                        tw-hidden lg:tw-table-cell`}>
                            <p className="tw-text-white">Descripción</p>
                        </th>
                        <th className={`tw-bg-black tw-border 
                                        tw-hidden lg:tw-table-cell`}>
                            <p className="tw-text-white">Comuna o Corregimiento</p>
                        </th>
                        <th className={`tw-bg-black tw-border 
                                        tw-hidden md:tw-table-cell`}>
                            <p className="tw-text-white">Barrio o Vereda</p>
                        </th>
                        <th className={`tw-bg-black tw-border 
                                        tw-hidden md:tw-table-cell`}>
                            <p className="tw-text-white">Unidad</p>
                        </th>
                        <th className={`tw-bg-black tw-border 
                                        tw-hidden md:tw-table-cell`}>
                            <p className="tw-text-white">Cantidad</p>
                        </th>
                        <th className={`tw-bg-black tw-border `}>
                            <p className="tw-text-white">Grupo poblacional</p>
                        </th>
                        <th className={`tw-bg-black tw-border`}>
                            <p className="tw-text-white">Población beneficiada</p>
                        </th>
                        <th className={`tw-bg-black tw-border 
                                        tw-hidden md:tw-table-cell`}>
                            <p className="tw-text-white">Fecha archivo</p>
                        </th>
                        <th className={`tw-bg-black tw-border`}>
                            <p className="tw-text-white">Enlace</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {evidences.map((evi, index) => (
                        <ShowEvidence evi={evi} index={index} key={evi.id_evidence}/>
                    ))}
                </tbody>
            </table>
        </div> : <p className="tw-text-2xl tw-font-bold tw-flex tw-justify-center">
            No hay evidencias cargadas
        </p>
    );

    return <UnitFrame>
        {/*<ol className="tw-flex tw-justify-center tw-flex-wrap">
            {rootTree.map((name) => (
                <li className="tw-flex tw-mx-3" key={name[0]}>
                    <p className="tw-text-green-600 tw-text-xl tw-font-bold">{name[1]}:</p> 
                    <p className="tw-ml-1 tw-text-xl tw-font-bold">{name[0]}</p>
                </li>
            ))}
        </ol>*/}
        <div className="tw-flex tw-justify-center">
            <UnidadForm/>
        </div>
        <div className="tw-flex tw-justify-center">
            <YearsForm/>
        </div>

        <div className="tw-flex tw-justify-center">
            <button type="button"
                    className=" tw-bg-blue-500 
                                hover:tw-bg-blue-300 hover:tw-text-black
                                tw-text-white tw-font-bold 
                                tw-py-2 tw-px-4 tw-my-5
                                tw-rounded"
                    onClick={handleEvidence}>
                Mostrar <br /> evidencias
            </button>
        </div>
        {showEvidence ? <Ternary/> : null}
    </UnitFrame>;
}