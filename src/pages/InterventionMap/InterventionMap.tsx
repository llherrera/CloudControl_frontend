import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { notify } from '@/utils';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Rectangle } from 'react-leaflet';
import { Icon } from 'leaflet';

import { useAppSelector } from '@/store';

import {
    BackBtn,
    Frame,
    LevelsFilters,
    SecretarySelect,
    LocationSelect } from '@/components';
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

    const {
        planLocation, 
        bounding1, 
        bounding2, 
        bounding3, 
        bounding4 } = useAppSelector(store => store.plan);
    const { id_plan, locs, secretary } = useAppSelector(store => store.content);

    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    //ubicaciones
    useEffect(() => {
        const fetch = async () => {
            await getUbiEvidences(id_plan)
            .then((res)=> {
                localStorage.setItem('evidences', JSON.stringify(res));
                if (res.length === 0)
                    notify("No hay evidencias para mostrar");
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
                        {loc.date.split('T')[0]} <br /><br />
                        {loc.name}<br/><br/>
                        {loc.activitiesDesc}<br/><br/>
                        {loc.responsible}
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