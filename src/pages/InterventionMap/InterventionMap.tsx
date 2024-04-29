import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notify } from '@/utils';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Rectangle } from 'react-leaflet';

import { useAppSelector } from '@/store';

import {
    BackBtn,
    Frame,
    LevelsFilters,
    SecretarySelect,
    LocationSelect } from '@/components';
import { getUbiEvidences } from '@/services/api';

import "react-toastify/dist/ReactToastify.css";
import 'leaflet/dist/leaflet.css';

export const InterventionMap = () => {
    return (
        <Frame
            data={<Section/>}
        />
    );
}

const Section = () => {
    const navigate = useNavigate();

    const {
        planLocation, 
        bounding1, 
        bounding2, 
        bounding3, 
        bounding4 } = useAppSelector(state => state.plan);
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
                    position={[lat, lng]}>
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
        <div className={`tw-bg-[url('/src/assets/images/bg-pi-1.png')]
                         tw-bg-cover
                         tw-h-full tw-border
                         tw-opacity-80`} >
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
            <ToastContainer />

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
                    />
                </MapContainer>
                
                <h2 className=' tw-absolute tw-w-1/4
                                tw-top-2 tw-z-50
                                tw-translate-x-1/4
                                tw-bg-white tw-p-2
                                tw-rounded
                                tw-font-bold
                                tw-text-wrap'>
                    {secretary}
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