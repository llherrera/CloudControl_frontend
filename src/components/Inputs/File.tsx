import React from "react";
import * as XLSX from 'xlsx';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLevels } from "@/store/plan/planSlice";

import { ExcelPlan, NodoInterface, NivelInterface } from "@/interfaces";
import { addLevel, addLevelNode } from "@/services/api";

export const FileInput = () => {
    const dispatch = useAppDispatch();

    const [data, setData] = React.useState<File>();
    const { id_plan } = useAppSelector((state) => state.content);

    let levels_: NivelInterface[] = [];

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
            const levels = data.filter((reg, index) => {
                return data.findIndex((reg2) => reg2.Niveles === reg.Niveles) === index;
            });
            const levelsName = levels.map((reg) => (reg.Niveles));
            levels_ = levelsName.map((reg) => {
                const level: NivelInterface = {
                    LevelName: reg,
                    Description: reg,
                }
                return level;
            });
            const ids = await addLevel(levels_, id_plan.toString()).catch(() => (alert('Ha ocurrido un error cargando los niveles del plan')));
            for (let i = 0; i < levelsName.length; i++) {
                const nodes = data.filter((reg) => reg.Id.split('.').length === i + 1);
                let nodes_ = nodes.map((reg) => {
                    const node: NodoInterface = {
                        id_node: `${ids.result[0]}.`+reg.Id,
                        NodeName: reg.Nodos,
                        Description: reg.Descripcion,
                        id_level: 0,
                        Parent: reg.Id.split('.').length === 1 ? null : `${ids.result[0]}.${reg.Id.split('.').slice(0, -1).join('.')}`,
                        Weight: reg.Peso
                    }
                    return node;
                });
                await addLevelNode(nodes_, ids.result[i])
                .catch(() => (
                    alert('Ha ocurrido un error cargando los nodos')
                ));
            }
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
        readExcel(data);
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
        </div>
    )
}