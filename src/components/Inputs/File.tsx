import React, { useState } from "react";
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import { Spinner } from "@/assets/icons";
import ProgressBar from "@ramonak/react-progress-bar";

import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import { ToastContainer } from 'react-toastify';
import { notify } from '@/utils';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLevels } from "@/store/plan/planSlice";

import { 
    ExcelPlan,
    LevelInterface,
    ExcelFinancial,
    ExcelPhysical,
    Secretary} from "@/interfaces";
import { 
    updateFinancial,
    updatePhysicalExcel,
    addLevel,
    addSecretaries,
    addNodes,
    addUnits } from "@/services/api";

const ModalSpinner = ({isOpen}:{isOpen: boolean}) => {
    return (
        <Modal  isOpen={isOpen}
                className='tw-flex tw-flex-col tw-items-center tw-justify-center'
                overlayClassName='tw-fixed tw-inset-0 tw-bg-black tw-opacity-50'>
            <Spinner/>
            <label className='tw-text-[#222222] 
                            tw-font-bold tw-text-lg 
                            tw-font-montserrat'>
                Cargando Plan...
            </label>
        </Modal>
    );
};

export const FileInput = () => {
    const dispatch = useAppDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<File>();
    const [textBar, setTextBar] = useState('');
    const [progressBar, setProgressBar] = useState(0);

    const { id_plan } = useAppSelector((state) => state.content);
    const { years, plan } = useAppSelector((state) => state.plan);


    let levels_: LevelInterface[] = [];
    let levelsName = [] as string[];

    const addLevels = async (data: ExcelPlan[]) => {
        const levels = data.filter((reg, index) => {
            return data.findIndex((reg2) => reg2.Niveles === reg.Niveles) === index;
        });
        levelsName = levels.map((reg) => (reg.Niveles));
        levels_ = levelsName.map((reg) => {
            const level: LevelInterface = {
                name: reg,
                description: '',
            }
            return level;
        });
        return await addLevel(levels_, id_plan.toString());
    };

    const addSecretariess = async (data: ExcelPlan[]) => {
        const secretaries = data.filter((reg, index) => {
            return data.findIndex((reg2) => reg2.Responsable === reg.Responsable && reg2.Responsable !== 'NULL') === index;
        });
        const secretariesName = secretaries.map((reg) => (reg.Responsable));
        let secretaries_ = secretariesName.map((reg) => {
            const secretary: Secretary = {
                id_plan: id_plan,
                name: reg??'',
                email: '',
                phone: 0,
            }
            return secretary;
        });
        await addSecretaries(id_plan, secretaries_);
    };

    const addNodess = async (data: ExcelPlan[]) => {
        await addNodes(data, id_plan, levelsName);
    };

    const addUnitss = async (data: ExcelPlan[], id_muni: string) => {
        await addUnits(id_plan, data, years, id_muni);
    };

    const readExcel = (file: File) => {
        if (plan === undefined) return;
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e: any) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {type: 'buffer'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then( async (d) => {
            const data = d as ExcelPlan[];
            
            await addLevels(data)
            .then((res) => {
                levels_ = levels_.map((reg, index) => {
                    reg.id_level = res.result[index];
                    return reg;
                });
                setTextBar('Niveles añadidos')
                setProgressBar(20);
            })
            .catch(() => notify('Ha ocurrido un error cargando los niveles'))

            await addSecretariess(data)
            .then(() => {
                setTextBar('Secretarias añadidas')
                setProgressBar(40);
            })
            .catch(() => notify('Ha ocurrido un error cargando los secretarios'))

            await addNodess(data)
            .then(() => {
                setTextBar('Nodos añadidos')
                setProgressBar(75);
            })
            .catch(() => notify('Ha ocurrido un error cargando los nodos'))

            await addUnitss(data, plan.id_municipality)
            .then(() => {
                setTextBar('Metas añadidas')
                setProgressBar(100);
                notify('Plan cargado con éxito');
                dispatch(setLevels(levels_));
            })
            .catch(() => notify('Ha ocurrido un error cargando las unidades'));
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files === null) return;
        const file = e.target.files[0];
        setData(file);
    };

    const handleSubmit = () => {
        if (data === undefined) return;
        //setIsOpen(true);
        readExcel(data);
    };

    return (
        <div className='tw-border-b-4 tw-pb-4 tw-pl-4'>
            <ToastContainer/>
            <ProgressBar completed={progressBar} customLabel={textBar} />
            <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href="/src/docs/Plantilla_Plan_CC.xlsx"
                download='Plantilla_Plan_Indicativo_Excel.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <DownloadIcon/>
                </IconButton>
            </a><br />

            <label className='tw-text-[#222222] 
                                tw-font-bold tw-text-lg 
                                tw-font-montserrat'>
                Importar plan por Excel
            </label>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleChange(e)}/>
            <button className=' tw-ml-3 tw-py-1 tw-px-2
                                tw-bg-gray-500 
                                tw-text-white
                                tw-rounded'
                    type="button"
                    onClick={handleSubmit}>
                Cargar Plan
            </button>
            <ModalSpinner isOpen={isOpen}/>
        </div>
    );
}

export const FileFinancialInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<File>();

    const { plan, years } = useAppSelector((state) => state.plan);
    const { id_plan } = useAppSelector((state) => state.content);

    const updateFinancials = async (data: ExcelFinancial[]) => {
        if (plan === undefined) return;
        if (data.length === 0) return;
        if (id_plan === 0) return;
        //const id_city = await getCityId(plan.municipality);
        const id_city = parseInt(plan.id_municipality);
        return await updateFinancial(id_plan, id_city, data, years);
    };

    const readExcel = (file: File) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e: any) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {type: 'buffer'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then( async (d) => {
            const data = d as ExcelFinancial[];

            await updateFinancials(data)
            .then(() => (alert('Se han cargado con éxito las ejecuciones financieras')))
            .catch(() => (alert('Ha ocurrido un error cargando las ejecuciones del plan')));

            setIsOpen(false);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files === null) return;
        const file = e.target.files[0];
        setData(file);
    };

    const handleSubmit = () => {
        if (data === undefined) return;
        setIsOpen(true);
        readExcel(data);
    }

    return (
        <form className="tw-border-b-4 tw-pb-4 tw-pl-4">
             <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href="/src/docs/Plantilla_Ejecuciones_Financieras.xlsx"
                download='Plantilla_Ejecuciones_Financieras.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <DownloadIcon/>
                </IconButton>
            </a><br />

            <p className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat">
                Actualizar ejecuciones financieras por Excel</p>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleChange(e)}/>
            <button className=' tw-ml-3 tw-py-1 tw-px-2
                                tw-bg-gray-500 
                                tw-text-white
                                tw-rounded'
                    type="button"
                    onClick={handleSubmit}>
                Cargar ejecuciones
            </button>
            <ModalSpinner isOpen={isOpen}/>
        </form>
    );
}

export const FilePhysicalInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<File>();

    const { plan, years } = useAppSelector((state) => state.plan);
    const { id_plan } = useAppSelector((state) => state.content);

    const updatePhysical = async (data: ExcelPhysical[]) => {
        if (plan === undefined) return;
        if (data.length === 0) return;
        if (id_plan === 0) return;
        const id_city = parseInt(plan.id_municipality);
        return await updatePhysicalExcel(id_plan, id_city, data, years);
    };

    const readExcel = (file: File) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e: any) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {type: 'buffer'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then( async (d) => {
            const data = d as ExcelPhysical[];

            await updatePhysical(data)
            .then(() => (alert('Se han cargado con éxito las ejecuciones fisicas')))
            .catch(() => (alert('Ha ocurrido un error cargando las ejecuciones del plan')));

            setIsOpen(false);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files === null) return;
        const file = e.target.files[0];
        setData(file);
    };

    const handleSubmit = () => {
        if (data === undefined) return;
        setIsOpen(true);
        readExcel(data);
    }

    return (
        <form className="tw-border-b-4 tw-pb-4 tw-pl-4">
             <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href="/src/docs/Plantilla_Ejecuciones_Fisicas.xlsx"
                download='Plantilla_Ejecuciones_Fisicas.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <DownloadIcon/>
                </IconButton>
            </a><br />

            <p className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat">
                Actualizar ejecuciones fisicas por Excel</p>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleChange(e)}/>
            <button className=' tw-ml-3 tw-py-1 tw-px-2
                                tw-bg-gray-500 
                                tw-text-white
                                tw-rounded'
                    type="button"
                    onClick={handleSubmit}>
                Cargar ejecuciones
            </button>
            <ModalSpinner isOpen={isOpen}/>
        </form>
    );
}