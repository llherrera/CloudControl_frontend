import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "@/store"
import { thunkGetLevelName } from "@/store/plan/thunks"

import { addEvicenceGoal, getUnitNodeAndYears } from "../../services/api"
import { YearInterface, UnidadInterface, YearDetail, EvidenceInterface } from "../../interfaces"

export const AñadirEvidencia = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { idPDT, idNodo } = useParams();
    const { namesTree } = useAppSelector((state) => state.plan);
    
    const [cargar, setCargar] = useState(false)
    const [data, setData] = useState<EvidenceInterface>({
        fecha: "",
        descripcionActividades: "",
        unidad: "num",
        cantidad: 0,
        comuna: "Tubara",
        barrio: "Soledad",
        correguimiento: "Carrizal",
        vereda: "Eden",
        poblacionBeneficiada: "AdultoMayor",
        numeroPoblacionBeneficiada: 0,
        recursosEjecutados: 0,
        fuenteRecursos: "Privado",
        nombreDocumento: "",
        lugar: "",
        fechaArchivo: "",
    })
    const [documento, setDocumento] = useState<FileList | null>(null)

    const [unidForm, setUnidForm] = useState<UnidadInterface>({
        code: '',
        description: '',
        indicator: '',
        base: 0,
        goal: 0,
        years: []
    });

    useEffect(() => {
        const ids = idNodo!.split('.');
        let ids2 = ids.reduce((acumulator:string[], currentValue) => {
            if (acumulator.length === 0) {
                return [currentValue];
            } else {
                const ultimoElemento = acumulator[acumulator.length - 1];
                const concatenado = `${ultimoElemento}.${currentValue}`;
                return [...acumulator, concatenado];
            }
        }, []);
        ids2 = ids2.slice(1);
        dispatch(thunkGetLevelName(ids2))
    }, []);

    useEffect(() => {
        getUnitNodeAndYears(idPDT!, idNodo!)
        .then((res) => {
            const { Node } = res;
            if (Node === undefined) return;
            const { Codigo, Descripcion, Indicador, Linea_base, Meta } = Node;
            if (Codigo === undefined || Descripcion === undefined || Indicador === undefined || Linea_base === undefined || Meta === undefined) return;
            setUnidForm({code: Node.Codigo,
                         description: Node.Descripcion,
                         indicator: Node.Indicador,
                         base: Node.Linea_base,
                         goal: Node.Meta,
                         years: []
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        //try {
        //    const ids = idNodo!.split('.');
        //    let ids2 = ids.reduce((acumulator:string[], currentValue) => {
        //        if (acumulator.length === 0) {
        //            return [currentValue];
        //        } else {
        //            const ultimoElemento = acumulator[acumulator.length - 1];
        //            const concatenado = `${ultimoElemento}.${currentValue}`;
        //            return [...acumulator, concatenado];
        //        }
        //    }, []);
        //    ids2 = ids2.slice(1);
        //    getLevelName(ids2).then((res) => {
        //        setNombres(res);
        //    });
//
        //    getNodoUnidadYAños(idPDT!, idNodo!).then((res) => {
        //        const { Nodo, Años } = res;
        //        if (Nodo === undefined) {
        //            return;
        //        }
        //        setUnidForm({code: Nodo.Codigo,
        //                     description: Nodo.Descripcion,
        //                     indicator: Nodo.Indicador,
        //                     base: Nodo.Linea_base,
        //                     goal: Nodo.Meta,
        //                     years: Años
        //        });
//
        //        Años.forEach((dato:YearDetail) => {
        //            const año = new Date(dato.Año).getFullYear();
        //            añosTemp.año.push(año);
        //            añosTemp.programacion.push(dato.Programacion_fisica);
        //            añosTemp.ejecFisica.push(dato.Ejecucion_Fisica);
        //            añosTemp.ejecFinanciera.push(dato.Ejecucion_financiera);
        //        });
        //        setañoForm(añosTemp);
        //    });
        //} catch (error) {
        //    console.log(error);
        //}
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    }

    const handleInputChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        if (file) {
            if (file[0].type !== 'application/pdf') {
                alert('El archivo debe ser pdf');
                e.target.value = '';
                return;
            }
            if (file[0].size > 1024 * 1024 * 5) {
                alert('El archivo es demasiado grande');
                e.target.value = '';
                return;
            }
            setDocumento(file);
        }
    }

    const handleSubmitEvidencia = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const res = await addEvicenceGoal(unidForm.code, data, documento![0])
        //setCargar(!cargar)
    }

    const handleBack = () => {
        navigate(-1)
    }

    const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCargar(!cargar)
    }

    const memorias = () =>{
        return(
            <div className="tw-mx-3 tw-mt-2 tw-grid tw-grid-cols-4 md:tw-grid-cols-12">
                <header className=" tw-col-start-1 tw-col-span-full
                                    md:tw-col-start-2 md:tw-col-span-10
                                    tw-border-4 tw-border-double tw-border-gray-500">
                    <h1 className=" tw-text-3xl tw-text-center tw-font-bold tw-text-blue-700">Memoria de avance del Plan</h1>
                </header>
                <table className="  tw-col-start-1 tw-col-span-full tw-mt-3 
                                    md:tw-col-start-2 md:tw-col-span-10 tw-text-center">
                    <thead>
                        <tr>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Código de la meta</label>
                            </th>
                            <th className="tw-border-4 tw-border-double tw-border-gray-500 ">
                                <label className="tw-font-bold">{ unidForm.code }</label>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Descripción de la meta</label>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500 ">
                                <label className="tw-font-bold">{ unidForm.description }</label>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {namesTree.map((name, index) => (
                            <tr key={index}>
                                <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ name[1] }</label>
                                </td>
                                <td className="tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ name[0] }</label>
                                </td>
                                <td className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ index === 0 ? 'Linea base': index === 1 ? 'Meta' : null }</label>
                                </td>
                                <td className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                    <label className="tw-font-bold">{ index === 0 ? unidForm.base: index === 1 ? unidForm.goal : null }</label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="  tw-col-start-1 tw-col-span-2 tw-mt-4
                                tw-justify-self-start
                                md:tw-col-start-2">
                    Fecha: { new Date().toLocaleDateString()}
                </p>
                <p className="  tw-font-bold tw-col-start-5 tw-mt-4
                                tw-justify-self-start">
                    Lugar:
                </p>
                <input  className=" tw-ml-4 tw-py-4 tw-mt-4
                                    tw-grow tw-border
                                    tw-col-start-8 tw-col-span-full
                                    md:tw-col-start-7 md:tw-col-end-12"
                        type="text" 
                        name="" 
                        id="" 
                />
                <p className="  tw-col-start-1 tw-col-span-2 tw-mt-4
                                tw-justify-self-start
                                md:tw-col-start-2">
                    Hora: { new Date().toLocaleTimeString()}
                </p>
                <p className="  tw-font-bold tw-mt-4 
                                tw-col-start-5 tw-col-span-2 
                                tw-justify-self-start
                                tw-break-words ">
                    Responsable del cargo:
                </p>
                <input  className=" tw-ml-4 tw-py-4 tw-mt-4
                                    tw-grow tw-border
                                    tw-col-start-8 tw-col-span-full
                                    md:tw-col-start-7 md:tw-col-end-12" 
                        type="text" 
                        name="" 
                        id="" 
                />
                <p className="  tw-font-bold tw-mt-4 tw-col-start-5 
                                tw-justify-self-start
                                tw-break-words">
                    Descripción:
                </p>
                <input  className=" tw-ml-4 tw-py-4 tw-mt-4
                                    tw-grow tw-border
                                    tw-col-start-8 tw-col-span-full
                                    md:tw-col-start-7 md:tw-col-end-12" 
                        type="text" 
                        name="" 
                        id="" 
                />
                <button className=" tw-col-span-full
                                    md:tw-col-start-2 md:tw-col-end-12
                                    tw-bg-blue-500
                                    tw-py-4 tw-mt-4
                                    tw-rounded
                                    tw-text-white tw-font-bold"
                        onClick={handleSubmitButton}>
                    cargar evidencias de esta meta
                </button>
            </div>
        )
    }

    const evidencias = () =>{
        return(
            <div className="tw-mx-3 tw-mt-2 tw-grid tw-grid-cols-12 ">
                <header className=" tw-col-span-full tw-flex tw-flex-col
                                    md:tw-col-start-2 md:tw-col-end-12
                                    tw-border-4 tw-border-double tw-border-gray-500">
                    <h1 className=" tw-text-3xl tw-font-bold tw-text-center tw-text-blue-700">Evidencias de la meta</h1>
                    <button className="inline-block" onClick={ (e) => handleSubmitButton(e)} >
                        return
                    </button>
                </header>
                <form
                    id="formEvidencia"
                    encType="multipart/form-data"
                    className="tw-col-span-full tw-flex tw-flex-col 
                                md:tw-col-start-2 md:tw-col-end-12">
                    <label className="tw-text-center md:tw-text-left">Fecha {new Date().toLocaleDateString()} </label>
                    
                    <div className="tw-mt-2">
                        <label >Código meta:</label>
                        <label className="tw-ml-3 tw-border tw-border-red-500 tw-px-3">{unidForm.code}</label>
                    </div>

                    <label className="tw-mt-2">Descripcion Actividades:</label>
                    <textarea 
                        name="descripcionActividades" 
                        id="descripcionActividades" 
                        className="tw-border"
                        onChange={(e) => handleInputChange(e)}/>

                    <label className="tw-mt-4">Numero de actividades:</label>
                    <div className="tw-flex tw-border">
                        <div className="tw-flex tw-flex-col">
                            <label>Unidad</label>
                            <select
                                name="unidad"
                                id="unidad"
                                className="tw-border"
                                onChange={(e) => handleInputChange(e)}
                                value={data.unidad}
                                >
                                <option value="num">Personas</option>
                                <option value="num">Kg</option>
                                <option value="num">Pesos</option>
                                <option value="char">Km</option>
                            </select>
                        </div>
                        <div className="tw-flex tw-ml-3 tw-flex-col">
                            <label>Cantidad</label>
                            <input
                                type="number" 
                                name="cantidad" 
                                id="cantidad" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}/>
                        </div>
                    </div>

                    <label className="tw-mt-4">Ubicacion</label>
                    <div className="tw-flex tw-border">
                        <div className="tw-flex tw-flex-col">
                            <label>Comuna</label>
                            <select 
                                name="comuna"
                                id="comuna"
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}
                                value={data.comuna}
                                >
                                <option value="Tubara">Tubara</option>
                                <option value="Baranoa">Baranoa</option>
                            </select>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Barrio</label>
                            <select 
                                name="barrio"
                                id="barrio"
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}
                                value={data.barrio}
                                >
                                <option value="Soledad">Soledad</option>
                                <option value="Galapa">Galapa</option>
                            </select>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Correguimiento</label>
                            <select 
                                name="correguimiento" 
                                id="correguimiento" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}
                                value={data.correguimiento}
                                >
                                <option value="Carrizal">Carrizal</option>
                                <option value="BrisasDelRio">Brisas del Rio</option>
                            </select>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                        <label>Vereda</label>
                            <select 
                                name="vereda" 
                                id="vereda" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}
                                value={data.vereda}
                                >
                                <option value="Eden">El Eden</option>
                                <option value="Morrito">El Morrito</option>
                            </select>
                        </div>
                    </div>

                    <div className="tw-flex tw-mt-4 tw-border">
                        <div className="tw-flex tw-flex-col">
                            <label>Poblacion beneficiada</label>
                            <select 
                                name="poblacionBeneficiada" 
                                id="poblacionBeneficiada" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}
                                value={data.poblacionBeneficiada}
                                >
                                <option value="AdultoMayor">Adulto Mayor</option>
                                <option value="Infantes">Infantes</option>
                            </select>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Numero de poblacion beneficiada</label>
                            <input  
                                type="number" 
                                name="numeroPoblacionBeneficiada" 
                                id="numeroPoblacionBeneficiada" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}/>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Recursos ejecutados</label>
                            <input  
                                type="number" 
                                name="recursosEjecutados" 
                                id="recursosEjecutados" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}/>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Fuente de recursos</label>
                            <select 
                                name="fuenteRecursos" 
                                id="fuenteRecursos" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}
                                value={data.fuenteRecursos}>
                                <option value="Privado">Sector privado</option>
                                <option value="Publico">Sector publico</option>
                            </select>
                        </div>
                    </div>

                    <div className="tw-flex tw-mt-4">
                        <div className="tw-flex tw-flex-col">
                            <label>Archivo de meta</label>
                            <input  
                                type="file" 
                                name="documento" 
                                id="documento" 
                                onChange={(e) => handleInputChangeFile(e)}/><br />
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Nombre documento</label>
                            <input  
                                type="text" 
                                name="nombreDocumento" 
                                id="nombreDocumento" 
                                className="tw-border"
                                onChange={(e) => handleInputChange(e)}/><br />
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Lugar</label>
                            <input  
                                type="text" 
                                name="lugar" 
                                id="lugar" 
                                className="tw-border"
                                onChange={(e) => handleInputChange(e)}/><br />
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Fecha del archivo</label>
                            <input  
                                type="date" 
                                name="fechaArchivo" 
                                id="fechaArchivo" 
                                onChange={(e) => handleInputChange(e)}/><hr />
                        </div>
                    </div>

                    <div className="tw-flex tw-justify-center">
                        <button className=" tw-grow
                                            tw-bg-blue-500
                                            tw-py-4 tw-mt-4
                                            tw-rounded
                                            tw-text-white tw-font-bold"
                                onClick={handleSubmitEvidencia}>
                            Añadir evidencia
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return(
        cargar ? evidencias():memorias()
    )
}
