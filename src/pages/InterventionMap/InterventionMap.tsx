import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Popup, Rectangle, useMap, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import { toast } from 'react-toastify';

import { decode } from '@/utils';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetMapZoomByPlan, thunkUpdateMapZoomByPlan } from '@/store/plan/thunks';

import { BackBtn, Frame, SecretarySelect } from '@/components';

import MarkerIcon from '@/assets/icons/location.svg';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

const DEFAULT_INDICATOR_COLOR = '#3388ff'; // fallback color (Leaflet default-ish)

export const InterventionMap = () => (
    <Frame>
        <Section />
    </Frame>
);

const Section = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { planLocation, bounding1, bounding2, bounding3, bounding4, secretaries: planSecretaries } = useAppSelector(store => store.plan);
    const { id_plan, locs, secretary } = useAppSelector(store => store.content);
    const [mapZoom, setMapZoom] = useState<number>(13);
    const [isSavingZoom, setIsSavingZoom] = useState(false);
    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    const { token_info } = useAppSelector(store => store.auth);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            const rolUsuario = decoded.rol || '';
            setIsAdmin(rolUsuario === 'admin');
        }
    }, [token_info]);

    useEffect(() => {
        if (locs.length === 0) {
            setMarkers([]);
        } else {
            const markersList = locs.map(loc => {
                const { lat, lng } = loc;

                // Buscamos la secretaria responsable por nombre (ajusta si usas otro campo)
                const foundSec = planSecretaries?.find(s => {
                    // Normalizamos por seguridad (trim & comparar lowercase)
                    if (!s?.name || !loc?.responsible) return false;
                    return s.name.trim().toLowerCase() === String(loc.responsible).trim().toLowerCase();
                });

                const secColor = (foundSec && foundSec.color) ? foundSec.color : DEFAULT_INDICATOR_COLOR;

                return (
                    <CircleMarker
                        key={String(lat) + String(loc.date)}
                        center={[lat, lng]}
                        radius={8}
                        pathOptions={{ color: secColor, fillColor: secColor, fillOpacity: 1 }}
                    >
                        <Popup>
                            <div className="tw-space-y-1 tw-text-sm">
                                <div className='tw-flex tw-gap-1'>
                                    <span className='tw-font-bold'>Fecha:</span>
                                    <span>{loc.date?.split?.('T')?.[0]}</span>
                                </div>
                                <div className='tw-font-bold'>{loc.responsible}</div>
                                <div className='tw-flex tw-gap-1'>
                                    <span className='tw-font-bold'>Meta:</span>
                                    <span>{loc.code}</span>
                                </div>
                                <div className='tw-font-semibold'>{loc.name}</div>
                                <div className='tw-flex tw-gap-1'>
                                    <span className='tw-font-bold'>Actividades:</span>
                                    <span>{loc.activitiesDesc}</span>
                                </div>
                                <div className='tw-flex tw-gap-1'>
                                    <span className='tw-font-bold'>Población beneficiada:</span>
                                    <span>{loc.benefited_population}</span>
                                </div>
                                <div className='tw-flex tw-gap-1'>
                                    <span className='tw-font-bold'>Cantidad beneficiados:</span>
                                    <span>{loc.benefited_population_number}</span>
                                </div>
                                <div className='tw-flex tw-gap-1'>
                                    <span className='tw-font-bold'>Fuente recursos:</span>
                                    <span>{loc.resource_font}</span>
                                </div>
                                <div className='tw-flex tw-gap-1'>
                                    <span className='tw-font-bold'>Recursos ejecutados:</span>
                                    <span>{loc.executed_resources}</span>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            });
            setMarkers(markersList);
        }
    }, [locs, planSecretaries]);

    useEffect(() => {
        if (id_plan) {
            console.log('[useEffect] id_plan detectado:', id_plan);

            dispatch(thunkGetMapZoomByPlan(id_plan))
                .unwrap()
                .then((zoomStr) => {
                    const zoomParsed = parseInt(zoomStr);
                    if (!isNaN(zoomParsed)) {
                        setMapZoom(zoomParsed);
                    } else {
                        console.warn('[useEffect] zoomParsed no es un número válido:', zoomStr);
                    }
                })
                .catch((error) => {
                    console.error('[useEffect] Error al obtener zoom por defecto:', error);
                    toast.error("Error al obtener zoom por defecto");
                });
        }
    }, [id_plan, dispatch]);

    function ZoomUpdater({ zoom }: { zoom: number }) {
        const map = useMap();

        useEffect(() => {
            if (!isNaN(zoom)) {
                map.setZoom(zoom);
                console.log('[ZoomUpdater] Zoom actualizado dinámicamente a:', zoom);
            }
        }, [zoom, map]);

        return null;
    }

    const handleBack = () => navigate(-1);

    return planLocation === undefined ? (
        <div className="tw-flex tw-justify-center tw-items-center tw-h-[60vh]">
            <div className="tw-bg-white tw-shadow-lg tw-rounded-xl tw-p-8 tw-text-center">
                <p className="tw-text-lg tw-font-semibold tw-text-gray-700">Cargando...</p>
            </div>
        </div>
    ) : (
        <div className="tw-bg-gray-50 tw-min-h-[80vh] tw-py-6 tw-p-8 tw-m-6 tw-rounded-2xl">
            {/* Cabecera */}
            <div className="tw-flex tw-items-center tw-mb-4 tw-gap-2">
                <BackBtn handle={handleBack} id={id_plan} />
                <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800 tw-grow tw-text-center">
                    Mapa de intervenciones
                </h1>
            </div>

            {/* Card de filtro y mapa */}
            <div className="tw-bg-white tw-shadow-xl tw-rounded-2xl tw-p-4 tw-flex tw-flex-col tw-gap-4 tw-mx-auto tw-max-w-6xl">

                {/* Filtros y rol */}
                <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-flex-wrap">
                    <SecretarySelect />
                    {secretary !== 'void' && (
                        <span className="tw-bg-green-100 tw-text-green-800 tw-px-4 tw-py-2 tw-rounded-lg tw-font-semibold tw-shadow">
                            {secretary}
                        </span>
                    )}
                </div>

                {/* Mapa */}
                <div className="tw-w-full tw-h-[60vh] tw-rounded-xl tw-overflow-hidden tw-mt-2">
                    <MapContainer
                        center={[planLocation.lat, planLocation.lng]}
                        zoom={mapZoom}
                        bounds={[[bounding1, bounding3], [bounding2, bounding4]]}
                        scrollWheelZoom={false}
                        className="tw-w-full tw-h-full"
                    >
                        <ZoomUpdater zoom={mapZoom} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {markers}
                        <Rectangle
                            bounds={[[bounding1, bounding3], [bounding2, bounding4]]}
                            pathOptions={{ color: 'blue', fillOpacity: 0 }}
                        />
                    </MapContainer>
                </div>

                {/* Controles de zoom para admin */}
                {isAdmin && (
                    <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-xl tw-p-4 tw-flex tw-flex-wrap tw-items-center tw-gap-4 tw-mt-4">
                        <label className="tw-text-blue-800 tw-font-semibold tw-text-sm sm:tw-text-base">
                            Configurar zoom por defecto:
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={18}
                            value={mapZoom}
                            onChange={(e) => setMapZoom(Number(e.target.value))}
                            className="tw-w-24 tw-px-3 tw-py-2 tw-border tw-rounded-md tw-shadow-sm tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                        />
                        <button
                            disabled={isSavingZoom}
                            onClick={async () => {
                                if (!id_plan) return;
                                try {
                                    setIsSavingZoom(true);
                                    await dispatch(thunkUpdateMapZoomByPlan({ id_plan, mapZoom: mapZoom.toString() })).unwrap();
                                    toast.success("Zoom actualizado");
                                } catch {
                                    toast.error("Error al guardar zoom");
                                } finally {
                                    setIsSavingZoom(false);
                                }
                            }}
                            className={`tw-px-4 tw-py-2 tw-rounded-md tw-font-medium tw-text-sm
        ${isSavingZoom
                                    ? 'tw-bg-gray-400 tw-cursor-not-allowed tw-text-white'
                                    : 'tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white'}
      `}
                        >
                            {isSavingZoom ? 'Guardando...' : 'Guardar zoom'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Section;
