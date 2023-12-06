import { LocationIcon } from '@/assets/icons';
import { LocationInterface } from '@/interfaces';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { useCallback, useState } from 'react';
import { Popover } from 'react-tiny-popover'

interface PopoverProps {
    callback: Function,
    index: number,
    item: LocationInterface
}


const API_KEY = import.meta.env.VITE_API_KEY_MAPS as string;

export const LocationPopover = (props: PopoverProps) => {
    const [poLocationIsOpen, setPoLocationIsOpen] = useState(false);
    const toggleOpen = () => setPoLocationIsOpen(!poLocationIsOpen)

    return (
        <Popover
            isOpen={poLocationIsOpen}
            positions={['right']}
            content={mapContainer(props)}
            onClickOutside={toggleOpen}>
            <button type="button" onClick={toggleOpen}>
                <LocationIcon />
            </button>
        </Popover>
    );
}

const mapContainer = (props: PopoverProps) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    let item = props.item;
    let centerLocation = { lat: 4.713237, lng: -74.78132 }
    let contentStyle: React.CSSProperties = {
        background: 'white',
        width: '400px',
        height: '250px',
        borderRadius: '15px'
    }
    let options: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoom: 0,
        restriction: {
            latLngBounds: {
                north: 13.011493,
                east: -66.9,
                south: -4.334669,
                west: -79.314914
            }
        }
    }
    if (item.LAT && item.LNG){
        centerLocation = {
            lat: item.LAT,
            lng: item.LNG
        }
        options.zoom = 12
    }
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        if (item.LAT && item.LNG) {
            let markerPosition: google.maps.LatLngLiteral = {
                lat: item.LAT,
                lng: item.LNG
            }
            let markerOptions = {
                clickable: false,
                draggable: false,
                position: markerPosition,
                map
            }
            setMarker(new google.maps.Marker(markerOptions));
        }
        setMap(map);
    }, [props.item])

    const onUnmount = useCallback(function callback() {
        setMap(null);
        setMarker(null);
    }, [])

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!map) return;
        let markerPosition: google.maps.LatLngLiteral = {
            lat: e.latLng?.lat()!,
            lng: e.latLng?.lng()!
        }

        let markerOptions = {
            clickable: false,
            draggable: false,
            position: markerPosition,
            map
        }
        if (!marker) {
            setMarker(new google.maps.Marker(markerOptions));
        } else {
            marker.setOptions(markerOptions);
        }
        props.callback(markerPosition, props.index);
    }


    return (
        <div>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={contentStyle}
                    center={centerLocation}
                    zoom={4}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={options}
                    onClick={handleMapClick}>
                </GoogleMap>
            ) : <p>Cargando...</p>}
        </div>
    )

}
