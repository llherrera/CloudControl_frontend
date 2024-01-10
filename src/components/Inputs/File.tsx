import React, { useState } from "react";
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import { Spinner } from "@/assets/icons";

import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLevels } from "@/store/plan/planSlice";

import { 
    ExcelPlan,
    LevelInterface,
    ExcelFinancial,
    ExcelPhysical } from "@/interfaces";
import { 
    updateFinancial,
    loadExcel,
    updatePhysicalExcel } from "@/services/api";

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
    const { id_plan } = useAppSelector((state) => state.content);
    const { years, plan } = useAppSelector((state) => state.plan);

    let levels_: LevelInterface[] = [];

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

            await loadExcel(id_plan, data, years, plan.id_municipality)
            .then(() => {
                setIsOpen(false);
                alert('Plan cargado con éxito');
                dispatch(setLevels(levels_));
            })
            .catch(() => {
                alert('Ha ocurrido un error cargando el plan');
                setIsOpen(false);
            });
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
    };

    return (
        <div className='tw-border-b-4 tw-pb-4 tw-pl-4'>
            <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href="/src/docs/Plantilla_Plan_CC.xlsx"
                download='Plantilla_Excel.xlsx'>
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
        //const id_city = await getCityId(plan.municipality);
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