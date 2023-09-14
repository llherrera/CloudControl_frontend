import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPDTid } from "../../services/api";
import { NivelForm } from "../../components";

export const PDTid = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const [data, setData] = useState([]);

    React.useEffect(() => {
        getPDTid(id!)
            .then((res) => {
                setData(res)
            })
    }, []);

    return (
        <div>
            {data.length === 0 ? <NivelForm id={id!} /> : <h1>Cargando...</h1>}
        </div>
    )
}