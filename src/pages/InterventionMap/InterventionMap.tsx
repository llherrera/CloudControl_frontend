import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import { BackBtn, Frame } from '@/components';
import { Coordinates } from '@/interfaces';

export const InterventionMap = () => {
    return (
        <Frame
            data={<Section/>}
        />
    )
}

const API_KEY = import.meta.env.VITE_API_KEY_MAPS as string;

const containerStyle = {
    width: '400px',
    height: '400px'
};

const Section = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const id = location.state?.id
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const [map, setMap] = useState<google.maps.Map|null>(null);
    const [ubication, setUbication] = useState<Coordinates>({lat: 10.96854, lng: -74.78132});

    useEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            setUbication({lat: position.coords.latitude, lng: position.coords.longitude})
        }, (error) => {
            console.log(error)
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        })
    }, [])

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, [])

    const handleBack = () => {
        navigate(-1)
    };

    return (
        <div>
            <BackBtn handle={handleBack} id={id} />
            <h1>Mapa de intervenciones</h1>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={ubication}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}>
                </GoogleMap>
            ) : <p>Cargando...</p>}
        </div>
    )
}