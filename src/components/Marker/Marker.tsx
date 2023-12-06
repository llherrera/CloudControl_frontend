import React from "react";
import { Marker } from "@react-google-maps/api";

interface MarkerProps {
    lat: number;
    lng: number;
    onDelete?: () => void;
    onEdit?: () => void;
    onDetail?: () => void;
}

export const MarkerComponent = ( props: MarkerProps ) => {
    return (
        <Marker
            position={{ lat: props.lat, lng: props.lng }}
            onClick={ props.onDetail?? props.onEdit?? props.onDelete?? (() => {console.log('Este marcador no tiene accione')}) }
            icon={{
                url: "https://loading.io/icon/bt460y",
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
            }}
        />
    );
}