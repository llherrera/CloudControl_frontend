import { useState, useCallback, useEffect } from 'react';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { Popover } from 'react-tiny-popover';

import { useAppDispatch, useAppSelector } from '@/store';
import { setPoints } from '@/store/evidence/evidenceSlice';

import { LocationIcon } from '@/assets/icons';
import { Coordinates, PopoverProps } from '@/interfaces';
import { getEnvironment } from '@/utils/environment';

const { API_KEY } = getEnvironment();

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
        googleMapsApiKey: API_KEY!
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
    const [markers_, setMarkers_] = useState<google.maps.Marker[]|null>(null);
    const { planLocation } = useAppSelector(state => state.plan);

    useEffect(() => {
        if (list_points.length > 0) {
            let markers: google.maps.Marker[] = [];
            list_points.forEach((point) => {
                let markerPosition: google.maps.LatLngLiteral = {
                    lat: point.lat,
                    lng: point.lng
                };
                let markerOptions = {
                    clickable: false,
                    draggable: false,
                    position: markerPosition,
                    map
                };
                let marker = new google.maps.Marker(markerOptions);
                let infowindow = new google.maps.InfoWindow({
                    content: 'Latitud: ' + point.lat + '<br>Longitud: ' + point.lng
                });
                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                });
                markers.push(marker);
            });
            setMarkers_(markers);
        } else {
            setMarkers_(null);
        }
    }, [list_points]);

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

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY!
    });

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        if (list_points.length > 0) {
            let markers: google.maps.Marker[] = [];
            list_points.forEach((point) => {
                let markerPosition: google.maps.LatLngLiteral = {
                    lat: point.lat,
                    lng: point.lng
                };
                let markerOptions = {
                    clickable: false,
                    draggable: false,
                    position: markerPosition,
                    map
                };
                let marker = new google.maps.Marker(markerOptions);
                let infowindow = new google.maps.InfoWindow({
                    content: 'Latitud: ' + point.lat + '<br>Longitud: ' + point.lng
                });
                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                });
                markers.push(marker);
            });
            setMarkers_(markers);
        } else {
            setMarkers_(null);
        }
        setMap(map);
    }, [list_points]);

    const onUnmount = useCallback(function callback() {
        setMap(null);
        setMarkers_(null);
    }, []);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!map) return;
        let markerPosition: google.maps.LatLngLiteral = {
            lat: e.latLng?.lat()!,
            lng: e.latLng?.lng()!
        };
        let position: Coordinates = {
            lat: e.latLng?.lat()!,
            lng: e.latLng?.lng()!
        };
        if (compareList(list_points, position)) {
            handleDeleteMarker(encontrarIndiceEnLista(list_points, position));
        } else {
            let newList = [...list_points, markerPosition];
            dispatch(setPoints(newList));
        }
    };

    const handleDeleteMarker = (index: number) => {
        const newList = list_points.filter((point, i) => i !== index);
        dispatch(setPoints(newList));
    };

    const compareList = (a: Coordinates[], b: Coordinates) => {
        let result = false;
        a.forEach((point) => {
            if (compare(point, b)) {
                result = true;
            }
        });
        return result;
    };

    const compare = (a: Coordinates, b: Coordinates) => {
        return a.lat === b.lat && a.lng === b.lng;
    };

    function encontrarIndiceEnLista(a: Coordinates[], b: Coordinates) {
        for (let i = 0; i < a.length; i++) {
            if (a[i].lat === b.lat && a[i].lng === b.lng) {
                return i;
            }
        }
        return -1;
    }

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
                </GoogleMap>
            :<p>Cargando...</p>}
        </div>
    );
}