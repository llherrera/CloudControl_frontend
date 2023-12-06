import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { useAppSelector } from "@/store";

import { addEvicenceGoal } from "../../services/api";
import { EvidenceInterface, Coordinates } from "../../interfaces";
import { BackBtn, MarkerComponent } from "@/components";


const API_KEY = import.meta.env.VITE_API_KEY_MAPS as string;
const containerStyle = {
    width: '400px',
    height: '400px'
};

export const EvidencePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const idPDT = location.state?.idPDT;

    const { namesTree, plan } = useAppSelector((state) => state.plan);
    const { unit } = useAppSelector((state) => state.unit);
    
    const [cargar, setCargar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<EvidenceInterface>({
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
        url: "",
        ubicaciones: []
    })
    const [documento, setDocumento] = useState<FileList | null>(null)
    const [listPoints, setListPoints] = useState<Coordinates[]>([])

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const [map, setMap] = useState<google.maps.Map|null>(null);
    const [ubication, setUbication] = useState<Coordinates>({lat: 10.96854, lng: -74.78132});

    useEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            setUbication({lat: position.coords.latitude, lng: position.coords.longitude})
        }, (error) => {
            console.log(error)
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        })
    }, []);

    useEffect(()=> {
        //To DO: obtener localidades para hacer el select
    }, [])

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, []);

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat && lng) {
            const exist = listPoints.find((point) => point.lat === lat && point.lng === lng)
            if (exist) return;
            setListPoints([...listPoints, {lat, lng}])
        }
    }

    const handleDeleteMarker = (index: number) => {
        const newList = listPoints.filter((point, i) => i !== index);
        setListPoints(newList);
    }

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
        setLoading(true)
        await addEvicenceGoal(plan?.id_plan! , unit.code, data, documento![0], listPoints)
        .then(() => {
            setLoading(false)
            alert('Evidencia añadida con exito')
        })
        .catch((err) => {
            setLoading(false)
            console.log(err);
            alert('Error al añadir evidencia')
        })
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
            <div className="tw-mx-3 tw-mt-2">
                <header className=" tw-border-4 tw-border-double
                                    tw-border-gray-500 
                                    tw-flex tw-bg-slate-200">
                    <BackBtn handle={handleBack} id={idPDT}/>
                    <h1 className=" tw-text-3xl tw-text-center 
                                    tw-font-bold tw-text-blue-700
                                    tw-grow">
                        Memoria de avance del Plan
                    </h1>
                </header>
                <table className="  tw-mt-3 tw-w-full 
                                    tw-text-center
                                    tw-bg-slate-200">
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
                <section className="tw-bg-slate-200
                                    tw-border-4 tw-border-double
                                    tw-border-gray-500
                                    tw-mt-3 tw-px-3">
                    <p className="tw-mt-3">
                        Fecha: { new Date().toLocaleDateString()} &nbsp;&nbsp;&nbsp;&nbsp;
                        Hora: { new Date().toLocaleTimeString()}
                    </p>
                    <div className="tw-flex tw-flex-col md:tw-flex-row">
                        <p className="tw-font-bold tw-mt-4">
                            Lugar:
                        </p>
                        <input  className=" tw-py-4 tw-px-2 tw-mt-4
                                            tw-grow 
                                            tw-border-4 tw-border-gray-400
                                            tw-rounded
                                            md:tw-ml-2"
                                type="text" 
                                value={unit.indicator??""}
                                readOnly
                                name="" 
                                id=""/>
                    </div>
                    <div className="tw-flex">
                        <p className="  tw-font-bold tw-mt-4 
                                        tw-justify-self-start
                                        tw-break-words ">
                            Responsable del cargo:
                        </p>
                        <input  className=" tw-py-4 tw-px-2 tw-mt-4
                                            tw-grow 
                                            tw-border-4 tw-border-gray-400
                                            tw-rounded
                                            md:tw-ml-2" 
                                type="text"
                                value={unit.responsible??"Por asignar"}
                                readOnly
                                name="" 
                                id="" />
                    </div>
                    <div className="tw-flex">
                        <p className="  tw-font-bold tw-mt-4
                                        tw-justify-self-start
                                        tw-break-words">
                            Descripción:
                        </p>
                        <input  className=" tw-py-4 tw-px-2 tw-mt-4
                                            tw-grow 
                                            tw-border-4 tw-border-gray-400
                                            tw-rounded
                                            md:tw-ml-2" 
                                type="text"
                                value={unit.description??"Por asignar"}
                                readOnly
                                name="" 
                                id=""/>
                    </div>
                    <div className="tw-flex tw-justify-center tw-my-4">
                        <button className=" tw-bg-blue-500
                                            tw-p-4
                                            tw-rounded
                                            tw-text-white tw-font-bold"
                                            onClick={handleSubmitButton}>
                            cargar evidencias de esta meta
                        </button>
                    </div>
                </section>
            </div>
        )
    }

    const evidencias = () =>{
        if (unit === undefined) return;
        return(
            <div className="tw-mx-3 tw-mt-2">
                <header className=" tw-flex tw-flex-col
                                    tw-border-4 tw-border-double
                                    tw-border-gray-500 tw-bg-slate-200">
                    <h1 className=" tw-text-3xl tw-font-bold tw-text-center tw-text-blue-700">Evidencias de la meta</h1>
                    <button className="inline-block" onClick={ (e) => handleSubmitButton(e)} >return</button>
                </header>
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
                                            tw-bg-white ">{unit.code}</label>
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
                                <option value="num">num</option>
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
                        <div className="tw-ml-3">
                            <button className=" tw-px-1 tw-mb-1
                                                tw-bg-white hover:tw-bg-gray-300
                                                tw-border-gray-400
                                                tw-rounded tw-border-2"
                                    onClick={()=>{}}
                                    type="button">
                                Cargar en el mapa
                            </button>
                            {isLoaded ? 
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={ubication}
                                    zoom={15}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                    onClick={handleMapClick}>
                                    {listPoints.map((point, index) => (
                                        <Marker key={index} 
                                                position={point}
                                                onClick={()=>handleDeleteMarker(index)} />
                                    ))}
                                    <MarkerComponent lat={ubication.lat} lng={ubication.lng} />
                                </GoogleMap>
                            :(<></>)}
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
                                <option value="Infantes">Infantes</option>
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
                                <option value="Privado">Sector privado</option>
                                <option value="Publico">Sector publico</option>
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
            </div>
        )
    }

    return(
        cargar ? evidencias():memorias()
    )
}
