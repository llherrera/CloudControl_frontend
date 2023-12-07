import { LocationIcon } from '@/assets/icons';
import { LocationInterface } from '@/interfaces';
import { useAppSelector } from '@/store';
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

const mapContainer = (props: PopoverProps) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const { planLocation } = useAppSelector(state => state.plan);

    let item = props.item;
    let contentStyle: React.CSSProperties = {
        background: 'white',
        width: '400px',
        height: '250px',
        borderRadius: '15px'
    }
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
    }
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        if (item.lat && item.lng) {
            let markerPosition: google.maps.LatLngLiteral = {
                lat: item.lat,
                lng: item.lng
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
                    center={planLocation}
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
