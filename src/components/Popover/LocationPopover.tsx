import { useState, useCallback } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { Popover } from 'react-tiny-popover';

import { useAppDispatch, useAppSelector } from '@/store';
import { setPoints } from '@/store/evidence/evidenceSlice';

import { LocationIcon } from '@/assets/icons';
import { Coordinates, PopoverProps } from '@/interfaces';
import icono from "@/assets/icons/location.svg";

const API_KEY = process.env.VITE_API_KEY_MAPS as string;

export const LocationPopover = (props: PopoverProps) => {
    const [poLocationIsOpen, setPoLocationIsOpen] = useState(false);
    const toggleOpen = () => setPoLocationIsOpen(!poLocationIsOpen);
    let red = '#EF4444';
    let green = '#86EFAC';
    let locationSelected = !!props.item.lat && !!props.item.lng;

    return (
        <Popover
            isOpen={poLocationIsOpen}
            positions={['right']}
            content={mapContainer(props)}
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
            positions={['right']}
            content={mapContainerUbi()}
            onClickOutside={toggleOpen}>
            <button type="button" onClick={toggleOpen}>
                <LocationIcon color={red}/>
            </button>
        </Popover>
    );
}

let contentStyle: React.CSSProperties = {
    background: 'white',
    width: '400px',
    height: '250px',
    borderRadius: '15px'
};

const mapContainer = (props: PopoverProps) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);

    const { planLocation } = useAppSelector(state => state.plan);

    let options: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoom: 12,
        restriction: {
            latLngBounds: {
                north: 13.011493,
                east: -66.9,
                south: -4.334669,
                west: -79.314914
            }
        },
        center: planLocation
    };

    let item = props.item;
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        if (item.lat && item.lng) {
            let markerPosition: google.maps.LatLngLiteral = {
                lat: item.lat,
                lng: item.lng
            };
            let markerOptions = {
                clickable: false,
                draggable: false,
                position: markerPosition,
                map
            };
            setMarker(new google.maps.Marker(markerOptions));
        }
        setMap(map);
    }, [props.item]);

    const onUnmount = useCallback(function callback() {
        setMap(null);
        setMarker(null);
    }, []);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!map) return;
        let markerPosition: google.maps.LatLngLiteral = {
            lat: e.latLng?.lat()!,
            lng: e.latLng?.lng()!
        };

        let markerOptions = {
            clickable: false,
            draggable: false,
            position: markerPosition,
            map
        };
        if (!marker) {
            setMarker(new google.maps.Marker(markerOptions));
        } else {
            marker.setOptions(markerOptions);
        }
        props.callback(markerPosition, props.index);
    };

    return (
        <div>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={contentStyle}
                    center={planLocation}
                    zoom={4}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={options}
                    onClick={handleMapClick}>
                </GoogleMap>
            ) : <p>Cargando...</p>}
        </div>
    );

}

const mapContainerUbi = () => {
    const dispatch = useAppDispatch();
    const { list_points } = useAppSelector(state => state.evidence);

    const [map, setMap] = useState<google.maps.Map|null>(null);
    const [markers_, setMarkers_] = useState<JSX.Element[]>([]);
    const { planLocation } = useAppSelector(state => state.plan);

    let options: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoom: 12,
        restriction: {
            latLngBounds: {
                north: 13.011493,
                east: -66.9,
                south: -4.334669,
                west: -79.314914
            }
        },
        center: planLocation
    };

    let markers = list_points.map((point, index) => (
        <Marker 
            key={index} 
            position={{lat:point.lat, lng:point.lng}}
            icon={{
                url: icono,
                scaledSize: new window.google.maps.Size(30, 30),
            }}
            onClick={()=>handleDeleteMarker(index)} />
    ));

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
        setMarkers_(markers);
    }, [list_points]);

    const onUnmount = useCallback(function callback() {
    }, []);

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat && lng) {
            const exist = list_points.find((point) => point.lat === lat && point.lng === lng);
            if (exist) return;
            setMarkers_([...markers_, <Marker
                key={list_points.length}
                position={{ lat, lng }}
                icon={{
                    url: icono,
                    scaledSize: new window.google.maps.Size(30, 30),
                }}
                onClick={()=>handleDeleteMarker(list_points.length)} />]);
            const newList = [...list_points, { lat, lng }];
            dispatch(setPoints(newList));
        }
    };

    const handleDeleteMarker = (index: number) => {
        const newList = list_points.filter((point, i) => i !== index);
        dispatch(setPoints(newList));
    };

    return (
        <div>
            {isLoaded ? 
                <GoogleMap
                    mapContainerStyle={contentStyle}
                    center={planLocation}
                    zoom={10}
                    options={options}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}>
                    {markers}
                </GoogleMap>
            :<p>Cargando...</p>}
        </div>
    );
}