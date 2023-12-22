import React, { useState } from "react";
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import { Spinner } from "@/assets/icons";

import { useAppSelector, useAppDispatch } from "@/store";
import { setLevels } from "@/store/plan/planSlice";

import { 
    ExcelPlan, 
    NodoInterface, 
    NivelInterface, 
    Secretary, 
    UnitInterface } from "@/interfaces";
import { 
    addLevel, 
    addLevelNode, 
    addUnitNodeAndYears, 
    addSecretaries } from "@/services/api";
import { getCityId } from "@/services/col_api";

interface idsInterface {
    result: number[],
}

export const FileInput = () => {
    const dispatch = useAppDispatch();

    const [data, setData] = useState<File>();
    const [isOpen, setIsOpen] = useState(false);
    const { id_plan } = useAppSelector((state) => state.content);
    const { plan, years } = useAppSelector((state) => state.plan);

    let levels_: NivelInterface[] = [];
    let levelsName = [];

    const addLevels = async (data: ExcelPlan[]) => {
        const levels = data.filter((reg, index) => {
            return data.findIndex((reg2) => reg2.Niveles === reg.Niveles) === index;
        });
        levelsName = levels.map((reg) => (reg.Niveles));
        levels_ = levelsName.map((reg) => {
            const level: NivelInterface = {
                name: reg,
                description: reg,
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
    
    const addNodes = async (data: ExcelPlan[], ids:idsInterface) => {
        for (let i = 0; i < levelsName.length; i++) {
            const nodes = data.filter((reg) => reg.Id.split('.').length === i + 1);
            let nodes_ = nodes.map((reg) => {
                const node: NodoInterface = {
                    id_node: `${ids.result[0]}.`+reg.Id,
                    name: reg.Nodos,
                    description: reg.Descripcion,
                    id_level: 0,
                    parent: reg.Id.split('.').length === 1 ? null : `${ids.result[0]}.${reg.Id.split('.').slice(0, -1).join('.')}`,
                    weight: reg.Peso
                }
                return node;
            });
            await addLevelNode(nodes_, ids.result[i])
        }
    };

    const addUnits = async (data: ExcelPlan[], ids:idsInterface) => {
        if (plan === undefined) return;
        const id_city = await getCityId(plan.municipaly);
        const units = data.filter((reg) => reg.Id.split('.').length === levels_.length);
        for (let i = 0; i < units.length; i++) {
            const unit: UnitInterface = {
                code: units[i].Id,
                description: units[i].Descripcion,
                indicator: units[i].Indicador,
                base: units[i].LineaBase??0,
                goal: units[i].Meta ?? 0,
                responsible: units[i].Responsable??'',
                years: [
                    {
                        year: years[0],
                        physical_programming: units[i].ProgramadoAño1??0,
                        physical_execution: 0,
                        financial_execution: 0
                    },
                    {
                        year: years[1],
                        physical_programming: units[i].ProgramadoAño2??0,
                        physical_execution: 0,
                        financial_execution: 0
                    },
                    {
                        year: years[2],
                        physical_programming: units[i].ProgramadoAño3??0,
                        physical_execution: 0,
                        financial_execution: 0
                    },
                    {
                        year: years[3],
                        physical_programming: units[i].ProgramadoAño4??0,
                        physical_execution: 0,
                        financial_execution: 0
                    }
                ]
            }
            const code = `${ids.result[0]}.`+units[i].Id;
            await addUnitNodeAndYears(id_plan.toString(), code, unit, unit.years, id_city);
        };
    }

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
            const data = d as ExcelPlan[];
            
            const ids = await addLevels(data)
            .catch(() => (alert('Ha ocurrido un error cargando los niveles del plan')));

            await addSecretariess(data)
            .catch(() => (alert('Ha ocurrido un error cargando las secretarías del plan')));

            await addNodes(data, ids)
            .catch(() => (alert('Ha ocurrido un error cargando los nodos del plan')));
            
            await addUnits(data, ids)
            .catch(() => (alert('Ha ocurrido un error cargando las unidades del plan')));

            setIsOpen(false);
            alert('Plan cargado con éxito');
            dispatch(setLevels(levels_));
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files === null) return;
        const file = e.target.files[0];
        setData(file);
    }

    const handleSubmit = () => {
        if (data === undefined) return;
        setIsOpen(true);
        readExcel(data);
    }

    const ModalSpinner = () => {
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
        )
    }

    return (
        <div className='tw-border-b-4 tw-pb-4 tw-pl-4'>
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
            <ModalSpinner/>
        </div>
    )
}