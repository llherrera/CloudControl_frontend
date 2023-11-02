import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPDTid } from "../../services/api";
import { NivelForm, Tablero, Frame } from "../../components";
import { NivelInterface } from "../../interfaces";

type nivel = {
    id_plan: number;
    Nombre: string;
    Descripcion: string;
    id_nivel: number;
}

export const PDTid = () => {
    const { id } = useParams();
    const [data, setData] = useState<NivelInterface[]>([]);

    useEffect(() => {
        const abortController = new AbortController()
        getPDTid(id!)
            .then((res) => {
                const resArr = [...res];
                const temp = [] as NivelInterface[]
                resArr.forEach((item:nivel) => {
                    temp.push({
                        id_nivel: item.id_nivel,
                        LevelName: item.Nombre,
                        Description: item.Descripcion,
                    })
                })
                setData(temp)
            })
            .catch((err) => {
                console.log(err);
            })
        return () => abortController.abort()
    }, []);

    return (
        <Frame
            data={data.length === 0 ? <NivelForm id={id!} /> : <Tablero data={data} />}
        />
    )
}