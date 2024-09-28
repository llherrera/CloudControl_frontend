import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { notify } from '@/utils';
import { MapContainer, TileLayer, Marker,
    Popup, Rectangle } from 'react-leaflet';
import { Icon } from 'leaflet';

import { useAppSelector } from '@/store';

import { BackBtn, Frame, SecretarySelect } from '@/components';
import { getUbiEvidences } from '@/services/api';

import MarkerIcon from '@/assets/icons/location.svg';
import "react-toastify/dist/ReactToastify.css";
import 'leaflet/dist/leaflet.css';

export const InterventionMap = () => {
    return (
        <Frame>
            <Section/>
        </Frame>
    );
}

const Section = () => {
    const navigate = useNavigate();

    const { planLocation, bounding1, bounding2,
        bounding3, bounding4 } = useAppSelector(store => store.plan);
    const { id_plan, locs, secretary } = useAppSelector(store => store.content);

    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    //ubicaciones
    useEffect(() => {
        const fetch = async () => {
            await getUbiEvidences(id_plan)
            .then(res => {
                localStorage.setItem('evidences', JSON.stringify(res));
                if (res.length === 0) notify("No hay evidencias para mostrar");
            });
        }
        fetch();
    }, []);

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
                        <div>
                            <div className='tw-flex tw-gap-1 tw--mb-4'>
                                <p className='tw-font-bold'>Fecha de evidencia: </p>
                                <p>{loc.date.split('T')[0]}</p>
                            </div>
                            <p className='tw-font-bold'>{loc.responsible}</p>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Meta:</p> <p>{loc.code}</p>
                            </div>
                            <p>{loc.name}</p>
                            <div className='tw-flex tw-gap-1'>
                                <p className='tw-font-bold'>Actividades: </p>
                                <p>{loc.activitiesDesc}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Población beneficiada:</p>
                                <p>{loc.benefited_population}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Cantidad de personas beneficiadas:</p>
                                <p>{loc.benefited_population_number}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Fuente de recursos:</p><p>{loc.resource_font}</p>
                            </div>
                            <div className='tw-flex tw-gap'>
                                <p className='tw-font-bold'>Recursos ejecutados:</p><p>{loc.executed_resources}</p>
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
        planLocation === undefined ?
        <p>Cargando...</p>:
        <div className={``} >
            <div className='tw-flex tw-my-4'>
                <BackBtn handle={handleBack} id={id_plan} />
                <h1 className='tw-grow tw-text-center'>
                    <p className='  tw-inline-block tw-bg-white
                                    tw-p-2 tw-rounded
                                    tw-font-bold tw-text-xl'>
                        Mapa de intervenciones
                    </p>
                </h1>
            </div>

            <div className='tw-flex tw-justify-center
                            tw-gap-2 tw-mx-2 tw-pb-2
                            tw-relative'>
                <SecretarySelect/>
                <MapContainer
                    center={[planLocation.lat, planLocation.lng]}
                    zoom={13}
                    bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                    scrollWheelZoom={false}>
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
                
                <h2 className=' tw-absolute tw-w-1/4
                                tw-top-2 tw-z-50
                                tw-translate-x-1/4
                                tw-bg-white tw-p-2
                                tw-h-10
                                tw-rounded
                                tw-font-bold
                                tw-text-wrap'>
                    {secretary === 'void' ? '' : secretary}
                </h2>
            </div>
        </div>
    );
}

/*
<div className='tw-flex tw-justify-center'>
                <SecretarySelect/>
                <LevelsFilters/>
                <LocationSelect/>
            </div>
            <div className='tw-flex tw-justify-center tw-pb-3'>
                <MapContainer
                    center={[planLocation.lat,planLocation.lng]}
                    zoom={13}
                    bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                    scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers}
                    <Rectangle
                        bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                    />
                </MapContainer>
            </div>
*/