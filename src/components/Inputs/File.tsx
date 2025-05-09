import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import ExcelJS, { Row, Cell } from 'exceljs';
import ProgressBar from "@ramonak/react-progress-bar";

import IconButton from "@mui/material/IconButton";
import { Download, AttachFile } from '@mui/icons-material';

import { notify, handleInputFile, dividirArreglo, readActivityFile } from '@/utils';

import { useAppSelector, useAppDispatch } from "@/store";
import { setLevels } from "@/store/plan/planSlice";

import { ExcelPlan, LevelInterface, ExcelFinancial, ActivityExcel,
    ExcelPhysical, ExcelUnitNode, Secretary } from "@/interfaces";
import { updateFinancial, updatePhysicalExcel, updateUniNodeExcel,
    addLevel, addSecretaries, addNodes, addUnits } from "@/services/api";
import { ModalSpinner } from "../Spinner";

export const FileInput = () => {
    const dispatch = useAppDispatch();

    const [data, setData] = useState<File>();
    const [textBar, setTextBar] = useState('');
    const [progressBar, setProgressBar] = useState(0);

    const { id_plan } = useAppSelector(store => store.content);
    const { years, plan } = useAppSelector(store => store.plan);


    let levels_: LevelInterface[] = [];
    let levelsName = [] as string[];

    const addLevels = async (data: ExcelPlan[]) => {
        const levels = data.filter((reg, index) => {
            return data.findIndex(reg2 => reg2.Niveles === reg.Niveles) === index;
        });
        levelsName = levels.map(reg => reg.Niveles);
        levels_ = levelsName.map(reg => {
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
        await addSecretaries(id_plan, secretaries_, true);
    };

    const addNodess = async (data: ExcelPlan[]) => {
        const parts = dividirArreglo(data, 50);
        const tam = 35/parts.length;
        for (let i = 0; i < parts.length; i++) {
            try {
                await addNodes(parts[i], id_plan, levelsName);
                setTextBar('Nodos añadidos');
                setProgressBar(40 + (tam * (i + 1)));
            } catch (error) {
                console.error(`Error al enviar la parte ${i + 1}:`, error);
            }
        }
        //await addNodes(data, id_plan, levelsName);
    };

    const addUnitss = async (data: ExcelPlan[], id_muni: string) => {
        const parts = dividirArreglo(data, 50);
        const tam = 25/parts.length;
        for (let i = 0; i < parts.length; i++) {
            try {
                await addUnits(id_plan, parts[i], years, id_muni);
                setTextBar('Metas añadidas');
                setProgressBar(75 + (tam * (i + 1)));
            } catch (error) {
                console.error(`Error al enviar la parte ${i + 1}:`, error);
            }
        }
        //await addUnits(id_plan, data, years, id_muni);
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
            .then(res => {
                levels_ = levels_.map((reg, index) => {
                    reg.id_level = res.result[index];
                    return reg;
                });
                setTextBar('Niveles añadidos')
                setProgressBar(20);
            })
            .catch(err => {
                const { status } = err.response;
                if (status == 409) {
                    notify('Este plan ya tiene niveles definidos', 'warning');
                    setProgressBar(20);
                } else notify('Ha ocurrido un error cargando los niveles', 'error');
            });

            await addSecretariess(data)
            .then(() => {
                setTextBar('Secretarías añadidas')
                setProgressBar(40);
            })
            .catch(err => {
                const { status } = err.response;
                if (status == 409) {
                    notify('Este plan ya tiene secretarías definidas', 'warning');
                    setProgressBar(40);
                } else notify('Ha ocurrido un error cargando las secretarías', 'error');
            });

            await addNodess(data)
            .then(() => {
                setTextBar('Nodos añadidos');
                setProgressBar(75);
            })
            .catch(() => notify('Ha ocurrido un error cargando los nodos', 'error'))

            await addUnitss(data, plan.id_municipality)
            .then(() => {
                setTextBar('Metas añadidas');
                setProgressBar(100);
                notify('Plan cargado con éxito', 'success');
                dispatch(setLevels(levels_));
            })
            .catch(() => notify('Ha ocurrido un error cargando las unidades', 'error'));

        });
    };

    const handleSubmit = () => {
        if (data === undefined) return;
        readExcel(data);
    };

    
    return (
        <div className='tw-p-4 tw-ml-4
                        tw-bg-white
                        tw-rounded'>
            <ProgressBar completed={progressBar} customLabel={textBar} />
            <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href={'https://firebasestorage.googleapis.com/v0/b/cloudcontrol-51ebb.appspot.com/o/Files%2FPlantilla%20Plan%20CC%20CompletoAll.xlsx?alt=media&token=8eec32d0-0271-4523-a424-925125765d0d'}
                download='Plantilla_Plan_Indicativo_Excel.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <Download/>
                </IconButton>
            </a><br />

            <p className='tw-text-[#222222] 
                                tw-font-bold tw-text-lg 
                                tw-font-montserrat'>
                Importar plan por Excel
            </p>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleInputFile(e, setData)}/>
            <button className=' tw-ml-3 tw-py-1 tw-px-2
                                tw-bg-gray-500 
                                tw-text-white
                                tw-rounded'
                    type="button"
                    onClick={handleSubmit}>
                Cargar Plan
            </button>
        </div>
    );
}

export const FileFinancialInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<File>();
    const [textBar, setTextBar] = useState('');
    const [progressBar, setProgressBar] = useState(0);

    const { plan, years } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const updateFinancials = async (data: ExcelFinancial[]) => {
        if (plan === undefined) return;
        if (data.length === 0) return;
        if (id_plan === 0) return;
        const id_city = parseInt(plan.id_municipality);
//        return await updateFinancial(id_plan, id_city, data, years);

        const parts = dividirArreglo(data, 50);
        const tam = 100/parts.length;
        for (let i = 0; i < parts.length; i++) {
            try {
                await updateFinancial(id_plan, id_city, parts[i], years);
                setTextBar('Ejecuciones actualizadas');
                setProgressBar(40 + (tam * (i + 1)));
            } catch (error) {
                console.error(`Error al enviar la parte ${i + 1}:`, error);
            }
        }
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
            .then(() => notify('Se han cargado con éxito las ejecuciones financieras', 'success'))
            .catch(() => notify('Ha ocurrido un error cargando las ejecuciones del plan', 'error'));

            setIsOpen(false);
        });
    };

    const handleSubmit = () => {
        if (data === undefined) return;
        setIsOpen(true);
        readExcel(data);
    }

    return (
        <form className='tw-p-4 tw-ml-4
                        tw-bg-white
                        tw-rounded'>
            <ProgressBar completed={progressBar} customLabel={textBar} />
            <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href={"https://firebasestorage.googleapis.com/v0/b/cloudcontrol-51ebb.appspot.com/o/Files%2FPlantilla%20Ejecuciones%20Financieras%20definitivo.xlsx?alt=media&token=60af1a7f-adca-4994-8fcc-06f72c595e14"}
                download='Plantilla_Ejecuciones_Financieras.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <Download/>
                </IconButton>
            </a><br />

            <p className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat">
                Actualizar ejecuciones financieras por Excel
            </p>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleInputFile(e, setData)}/>
            <button className=' tw-ml-3 tw-py-1 tw-px-2
                                tw-bg-gray-500 
                                tw-text-white
                                tw-rounded'
                    type="button"
                    onClick={handleSubmit}>
                Cargar ejecuciones
            </button>
            {/*<ModalSpinner isOpen={isOpen}/>*/}
        </form>
    );
}

export const FilePhysicalInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<File>();
    const [textBar, setTextBar] = useState('');
    const [progressBar, setProgressBar] = useState(0);

    const { plan, years } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const updatePhysical = async (data: ExcelPhysical[]) => {
        if (plan === undefined) return;
        if (data.length === 0) return;
        if (id_plan === 0) return;
        const id_city = parseInt(plan.id_municipality);
//        return await updatePhysicalExcel(id_plan, id_city, data, years);

        const parts = dividirArreglo(data, 50);
        const tam = 100/parts.length;
        for (let i = 0; i < parts.length; i++) {
            try {
                await updatePhysicalExcel(id_plan, id_city, parts[i], years);
                setTextBar('Ejecuciones actualizadas');
                setProgressBar(40 + (tam * (i + 1)));
            } catch (error) {
                console.error(`Error al enviar la parte ${i + 1}:`, error);
            }
        }
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
            .then(() => notify('Se han cargado con éxito las ejecuciones fisicas', 'success'))
            .catch(() => notify('Ha ocurrido un error cargando las ejecuciones del plan', 'error'));

            setIsOpen(false);
        });
    };

    const handleSubmit = () => {
        if (data === undefined) return;
        setIsOpen(true);
        readExcel(data);
    }

    return (
        <form className='tw-p-4 tw-ml-4
                        tw-bg-white
                        tw-rounded'>
            <ProgressBar completed={progressBar} customLabel={textBar} />
            <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href={"https://firebasestorage.googleapis.com/v0/b/cloudcontrol-51ebb.appspot.com/o/Files%2FPlantilla%20Ejecuciones%20fisicas%20definitivo.xlsx?alt=media&token=dad43700-3cf9-4569-8991-8f2c18fd0fda"}
                download='Plantilla_Ejecuciones_Fisicas.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <Download/>
                </IconButton>
            </a><br />

            <p className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat">
                Actualizar ejecuciones fisicas por Excel
            </p>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleInputFile(e, setData)}/>
            <button className=' tw-ml-3 tw-py-1 tw-px-2
                                tw-bg-gray-500 
                                tw-text-white
                                tw-rounded'
                    type="button"
                    onClick={handleSubmit}>
                Cargar ejecuciones
            </button>
            {/*<ModalSpinner isOpen={isOpen}/>*/}
        </form>
    );
}

export const FileUnitInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<File>();

    const { plan, years } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const updateUnit = async (data: ExcelUnitNode[]) => {
        if (plan === undefined) return;
        if (data.length === 0) return;
        if (id_plan === 0) return;
        const id_city = parseInt(plan.id_municipality);
//        return await updateUniNodeExcel(id_plan, id_city, data, years);

        const parts = dividirArreglo(data, 50);
        for (let i = 0; i < parts.length; i++) {
            try {
                await updateUniNodeExcel(id_plan, id_city, parts[i], years);
            } catch (error) {
                console.error(`Error al enviar la parte ${i + 1}:`, error);
            }
        }
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
            const data = d as ExcelUnitNode[];

            await updateUnit(data)
            .then(() => notify('Se han cargado con éxito las ejecuciones fisicas', 'success'))
            .catch(() => notify('Ha ocurrido un error cargando las ejecuciones del plan', 'error'));

            setIsOpen(false);
        });
    };

    const handleSubmit = () => {
        if (data === undefined) return;
        setIsOpen(true);
        readExcel(data);
    }

    return (
        <form className='tw-p-4 tw-ml-4
                        tw-bg-white
                        tw-rounded'>
            <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href={"https://firebasestorage.googleapis.com/v0/b/cloudcontrol-51ebb.appspot.com/o/Files%2FPlantilla%20Nodos%20Completa.xlsx?alt=media&token=8ae2d09f-3ea1-4b25-9a3a-010b61d39be1"}
                download='Plantilla_Metas_Unidad.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <Download/>
                </IconButton>
            </a><br />

            <p className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat">
                Actualizar metas por Excel
            </p>
            <input  type="file" 
                    className='tw-ml-3'
                    onChange={(e)=>handleInputFile(e, setData)}/>
            <button className=' tw-ml-3 tw-py-1 tw-px-2
                                tw-bg-gray-500 
                                tw-text-white
                                tw-rounded'
                    type="button"
                    onClick={handleSubmit}>
                Cargar metas
            </button>
            <ModalSpinner isOpen={isOpen}/>
        </form>
    );
}

export const ActivitieasPlansFileInput = () => {
    const [data, setData] = useState<File>();
    const [textBar, setTextBar] = useState('');
    const [progressBar, setProgressBar] = useState(0);
    const [fileName, setFileName] = useState<string | undefined>();

    const { plan, years } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    useEffect(() => {
        if (data == undefined) setFileName(undefined)
        else setFileName(data.name);
    }, [data]);

    const loadActivities = async (data: ActivityExcel[]) => {
        if (plan === undefined) return;
        if (data.length === 0) return;
        if (id_plan === 0) return;
        const id_city = parseInt(plan.id_municipality);

        const parts = dividirArreglo(data, 50);
        const tam = 100/parts.length;
        for (let i = 0; i < parts.length; i++) {
            try {
                //await updateFinancial(id_plan, id_city, parts[i], years);
                //setTextBar('Actividades subidas');
                //setProgressBar(40 + (tam * (i + 1)));
            } catch (error) {
                console.error(`Error al enviar la parte ${i + 1}:`, error);
            }
        }
    };

    const readExcel = (file: File) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = async (e: any) => {
                const buffer = e.target.result as ArrayBuffer;
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(buffer);

                const ws = wb.worksheets[0];
                const rows: any[] = [];

                ws.eachRow((row, rowNumber) => {
                    console.log(row.getCell(1).result);
                    console.log(row.getCell(2).result);
                    console.log(row.getCell(3).result);
                    console.log(row.getCell(4).result);
                    console.log(row.getCell(5).result);
                    console.log(row.getCell(6).result);
                    console.log(row.getCell(7).result);
                });

            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then( async (d) => {
            const data = d as ActivityExcel[];
            console.log('done');
            //await loadActivities(data)
            //.then(() => notify('Se han cargado con éxito las actividades de los planes de acción', 'success'))
            //.catch(() => notify('Ha ocurrido un error cargando las actividades', 'error'));
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data === undefined) return;
        readActivityFile(data, id_plan);
    };

    return (
        <form className='tw-p-4 tw-ml-4
                        tw-bg-white
                        tw-rounded'
            onSubmit={handleSubmit}>
            <ProgressBar completed={progressBar} customLabel={textBar} />
            <a  className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat"
                href={"https://firebasestorage.googleapis.com/v0/b/cloudcontrol-51ebb.appspot.com/o/Files%2FPlantilla%20Ejecuciones%20Financieras%20definitivo.xlsx?alt=media&token=60af1a7f-adca-4994-8fcc-06f72c595e14"}
                download='Plantilla_Ejecuciones_Financieras.xlsx'>
                Descargar plantilla de Excel
                <IconButton className='tw-p-1 tw-ml-3'
                            size='large'>
                    <Download/>
                </IconButton>
            </a><br />

            <p className="tw-text-[#222222]
                            tw-font-bold tw-text-lg
                            tw-font-montserrat">
                Generar planes de acción y actividades mediante un archivo de Excel
            </p>
            <div className="tw-flex items-center tw-rounded
                            tw-overflow-hidden tw-w-fit">
                <label className={` tw-flex tw-items-center
                                    tw-bg-blue-400 hover:tw-bg-blue-600
                                    tw-text-white tw-px-3 tw-py-1
                                    tw-cursor-pointer`}>
                    <AttachFile className="mr-2"/>
                    Escoger archivo
                    <input
                        type="file"
                        className="tw-hidden"
                        onChange={e => handleInputFile(e, setData)}
                    />
                </label>
                <div className={`${fileName == undefined ?
                                    'tw-bg-red-400 tw-text-gray-200'
                                    : 'tw-bg-green-400'}
                                tw-rounded-r tw-align-bottom
                                tw-px-3 tw-py-1 tw-whitespace-nowrap`}>
                    {fileName??'No se ha escogido un archivo'}
                </div>
                <input
                    type="submit"
                    value='Cargar'
                    title="Guardar las actividades desde el archivo"
                    className={`
                        tw-bg-green-400 hover:tw-bg-green-600
                        tw-p-2 tw-ml-6 tw-rounded tw-text-white
                        tw-cursor-pointer
                    `}
                />
            </div>
        </form>
    );
}