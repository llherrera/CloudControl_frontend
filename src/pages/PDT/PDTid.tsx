import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPDTid } from "../../services/api";
import { NivelForm, Tablero } from "../../components";
import { Nivel } from "../../interfaces";

export const PDTid = () => {
    const { id } = useParams();

    const [data, setData] = useState([] as Nivel[]);

    useEffect(() => {
        getPDTid(id!)
            .then((res) => {
                setData(res)
            })
    }, []);

    return (
        <div>
            {data.length === 0 ? <NivelForm id={id!} /> : <Tablero data={data} />}
        </div>
    )
}