import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { Spinner } from "@/assets/icons";

import { useAppSelector, useAppDispatch } from "@/store";
import { 
    thunkUpdateEvidence, 
    thunkAddEvidenceGoal, 
    thunkGetUbiEvidence } from "@/store/evidence/thunks";

import { EvidenceInterface } from "@/interfaces";
import { UbicationsPopover } from "@/components";

const ModalSpinner = ({isOpen}:{isOpen: boolean}) => {
    return (
        <Modal  isOpen={isOpen}
                className='tw-flex tw-flex-col tw-items-center tw-justify-center'
                overlayClassName='tw-fixed tw-inset-0 tw-bg-black tw-opacity-50'>
            <Spinner/>
            <label className='tw-text-[#222222] 
                            tw-font-bold tw-text-lg 
                            tw-font-montserrat'>
                Cargando Evidencia...
            </label>
        </Modal>
    );
};

export const EvidenceForm = () => {
    const dispatch = useAppDispatch();

    const { plan } = useAppSelector((state) => state.plan);
    const { unit } = useAppSelector((state) => state.unit);
    const { list_points, evi_selected } = useAppSelector((state) => state.evidence);
    const { id_plan } = useAppSelector((state) => state.content);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<EvidenceInterface>(evi_selected??
        {
        id_evidence: 0,
        code: unit!.code,
        date: new Date().toISOString(),
        activitiesDesc: "",
        unit: "num",
        amount: 0,
        commune: "Tubara",
        neighborhood: "Soledad",
        corregimiento: "Carrizal",
        vereda: "Eden",
        benefited_population: "AdultoMayor",
        benefited_population_number: 0,
        executed_resources: 0,
        resources_font: "Privado",
        name_file: "",
        place: "",
        date_file: "",
        file_link: "",
        locations: [],
        state: 0,
    });
    const [documento, setDocumento] = useState<FileList | null>();

    useEffect(()=> {
        //To DO: obtener localidades para hacer el select
    }, []);

    useEffect(()=> {
        if (evi_selected !== undefined)
            dispatch(thunkGetUbiEvidence(evi_selected.id_evidence));
    }, [evi_selected]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | 
                                        HTMLSelectElement | 
                                        HTMLTextAreaElement>) => {
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
            setDocumento(file);
        }
    };

    const handleSubmitEvidence = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (unit === undefined) return alert('No se ha seleccionado una meta');
        if (documento === null) return alert('No se ha seleccionado un documento');
        if (data.neighborhood === "") return alert('No se ha seleccionado un barrio');
        if (data.amount <= 0) return alert('No se ha seleccionado una cantidad');
        if (data.commune === "") return alert('No se ha seleccionado una comuna');
        if (data.corregimiento === "") return alert('No se ha seleccionado un correguimiento');
        if (data.activitiesDesc === "") return alert('No se ha seleccionado una descripcion de actividades');
        if (data.date === "") return alert('No se ha seleccionado una fecha');
        if (data.date_file === "") return alert('No se ha seleccionado una fecha de archivo');
        if (data.resources_font === "") return alert('No se ha seleccionado una fuente de recursos');
        if (data.place === "") return alert('No se ha seleccionado un lugar');
        if (data.name_file === "") return alert('No se ha seleccionado un nombre de documento');
        if (data.benefited_population_number === 0) return alert('No se ha seleccionado un numero de poblacion beneficiada');
        if (data.benefited_population === "") return alert('No se ha seleccionado una poblacion beneficiada');
        if (data.executed_resources <= 0) return alert('No se ha seleccionado un recurso ejecutado');
        if (data.unit === "") return alert('No se ha seleccionado una unidad');
        if (data.vereda === "") return alert('No se ha seleccionado una vereda');
        if (list_points.length === 0) return alert('No se ha seleccionado una ubicacion');
        setLoading(true);

        if (evi_selected === undefined) {
            dispatch(thunkAddEvidenceGoal({
                id_plan: id_plan,
                code: unit.code,
                data: data,
                file: documento![0],
                list_points: list_points
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
        } else { 
            dispatch(thunkUpdateEvidence({
                data: data,
                file: documento![0],
                list_points: list_points
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
        loading ? <ModalSpinner isOpen={loading}/> :
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
                                    tw-bg-white ">{unit.code === '' ? evi_selected?.code : unit.code}</label>
            </div>

            <label className="tw-mt-4">Descripcion Actividades:</label>
            <textarea 
                name="activitiesDesc" 
                id="activitiesDesc" 
                required
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
                        name="unit"
                        id="unit"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e) => handleInputChange(e)}
                        required>
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
                        name="amount" 
                        id="amount" 
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
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
                        name="commune"
                        id="commune"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required>
                        <option value="Tubara">Todas</option>
                    </select>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Barrio o Vereda</label>
                    <select 
                        name="neighborhood"
                        id="neighborhood"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required>
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
                        name="benefited_population" 
                        id="benefited_population" 
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required>
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
                        name="benefited_population_number" 
                        id="benefited_population_number"
                        placeholder="Numero de beneficiados"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Recursos ejecutados</label>
                    <input  
                        type="number" 
                        name="executed_resources" 
                        id="executed_resources"
                        placeholder="Recursos ejecutados"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Fuente de recursos</label>
                    <select 
                        name="resources_font" 
                        id="resources_font" 
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required>
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
                        name="name_file"
                        id="name_file"
                        placeholder="Nombre del documento"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e) => handleInputChange(e)}/><br />
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Lugar</label>
                    <input
                        type="text"
                        name="place"
                        id="place"
                        placeholder="Lugar de las actividades"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e) => handleInputChange(e)}/><br />
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <label>Fecha del archivo</label>
                    <input
                        type="date"
                        name="date_file"
                        id="date_file"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
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
                </button>
            </div>
        </form>
    );
};