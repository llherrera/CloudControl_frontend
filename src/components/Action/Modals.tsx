import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { Box, CircularProgress } from '@mui/material';
import { ImportExport, Delete, Add, FormatListBulleted, Edit,
    FileDownload } from '@mui/icons-material';

import { ShowPlanOrForm, ActivityForm, BackBtn, UpdateActivityForm,
    ActivitieasPlansFileInput
 } from "@/components";
import { ModalProps, PropsModalActionPlan } from "@/interfaces";
import { generateActionPlanExcel } from "@/utils";

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetActionPlans, thunkGetActivityActionPlan } from '@/store/plan/thunks';
import { setSelectedActionPlan } from '@/store/plan/planSlice';

interface Props {
    bclassName?: string;
    callback: (props: boolean) => void;
    tooltip: string;
    children: JSX.Element | JSX.Element[];
}

const CustomButton = ({ bclassName, callback, tooltip, children }: Props) => {
    return(
        <button
            title={tooltip}
            className={`${bclassName} hover:tw-bg-blue-200
                        tw-h-24 tw-w-full tw-gap-2
                        tw-flex tw-justify-center
                        tw-items-center tw-rounded
                        tw-font-bold tw-text-2xl`}
            onClick={() => callback(true)}>
            {children}
        </button>
    );
}

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
            <CustomButton
                bclassName={`${bclassName}`}
                tooltip="Listar planes"
                callback={() => setIsOpen1(true)}>
                <p>Lista</p>
                <FormatListBulleted/>
            </CustomButton> :
            i === 1 ?
            <CustomButton
                bclassName={`${bclassName}`}
                tooltip="Agregar plan"
                callback={() => setIsOpen2(true)}>
                <p>Adicionar</p>
                <Add/>
            </CustomButton> :
            i === 2 ?
            <CustomButton
                bclassName={`${bclassName}`}
                tooltip="Actualizar plan"
                callback={() => setIsOpen3(true)}>
                <p>Modificar</p>
                <Edit/>
            </CustomButton> :
            i === 3 ?
            <CustomButton
                bclassName={`${bclassName}`}
                tooltip="Eliminar planes"
                callback={() => setIsOpen4(true)}>
                <p>Eliminar</p>
                <Delete/>
            </CustomButton> :
            i === 4 ?
            <CustomButton
                bclassName={`${bclassName}`}
                tooltip="Importar planes"
                callback={() => setIsOpen5(true)}>
                <p>Importar</p>
                <ImportExport/>
            </CustomButton> :
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
                {showInfo ?
                <div className="tw-absolute tw-top-0 tw-left-0">
                    <BackBtn handle={()=>handleReturn()} id={83}/>
                </div>
                : null}
                {showInfo ?
                <>
                    <ShowPlanOrForm showPlan={selectedPlan}/>
                    <div className="tw-flex tw-justify-center tw-mt-3">
                        <button onClick={() => setDown(true)}
                            className=' tw-bg-green-500 hover:tw-bg-green-300
                                        tw-p-2 tw-rounded tw-flex tw-gap-2
                                        tw-text-white tw-font-bold'>
                            {loading ?
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                                : <>
                                    <p>Descargar</p>
                                    <FileDownload/>
                                </>
                            }
                        </button>
                    </div>
                </>
                : <>
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
                </>}
            </Box>
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

    const handleAddActivity = (i: number) => dispatch(setSelectedActionPlan(i));

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
                : addPlan ? <ShowPlanOrForm/>
                : addAction ?
                    selectedPlan ? <ActivityForm showPlan={selectedPlan} upd={false}/>
                    : <p>Cargando plan</p>
                : null}
            </Box>
        </Modal>
    );
}

const UpdatePlanModal = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const { actionPlan, selectedPlan, done } = useAppSelector(store => store.plan);

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
    }, [props.modalIsOpen]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        dispatch(setSelectedActionPlan(index));
        if (index > -1) {
            setUpdAction(true);
        }
    }, [index]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (selectedPlan && !updAction) {
            dispatch(thunkGetActivityActionPlan(selectedPlan.id_actionPlan));
        }
    }, [selectedPlan]);

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (selectedPlan != undefined && done) setUpdAction(true);
    }, [done]);

    const handleAddActivity = (i: number) => dispatch(setSelectedActionPlan(i));

    const handleReturn = () => {
        setUpdAction(false);
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
                    : actionPlan.map((item, i) =>
                        <li className="tw-flex" key={i}>
                            <button
                                className=" tw-flex tw-justify-between tw-w-full
                                            tw-mb-4 tw-p-2 tw-rounded
                                            tw-bg-gray-200 hover:tw-bg-gray-300
                                            tw-border-4 tw-border-gray-400"
                                type="button"
                                title={`${item.BPIMCode}\n${item.office}`}
                                onClick={() => handleAddActivity(i)}>
                                <p>{item.POAINameProject}</p>
                                <p>Actualizar plan</p>
                            </button>
                        </li>
                    )}
                </ul>
                : updAction ?
                    <>
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
                <ActivitieasPlansFileInput/>
            </Box>
        </Modal>
    );
}