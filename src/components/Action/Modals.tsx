import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import { Box } from '@mui/material';

import { ActionPlanFrom, ActivityForm, BackBtn } from "@/components";
import { ModalProps, PropsModalActionPlan } from "@/interfaces";
import { generateActionPlanExcel } from "@/utils";

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetActionPlans, thunkGetActivityActionPlan } from '@/store/plan/thunks';
import { setSelectedActionPlan } from '@/store/plan/planSlice';

export const ModalOption = ({ i, className, bclassName }: PropsModalActionPlan) => {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [isOpen5, setIsOpen5] = useState(false);

    return (
        <div className={`${className} `}>
            {i === 0 ?
            <ListPlanModal
                modalIsOpen={isOpen1}
                callback={setIsOpen1} /> :
            i === 1 ?
            <AddPlanModal
                modalIsOpen={isOpen2}
                callback={setIsOpen2} /> :
            i === 2 ?
            <UpdatePlanModal
                modalIsOpen={isOpen3}
                callback={setIsOpen3} /> :
            i === 3 ?
            <DeletePlanModal
                modalIsOpen={isOpen4}
                callback={setIsOpen4} /> :
            i === 4 ?
            <ImportPlanModal
                modalIsOpen={isOpen5}
                callback={setIsOpen5} /> :
            <></>
            }
            {i === 0 ?
            <button
                title="Listar planes"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen1(!isOpen1)}>
                Lista
            </button> :
            i === 1 ?
            <button
                title="Agregar plan"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen2(!isOpen2)}>
                Adicionar
            </button> :
            i === 2 ?
            <button
                title="Actualizar plan"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen3(!isOpen3)}>
                Modificar
            </button> :
            i === 3 ?
            <button
                title="Eliminar planes"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen4(!isOpen4)}>
                Eliminar
            </button> :
            i === 4 ?
            <button
                title="Importar planes"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen4(!isOpen5)}>
                Importar
            </button> :
            <></>
            }
        </div>
    );
}

const ListPlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const { actionPlan, selectedPlan,
        loadingActivityActionPlan } = useAppSelector(store => store.plan);

    const [count, setCount] = useState(-1);
    const [index, setIndex] = useState(-1);
    const [send, setSend] = useState(false);
    const isFirstRenderC = useRef(true);
    const isFirstRenderG = useRef(true);
    const isFirstRenderS = useRef(true);

    const onClose = () => {
        props.callback(false);
        dispatch(setSelectedActionPlan(-1));
    }

    useEffect(() => {
        dispatch(thunkGetActionPlans(id_plan));
    }, []);

    useEffect(() => {
        if (isFirstRenderS.current) {
            isFirstRenderS.current = false;
            return;
        }
        dispatch(setSelectedActionPlan(index));
        if (index > -1) setSend(true);
        else setSend(false);
    }, [index]);

    useEffect(() => {
        if (isFirstRenderC.current) {
            isFirstRenderC.current = false;
            return;
        }
        setCount(prevCount => prevCount + 1);
    }, [loadingActivityActionPlan]);

    useEffect(() => {
        if (selectedPlan != undefined && send)
            dispatch(thunkGetActivityActionPlan(selectedPlan.id_actionPlan));
    }, [send]);

    useEffect(() => {
        if (isFirstRenderG.current) {
            isFirstRenderG.current = false;
            return;
        }
        if (count > 0 && count % 2 === 0 && selectedPlan != undefined && send) {
            generateActionPlanExcel(selectedPlan);
            dispatch(setSelectedActionPlan(-1));
        }
        if (count > 0 && count % 2 === 0) setSend(false);
    }, [count]);

    const handleClick = (index: number) => setIndex(index);

    return (
        <Modal isOpen={props.modalIsOpen}
            onRequestClose={() => onClose()}
            contentLabel=''
            style={{
                overlay: {
                    backgroundColor: 'transparent'
                }
            }}>
            <Box>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <button className=" tw-px-2"
                        onClick={onClose}>
                        <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                            X
                        </p>
                    </button>
                </div>
                <table className="tw-w-full">
                    <thead>
                        <tr className="tw-bg-blueBar ">
                            <th>
                                <p></p>
                            </th>
                            <th>
                                <p>Código plan</p>
                            </th>
                            <th>
                                <p>Fecha Programada</p>
                            </th>
                            <th>
                                <p>Nombre proyecto POAI</p>
                            </th>
                            <th>
                                <p>Código BPIM</p>
                            </th>
                            <th>
                                <p>Objetivos</p>
                            </th>
                            <th>
                                <p>Columna</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {actionPlan === undefined || actionPlan.length == 0 ?
                            <tr>
                                <th>
                                    <p className='tw-basis-full tw-p-1'>
                                        Aún no se han definido los proyectos
                                    </p>
                                </th>
                            </tr>
                            : actionPlan.map((p, i) =>
                                <tr key={i} className='tw-border'>
                                    <th>
                                        <button
                                            className=""
                                            onClick={() => handleClick(i)}>
                                            Seleccionar
                                        </button>
                                    </th>
                                    <th>
                                        <p>{p.planCode}</p>
                                    </th>
                                    <th>
                                        <p>{p.programedDate ? new Date(p.programedDate).toISOString().split('T').slice(0, 1) : 'No definido'}</p>
                                    </th>
                                    <th>
                                        <p>{p.POAINameProject}</p>
                                    </th>
                                    <th>
                                        <p>{p.BPIMCode}</p>
                                    </th>
                                    <th>
                                        <p>{p.Objetives}</p>
                                    </th>
                                    <th>
                                        <p>Columna</p>
                                    </th>
                                </tr>
                            )}
                    </tbody>
                </table>
            </Box>
        </Modal>
    );
}

const AddPlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const { actionPlan } = useAppSelector(store => store.plan);

    const [addPlan, setAddPlan] = useState<boolean>(false);
    const [addAction, setAddAction] = useState<boolean>(false);
    const [index, setIndex] = useState(-1);

    const onClose = () => {
        handleReturn();
        dispatch(setSelectedActionPlan(-1));
        props.callback(false);
    }

    useEffect(() => {
        dispatch(thunkGetActionPlans(id_plan));
    }, []);

    useEffect(() => {
        if (index > -1) {
            dispatch(setSelectedActionPlan(index));
            setAddAction(true);
        }
    }, [index]);

    const handleAddActionPlan = () => setAddPlan(true);

    const handleAddActivity = (i: number) => setIndex(i);

    const handleReturn = () => {
        setAddPlan(false);
        setAddAction(false);
        setIndex(-1);
    }

    return (
        <Modal isOpen={props.modalIsOpen}
            onRequestClose={() => onClose()}
            contentLabel=''
            style={{
                overlay: {
                    backgroundColor: 'transparent'
                }
            }}>
            <Box>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <button className=" tw-px-2"
                        onClick={onClose}>
                        <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                            X
                        </p>
                    </button>
                </div>
                {addPlan || addAction ?
                    <div className="tw-absolute tw-top-0 tw-left-0">
                        <BackBtn handle={()=>handleReturn()} id={19}/>
                    </div>
                    : null
                }
                {!addPlan && ! addAction ?
                <ul className="tw-shadow-2xl tw-p-4 tw-border-2 tw-rounded">
                    <li>
                        <button className=" tw-bg-greenBtn hover:tw-bg-green-300
                                        tw-text-white hover:tw-text-black tw-font-bold
                                        tw-rounded tw-w-full tw-py-2 tw-mb-4"
                                onClick={handleAddActionPlan}
                                type="button"
                                title="Agregar un nuevo plan">
                            Añadir plan +
                        </button>
                    </li>
                    {actionPlan === undefined || actionPlan.length == 0 ?
                        <li>
                            <p className='tw-basis-full tw-p-1'>
                                Aún no se han definido los proyectos
                            </p>
                        </li>
                    : actionPlan.map((item, i) => <li className="tw-flex" key={i}>
                        <button
                            className=" tw-flex tw-justify-between tw-w-full
                                        tw-mb-4 tw-p-2 tw-rounded
                                        tw-bg-gray-200 hover:tw-bg-gray-300
                                        tw-border-4 tw-border-gray-400"
                            type="button"
                            title={`${item.BPIMCode}\n${item.office}`}
                            onClick={() => handleAddActivity(i)}>
                            <p>{item.POAINameProject}</p>
                            <p>Añadir actividad</p>
                        </button>
                    </li>)}
                </ul>
                : addPlan ? <ActionPlanFrom/>
                : addAction ? <ActivityForm plan={actionPlan![index]}/>
                : null}
            </Box>
        </Modal>
    );
}

const UpdatePlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const onClose = () => {
        dispatch(setSelectedActionPlan(-1));
        props.callback(false);
    }

    return (
        <Modal isOpen={props.modalIsOpen}
            onRequestClose={() => onClose()}
            contentLabel=''
            style={{
                overlay: {
                    backgroundColor: 'transparent'
                }
            }}>
            <Box>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <button className=" tw-px-2"
                        onClick={onClose}>
                        <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                            X
                        </p>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

const DeletePlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const onClose = () => {
        dispatch(setSelectedActionPlan(-1));
        props.callback(false);
    }

    return (
        <Modal isOpen={props.modalIsOpen}
            onRequestClose={() => onClose()}
            contentLabel=''
            style={{
                overlay: {
                    backgroundColor: 'transparent'
                }
            }}>
            <Box>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <button className=" tw-px-2"
                        onClick={onClose}>
                        <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                            X
                        </p>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

const ImportPlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const onClose = () => {
        dispatch(setSelectedActionPlan(-1));
        props.callback(false);
    }

    return (
        <Modal isOpen={props.modalIsOpen}
            onRequestClose={() => onClose()}
            contentLabel=''
            style={{
                overlay: {
                    backgroundColor: 'transparent'
                }
            }}>
            <Box>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <button className=" tw-px-2"
                        onClick={onClose}>
                        <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                            X
                        </p>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}