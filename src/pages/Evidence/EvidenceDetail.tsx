import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const EvidenceDetail = () => {
    const location = useLocation()

    useEffect(() => {
        console.log(location.state)
    }, [])

    return (
        <div>
            <h1>EvidenceDetail</h1>
        </div>
    )
}