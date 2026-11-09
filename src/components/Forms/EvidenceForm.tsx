import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notify, convertLocations } from '@/utils';
import { EvidenceInterface, LocationInterface } from "@/interfaces";
import { UbicationsPopover, ModalSpinner, BackBtn } from "@/components/Citizen";

import { useAppSelector, useAppDispatch } from "@/store";
import {
    thunkUpdateEvidence,
    thunkAddEvidenceGoal,
    thunkGetUbiEvidence
} from "@/store/evidence/thunks";
import { thunkGetLocations } from "@/store/plan/thunks";

export const EvidenceForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { unit } = useAppSelector(store => store.unit);
    const { list_points, evi_selected } = useAppSelector(store => store.evidence);
    const { id_plan } = useAppSelector(store => store.content);
    const { locations, plan, years } = useAppSelector(store => store.plan);

    const todayDate = new Date();
    //const deadLine = new Date(todayDate.getUTCFullYear(), 1, 1);
    const [yearSelect, setYearSelect] = useState<number>(plan ? new Date(plan.deadline == null ? `${years[0] - 1}-02-1` : plan.deadline).getFullYear() : new Date().getFullYear());
    const deadline = yearSelect >= years[0] ? yearSelect : 'No hay fecha de corte';
    const [yearRegister, setYearRegister] = useState(todayDate.getUTCFullYear());

    const [loading, setLoading] = useState(false);
    const [showOther, setShowOther] = useState(false);
    const blankData = {
        id_evidence: 0,
        code: unit.code,
        date: new Date().toISOString(),
        activitiesDesc: "",
        unit: "M",
        amount: 0,
        commune: "Todas",
        neighborhood: "Todas",
        corregimiento: "",
        vereda: "",
        benefited_population: "AdultoMayor",
        benefited_population_number: 0,
        executed_resources: 0,
        resources_font: "Otros",
        name_file: "",
        place: "",
        date_file: "",
        file_link: "",
        locations: [],
        state: 0,
    };
    const [data, setData] = useState<EvidenceInterface>(evi_selected ?? blankData);
    const [documento, setDocumento] = useState<FileList | null>(null);

    interface SupportItem {
        id: string;
        type: 'file' | 'link';
        file?: File;
        link?: string;
        name_file: string;
        place: string;
        date_file: string;
    }

    const [supports, setSupports] = useState<SupportItem[]>([
        {
            id: '1',
            type: 'file',
            name_file: evi_selected?.name_file || '',
            place: evi_selected?.place || '',
            date_file: evi_selected?.date_file ? evi_selected.date_file.split('T')[0] : '',
            link: evi_selected?.file_link || ''
        }
    ]);

        const handleAddSupport = (typeOrEvent?: 'file' | 'link' | React.MouseEvent) => {
            const type: 'file' | 'link' = (typeOrEvent === 'link' || typeOrEvent === 'file') ? typeOrEvent : 'file';
            setSupports(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type,
                    name_file: '',
                    place: data.place || '',
                    date_file: data.date_file || new Date().toISOString().split('T')[0],
                    link: ''
                }
            ]);
        };

        const handleRemoveSupport = (id: string) => {
            if (supports.length === 1) {
                notify('Debe existir al menos un archivo o link de evidencia', 'warning');
                return;
            }
            setSupports(prev => prev.filter(s => s.id !== id));
        };

        const handleUpdateSupport = (id: string, field: keyof SupportItem, value: any) => {
            setSupports(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
        };

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
            setLocations__(locTemp ?? []);
        }, [locationsMap, indexLocations]);

        useEffect(() => {
            if (evi_selected !== undefined)
                dispatch(thunkGetUbiEvidence(evi_selected.id_evidence));
        }, [evi_selected]);

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement |
            HTMLSelectElement |
            HTMLTextAreaElement>) => {
            const { name, value } = event.target;
            if (name === 'resources_font' && value === 'Otros') {
                setShowOther(true);
            } else if (name === 'resources_font' &&
                (value === 'RecursosPropiosICLD' ||
                    value === 'RecursosPropiosICDE' ||
                    value === 'SGP' ||
                    value === 'Regalias' ||
                    value === 'Credito' ||
                    value === 'Estampillas' ||
                    value === 'SGP Cultura' ||
                    value === 'SGP Deporte' ||
                    value === 'SGP Educacion' ||
                    value === 'SGP Salud' ||
                    value === 'SGP Libre inversion' ||
                    value === 'Cofinanciacion Departamento' ||
                    value === 'Cofinanciacion Nacion' ||
                    value === 'Propios' ||
                    value === 'Funcionamiento'
                )) {
                setShowOther(false);
            }
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
                    notify('El archivo debe ser pdf', 'warning');
                    e.target.value = '';
                    return;
                }
                setDocumento(file);
            }
        };

        const handleSubmitEvidence = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            if (unit === undefined) return notify('No se ha seleccionado una meta', 'warning');

            // Validación de soportes (archivos o links)
            if (supports.length === 0) return notify('Debe agregar al menos un soporte (archivo o link)', 'warning');
            for (let i = 0; i < supports.length; i++) {
                const s = supports[i];
                if (s.type === 'file' && !s.file && evi_selected === undefined) {
                    return notify(`Falta seleccionar el archivo en el soporte #${i + 1}`, 'warning');
                }
                if (s.type === 'link') {
                        const linkVal = s.link?.trim() || '';
                        if (!linkVal) {
                            return notify(`Falta ingresar el enlace (URL) en el soporte #${i + 1}`, 'warning');
                        }
                            if (!linkVal.startsWith('http://') && !linkVal.startsWith('https://')) {
                                return notify(`El enlace del soporte #${i + 1} debe iniciar con http:// o https://`, 'warning');
                            }
                        }
                        if (!s.name_file || s.name_file.trim() === '') {
                            return notify(`Falta el nombre del documento en el soporte #${i + 1}`, 'warning');
                        }
                        if (!s.place || s.place.trim() === '') {
                            return notify(`Falta el lugar en el soporte #${i + 1}`, 'warning');
                        }
                        if (!s.date_file || s.date_file.trim() === '') {
                            return notify(`Falta la fecha del documento en el soporte #${i + 1}`, 'warning');
                        }
                    }

                    if (data.neighborhood === "") return notify('No se ha seleccionado un barrio', 'warning');
                    if (data.amount <= 0) return notify('No se ha seleccionado una cantidad', 'warning');
                    if (data.commune === "") return notify('No se ha seleccionado una comuna', 'warning');
                    if (data.activitiesDesc === "") return notify('No se ha seleccionado una descripcion de actividades', 'warning');
                    if (data.date === "") return notify('No se ha seleccionado una fecha', 'warning');
                    if (data.resources_font === "") return notify('No se ha seleccionado una fuente de recursos', 'warning');
                    if (data.benefited_population_number === 0) return notify('No se ha seleccionado un numero de poblacion beneficiada', 'warning');
                    if (data.benefited_population === "") return notify('No se ha seleccionado una poblacion beneficiada', 'warning');
                    if (data.unit === "") return notify('No se ha seleccionado una unidad', 'warning');

                    // Configurar archivo principal y metadatos
                    const firstFileSupport = supports.find(s => s.type === 'file' && s.file);
                    const mainFile = firstFileSupport?.file || documento?.[0];
                    const primarySupport = supports[0];

                    // Serializar lista de enlaces y soportes si son múltiples
                    const supportSummary = supports.map(s => ({
                        type: s.type,
                        name: s.name_file,
                        place: s.place,
                        date: s.date_file,
                        link: s.type === 'link' ? s.link : ''
                    }));

                    const submissionData = {
                        ...data,
                        name_file: primarySupport.name_file || data.name_file,
                        place: primarySupport.place || data.place,
                        date_file: primarySupport.date_file || data.date_file,
                        file_link: supports.some(s => s.type === 'link')
                            ? JSON.stringify(supportSummary)
                            : data.file_link
                    };

                    setLoading(true);

                    if (evi_selected === undefined) {
                        dispatch(thunkAddEvidenceGoal({
                            id_plan: id_plan,
                            code: unit.code,
                            data: submissionData,
                            file: mainFile as File,
                            list_points: list_points
                        }))
                            .then((res) => {
                                setLoading(false);
                                if (res && !res.type.includes('rejected')) {
                                    setData(blankData);
                                    setSupports([{
                                        id: '1',
                                        type: 'file',
                                        name_file: '',
                                        place: '',
                                        date_file: new Date().toISOString().split('T')[0],
                                        link: ''
                                    }]);
                                }
                            });
                    } else {
                        dispatch(thunkUpdateEvidence({
                            id_evidence: evi_selected.id_evidence,
                            data: submissionData,
                            file: mainFile as File,
                            list_points: list_points
                        }))
                            .then(() => {
                                setLoading(false);
                                setData(blankData);
                            });
                    }
                };

                const handleBack = () => navigate(-1);


                return (
                    <>{plan == undefined ? <div key={0}>
                        <h1>404</h1>
                        <h2>No se ha seleccionado un plan</h2>
                        <BackBtn handle={handleBack} id={1} />
                    </div> : <form
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

                        <div>
                            {typeof deadline == 'number' ? years[0] === deadline ? null :
                                <button className={`${yearRegister === todayDate.getUTCFullYear() - 1 ?
                                    'tw-bg-blue-400' : 'tw-bg-red-400'}
                                        tw-rounded tw-p-2 tw-mr-3 tw-mt-3
                                        tw-border tw-border-black`}
                                    onClick={() => setYearRegister(todayDate.getUTCFullYear() - 1)}
                                    type="button">
                                    Adicionar registros {deadline - 1}
                                </button>
                                : null}
                            <button className={`${yearRegister === todayDate.getUTCFullYear() ?
                                'tw-bg-blue-400' : 'tw-bg-red-400'}
                                    tw-rounded tw-p-2
                                    tw-border tw-border-black`}
                                onClick={() => setYearRegister(todayDate.getUTCFullYear())}
                                type="button">
                                Adicionar registros {deadline}
                            </button>
                        </div>
                        <p className="tw-mt-4">Descripcion Actividades:</p>
                        <textarea
                            title="Descripcion Actividades"
                            name="activitiesDesc"
                            id="activitiesDesc"
                            required
                            value={data.activitiesDesc}
                            className=" tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400
                            tw-bg-white tw-resize-none"
                            onChange={e => handleInputChange(e)} />

                        <p className="tw-mt-4">Numero de actividades:</p>
                        <div className="tw-flex tw-flex-wrap
                            tw-rounded tw-p-2
                            tw-border-2 tw-border-gray-400">
                            <div className="tw-flex tw-flex-col">
                                <p>Unidad</p>
                                <select
                                    title="Unidad"
                                    name="unit"
                                    id="unit"
                                    className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                                    onChange={e => handleInputChange(e)}
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
                                    title="Cantidad"
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    value={data.amount}
                                    className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                                    required
                                    onChange={e => handleInputChange(e)} />
                            </div>
                        </div>

                        <p className="tw-mt-4">Ubicacion</p>
                        <div className="tw-flex tw-flex-wrap
                            tw-rounded tw-p-4 tw-mb-2
                            tw-border-4 tw-border-blue-400 tw-bg-blue-50 tw-items-center">
                            <div className="tw-flex tw-flex-col">
                                <p>Localidad/Comuna/Corregimiento</p>
                                <select
                                    value={data.commune}
                                    title="Localidad"
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
                                    value={data.neighborhood}
                                    title="Barrio"
                                    name="neighborhood"
                                    id="neighborhood"
                                    className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                                    onChange={e => handleInputChange(e)}
                                    required>
                                    {locations__.map(loc =>
                                        <option value={loc.name} key={loc.name}>
                                            {loc.name}
                                        </option>
                                    )}
                                    <option value="Todas">Todas</option>
                                </select>
                            </div>
                            <div className="tw-flex tw-flex-col tw-ml-5 tw-items-center">
                                <UbicationsPopover />
                                {/* Estado de la ubicación */}
                                {list_points && list_points.length > 0 ? (
                                    <span className="tw-text-green-600 tw-font-semibold tw-mt-2">Ubicación asignada</span>
                                ) : (
                                    <span className="tw-text-red-600 tw-font-semibold tw-mt-2">Ubicación no asignada</span>
                                )}
                            </div>
                        </div>

                        <div className="tw-flex tw-flex-wrap
                            tw-mt-4 tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400">
                            <div className="tw-flex tw-flex-col">
                                <p>Poblacion beneficiada</p>
                                <select
                                    title="Poblacion beneficiada"
                                    name="benefited_population"
                                    id="benefited_population"
                                    value={data.benefited_population}
                                    className=" tw-p-2 tw-rounded
                                    tw-border-2 tw-border-gray-400
                                    tw-bg-white"
                                    onChange={e => handleInputChange(e)}
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
                                    onChange={e => handleInputChange(e)} />
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
                                    onChange={e => handleInputChange(e)} />
                            </div>
                            <div className="tw-flex">
                                <div className="tw-flex tw-flex-col tw-ml-3">
                                    <p>Fuente de recursos</p>
                                    <select
                                        title="Fuente de recursos"
                                        name="resources_font"
                                        id="resources_font"
                                        value={data.resources_font}
                                        className=" tw-p-2 tw-rounded
                                        tw-border-2 tw-border-gray-400
                                        tw-bg-white"
                                        onChange={e => handleInputChange(e)}
                                        required>
                                        <option value="Otros">Otros</option>
                                        <option value="RecursosPropiosICLD">Recursos Propios ICLD</option>
                                        <option value="RecursosPropiosICDE">Recursos Propios ICDE</option>
                                        <option value="SGP">SGP</option>
                                        <option value="Regalias">Regalias</option>
                                        <option value="Credito">Credito</option>
                                        <option value="Estampillas">Estampillas</option>
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
                                {showOther ?
                                    <input
                                        title="Otra fuente de recursos"
                                        name="resources_font"
                                        id="other_resources_font"
                                        type="text"
                                        className=" tw-p-2 tw-ml-3 tw-mt-6 tw-rounded
                                        tw-border-2 tw-border-gray-400
                                        tw-bg-white"
                                        onChange={e => handleInputChange(e)}
                                        value={data.resources_font}
                                    />
                                    : null}
                            </div>
                        </div>

                        <div className="tw-mt-4 tw-p-3 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-slate-100">
                            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                                <p className="tw-font-bold tw-text-gray-800">Soportes de Meta (Archivos / Enlaces):</p>
                                <button
                                    type="button"
                                    onClick={handleAddSupport}
                                    className="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-px-3 tw-py-1.5 tw-rounded tw-border tw-border-black tw-text-xs tw-font-bold"
                                >
                                    + Agregar Soporte
                                </button>
                            </div>

                            <div className="tw-flex tw-flex-col tw-gap-3">
                                {supports.map((sup, idx) => (
                                    <div
                                        key={sup.id}
                                        className="tw-flex tw-flex-wrap tw-items-center tw-p-3 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-white tw-gap-3"
                                    >
                                        <span className="tw-font-bold tw-text-xs tw-bg-slate-200 tw-px-2 tw-py-1 tw-rounded tw-border">
                                            #{idx + 1}
                                        </span>

                                        <div className="tw-flex tw-flex-col">
                                            <label className="tw-text-xs tw-font-bold">Tipo</label>
                                            <select
                                                value={sup.type}
                                                onChange={(e) => handleUpdateSupport(sup.id, 'type', e.target.value as 'file' | 'link')}
                                                className="tw-p-1.5 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-white tw-text-xs"
                                            >
                                                <option value="file">Archivo PDF</option>
                                                <option value="link">Enlace Web (URL)</option>
                                            </select>
                                        </div>

                                        {sup.type === 'file' ? (
                                            <div className="tw-flex tw-flex-col">
                                                <label className="tw-text-xs tw-font-bold">Subir archivo (PDF)</label>
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="tw-p-1 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-white tw-text-xs"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            if (file.type !== 'application/pdf') {
                                                                notify('El archivo debe ser PDF', 'warning');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            handleUpdateSupport(sup.id, 'file', file);
                                                            if (!sup.name_file) {
                                                                handleUpdateSupport(sup.id, 'name_file', file.name.replace('.pdf', ''));
                                                            }
                                                            // Si es el primer archivo, sincronizar con documento legacy
                                                            if (idx === 0 && e.target.files) {
                                                                setDocumento(e.target.files);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="tw-flex tw-flex-col tw-grow tw-min-w-[220px]">
                                                <label className="tw-text-xs tw-font-bold">Enlace Web (URL de Drive/Sharepoint/web)</label>
                                                <input
                                                    type="url"
                                                    placeholder="https://ejemplo.com/evidencia..."
                                                    value={sup.link || ''}
                                                    onChange={(e) => handleUpdateSupport(sup.id, 'link', e.target.value)}
                                                    className="tw-p-1.5 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-white tw-text-xs"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="tw-flex tw-flex-col">
                                            <label className="tw-text-xs tw-font-bold">Nombre documento</label>
                                            <input
                                                type="text"
                                                placeholder="Nombre del documento"
                                                value={sup.name_file}
                                                onChange={(e) => handleUpdateSupport(sup.id, 'name_file', e.target.value)}
                                                className="tw-p-1.5 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-white tw-text-xs"
                                                required
                                            />
                                        </div>

                                        <div className="tw-flex tw-flex-col">
                                            <label className="tw-text-xs tw-font-bold">Lugar</label>
                                            <input
                                                type="text"
                                                placeholder="Lugar de las actividades"
                                                value={sup.place}
                                                onChange={(e) => handleUpdateSupport(sup.id, 'place', e.target.value)}
                                                className="tw-p-1.5 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-white tw-text-xs"
                                                required
                                            />
                                        </div>

                                        <div className="tw-flex tw-flex-col">
                                            <label className="tw-text-xs tw-font-bold">Fecha del archivo</label>
                                            <input
                                                type="date"
                                                value={sup.date_file}
                                                onChange={(e) => handleUpdateSupport(sup.id, 'date_file', e.target.value)}
                                                className="tw-p-1.5 tw-rounded tw-border-2 tw-border-gray-400 tw-bg-white tw-text-xs"
                                                required
                                            />
                                        </div>

                                        {supports.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSupport(sup.id)}
                                                className="tw-bg-red-500 hover:tw-bg-red-700 tw-text-white tw-px-2.5 tw-py-1.5 tw-rounded tw-font-bold tw-text-xs tw-self-end tw-mb-0.5"
                                                title="Eliminar soporte"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
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
                                {loading ? <ModalSpinner isOpen={loading} /> :
                                    evi_selected === undefined ?
                                        "Añadir evidencia" :
                                        "Actualizar evidencia"
                                }
                            </button>
                        </div>
                    </form>
                    }</>
                );
            };