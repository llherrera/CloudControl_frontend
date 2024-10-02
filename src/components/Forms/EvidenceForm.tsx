import React, { useState, useEffect } from "react";
import { notify, convertLocations } from '@/utils';
import { EvidenceInterface, LocationInterface } from "@/interfaces";
import { UbicationsPopover, ModalSpinner } from "@/components";

import { useAppSelector, useAppDispatch } from "@/store";
import {
    thunkUpdateEvidence,
    thunkAddEvidenceGoal,
    thunkGetUbiEvidence } from "@/store/evidence/thunks";
import { thunkGetLocations } from "@/store/plan/thunks";

export const EvidenceForm = () => {
    const dispatch = useAppDispatch();
    const todayDate = new Date();
    const deadLine = new Date(todayDate.getUTCFullYear(), 1, 1);

    const { unit } = useAppSelector(store => store.unit);
    const { list_points, evi_selected } = useAppSelector(store => store.evidence);
    const { id_plan } = useAppSelector(store => store.content);
    const { locations } = useAppSelector(store => store.plan);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<EvidenceInterface>(evi_selected??
        {
        id_evidence: 0,
        code: unit.code,
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
    const [documento, setDocumento] = useState<FileList | null>(null);
    const [yearRegister, setYearRegister] = useState(todayDate.getUTCFullYear());

    const [locationsMap, setLocationsMap] = useState<Map<LocationInterface, LocationInterface[]>>();
    const [locations_, setLocations_] = useState<LocationInterface[]>([]);
    const [locations__, setLocations__] = useState<LocationInterface[]>([]);
    const [indexLocations, setIndexLocations] = useState(0);

    useEffect(() => {
        if (locations == undefined)
            dispatch(thunkGetLocations(id_plan));
    }, []);

    useEffect(() => {
        if (locations == undefined) return;
        if (locations.length === 0) return;
        setLocationsMap(convertLocations(locations));
    }, [locations]);

    useEffect(() => {
        if (locationsMap === undefined) return;
        const locsTemp = Array.from(locationsMap.keys());
        const locTemp = locationsMap.get(locsTemp[indexLocations]);
        setLocations_(locsTemp);
        setLocations__(locTemp??[]);
    }, [locationsMap, indexLocations]);

    useEffect(() => {
        if (evi_selected !== undefined)
            dispatch(thunkGetUbiEvidence(evi_selected.id_evidence));
    }, [evi_selected]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | 
                                        HTMLSelectElement | 
                                        HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const handleLocationSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { selectedIndex } = event.target;
        setIndexLocations(selectedIndex);
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
                file: documento[0],
                list_points: list_points
            }))
            .unwrap()
            .then(() => {
                setLoading(false);
                notify('Evidencia añadida con exito', 'success');
            })
            .catch(()=> {
                setLoading(false);
                notify('Error al añadir evidencia', 'error');
            });
        } else { 
            dispatch(thunkUpdateEvidence({
                id_evidence: evi_selected.id_evidence,
                data: data,
                file: documento[0],
                list_points: list_points
            }))
            .unwrap()
            .then(()=> {
                setLoading(false);
                notify('Evidencia actualizada con exito', 'success');
            })
            .catch(()=> {
                setLoading(false);
                notify('Error al actualizar evidencia', 'error');
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

            <div className="tw-mt-2 tw-flex">
                <p className="tw-mr-2">Código meta:</p>
                <label className="  tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white ">
                    {unit.code === '' ? evi_selected?.code : unit.code}
                </label>
            </div>

            <div className="tw-mt-3 tw-flex tw-gap-2">
                {todayDate < deadLine ? 
                    <button className={`${yearRegister === todayDate.getUTCFullYear() - 1 ? 
                        'tw-bg-blue-400' : 'tw-bg-red-400'}
                        tw-rounded tw-p-2 
                        tw-border tw-border-black`}
                        onClick={()=>setYearRegister(todayDate.getUTCFullYear() - 1)}
                        type="button">
                        Adicionar registros {todayDate.getUTCFullYear() - 1}
                    </button>
                    :null
                }
                <button className={`${yearRegister === todayDate.getUTCFullYear() ? 
                                    'tw-bg-blue-400' : 'tw-bg-red-400'}
                                    tw-rounded tw-p-2 
                                    tw-border tw-border-black`}
                        onClick={()=>setYearRegister(todayDate.getUTCFullYear())}
                        type="button">
                    Adicionar registros {todayDate.getUTCFullYear()}
                </button>
            </div>
            <p className="tw-mt-4">Descripcion Actividades:</p>
            <textarea
                name="activitiesDesc" 
                id="activitiesDesc" 
                required
                value={data.activitiesDesc}
                className=" tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400
                            tw-bg-white tw-resize-none"
                onChange={(e) => handleInputChange(e)}/>

            <p className="tw-mt-4">Numero de actividades:</p>
            <div className="tw-flex tw-flex-wrap
                            tw-rounded tw-p-2
                            tw-border-2 tw-border-gray-400">
                <div className="tw-flex tw-flex-col">
                    <p>Unidad</p>
                    <select
                        name="unit"
                        id="unit"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e) => handleInputChange(e)}
                        required>
                        <option value="M">M</option>
                        <option value="M2">M2</option>
                        <option value="M3">M3</option>
                        <option value="KM">KM</option>
                        <option value="HA">HA</option>
                        <option value="other">Otro</option>
                        <option value="Num">Num</option>
                        <option value="%">%</option>
                    </select>
                </div>
                <div className="tw-flex tw-ml-3 tw-flex-col">
                    <p>Cantidad</p>
                    <input
                        type="number" 
                        name="amount" 
                        id="amount"
                        value={data.amount}
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
            </div>

            <p className="tw-mt-4">Ubicacion</p>
            <div className="tw-flex tw-flex-wrap
                            tw-rounded tw-p-2
                            tw-border-2 tw-border-gray-400">
                <div className="tw-flex tw-flex-col">
                    <p>Localidad/Comuna/Corregimiento</p>
                    <select
                        name="commune"
                        id="commune"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={e => {
                            handleInputChange(e);
                            handleLocationSelect(e);
                        }}
                        required>
                        {locations_.map(loc =>
                            <option value={loc.name} key={loc.name}>
                                {loc.name}
                            </option>
                        )}
                        <option value="Todas">Todas</option>
                    </select>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <p>Barrio/Vereda/Centro poblado</p>
                    <select
                        name="neighborhood"
                        id="neighborhood"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required>
                        {locations__.map(loc =>
                            <option value={loc.name} key={loc.name}>
                                {loc.name}
                            </option>
                        )}
                        <option value="Todas">Todas</option>
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
                    <p>Poblacion beneficiada</p>
                    <select 
                        name="benefited_population" 
                        id="benefited_population"
                        value={data.benefited_population}
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
                    <p>Numero de poblacion beneficiada</p>
                    <input  
                        type="number"
                        name="benefited_population_number"
                        id="benefited_population_number"
                        value={data.benefited_population_number}
                        placeholder="Numero de beneficiados"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <p>Recursos ejecutados</p>
                    <input
                        type="number"
                        name="executed_resources"
                        id="executed_resources"
                        value={data.executed_resources}
                        placeholder="Recursos ejecutados"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e)=> handleInputChange(e)}/>
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <p>Fuente de recursos</p>
                    <select 
                        name="resources_font"
                        id="resources_font"
                        value={data.resources_font}
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        onChange={(e)=> handleInputChange(e)}
                        required>
                        <option value="RecursosPropiosICLD">Recursos Propios ICLD</option>
                        <option value="RecursosPropiosICDE">Recursos Propios ICDE</option>
                        <option value="SGP">SGP</option>
                        <option value="Regalias">Regalias</option>
                        <option value="Credito">Credito</option>
                        <option value="Estampillas">Estampillas</option>
                        <option value="Otros">Otros</option>
                        <option value="SGP Cultura">SGP Cultura</option>
                        <option value="SGP Deporte">SGP Deporte</option>
                        <option value="SGP Educacion">SGP Educacion</option>
                        <option value="SGP Salud">SGP Salud</option>
                        <option value="SGP Libre inversion">SGP Libre inversion</option>
                        <option value="Cofinanciacion Departamento">Cofinanciacion Departamento</option>
                        <option value="Cofinanciacion Nacion">Cofinanciacion Nacion</option>
                        <option value="Propios">Propios</option>
                        <option value="Funcionamiento">Funcionamiento</option>
                    </select>
                </div>
            </div>

            <div className="tw-flex tw-flex-wrap
                            tw-mt-4 tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400">
                <div className="tw-flex tw-flex-col">
                    <p>Archivo de meta</p>
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
                    <p>Nombre documento</p>
                    <input
                        type="text"
                        name="name_file"
                        id="name_file"
                        value={data.name_file}
                        placeholder="Nombre del documento"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e) => handleInputChange(e)}/><br />
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <p>Lugar</p>
                    <input
                        type="text"
                        name="place"
                        id="place"
                        value={data.place}
                        placeholder="Lugar de las actividades"
                        className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                        required
                        onChange={(e) => handleInputChange(e)}/><br />
                </div>
                <div className="tw-flex tw-flex-col tw-ml-3">
                    <p>Fecha del archivo</p>
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
                    {evi_selected === undefined ?
                        "Añadir evidencia" : 
                        "Actualizar evidencia"
                    }
                </button>
            </div>
        </form>
    );
};