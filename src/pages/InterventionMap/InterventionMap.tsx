import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MapContainer, TileLayer, Marker,
    Popup, Rectangle } from 'react-leaflet';
import { Icon } from 'leaflet';

import { useAppSelector } from '@/store';

import { BackBtn, Frame, SecretarySelect } from '@/components';

import MarkerIcon from '@/assets/icons/location.svg';
import "react-toastify/dist/ReactToastify.css";
import 'leaflet/dist/leaflet.css';

export const InterventionMap = () => (
    <Frame>
        <Section />
    </Frame>
);

const Section = () => {
    const navigate = useNavigate();

    const { planLocation, bounding1, bounding2,
        bounding3, bounding4 } = useAppSelector(store => store.plan);
    const { id_plan, locs, secretary } = useAppSelector(store => store.content);

    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (locs.length === 0) {
            setMarkers([]);
        } else {
            let markers: JSX.Element[] = [];
            locs.forEach(loc => {
                const { lat, lng } = loc;
                const marker = 
                <Marker key={loc.lat+loc.date}
                    position={[lat, lng]}
                    icon={new Icon({
                        iconUrl: MarkerIcon,
                        iconSize: [25,41],
                        iconAnchor: [12, 41]
                    })}>
                    <Popup>
                        <div className="tw-space-y-1 tw-text-sm">
                            <div className='tw-flex tw-gap-1'>
                                <span className='tw-font-bold'>Fecha:</span>
                                <span>{loc.date.split('T')[0]}</span>
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
                </Marker>
                markers.push(marker);
            });
            //evidences.forEach((item) => {
            //    item.locations.forEach((location, index) => {
            //        const { lat, lng } = location;
            //        const marker__ = <Marker key={item.id_evidence + index} 
            //            position={[lat, lng]}>
            //            <Popup>
            //                {item.date.split('T')[0]} <br /><br />
            //                {item.name} <br /><br />
            //                {item.activitiesDesc} <br />
            //                {item.responsible}
            //            </Popup>
            //        </Marker>
            //        markers__.push(marker__);
            //    });
            //});
            setMarkers(markers);
        }
    }, [locs]);

    const handleBack = () => navigate(-1);

    
    return (
        planLocation === undefined ? (
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
                    <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-flex-wrap">
                        <SecretarySelect />
                        {secretary !== 'void' && (
                            <span className="tw-bg-green-100 tw-text-green-800 tw-px-4 tw-py-2 tw-rounded-lg tw-font-semibold tw-shadow">
                                {secretary}
                            </span>
                        )}
                    </div>
                    <div className="tw-w-full tw-h-[60vh] tw-rounded-xl tw-overflow-hidden tw-mt-2">
                        <MapContainer
                            center={[planLocation.lat, planLocation.lng]}
                            zoom={13}
                            bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                            scrollWheelZoom={false}
                            className="tw-w-full tw-h-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {markers}
                            <Rectangle
                                bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                                pathOptions={{color:'blue', fillOpacity: 0}}
                            />
                        </MapContainer>
                    </div>
                </div>
            </div>
        )
    );
}