import { useState, useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Rectangle,
    useMapEvents,
    useMap } from 'react-leaflet';
import L, { latLng, Icon } from 'leaflet';
import { Popover } from 'react-tiny-popover';

import { useAppDispatch, useAppSelector } from '@/store';
import { setPoints } from '@/store/evidence/evidenceSlice';
import { Coordinates } from '@/interfaces';

import { LocationIcon } from '@/assets/icons';
import { PopoverProps } from '@/interfaces';

import MarkerIcon from '@/assets/icons/location.svg';

const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    }, [map]);
    return null;
};

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
    const [modalOpen, setModalOpen] = useState(false);
    // Elimina hasLocation y su lógica
    // const [hasLocation, setHasLocation] = useState(false);
    // const { list_points } = useAppSelector(store => store.evidence);
    // useEffect(() => {
    //     setHasLocation(list_points && list_points.length > 0);
    // }, [list_points]);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    return (
        <div className="tw-flex tw-flex-col tw-items-center">
            <button
                type="button"
                onClick={openModal}
                className="tw-px-4 tw-py-2 tw-rounded tw-font-bold tw-transition-colors tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white"
            >
                Asignar ubicación
            </button>
            {modalOpen && (
                <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center">
                    {/* Fondo semitransparente */}
                    <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-40" onClick={closeModal}></div>
                    {/* Modal */}
                    <div className="tw-relative tw-z-10 tw-bg-white tw-rounded-lg tw-shadow-2xl tw-border-2 tw-border-blue-300 tw-p-4 tw-max-w-lg tw-w-full tw-mx-4">
                        <button
                            className="tw-absolute tw-top-2 tw-right-2 tw-text-gray-500 hover:tw-text-red-500 tw-text-xl tw-font-bold tw-z-20"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                        <div className="tw-mb-2 tw-text-lg tw-font-semibold tw-text-blue-700 tw-text-center">Selecciona la ubicación en el mapa</div>
                        <MapContainerUbi />
                    </div>
                </div>
            )}
        </div>
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
    } = useAppSelector(store => store.plan);

    return (
        planLocation === undefined ?
        <p>Cargando...</p>:
        <MapContainer
            style={{height: '250px', width: '400px'}}
            center={[planLocation.lat,planLocation.lng]}
            zoom={13}
            bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
            scrollWheelZoom={false}>
            <ResizeMap/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} callback={setPosition}/>
            <Rectangle
                bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                pathOptions={{color:'blue', fillOpacity: 0}}
            />
        </MapContainer>
    );
}

const UbiMarker = () => {
    const dispatch = useAppDispatch();
    const { list_points } = useAppSelector(store => store.evidence);
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
                key={i}
                eventHandlers={{
                    click: hola
                }}
                position={[p.lat, p.lng]}
            />
        )
}


//delete L.Icon.Default.prototype._getIconUrl;
//L.Icon.Default.mergeOptions({
//    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
//});
const MapContainerUbi = () => {
    const dispatch = useAppDispatch();

    const {
        planLocation,
        bounding1,
        bounding2,
        bounding3,
        bounding4
    } = useAppSelector(store => store.plan);

    const [markers, setMarkers] = useState<Coordinates[]>([]);
    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                const markerExists = markers.some(marker => marker.lat === lat && marker.lng === lng);
                if (!markerExists) {
                    setMarkers([...markers, { lat, lng }]);
                }
            },
        });
        return null;
    };

    useEffect(() => {
        dispatch(setPoints(markers));
    }, [markers]);

    const handleMarkerClick = (index: number) => {
        //console.log('hoka');
        setMarkers(markers.filter((_, i) => i !== index));
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
            <ResizeMap/>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents/>
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={[marker.lat, marker.lng]}
                    icon={new Icon({
                        iconUrl: MarkerIcon,
                        iconSize: [25,41],
                        iconAnchor: [12, 41]
                    })}
                    eventHandlers={{
                        click: () => handleMarkerClick(index)
                    }}
                />
            ))}
            
            <Rectangle
                bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                pathOptions={{color:'blue', fillOpacity: 0}}
            />
        </MapContainer>
    );
}

/*<MapEvents/>
{markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={[marker.lat, marker.lng]}
                    eventHandlers={{
                        click: () => handleMarkerClick(index)
                    }}
                />
            ))}
*/

//const { list_points } = useAppSelector(store => store.evidence);
//const handleDeleteMarker = (index: number) => {
//    const newList = list_points.filter((point, i) => i !== index);
//    dispatch(setPoints(newList));
//};
//<UbiMarker/>