import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import { Box, CircularProgress } from '@mui/material';

import { ActionPlanFrom, ActivityForm, BackBtn,
    UpdateActivityForm } from "@/components";
import { ModalProps, PropsModalActionPlan } from "@/interfaces";
import { generateActionPlanExcel } from "@/utils";

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetActionPlans, thunkGetActivityActionPlan } from '@/store/plan/thunks';
import { setSelectedActionPlan, setDone } from '@/store/plan/planSlice';

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
                onClick={() => setIsOpen1(true)}>
                Lista
            </button> :
            i === 1 ?
            <button
                title="Agregar plan"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen2(true)}>
                Adicionar
            </button> :
            i === 2 ?
            <button
                title="Actualizar plan"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen3(true)}>
                Modificar
            </button> :
            i === 3 ?
            <button
                title="Eliminar planes"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen4(true)}>
                Eliminar
            </button> :
            i === 4 ?
            <button
                title="Importar planes"
                className={`${bclassName} tw-rounded tw-h-24 tw-w-full`}
                onClick={() => setIsOpen4(true)}>
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
    const { actionPlan, selectedPlan, done } = useAppSelector(store => store.plan);
    const [down, setDown] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [loading, setLoading] = useState(false);

    const isFirstRenderG = useRef(true);

    const onClose = () => {
        props.callback(false);
        setShowInfo(false);
        dispatch(setSelectedActionPlan(-1));
    };

    useEffect(() => {
        if (!props.modalIsOpen) return;
        dispatch(thunkGetActionPlans(id_plan));
    }, [props.modalIsOpen]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (selectedPlan && !done) {
            dispatch(thunkGetActivityActionPlan(selectedPlan.id_actionPlan));
        }
    }, [selectedPlan]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (selectedPlan != undefined && done) {
            setShowInfo(true);
            //generateActionPlanExcel(selectedPlan);
            //dispatch(setSelectedActionPlan(-1));
            //dispatch(setDone(false));
        }
//        if (count > 0 && count % 2 === 0) setSend(false);
    }, [done]);

    useEffect(() => {
        if (down) {
            setLoading(true);
            generateActionPlanExcel(selectedPlan!);
            //dispatch(setSelectedActionPlan(-1));
            //dispatch(setDone(false));
            setDown(false);
            setLoading(false);
        }
    }, [down]);

    const handleClick = async (index: number) => {
        dispatch(setSelectedActionPlan(index));
    };

    const handleReturn = () => {
        dispatch(setSelectedActionPlan(-1))
        setShowInfo(false);
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
            {showInfo ?
            <Box>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <button className=" tw-px-2"
                        onClick={onClose}>
                        <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">
                            X
                        </p>
                    </button>
                </div>
                {<div className="tw-absolute tw-top-0 tw-left-0">
                    <BackBtn handle={()=>handleReturn()} id={83}/>
                </div>
                }
                <ActionPlanFrom showPlan={selectedPlan}/>
                <button onClick={() => setDown(true)}
                    className=' tw-bg-green-300 hover:tw-bg-green-400
                                    tw-py-2 tw-rounded'>
                    {loading ?
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                        : <p>Descargar</p>
                    }
                </button>
            </Box>
            : <Box>
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
                                <p>Oficina</p>
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
                                            className="tw-bg-green-200 tw-rounded tw-p-1"
                                            onClick={() => handleClick(i)}>
                                            Seleccionar
                                        </button>
                                    </th>
                                    <th>
                                        <p>{p.planCode.slice(0, 20)}</p>
                                    </th>
                                    <th>
                                        <p>{p.programedDate ? new Date(p.programedDate).toISOString().split('T').slice(0, 1) : 'No definido'}</p>
                                    </th>
                                    <th>
                                        <p>{p.POAINameProject.slice(0, 20)}</p>
                                    </th>
                                    <th>
                                        <p>{p.BPIMCode.slice(0, 20)}</p>
                                    </th>
                                    <th title={p.Objetives}>
                                        <p>{p.Objetives.slice(0, 20)}</p>
                                    </th>
                                    <th>
                                        <p title={p.office}>{p.office.replace('Secretaría ','').replace('de ','')}</p>
                                    </th>
                                </tr>
                            )}
                    </tbody>
                </table>
            </Box>
            }
        </Modal>
    );
}

const AddPlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const { actionPlan, selectedPlan, done } = useAppSelector(store => store.plan);

    const [addPlan, setAddPlan] = useState<boolean>(false);
    const [addAction, setAddAction] = useState<boolean>(false);
    const [index, setIndex] = useState(-1);

    const onClose = () => {
        handleReturn();
        dispatch(setSelectedActionPlan(-1));
        props.callback(false);
    };

    useEffect(() => {
        if (!props.modalIsOpen) return;
        dispatch(thunkGetActionPlans(id_plan));
    }, [props.modalIsOpen]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        dispatch(setSelectedActionPlan(index));
        if (index > -1) {
            setAddAction(true);
        }
    }, [index]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (selectedPlan && !done) {
            dispatch(thunkGetActivityActionPlan(selectedPlan.id_actionPlan));
        }
    }, [selectedPlan]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (selectedPlan != undefined && done) setAddAction(true);
    }, [done]);

    const handleAddActionPlan = () => setAddPlan(true);

    const handleAddActivity = (i: number) => {
        dispatch(setSelectedActionPlan(i));
        //setAddAction(true);
        //setIndex(i);
    }

    const handleReturn = () => {
        setAddPlan(false);
        setAddAction(false);
        setIndex(-1);
        dispatch(setSelectedActionPlan(-1));
    };

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
                        <BackBtn handle={() => handleReturn()} id={19}/>
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
                : addAction ?
                    selectedPlan ? <ActivityForm showPlan={selectedPlan}/>
                    : <p>Cargando plan</p>
                : null}
            </Box>
        </Modal>
    );
}

const UpdatePlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const { actionPlan, selectedPlan } = useAppSelector(store => store.plan);

    const [updAction, setUpdAction] = useState<boolean>(false);
    const [index, setIndex] = useState(-1);

    const onClose = () => {
        handleReturn();
        dispatch(setSelectedActionPlan(-1));
        props.callback(false);
    };

    useEffect(() => {
        if (!props.modalIsOpen) return;
        dispatch(thunkGetActionPlans(id_plan));
    }, []);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (index > -1) {
            dispatch(setSelectedActionPlan(index));
            setUpdAction(true);
        }
    }, [index]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (selectedPlan && updAction) {
            dispatch(thunkGetActivityActionPlan(selectedPlan.id_actionPlan));
        }
    }, [updAction]);

    const handleClick = (i: number) => setIndex(i);

    const handleReturn = () => {
        setUpdAction(false);
        setIndex(-1);
        //dispatch(setSelectedActionPlan(-1));
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
                {updAction ?
                    <div className="tw-absolute tw-top-0 tw-left-0">
                        <BackBtn handle={() => handleReturn()} id={19}/>
                    </div>
                    : null
                }
                {!updAction ?
                <ul className="tw-shadow-2xl tw-p-4 tw-border-2 tw-rounded">
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
                            onClick={() => handleClick(i)}>
                            <p>{item.POAINameProject}</p>
                            <p>Actualizar plan</p>
                        </button>
                    </li>)}
                </ul>
                : updAction ?
                    <>
                        <button
                            className=' tw-bg-cyan-300 hover:tw-bg-cyan-400
                                        tw-border-2 tw-border-gray-200
                                        tw-p-2 tw-mt-2 tw-mx-3
                                        tw-rounded tw-shadow'>
                            Actualizar información del plan
                        </button>
                        {selectedPlan ?
                            <UpdateActivityForm/> :
                            <p>Cargando plan</p>
                        }
                    </>
                : null}
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