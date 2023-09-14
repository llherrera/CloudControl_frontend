import React, { useState } from 'react';
import axios from "axios";

export const PingPage = () => {
    const [data, setData] = useState([]);

    React.useEffect(() => {
        axios.get("/ping")
        .then((response) => {
            setData(response.data);
        });
    }, []);
    return <div>{ data!.map(( e:any )=> <div>{e.Nombre} {e.Fecha_inicio} {e.Fecha_fin} {e.Descripcion} {e.Alcaldia}</div>) }</div>;
};
