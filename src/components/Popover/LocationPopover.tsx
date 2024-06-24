import { useState, useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Rectangle,
    useMapEvents } from 'react-leaflet';
import { Popover } from 'react-tiny-popover';

import { useAppDispatch, useAppSelector } from '@/store';
import { setPoints } from '@/store/evidence/evidenceSlice';

import { LocationIcon } from '@/assets/icons';
import { PopoverProps } from '@/interfaces';

import 'leaflet/dist/leaflet.css';

export const LocationPopover = (props: PopoverProps) => {
    const [poLocationIsOpen, setPoLocationIsOpen] = useState(false);
    const toggleOpen = () => setPoLocationIsOpen(!poLocationIsOpen);
    let red = '#EF4444';
    let green = '#86EFAC';
    let locationSelected = !!props.item.lat && !!props.item.lng;

    return (
        <Popover
            isOpen={poLocationIsOpen}
            positions={['right', 'left', 'top', 'bottom']}
            content={MapContainer_(props)}
            onClickOutside={toggleOpen}>
            <button type="button" onClick={toggleOpen}>
                <LocationIcon color={locationSelected ? green:red} />
            </button>
        </Popover>
    );
}

export const UbicationsPopover = () => {
    const [poLocationIsOpen, setPoLocationIsOpen] = useState(false);
    const toggleOpen = () => setPoLocationIsOpen(!poLocationIsOpen);
    let red = '#EF4444';

    return (
        <Popover
            isOpen={poLocationIsOpen}
            positions={['right', 'left', 'top', 'bottom']}
            content={MapContainerUbi()}>
            <button type="button" onClick={toggleOpen}>
                <LocationIcon color={red}/>
            </button>
        </Popover>
    );
}

const LocationMarker = ({position, callback}: {position: number[],callback: Function}) => {
    const map = useMapEvents({
        click(e) {
            callback([e.latlng.lat, e.latlng.lng])
        },
    });

    return position.length === 0 ? <div/>:
        <Marker position={[position[0], position[1]]}/>
}

const MapContainer_ = (props: PopoverProps) => {
    const [position, setPosition] = useState<number[]>([]);

    useEffect(() => {
        if (position.length === 0) return;
        props.callback({lat: position[0], lng: position[1]}, props.index)
    }, [position]);

    const {
        planLocation,
        bounding1,
        bounding2,
        bounding3,
        bounding4
    } = useAppSelector(state => state.plan);

    return (
        planLocation === undefined ?
        <p>Cargando...</p>:
        <MapContainer
            style={{height: '250px', width: '400px'}}
            center={[planLocation.lat,planLocation.lng]}
            zoom={13}
            bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
            scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} callback={setPosition}/>
            <Rectangle
                bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
            />
        </MapContainer>
    );
}

const UbiMarker = () => {
    const dispatch = useAppDispatch();
    const { list_points } = useAppSelector(state => state.evidence);
    const hola = () => console.log('hhh');
    const map = useMapEvents({
        click(e) {
            let markerPosition = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };
            let newList = [...list_points, markerPosition];
            dispatch(setPoints(newList));
        },
    });

    return list_points.length === 0 ? [<div/>] :
        list_points.map((p, i) => 
            <Marker
                key={p.lat}
                eventHandlers={{
                    click: hola
                }}
                position={[p.lat, p.lng]}
            />
        )
}

const MapContainerUbi = () => {
    const dispatch = useAppDispatch();

    //const [map, setMap] = useState<google.maps.Map|null>(null);
    //const [markers_, setMarkers_] = useState<google.maps.Marker[]>([]);
    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    const {
        planLocation,
        bounding1,
        bounding2,
        bounding3,
        bounding4
    } = useAppSelector(state => state.plan);
    const { list_points } = useAppSelector(state => state.evidence);

    const handleDeleteMarker = (index: number) => {
        const newList = list_points.filter((point, i) => i !== index);
        dispatch(setPoints(newList));
    };

    return (
        planLocation === undefined ?
        <p>Cargando...</p>:
        <MapContainer
            style={{height: '250px', width: '400px'}}
            center={[planLocation.lat,planLocation.lng]}
            zoom={13}
            bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
            scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {UbiMarker()}
            <Rectangle
                bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
            />
        </MapContainer>
    );
}
