import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "@/store"
import { thunkGetLevelName } from "@/store/plan/thunks"

import { addEvicenceGoal, getUnitNodeAndYears } from "../../services/api"
import { YearInterface, UnitInterface, YearDetail, EvidenceInterface } from "../../interfaces"

export const AñadirEvidencia = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { idPDT, idNodo } = useParams();
    const { namesTree } = useAppSelector((state) => state.plan);
    const { unit } = useAppSelector((state) => state.unit);
    
    const [cargar, setCargar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<EvidenceInterface>({
        fecha: new Date().toISOString(),
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

    const handleSubmitEvidence = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (unit === undefined) return alert('No se ha seleccionado una meta');
        if (documento === null) return alert('No se ha seleccionado un documento');
        if (data.barrio === "") return alert('No se ha seleccionado un barrio');
        if (data.cantidad <= 0) return alert('No se ha seleccionado una cantidad');
        if (data.comuna === "") return alert('No se ha seleccionado una comuna');
        if (data.correguimiento === "") return alert('No se ha seleccionado un correguimiento');
        if (data.descripcionActividades === "") return alert('No se ha seleccionado una descripcion de actividades');
        if (data.fecha === "") return alert('No se ha seleccionado una fecha');
        if (data.fechaArchivo === "") return alert('No se ha seleccionado una fecha de archivo');
        if (data.fuenteRecursos === "") return alert('No se ha seleccionado una fuente de recursos');
        if (data.lugar === "") return alert('No se ha seleccionado un lugar');
        if (data.nombreDocumento === "") return alert('No se ha seleccionado un nombre de documento');
        if (data.numeroPoblacionBeneficiada === 0) return alert('No se ha seleccionado un numero de poblacion beneficiada');
        if (data.poblacionBeneficiada === "") return alert('No se ha seleccionado una poblacion beneficiada');
        if (data.recursosEjecutados <= 0) return alert('No se ha seleccionado un recurso ejecutado');
        if (data.unidad === "") return alert('No se ha seleccionado una unidad');
        if (data.vereda === "") return alert('No se ha seleccionado una vereda');
        setLoading(true)
        await addEvicenceGoal(unit.code, data, documento![0]).then(() => {
            setLoading(false)
            alert('Evidencia añadida con exito')
        })
        //setCargar(!cargar)
    }

    const handleBack = () => {
        navigate(-1)
    }

    const handleSubmitButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCargar(!cargar)
    }

    const memorias = () =>{
        if (unit === undefined) return;
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
                                <label className="tw-font-bold">{ unit.code }</label>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500">
                                <label className="tw-font-bold">Descripción de la meta</label>
                            </th>
                            <th className="tw-hidden md:tw-table-cell tw-border-4 tw-border-double tw-border-gray-500 ">
                                <label className="tw-font-bold">{ unit.description }</label>
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
                                    <label className="tw-font-bold">{ index === 0 ? unit.base: index === 1 ? unit.goal : null }</label>
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
        if (unit === undefined) return;
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
                        <label className="tw-ml-3 tw-border tw-border-red-500 tw-px-3">{unit.code}</label>
                    </div>

                    <label className="tw-mt-2">Descripcion Actividades:</label>
                    <textarea 
                        name="descripcionActividades" 
                        id="descripcionActividades" 
                        required
                        className="tw-border tw-resize-none"
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
                                onChange={(e)=> handleInputChange(e)}/>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Recursos ejecutados</label>
                            <input  
                                type="number" 
                                name="recursosEjecutados" 
                                id="recursosEjecutados" 
                                className="tw-border"
                                required
                                onChange={(e)=> handleInputChange(e)}/>
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Fuente de recursos</label>
                            <select 
                                name="fuenteRecursos" 
                                id="fuenteRecursos" 
                                className="tw-border"
                                onChange={(e)=> handleInputChange(e)}
                                required
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
                                required
                                onChange={(e) => handleInputChangeFile(e)}/><br />
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Nombre documento</label>
                            <input  
                                type="text" 
                                name="nombreDocumento" 
                                id="nombreDocumento" 
                                className="tw-border"
                                required
                                onChange={(e) => handleInputChange(e)}/><br />
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Lugar</label>
                            <input  
                                type="text" 
                                name="lugar" 
                                id="lugar" 
                                className="tw-border"
                                required
                                onChange={(e) => handleInputChange(e)}/><br />
                        </div>
                        <div className="tw-flex tw-flex-col tw-ml-3">
                            <label>Fecha del archivo</label>
                            <input  
                                type="date" 
                                name="fechaArchivo" 
                                id="fechaArchivo" 
                                required
                                onChange={(e) => handleInputChange(e)}/><hr />
                        </div>
                    </div>

                    <div className="tw-flex tw-justify-center">
                        <button className=" tw-grow
                                            tw-bg-blue-500
                                            tw-py-4 tw-mt-4
                                            tw-rounded
                                            tw-text-white tw-font-bold"
                                onClick={handleSubmitEvidence}>
                            Añadir evidencia
                            {loading && <span className="tw-ml-3 tw-spinner tw-spinner-white"></span>}
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
