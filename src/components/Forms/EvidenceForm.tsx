import React, { useState, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkUpdateEvidence, thunkAddEvidenceGoal, thunkGetUbiEvidence } from "@/store/evidence/thunks";

import { EvidenceInterface } from "../../interfaces";
import { UbicationsPopover } from "@/components";

export const EvidenceForm = () => {
    const dispatch = useAppDispatch();

    const { plan } = useAppSelector((state) => state.plan);
    const { unit } = useAppSelector((state) => state.unit);
    const { listPoints, eviSelected } = useAppSelector((state) => state.evidence);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<EvidenceInterface>(eviSelected??
        {
        id_evidencia: 0,
        codigo: unit!.code,
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
        fecha2: "",
        enlace: "",
        ubicaciones: [],
        estado: 0,
    });
    const [documento, setDocumento] = useState<FileList | null>(
        eviSelected!.enlace === '' ? null : null
    );

    useEffect(()=> {
        //To DO: obtener localidades para hacer el select
    }, []);

    useEffect(()=> {
        if (eviSelected !== undefined) {
            dispatch(thunkGetUbiEvidence(eviSelected.id_evidencia));
        }
    }, [eviSelected]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

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
    };

    const handleSubmitEvidence = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (unit === undefined) return alert('No se ha seleccionado una meta');
        if (documento === null) return alert('No se ha seleccionado un documento');
        if (data.barrio === "") return alert('No se ha seleccionado un barrio');
        if (data.cantidad <= 0) return alert('No se ha seleccionado una cantidad');
        if (data.comuna === "") return alert('No se ha seleccionado una comuna');
        if (data.correguimiento === "") return alert('No se ha seleccionado un correguimiento');
        if (data.descripcionActividades === "") return alert('No se ha seleccionado una descripcion de actividades');
        if (data.fecha === "") return alert('No se ha seleccionado una fecha');
        if (data.fecha2 === "") return alert('No se ha seleccionado una fecha de archivo');
        if (data.fuenteRecursos === "") return alert('No se ha seleccionado una fuente de recursos');
        if (data.lugar === "") return alert('No se ha seleccionado un lugar');
        if (data.nombreDocumento === "") return alert('No se ha seleccionado un nombre de documento');
        if (data.numeroPoblacionBeneficiada === 0) return alert('No se ha seleccionado un numero de poblacion beneficiada');
        if (data.poblacionBeneficiada === "") return alert('No se ha seleccionado una poblacion beneficiada');
        if (data.recursosEjecutados <= 0) return alert('No se ha seleccionado un recurso ejecutado');
        if (data.unidad === "") return alert('No se ha seleccionado una unidad');
        if (data.vereda === "") return alert('No se ha seleccionado una vereda');
        if (listPoints.length === 0) return alert('No se ha seleccionado una ubicacion');
        setLoading(true);

        if (eviSelected === undefined) {
            dispatch(thunkAddEvidenceGoal({
                id_plan: plan?.id_plan!,
                code: unit.code,
                data: data,
                file: documento![0],
                listPoints: listPoints
            }))
            .unwrap()
            .then(() => {
                setLoading(false);
                alert('Evidencia añadida con exito');
            })
            .catch(()=> {
                setLoading(false);
                alert('Error al añadir evidencia');
            });
        }else { 
            dispatch(thunkUpdateEvidence({
                data: data,
                file: documento![0],
                listPoints: listPoints
            }))
            .unwrap()
            .then(()=> {
                setLoading(false);
                alert('Evidencia actualizada con exito');
            })
            .catch(()=> {
                setLoading(false);
                alert('Error al actualizar evidencia');
            });
        }
    };

    return (
        <form
            id="formEvidencia"
            encType="multipart/form-data"
            className=" tw-flex tw-flex-col 
                        tw-mt-3 tw-p-3
                        tw-border-4 tw-border-double
                        tw-border-gray-500 tw-bg-slate-200">
            <label className="tw-text-center md:tw-text-left">Fecha: {new Date().toLocaleDateString()} </label>
                    
            <div className="tw-mt-2">
                <label >Código meta:</label>
                <label className="  tw-m-3 tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white ">{unit.code === '' ? eviSelected?.codigo : unit.code}</label>
            </div>

            <label className="tw-mt-4">Descripcion Actividades:</label>
            <textarea 
                name="descripcionActividades" 
                id="descripcionActividades" 
                required
                value={data.descripcionActividades}
                className=" tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400
                            tw-bg-white tw-resize-none"
                onChange={(e) => handleInputChange(e)}/>

            <label className="tw-mt-4">Numero de actividades:</label>
            <div className="tw-flex tw-flex-wrap
                            tw-rounded tw-p-2
                            tw-border-2 tw-border-gray-400">
                <div className="tw-flex tw-flex-col">
                    <label>Unidad</label>
                    <select
                        name="unidad"
                        id="unidad"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e) => handleInputChange(e)}
                        required
                        value={data.unidad}>
                        <option value="num">M</option>
                        <option value="num">M2</option>
                        <option value="num">M3</option>
                        <option value="num">KM</option>
                        <option value="num">HA</option>
                        <option value="num">Otro</option>
                        <option value="num">Num</option>
                        <option value="num">%</option>
                    </select>
                </div>
                <div className="tw-flex tw-ml-3 tw-flex-col">
                    <label>Cantidad</label>
                    <input
                        type="number" 
                        name="cantidad" 
                        id="cantidad" 
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        value={data.cantidad}
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
            </div>

            <label className="tw-mt-4">Ubicacion</label>
            <div className="tw-flex tw-flex-wrap
                            tw-rounded tw-p-2
                            tw-border-2 tw-border-gray-400">
                <div className="tw-flex tw-flex-col">
                    <label>Comuna o Corregimiento</label>
                    <select 
                        name="comuna"
                        id="comuna"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required
                        value={data.comuna}
                        >
                        <option value="Tubara">Todas</option>
                    </select>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Barrio o Vereda</label>
                    <select 
                        name="barrio"
                        id="barrio"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required
                        value={data.barrio}
                        >
                        <option value="Soledad">Todas</option>
                        <option value="Galapa">Galapa</option>
                    </select>
                </div>
                <div className="tw-flex tw-ml-5">
                    <UbicationsPopover/>
                </div>
            </div>

            <div className="tw-flex tw-flex-wrap
                            tw-mt-4 tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400">
                <div className="tw-flex tw-flex-col">
                    <label>Poblacion beneficiada</label>
                    <select 
                        name="poblacionBeneficiada" 
                        id="poblacionBeneficiada" 
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required
                        value={data.poblacionBeneficiada}>
                        <option value="AdultoMayor">Adulto Mayor</option>
                        <option value="Afrodescendientes">Afrodescendientes</option>
                        <option value="Docentes">Docentes</option>
                        <option value="Estudiantes">Estudiantes</option>
                        <option value="Calle">Habitantes de la Calle</option>
                        <option value="Indigenas">Indigenas</option>
                        <option value="Jovenes">Jovenes</option>
                        <option value="LGBTI">LGBTI</option>
                        <option value="Mujeres">Mujeres</option>
                        <option value="NA">N/A</option>
                        <option value="Adolescentes">Niños, Niñas y Adolescentes</option>
                        <option value="Otros">Otros</option>
                        <option value="Discapacitados">Personas con Discapacidad</option>
                        <option value="PobrezaExtrema">Personas en Pobreza Extrema</option>
                        <option value="Reinsertados">Reinsertados</option>
                        <option value="ROM">ROM</option>
                        <option value="Todos">Todos</option>
                        <option value="Victimas">Victimas</option>
                    </select>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Numero de poblacion beneficiada</label>
                    <input  
                        type="number" 
                        name="numeroPoblacionBeneficiada" 
                        id="numeroPoblacionBeneficiada"
                        placeholder="Numero de beneficiados"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        value={data.numeroPoblacionBeneficiada}
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Recursos ejecutados</label>
                    <input  
                        type="number" 
                        name="recursosEjecutados" 
                        id="recursosEjecutados"
                        placeholder="Recursos ejecutados"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        value={data.recursosEjecutados}
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Fuente de recursos</label>
                    <select 
                        name="fuenteRecursos" 
                        id="fuenteRecursos" 
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required
                        value={data.fuenteRecursos}>
                        <option value="Privado">Recursos Propios ICLD</option>
                        <option value="Publico">Recursos Propios ICDE</option>
                        <option value="Publico">SGP</option>
                        <option value="Publico">Regalias</option>
                        <option value="Publico">Credito</option>
                        <option value="Publico">Estampillas</option>
                        <option value="Publico">Otros</option>
                        <option value="Publico">SGP Cultura</option>
                        <option value="Publico">SGP Deporte</option>
                        <option value="Publico">SGP Educacion</option>
                        <option value="Publico">SGP Salud</option>
                        <option value="Publico">SGP Libre inversion</option>
                        <option value="Publico">Cofinanciacion Departamento</option>
                        <option value="Publico">Cofinanciacion Nacion</option>
                        <option value="Publico">Propios</option>
                        <option value="Publico">Funcionamiento</option>
                    </select>
                </div>
            </div>

            <div className="tw-flex tw-flex-wrap
                            tw-mt-4 tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400">
                <div className="tw-flex tw-flex-col">
                    <label>Archivo de meta</label>
                    <input  
                        type="file" 
                        name="documento" 
                        id="documento"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e) => handleInputChangeFile(e)}/><br />
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Nombre documento</label>
                    <input  
                        type="text" 
                        name="nombreDocumento" 
                        id="nombreDocumento"
                        placeholder="Nombre del documento"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        value={data.nombreDocumento}
                        onChange={(e) => handleInputChange(e)}/><br />
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Lugar</label>
                    <input  
                        type="text" 
                        name="lugar" 
                        id="lugar"
                        placeholder="Lugar de las actividades"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        value={data.lugar}
                        onChange={(e) => handleInputChange(e)}/><br />
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Fecha del archivo</label>
                    <input  
                        type="date" 
                        name="fecha2" 
                        id="fecha2"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        value={data.fecha2}
                        onChange={(e) => handleInputChange(e)}/><hr />
                </div>
            </div>

            <div className="tw-flex tw-justify-center">
                <button className=" tw-grow
                                    tw-bg-blue-500 hover:tw-bg-blue-300
                                    tw-py-4 tw-mt-4
                                    tw-rounded
                                    tw-text-white hover:tw-text-black
                                    tw-font-bold"
                        onClick={handleSubmitEvidence}>
                    Añadir evidencia
                    {loading && <span className="tw-ml-3 tw-spinner tw-spinner-white"></span>}
                </button>
            </div>
        </form>
    );
};