import React, { useState } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";

import { UbicationDB } from "@/interfaces";
import icono from "@/assets/icons/location.svg";

export const MarkerComponent = ( {item}: {item:UbicationDB} ) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const handleShowTooltip = () => {
        setShowTooltip(true);
    }

    return (
        <Marker position={{lat: item.Latitud, lng: item.Longitud}}
                onClick={handleShowTooltip}
                icon={{
                    url: icono,
                    scaledSize: new window.google.maps.Size(30, 30),
                }}>
            {showTooltip && (
                <InfoWindow onCloseClick={()=>setShowTooltip(false)}>
                    <div>
                        <p>{item.codigo}</p>
                    </div>
                </InfoWindow>
            )}
        </Marker>
    );
}