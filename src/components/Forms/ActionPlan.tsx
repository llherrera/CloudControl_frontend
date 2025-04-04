import { Fragment, useEffect, useState } from "react";
import { Box, CircularProgress, List, ListItem, Tooltip, Button, Zoom } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { InputLabel, InputTable, CloseBtn } from "@/components";

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkAddActionPlan, thunkAddActivityActionPlan, thunkUpdateActionPlan, thunkUpdateActivityActionPlan } from '@/store/plan/thunks';

import { NodeInterface, UnitNodeInterface, ActionPlan, Activity, Rubro, levelsPlan } from "@/interfaces";
import { getLevelNodes, getListNodes } from '@/services/api';
import { notify } from "@/utils";

export const ShowPlanOrForm = ({showPlan} :{showPlan?: ActionPlan}) => showPlan ? <ShowInfoPlan showPlan={showPlan} add={true}/> : <PlanForm/>;

const ShowInfoPlan = ({showPlan, add} :{showPlan: ActionPlan, add: boolean}) => {
    const { plan, levels } = useAppSelector(store => store.plan);

    return(
        <div className="tw-flex tw-flex-col
                        tw-mt-3 tw-p-3
                        tw-border-4 tw-border-double
                        tw-border-gray-500 tw-bg-slate-200">
            <header className="tw-text-center">
                <h1 className="tw-font-bold">Ficha plan de Acción</h1>
                <h1 className="tw-font-bold">{plan!.municipality}</h1>
                <h1 className="tw-font-bold">Ficha de programación y seguimiento</h1>
            </header>
            <div className={`tw-py-2 tw-grid tw-grid-cols-2
                            tw-border-y-4 tw-border-double tw-border-gray-500`}>
                <div className={`tw-my-2 tw-justify-self-end`}>
                    <label className="tw-col-start-1 tw-justify-self-end tw-self-center">
                        Código Plan de Acción:
                    </label>
                    <p className={` tw-col-start-2
                                    tw-w-48 tw-p-2 tw-rounded
                                    tw-border-2
                                    tw-border-gray-400
                                    tw-bg-white`}>
                        {showPlan.planCode}
                    </p>
                </div>
                <div className="tw-ml-4 tw-my-2">
                    <label
                        htmlFor="selectSecre"
                        className="tw-col-start-1 tw-justify-self-end tw-self-center">
                        Secretaría:
                    </label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <p className={` tw-col-start-2
                                    tw-w-48 tw-p-2 tw-rounded
                                    tw-border-2
                                    tw-border-gray-400
                                    tw-bg-white`}>
                        {showPlan.office}
                    </p>
                </div>
            </div>
            <div className="tw-my-4">
                <div className="tw-mb-3 tw-grid tw-grid-cols-2 tw-gap-3">
                    <div className="tw-col-start-1 tw-justify-self-end">
                        <label
                            htmlFor="progDate">
                            Programación:
                        </label>&nbsp;&nbsp;&nbsp;&nbsp;
                        <input
                            readOnly
                            type="date"
                            name="programedDate"
                            id="progDate"
                            value={showPlan.programedDate === null ? undefined : (new Date(showPlan.programedDate)).toISOString().split('T')[0]}
                            className={`tw-p-2 tw-rounded
                                        tw-border-2 tw-border-gray-400
                                        tw-bg-white`} />
                    </div>
                    <div className="tw-col-start-2">
                        <label
                            htmlFor="follDate">
                            Seguimiento:
                        </label>&nbsp;&nbsp;&nbsp;&nbsp;
                        <input
                            readOnly
                            type="date"
                            name="followDate"
                            id="follDate"
                            value={showPlan.followDate === null ? undefined : (new Date(showPlan.followDate)).toISOString().split('T')[0]}
                            className={`tw-p-2 tw-rounded
                                        tw-border-2 tw-border-gray-400
                                        tw-bg-white`} />
                    </div>
                </div>
                <div className='tw-flex tw-m-auto tw-gap-2
                                tw-justify-center tw-items-center'>
                    <div className='tw-grid tw-grid-cols-2 tw-gap-4 tw-items-center'>
                        <label className='tw-text-right'>{levels[0].name}</label>
                        <p className="tw-p-2 tw-mr-3 tw-w-24 tw-rounded tw-col-span-1 tw-border-2 tw-border-gray-400 tw-bg-white">
                            {showPlan.level_1}
                        </p>
                    </div>
                    <div className='tw-grid tw-grid-cols-2 tw-gap-4 tw-items-center'>
                        <label className='tw-text-right'>{levels[1].name}</label>
                        <p className="tw-p-2 tw-mr-3 tw-w-24 tw-rounded tw-col-span-1 tw-border-2 tw-border-gray-400 tw-bg-white">
                            {showPlan.level_2}
                        </p>
                    </div>
                    <div className='tw-grid tw-grid-cols-2 tw-gap-4 tw-items-center'>
                        <label className='tw-text-right'>{levels[2].name}</label>
                        <p className="tw-p-2 tw-mr-3 tw-w-24 tw-rounded tw-col-span-1 tw-border-2 tw-border-gray-400 tw-bg-white">
                            {showPlan.level_3}
                        </p>
                    </div>
                </div>
            </div>
            <div className="tw-pt-2 tw-border-t-4
                            tw-border-double tw-border-gray-500">
                <div className={`tw-my-2 tw-grid tw-grid-cols-4 tw-gap-3`}>
                    <label className="tw-col-start-1 tw-justify-self-end tw-self-center">
                        Nombre del proyecto POAI:
                    </label>
                    <p className={` tw-col-span-2
                                    tw-p-2 tw-rounded
                                    tw-border-2
                                    tw-border-gray-400
                                    tw-bg-white`}>
                        {showPlan.POAINameProject}
                    </p>
                </div>
                <div className={`tw-my-2 tw-grid tw-grid-cols-4 tw-gap-3`}>
                    <label className="tw-col-start-1 tw-justify-self-end tw-self-center">
                        Código BPIM:
                    </label>
                    <p className={` tw-col-span-2
                                    tw-p-2 tw-rounded
                                    tw-border-2
                                    tw-border-gray-400
                                    tw-bg-white`}>
                        {showPlan.BPIMCode}
                    </p>
                </div>
                <div className={`tw-my-2 tw-grid tw-grid-cols-4 tw-gap-3`}>
                    <label className="tw-col-start-1 tw-justify-self-end tw-self-center">
                        Objetivos:
                    </label>
                    <p className={` tw-col-span-2
                                    tw-p-2 tw-rounded
                                    tw-border-2
                                    tw-border-gray-400
                                    tw-bg-white`}>
                        {showPlan.Objetives}
                    </p>
                </div>
            </div>
            <div className="tw-mb-4 tw-border-t-4 tw-border-double tw-border-gray-500">
                <ul className="tw-mb-2">
                {showPlan.rubros.map((r, i) =>
                    <li key={i} className="tw-pt-2 tw-grid tw-grid-cols-4 tw-gap-3">
                        <div className={`tw-grid tw-gap-3 tw-justify-self-end
                                        tw-col-start-1 tw-col-span-2`}>
                            <label className="tw-col-start-1 tw-justify-self-end tw-self-center">
                                Código Presupuestal:
                            </label>
                            <p className={` tw-col-start-2
                                            tw-p-2 tw-rounded
                                            tw-border-2
                                            tw-border-gray-400
                                            tw-bg-white`}>
                                {r.presupuestalCode}
                            </p>
                        </div>
                        <div className={`tw-grid tw-gap-3 tw-justify-self-start
                                        tw-col-start-3 tw-col-span-2`}>
                            <label className="tw-col-start-1 tw-justify-self-end tw-self-center">
                                Rubro:
                            </label>
                            <p className={`tw-col-start-2
                                            tw-w-48 tw-p-2 tw-rounded
                                            tw-border-2
                                            tw-border-gray-400
                                            tw-bg-white`}>
                                {r.rubro}
                            </p>
                        </div>
                    </li>
                )}
                </ul>
            </div>
            {add ? <ShowActivity actions={showPlan.actions}/> : null}
        </div>
    );
}

const ShowActivity = ({actions}: {actions: Activity[]}) => {
    return(
        <table className="  tw-table-auto
                            tw-border-collapse
                            tw-w-full tw-text-sm">
            <thead>
                <tr>
                    <th rowSpan={2}
                        className=" tw-border-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Principales Actividades
                    </th>
                    <th rowSpan={2}
                        className=" tw-border-r-4 tw-border-y-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Prog/Ejec
                    </th>
                    <th rowSpan={2}
                        className=" tw-border-r-4 tw-border-y-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Unidad de Medida
                    </th>
                    <th rowSpan={2}
                        className=" tw-border-r-4 tw-border-y-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Cantidad
                    </th>
                    <th rowSpan={2}
                        className=" tw-border-r-4 tw-border-y-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Costo Total (Miles)
                    </th>
                    <th colSpan={4}
                        className=" tw-border-r-4 tw-border-y-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Fuentes Financiación
                    </th>
                    <th colSpan={2}
                        className=" tw-border-r-4 tw-border-y-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Programación (dd/mm/aa)
                    </th>
                    <th colSpan={3}
                        className=" tw-border-y-4 tw-border-r-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        Indicadores
                    </th>
                </tr>
                <tr>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        MPIO
                    </th>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        SGP
                    </th>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        REGALÍAS
                    </th>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        OTROS
                    </th>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        INICIO
                    </th>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        TERMINA
                    </th>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        FÍSICO
                    </th>
                    <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        INVERSIÓN
                    </th>
                    <th className=" tw-border-b-4 tw-border-r-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                        EFICIENCIA
                    </th>
                </tr>
            </thead>
            <tbody className="tw-bg-white tw-border-b-4 tw-border-double
                        tw-border-gray-500 ">
                {actions.map((a, i) =>
                <Fragment key={i}>
                    <tr>
                        <td rowSpan={2}
                            className="tw-border-x-4 tw-border-double tw-border-gray-500">
                            <textarea
                                readOnly
                                value={a.activityDesc}
                                name={`activityDesc_${i + 1}`}
                                id="activityDesc"
                                className={`tw-border-2 tw-rounded tw-border-gray-400`}>
                            </textarea>
                        </td>
                        <td className=" tw-border-double tw-border-gray-500
                                        tw-font-bold tw-text-center">
                            P
                        </td>
                        <td rowSpan={2}
                            className="tw-border-x-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.unitMeter}
                            </p>
                        </td>
                        <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.amountP}
                            </p>
                        </td>
                        <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={` tw-w-full tw-rounded
                                            tw-border-2 tw-my-2 tw-text-center
                                            tw-border-gray-400
                                        `}>
                                {a.totalCostP}
                            </p>
                        </td>
                        <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.municipioP}
                            </p>
                        </td>
                        <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.sgpP}
                            </p>
                        </td>
                        <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.regaliasP}
                            </p>
                        </td>
                        <td className="tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.otrosP}
                            </p>
                        </td>
                        <td rowSpan={2}
                            className="tw-border-x-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.start_date?.toString().split('T')[0]}
                            </p>
                        </td>
                        <td rowSpan={2}
                            className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.end_date!.toString().split('T')[0]}
                            </p>
                        </td>
                        <td rowSpan={2}
                            className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.phisicalIndicator}
                            </p>
                        </td>
                        <td rowSpan={2}
                            className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.invertionIndicator}
                            </p>
                        </td>
                        <td rowSpan={2}
                            className="tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.efficiencyIndicator}
                            </p>
                        </td>
                    </tr>
                    <tr className="tw-border-b-8 tw-border-double tw-border-gray-500">
                        <td className=" tw-border-t-4 tw-border-double tw-border-gray-500
                                        tw-font-bold tw-text-center">
                            E
                        </td>
                        <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.amountE}
                            </p>
                        </td>
                        <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={` tw-w-full tw-rounded
                                            tw-border-2 tw-my-2 tw-text-center
                                            tw-border-gray-400
                                        `}>
                                {a.totalCostE}
                            </p>
                        </td>
                        <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.municipioE}
                            </p>
                        </td>
                        <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.sgpE}
                            </p>
                        </td>
                        <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.regaliasE}
                            </p>
                        </td>
                        <td className="tw-border-t-4 tw-border-double tw-border-gray-500">
                            <p className={`tw-w-full tw-rounded tw-border-2 tw-my-2 tw-border-gray-400 `}>
                                {a.otrosE}
                            </p>
                        </td>
                    </tr>
                </Fragment>
                )}
            </tbody>
        </table>
    );
}

const PlanForm = ({showPlan} :{showPlan?: ActionPlan}) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const { plan, years, levels, secretaries, loadingActionPlan } = useAppSelector(store => store.plan);
    const [actionPlan, setActionPlan] = useState<ActionPlan>(
        showPlan ?? {
        id_actionPlan: 0,
        id_plan: id_plan,
        planCode: '',
        office: '',
        programedDate: null,
        followDate: null,
        POAINameProject: '',
        BPIMCode: '',
        Objetives: '',
        level1: '',
        level2: '',
        level3: '',
        level_1: '',
        level_2: '',
        level_3: '',
        actions: [],
        rubros: [],
        nodes: [],
        nodesResult: [],
        year: 0
    });
    const [rubros, setRubros] = useState<Rubro[]>(
        showPlan ? showPlan.rubros :
        [
            {
                id_actionPlan: 0,
                presupuestalCode: '',
                rubro: '',
            }
        ]
    );
    const [rubro, setRubro] = useState<Rubro>({
        id_actionPlan: 0,
        presupuestalCode: '',
        rubro: '',
    });

    const todayDate = new Date();
    const yearSelect = plan ? new Date(plan.deadline == null ? `${years[0]-1}-02-1` : plan.deadline).getFullYear() : new Date().getFullYear();
    const deadline = yearSelect >= years[0] ? yearSelect : 'No hay fecha de corte';
    const [yearRegister, setYearRegister] = useState(todayDate.getUTCFullYear());

    const [send, setSend] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex_] = useState<number[]>(levels.map(() => 0));

    useEffect(() => {
        const fetch = async () => {
            if (levels.length === 0) return;
            let parent: (string | null) = null;
            let response = [] as NodeInterface[][];
            for (let i = 0; i < levels.length; i++) {
                const { id_level } = levels[i];
                if (id_level) {
                    const res: NodeInterface[] = await getLevelNodes({ id_level: id_level, parent: parent });
                    parent = res[index_[i]].id_node;
                    response.push(res);
                }
            }
            response[levels.length - 1].splice(0, 0, {
                id_node: '',
                code: '',
                name: '',
                description: '',
                parent: null,
                id_level: 0,
                weight: 0,
            });
            setPrograms(response);
        }
        fetch();
    }, [index_]);

    useEffect(() => {
        if (send) handleSubmit2();
    }, [send]);

    const addRubro = () => {
        const newData = [...rubros, rubro];
        setRubros(newData);
        setRubro({ id_actionPlan: 0, presupuestalCode: '', rubro: '' });
    };

    const deleteRubro = () => {
        if (rubros.length > 0) {
            const newData = rubros.slice(0, rubros.length - 1);
            setRubros(newData);
        }
    };

    const handleInputFormChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...rubros];
        const nameO = name.split('_')[0];
        newData[index] = { ...newData[index], [nameO]: value };
        setRubros(newData);
    };

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
        let newIndex_ = [...index_];
        if (newIndex === 0) {
            newIndex_[index] = newIndex;
        } else {
            newIndex_[index] = newIndex;
            for (let i = index + 1; i < newIndex_.length; i++) {
                newIndex_[i] = 0;
            }
        }
        setIndex_(newIndex_);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement |
                                        HTMLSelectElement |
                                        HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;
        let newData = actionPlan;
        let newDate = new Date('2025-01-02');
        if (type === 'date') {
            const [, month, day] = value.split("-");
            newDate = new Date(`${yearRegister}-${month}-${parseInt(day)+1}`);
            newData = { ...newData, [name]: newDate };
        } else {
            newData = { ...newData, [name]: value };
        }
        setActionPlan(newData);
    };

    const validateFields = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!actionPlan.planCode.trim()) newErrors.planCode = 'El código del plan es obligatorio.';
        if (!actionPlan.office.trim()) newErrors.office = 'La oficina es obligatoria.';
        if (!actionPlan.POAINameProject.trim()) newErrors.POAINameProject = 'El nombre del proyecto POAI es obligatorio.';
        if (!actionPlan.programedDate) newErrors.programedDate = 'La fecha de programación es obligatoria.';
        if (!actionPlan.followDate) newErrors.followDate = 'La fecha de seguimiento es obligatoria.';
        if (!actionPlan.BPIMCode.trim()) newErrors.BPIMCode = 'El código BPIM es obligatorio.';
        if (!actionPlan.Objetives.trim()) newErrors.Objetives = 'Los objetivos son obligatorios.';
        for (let i = 0; i < rubros.length; i++) {
            if (!rubros[i].presupuestalCode.trim()) newErrors[`presupuestalCode_${i + 1}`] = `El código presupuestal es obligatorio`;
            if (!rubros[i].rubro.trim()) newErrors[`rubro_${i + 1}`] = `El rubro es obligatorio`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedActionPlan = { ...actionPlan };
        for (let i = 0; i < 3; i++) {
            const str = `level${i + 1}` as keyof levelsPlan;
            updatedActionPlan[str] = programs[i][index_[i]].id_node;
        }
        updatedActionPlan['year'] = yearRegister;
        setActionPlan(updatedActionPlan);
        setSend(true);
    };

    const handleSubmit2 = async () => {
        let errorJoin = '';
        if (!validateFields()) {
            for (const key in errors) errorJoin += '\n' + errors[key];
            notify('Errores de validación de ficha: ' + errorJoin, 'error');
        } else {
            showPlan ?
            dispatch(thunkUpdateActionPlan({ id_plan, plan: actionPlan, rubros })) :
            dispatch(thunkAddActionPlan({ id_plan, plan: actionPlan, rubros }));
        }
        setSend(false);
    };

    return(
        <form   onSubmit={handleSubmit}
                className=" tw-flex tw-flex-col
                            tw-mt-3 tw-p-3
                            tw-border-4 tw-border-double
                            tw-border-gray-500 tw-bg-slate-200">
            <header className="tw-text-center">
                <h1 className="tw-font-bold">Ficha plan de Acción</h1>
                <h1 className="tw-font-bold">{plan!.municipality}</h1>
                <h1 className="tw-font-bold">Ficha de programación y seguimiento</h1>
            </header>
            <div className="tw-my-2">
                {typeof deadline == 'number' ? years[0] === deadline ? null :
                    <button className={`${yearRegister === todayDate.getUTCFullYear()- 1 ?
                                        'tw-bg-green-400' : 'tw-bg-red-400'}
                                        tw-rounded tw-p-2 tw-mr-3 tw-mt-3
                                        tw-font-bold tw-text-white
                                        tw-border tw-border-black`}
                            onClick={() => setYearRegister(todayDate.getUTCFullYear() - 1)}
                            type="button">
                        Adicionar plan {deadline - 1}
                    </button>
                : null}
                <button className={`${yearRegister === todayDate.getUTCFullYear() ?
                                    'tw-bg-green-400' : 'tw-bg-red-400'}
                                    tw-rounded tw-p-2
                                    tw-font-bold tw-text-white
                                    tw-border tw-border-black`}
                        onClick={() => setYearRegister(todayDate.getUTCFullYear())}
                        type="button">
                    Adicionar plan {deadline}
                </button>
            </div>
            <div className={`tw-py-2 tw-grid tw-grid-cols-2
                            tw-border-y-4 tw-border-double tw-border-gray-500`}>
                <InputLabel
                    name="planCode"
                    label="Código Plan de Acción"
                    id="codePlan"
                    value={actionPlan.planCode}
                    onChange={e => handleInputChange(e)}
                    errors={errors}
                    className="tw-justify-self-end"
                />
                <div className="tw-ml-4 tw-my-2">
                    <label
                        htmlFor="selectSecre"
                        className="tw-col-start-1 tw-justify-self-end tw-self-center">
                        Secretaría:
                    </label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <select
                        onChange={e => handleInputChange(e)}
                        value={actionPlan.office}
                        name="office"
                        id="selectSecre"
                        className={`tw-col-start-2
                                    tw-w-48 tw-p-2 tw-rounded
                                    tw-border-2
                                    ${errors.office ? 'tw-border-red-400' : 'tw-border-gray-400'}
                                    tw-bg-white`}>
                        <option value=""></option>
                        {secretaries!.map((s, i) => <option key={i} value={s.name}>
                            {s.name}
                        </option>)}
                    </select>
                </div>
            </div>
            <div className="tw-my-4">
                <div className="tw-mb-3 tw-grid tw-grid-cols-2 tw-gap-3">
                    <div className="tw-col-start-1 tw-justify-self-end">
                        <label
                            htmlFor="progDate">
                            Programación:
                        </label>&nbsp;&nbsp;&nbsp;&nbsp;
                        <input
                            onChange={e => handleInputChange(e)}
                            type="date"
                            name="programedDate"
                            id="progDate"
                            value={actionPlan.programedDate === null ? undefined : (new Date(actionPlan.programedDate)).toISOString().split('T')[0]}
                            className={`tw-p-2 tw-rounded
                                        tw-border-2
                                        ${errors.programedDate === null ? 'tw-border-red-400' : 'tw-border-gray-400'}
                                        tw-bg-white`} />
                    </div>
                    <div className="tw-col-start-2">
                        <label
                            htmlFor="follDate">
                            Seguimiento:
                        </label>&nbsp;&nbsp;&nbsp;&nbsp;
                        <input
                            onChange={e => handleInputChange(e)}
                            type="date"
                            name="followDate"
                            id="follDate"
                            value={actionPlan.followDate === null ? undefined : (new Date(actionPlan.followDate)).toISOString().split('T')[0]}
                            className={`tw-p-2 tw-rounded
                                        tw-border-2
                                        ${errors.followDate === null ? 'tw-border-red-400' : 'tw-border-gray-400'}
                                        tw-bg-white`} />
                    </div>
                </div>
                <div className='tw-flex tw-m-auto tw-gap-2
                                tw-justify-center tw-items-center'>
                    {programs.slice(0, 3).map((program, index) =>
                        <div key={index}
                            className='tw-grid tw-grid-cols-2 tw-gap-4 tw-items-center'>
                            <label className='tw-text-right'>{levels[index].name}</label>
                            <select onChange={e => handleChangePrograms(index, e)}
                                className=' tw-p-2 tw-mr-3 tw-w-24
                                            tw-rounded tw-col-span-1
                                            tw-border-2 tw-border-gray-400'>
                                {program.map((node, index) => <option value={node.id_node} key={index}>{node.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            <div className="tw-pt-2 tw-border-t-4
                            tw-border-double tw-border-gray-500">
                <InputLabel
                    className="tw-grid tw-grid-cols-2 tw-gap-3"
                    name="POAINameProject"
                    id="POAIName"
                    label="Nombre del proyecto POAI"
                    value={actionPlan.POAINameProject}
                    onChange={e => handleInputChange(e)}
                    errors={errors} />
                <InputLabel
                    className="tw-grid tw-grid-cols-2 tw-gap-3"
                    name="BPIMCode"
                    id="BPIMCode"
                    label="Código BPIM"
                    value={actionPlan.BPIMCode}
                    onChange={e => handleInputChange(e)}
                    errors={errors} />
                <InputLabel
                    className="tw-grid tw-grid-cols-2 tw-gap-3"
                    name="Objetives"
                    id="objetives"
                    label="Objetivos"
                    value={actionPlan.Objetives}
                    onChange={e => handleInputChange(e)}
                    errors={errors} />
            </div>
            <div className="tw-mb-4 tw-border-y-4 tw-border-double tw-border-gray-500">
                <ul>
                {rubros.map((r, i) =>
                    <li key={i} className="tw-pt-2 tw-grid tw-grid-cols-4 tw-gap-3">
                        <InputLabel
                            className=" tw-grid tw-gap-3 tw-justify-self-end
                                        tw-col-start-1 tw-col-span-2"
                            name={`presupuestalCode_${i + 1}`}
                            id="codePres"
                            label="Código Presupuestal"
                            value={r.presupuestalCode}
                            onChange={e => handleInputFormChange(e, i)}
                            errors={errors} />
                        <InputLabel
                            className=" tw-grid tw-gap-3 tw-justify-self-start
                                        tw-col-start-3 tw-col-span-2"
                            name={`rubro_${i + 1}`}
                            id="rubro"
                            label="Rubro"
                            value={r.rubro}
                            onChange={e => handleInputFormChange(e, i)}
                            errors={errors} />
                    </li>
                )}
                </ul>
                <div className="tw-w-full tw-flex tw-justify-around tw-py-2 tw-border tw-rounded">
                    <button className=" tw-bg-green-500
                                        hover:tw-bg-green-300
                                        tw-text-white tw-font-bold
                                        tw-w-12 tw-p-2 tw-rounded"
                        type="button"
                        title="Agregar un nuevo nivel"
                        onClick={addRubro}>+</button>
                    <button className=" tw-bg-red-500
                                        hover:tw-bg-red-300
                                        tw-text-white tw-font-bold
                                        tw-w-12 tw-p-2 tw-rounded"
                        type="button"
                        title="Eliminar un nivel"
                        onClick={deleteRubro}>-</button>
                </div>
            </div>
            {showPlan ? null :
                <button type="submit"
                    className=' tw-bg-green-500 hover:tw-bg-green-300
                                tw-py-2 tw-rounded tw-text-white tw-font-bold'>
                    {loadingActionPlan ?
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                        : <p>Añadir registro</p>
                    }
                </button>
            }
        </form>
    );
}

export const ActivityForm = ({ showPlan, upd }: { showPlan: ActionPlan, upd: boolean }) => {
    const dispatch = useAppDispatch();

    const { loadingActivityActionPlan, selectedPlan } = useAppSelector(store => store.plan);

    const [listNodes, setListNodes] = useState<UnitNodeInterface[]>([]);
    const [selectNodes, setSelectNodes] = useState<UnitNodeInterface[]>([]);
    const [selectNodesFinan, setSelectNodesFinan] = useState<number[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [activity, setactivity] = useState<Activity>({
        id_activity: 0,
        id_actionPlan: 0,
        id_node: '',
        activityDesc: '',
        unitMeter: '',
        amountP: 0,
        totalCostP: 0,
        municipioP: 0,
        sgpP: 0,
        regaliasP: 0,
        otrosP: 0,
        amountE: 0,
        totalCostE: 0,
        municipioE: 0,
        sgpE: 0,
        regaliasE: 0,
        otrosE: 0,
        start_date: null,
        end_date: null,
        phisicalIndicator: 0,
        invertionIndicator: 0,
        efficiencyIndicator: 0
    });
    const [activities, setActivities] = useState<Activity[]>(
        selectedPlan && selectedPlan.actions && selectedPlan.actions.length > 0 ? selectedPlan.actions :
        [
            {
                id_activity: 0,
                id_actionPlan: 0,
                id_node: '',
                activityDesc: '',
                unitMeter: '',
                amountP: 0,
                totalCostP: 0,
                municipioP: 0,
                sgpP: 0,
                regaliasP: 0,
                otrosP: 0,
                amountE: 0,
                totalCostE: 0,
                municipioE: 0,
                sgpE: 0,
                regaliasE: 0,
                otrosE: 0,
                start_date: null,
                end_date: null,
                phisicalIndicator: 0,
                invertionIndicator: 0,
                efficiencyIndicator: 0
            }
        ]
    );

    useEffect(() => {
        getListNodes(showPlan.level3)
            .then((res: UnitNodeInterface[]) => {
                setListNodes(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (listNodes.length > 0) {
            setSelectNodes(listNodes.filter((l) => showPlan.nodes.map(n => n.id_node).includes(l.id_node)));
        }
    }, [listNodes]);

    const addActivity = () => {
        const newData = [...activities, activity];
        setActivities(newData);
        setactivity({
            id_activity: 0,
            id_actionPlan: 0,
            id_node: '',
            activityDesc: '',
            unitMeter: '',
            amountP: -1,
            totalCostP: -1,
            municipioP: -1,
            sgpP: -1,
            regaliasP: -1,
            otrosP: -1,
            amountE: -1,
            totalCostE: -1,
            municipioE: -1,
            sgpE: -1,
            regaliasE: -1,
            otrosE: -1,
            start_date: null,
            end_date: null,
            phisicalIndicator: -1,
            invertionIndicator: -1,
            efficiencyIndicator: -1
        });
    };

    const deleteActivity = () => {
        if (activities.length > 0) {
            const newData = activities.slice(0, activities.length - 1);
            setActivities(newData);
        }
    };

    const handleInputFormChange = ( event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
                                    index: number) => {
        const { name, value } = event.target;
        const newData = [...activities];
        const nameO = name.replace(/_\d+$/, '');
        newData[index] = { ...newData[index], [nameO]: value };

        const municipioP = parseFloat(newData[index].municipioP.toString()) > -1 ? parseFloat(newData[index].municipioP.toString()) : 0;
        const sgpP = parseFloat(newData[index].sgpP.toString()) > -1 ? parseFloat(newData[index].sgpP.toString()) : 0;
        const regaliasP = parseFloat(newData[index].regaliasP.toString()) > -1 ? parseFloat(newData[index].regaliasP.toString()) : 0;
        const otrosP = parseFloat(newData[index].otrosP.toString()) > -1 ? parseFloat(newData[index].otrosP.toString()) : 0;
        newData[index].totalCostP = municipioP + sgpP + regaliasP + otrosP;

        const municipioE = parseFloat(newData[index].municipioE.toString()) > -1 ? parseFloat(newData[index].municipioE.toString()) : 0;
        const sgpE = parseFloat(newData[index].sgpE.toString()) > -1 ? parseFloat(newData[index].sgpE.toString()) : 0;
        const regaliasE = parseFloat(newData[index].regaliasE.toString()) > -1 ? parseFloat(newData[index].regaliasE.toString()) : 0;
        const otrosE = parseFloat(newData[index].otrosE.toString()) > -1 ? parseFloat(newData[index].otrosE.toString()) : 0;
        newData[index].totalCostE = municipioE + sgpE + regaliasE + otrosE;

        const newErrors: { [key: string]: string } = {...errors};
        newErrors[name] = '';
        setErrors(newErrors);

        setActivities(newData);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = e.target.selectedIndex - 1;
        const temp = selectNodes.map(item => item.id_node);
        if (index < 0) return;
        if (!temp.includes(listNodes[index].id_node)) {
            setSelectNodes(prevItems => [...prevItems, listNodes[index]]);
            setSelectNodesFinan(prevItems => [...prevItems, 0]);
        }
        else notify('No puede relacionar la misma meta mas de una vez', 'warning');
    };

    const handleSelectChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = e.target.selectedIndex - 1;
        const temp = selectNodes.map(item => item.id_node);
        if (index < 0) return;
        if (!temp.includes(listNodes[index].id_node)) {
            setSelectNodes(prevItems => [...prevItems, listNodes[index]]);
            setSelectNodesFinan(prevItems => [...prevItems, 0]);
        }
    };

    const handleInputFinalcial = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value, name } = e.target;
        const temp = selectNodesFinan;
        temp[index] = parseFloat(value);

        const newErrors: { [key: string]: string } = {...errors};
        newErrors[name] = '';

        setErrors(newErrors);
        setSelectNodesFinan(temp);
    };

    const validateActionFields = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        let totalP = 0, totalE = 0, totalNodes = 0;
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            if (!activity.activityDesc.trim()) newErrors[`activityDesc_${i + 1}`] = 'La descripción de la actividad es obligatoria.';
            if (!activity.unitMeter.trim()) newErrors[`unitMeter_${i + 1}`] = 'La unidad de medida es obligatoria.';
            if (activity.amountP <= 0) newErrors[`amountP_${i + 1}`] = 'La cantidad programada debe ser mayor a 0.';
            if (activity.totalCostP <= 0) newErrors[`totalCostP_${i + 1}`] = 'El costo total programado debe ser mayor a 0.';
            if (activity.amountE < 0) newErrors[`amountE_${i + 1}`] = 'La cantidad ejecutada no puede ser negativa.';
            if (activity.totalCostE < 0) newErrors[`totalCostE_${i + 1}`] = 'El costo total ejecutado no puede ser negativo.';
            if (!activity.start_date) newErrors[`start_date_${i + 1}`] = 'La fecha de inicio es obligatoria.';
            if (!activity.end_date) newErrors[`end_date_${i + 1}`] = 'La fecha de finalización es obligatoria.';
            if (activity.start_date && activity.end_date && activity.start_date > activity.end_date)
                newErrors[`end_date_${i + 1}`] = 'La fecha de finalización debe ser posterior a la de inicio.';
            if (activity.phisicalIndicator < 0) newErrors[`phisicalIndicator_${i + 1}`] = 'El indicador físico es obligatorio.';
            if (activity.invertionIndicator < 0) newErrors[`invertionIndicator_${i + 1}`] = 'El indicador de inversión es obligatorio.';
            if (activity.efficiencyIndicator < 0) newErrors[`efficiencyIndicator_${i + 1}`] = 'El indicador de eficiencia es obligatorio.';
            totalP += activity.totalCostP;
            totalE += activity.totalCostE;
        }
        for (let i = 0; i < selectNodesFinan.length; i++) {
            if (selectNodesFinan[i] === 0) newErrors[`peso_${i + 1}`] = 'Este valor tiene que ser superior a 0';
            totalNodes += selectNodesFinan[i];
        }
        if (totalNodes < 0) newErrors['Total'] = 'El valor sumado de las metas tiene que ser mayor que 0';
        if (totalNodes > totalE) newErrors['Total'] = 'Los valores de las metas de producto no pueden superar a los valores de las actividades programadas';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const deleteItem = (index: number) => {
        setSelectNodes(items => items.filter((item, i) => i !== index));
        setSelectNodesFinan(items => items.filter((item, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let errorJoin = '';
        if (!validateActionFields()) {
            for (const key in errors) errorJoin += '\n' + errors[key];
            notify('Errores de validación de tareas: ', 'error');
            console.log(errors);
            console.log(errorJoin);
        } else {
            let temp = selectNodes.map(s => s.id_node)[0];
            dispatch(thunkAddActivityActionPlan(
                {
                    id_plan: showPlan.id_actionPlan,
                    activities,
                    node: temp
                }
            ));
        }
    };

    return (
        <>
        {upd ? <PlanForm showPlan={selectedPlan!}/> : <ShowInfoPlan showPlan={selectedPlan!} add={false}/> }
        <form   onSubmit={handleSubmit}
                className=" tw-flex tw-flex-col tw-mt-3
                            tw-border-4 tw-border-double
                            tw-border-gray-500 tw-bg-slate-200">
            <table className="  tw-table-auto
                                tw-border-collapse
                                tw-w-full tw-text-sm">
                <thead>
                    <tr>
                        <th rowSpan={2}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Meta de producto
                        </th>
                        <th rowSpan={2}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Principales Actividades
                        </th>
                        <th rowSpan={2}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Prog/Ejec
                        </th>
                        <th rowSpan={2}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Unidad de Medida
                        </th>
                        <th rowSpan={2}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Cantidad
                        </th>
                        <th rowSpan={2}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Costo Total (Miles)
                        </th>
                        <th colSpan={4}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Fuentes Financiación
                        </th>
                        <th colSpan={2}
                            className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Programación (dd/mm/aa)
                        </th>
                        <th colSpan={3}
                            className=" tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            Indicadores
                        </th>
                    </tr>
                    <tr>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            MPIO
                        </th>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            SGP
                        </th>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            REGALÍAS
                        </th>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            OTROS
                        </th>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            INICIO
                        </th>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            TERMINA
                        </th>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            FÍSICO
                        </th>
                        <th className=" tw-border-r-4 tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            INVERSIÓN
                        </th>
                        <th className=" tw-border-b-4 tw-border-double
                                        tw-border-gray-500 tw-bg-slate-200">
                            EFICIENCIA
                        </th>
                    </tr>
                </thead>
                <tbody className="tw-bg-white tw-border-b-4 tw-border-double
                            tw-border-gray-500 ">
                    {activities.map((a, i) =>
                    <Fragment key={i}>
                        <tr>
                            <td rowSpan={2}>
                                <select className=" tw-p-2 tw-w-32 tw-rounded
                                                    tw-border-2 tw-border-gray-400"
                                    onChange={e => handleSelectChange2(e)}>
                                    <option value=""></option>
                                    {listNodes.map((l, i) =>
                                        <option value={l.id_node} key={i}>
                                            {l.name}
                                        </option>
                                    )}
                                </select>
                            </td>
                            <td rowSpan={2}
                                className="tw-border-x-4 tw-border-double tw-border-gray-500">
                                <div className="tw-w-full">
                                    <textarea
                                        value={a.activityDesc}
                                        onChange={e => handleInputFormChange(e, i)}
                                        name={`activityDesc_${i + 1}`}
                                        id="activityDesc"
                                        title={errors[`activityDesc_${i + 1}`] ? errors[`activityDesc_${i + 1}`] : ''}
                                        className={`tw-border-2 tw-rounded
                                                    ${errors[`activityDesc_${i + 1}`] ? 'tw-border-red-400' : 'tw-border-gray-400'}
                                                    `}>
                                    </textarea>
                                    {errors[`activityDesc_${i + 1}`] ?
                                        <p className="tw-text-red-400">
                                            {errors[`activityDesc_${i + 1}`]}
                                        </p>
                                    : null}
                                </div>
                            </td>
                            <td className=" tw-border-double tw-border-gray-500
                                            tw-font-bold tw-text-center">
                                P
                            </td>
                            <td rowSpan={2}
                                className="tw-border-x-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.unitMeter}
                                    name={`unitMeter_${i + 1}`}
                                    type={'text'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.amountP}
                                    name={`amountP_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <>
                                    <p className={` tw-w-full tw-rounded
                                                    tw-border-2 tw-my-2 tw-text-center
                                                    ${errors[`totalCostP_${i + 1}`] ? 'tw-border-red-400' : 'tw-border-gray-400' }
                                                `}>
                                        {a.totalCostP}
                                    </p>
                                    {errors[`totalCostP_${i + 1}`] ?
                                        <p className="tw-text-red-400">
                                            {errors[`totalCostP_${i + 1}`]}
                                        </p>
                                    : null}
                                </>
                            </td>
                            <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.municipioP}
                                    name={`municipioP_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.sgpP}
                                    name={`sgpP_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.regaliasP}
                                    name={`regaliasP_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.otrosP}
                                    name={`otrosP_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td rowSpan={2}
                                className="tw-border-x-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    name={`start_date_${i + 1}`}
                                    type={'date'}
                                    value={a.start_date === null ? undefined : (new Date(a.start_date)).toISOString().split('T')[0]}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td rowSpan={2}
                                className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    name={`end_date_${i + 1}`}
                                    type={'date'}
                                    value={a.end_date === null ? undefined : (new Date(a.end_date)).toISOString().split('T')[0]}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td rowSpan={2}
                                className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.phisicalIndicator}
                                    name={`phisicalIndicator_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td rowSpan={2}
                                className="tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.invertionIndicator}
                                    name={`invertionIndicator_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td rowSpan={2}>
                                <InputTable
                                    value={a.efficiencyIndicator}
                                    name={`efficiencyIndicator_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                        </tr>
                        <tr className="tw-border-b-8 tw-border-double tw-border-gray-500">
                            <td className=" tw-border-t-4 tw-border-double tw-border-gray-500
                                            tw-font-bold tw-text-center">
                                E
                            </td>
                            <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.amountE}
                                    name={`amountE_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                                <>
                                    <p className={` tw-w-full tw-rounded
                                                    tw-border-2 tw-my-2 tw-text-center
                                                    ${errors[`totalCostE_${i + 1}`] ? 'tw-border-red-400' : 'tw-border-gray-400' }
                                                `}>
                                        {a.totalCostE}
                                    </p>
                                    {errors[`totalCostE_${i + 1}`] ?
                                        <p className="tw-text-red-400">
                                            {errors[`totalCostE_${i + 1}`]}
                                        </p>
                                    : null}
                                </>
                            </td>
                            <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.municipioE}
                                    name={`municipioE_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.sgpE}
                                    name={`sgpE_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-t-4 tw-border-r-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.regaliasE}
                                    name={`regaliasE_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                            <td className="tw-border-t-4 tw-border-double tw-border-gray-500">
                                <InputTable
                                    value={a.otrosE}
                                    name={`otrosE_${i + 1}`}
                                    type={'number'}
                                    onChange={e => handleInputFormChange(e, i)}
                                    errors={errors}
                                />
                            </td>
                        </tr>
                    </Fragment>
                    )}
                    <tr>
                        <th colSpan={15}
                            className="tw-py-2">
                            <button className=" tw-bg-green-500
                                                hover:tw-bg-green-300
                                                tw-text-white tw-font-bold
                                                tw-w-12 tw-p-2 tw-mr-2 tw-rounded"
                                type="button"
                                title="Agregar un nuevo nivel"
                                onClick={addActivity}>+</button>
                            <button className=" tw-bg-red-500
                                                hover:tw-bg-red-300
                                                tw-text-white tw-font-bold
                                                tw-w-12 tw-p-2 tw-ml-2 tw-rounded"
                                type="button"
                                title="Eliminar un nivel"
                                onClick={deleteActivity}>-</button>
                        </th>
                    </tr>
                </tbody>
            </table>
            <div className="tw-mx-3">
                <div className="tw-flex tw-gap-2 tw-mt-4">
                    {/*<p className="tw-basis-1/3 tw-mt-6">
                        Metas de producto
                    </p>*/}
                    <div className="tw-basis-2/3 tw-mt-6 tw-flex tw-items-center">
                        <p className="  tw-p-2 tw-rounded tw-bg-white
                                        tw-border-2 tw-border-gray-400">
                            {activities.map(a => a.totalCostE).reduce((a, b) => a + b, 0)}
                        </p>
                        <p className="tw-ml-2 tw-align-baseline">
                            Total ejecutado
                        </p>
                        <Tooltip
                            title={`El total acumulado programado para las actividades se debe distribuir en las metas de producto y debe coincidir`}
                            slots={{
                                transition: Zoom,
                            }}
                        >
                            <Button>
                                <InfoIcon color="action"/>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="tw-flex tw-gap-2 tw-mt-4">
                    {/*<div className="tw-basis-1/3">
                        <select className=" tw-p-2 tw-w-48 tw-rounded
                                            tw-border-2 tw-border-gray-400"
                            onChange={e => handleSelectChange(e)}>
                            <option value=""></option>
                            {listNodes.map((l, i) =>
                                <option value={l.id_node} key={i}>
                                    {l.name}
                                </option>
                            )}
                        </select>
                    </div>*/}
                    <List className="tw-basis-full tw-bg-white">
                        {selectNodes.map((node, i) =>
                            <ListItem
                                key={i}
                                title={`${node.name}\n${node.responsible}`}
                                secondaryAction={<CloseBtn handle={deleteItem} id={i} />}
                                className="tw-border-2 tw-rounded tw-my-1 tw-mx-2">
                                <input
                                    type="number"
                                    name={`peso_${i + 1}`}
                                    onChange={e => handleInputFinalcial(e, i)}
                                    placeholder="financiera adjunta"
                                    className={`tw-w-36 tw-mr-2 tw-text-center
                                                tw-rounded tw-border
                                                ${errors[`peso_${i + 1}`] ? 'tw-border-red-400' : 'tw-border-black' }
                                              `}
                                />
                                <p>{node.name}</p>
                            </ListItem>
                        )}
                    </List>
                </div>
            </div>
            <button type="submit"
                className={`${loadingActivityActionPlan ? 'tw-bg-green-300'
                            : 'tw-bg-green-500 hover:tw-bg-green-400'}
                            tw-py-2 tw-mt-5 tw-mb-2 tw-mx-3 tw-rounded`}>
                {loadingActivityActionPlan ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                    : <p className="tw-font-bold tw-text-white">
                        {upd ? 'Actualizar plan' : 'Cargar actividades'}
                    </p>
                }
            </button>
        </form>
        </>
    );
}

export const UpdateActivityForm = () => {
    const { selectedPlan } = useAppSelector(store => store.plan);

    if (!selectedPlan) return <p>Cargando plan</p>;

    return (<ActivityForm showPlan={selectedPlan!} upd={true}/> );
}