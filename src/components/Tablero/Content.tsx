import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useAppSelector } from "@/store";

import { NodoInterface, Token, NivelInterface, PesosNodos, PDTInterface } from "@/interfaces";
import { getNodosNivel, getColors } from '@/services/api';
import { NodoForm, ColorForm, NodesList, TimeLine, Graph } from "@/components";
import { getToken, decode } from "@/utils";

interface Props {
    index: number;
    len: number;
    data: NivelInterface;
    callback: (index: number, padre: (string | null)) => void;
    Padre: (string | null);
    id: number;
    progress: boolean;
}

type nodos = {
    id_nodo: string;
    Nombre: string;
    Descripcion: string;
    Padre: (string | null);
    id_nivel: number;
}

export const Content = ( props : Props ) => {
    const navigate = useNavigate();
    const { plan } = useAppSelector(store => store.plan)
    
    const [años, setAños] = useState<number[]>([]);
    const [bool, setBool] = useState(false)

    const {Fecha_inicio} = plan
    if (!bool) {
        setBool(true)
        setAños([
            new Date(Fecha_inicio).getUTCFullYear(),
            new Date(Fecha_inicio).getUTCFullYear()+1, 
            new Date(Fecha_inicio).getUTCFullYear()+2, 
            new Date(Fecha_inicio).getUTCFullYear()+3
        ])
    }

    const [nodos, setNodos] = useState<NodoInterface[]>([]);
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const [propPad, setPropPad] = useState(props.index);

    const [añoSelect, setAño] = useState<number>(años[0]);
    const [progresoAño, setProgresoAño] = useState<number[]>([])
    const [progress, setProgress] = useState(0);

    const [color, setColor] = useState(false);
    const [colors, setColors] = useState<number[]>([]);
    const [hadColor, setHadColor] = useState(false);
    
    const [rol, setRol] = useState("")
    const [id, setId] = useState(0)

    useEffect(() => {
        const gettoken = getToken()
        try {
            const {token} = gettoken ? gettoken : null
            if (token !== null && token !== undefined) {
                const decoded = decode(token) as Token
                setId(decoded.id_plan)
                setRol(decoded.rol)
            }
        } catch (error) {
            console.log(error);
        }
        if ( shouldUpdate ) {
            try{
                if (nodos.length == 0) {
                    getNodosNivel(props.id, props.data.id_nivel!, props.Padre)
                        .then((res) => {
                            const resArr = [...res];
                            const temp = [] as NodoInterface[]
                            resArr.forEach((item:nodos) => {
                                temp.push({
                                    id_node: item.id_nodo,
                                    NodeName: item.Nombre,
                                    Description: item.Descripcion,
                                    Parent: item.Padre,
                                    id_level: item.id_nivel,
                                    Weight: 0,
                                })
                            })
                            setNodos(temp)
                    })
                }
                getColors(props.id.toString())
                    .then((res) => {
                        if (res.length > 0) {
                            let temp = []
                            temp.push(res[0].value1)
                            temp.push(res[0].value2)
                            temp.push(res[0].value3)
                            temp.push(res[0].value4)
                            setColors(temp)
                            setHadColor(true)
                        }
                    })
                getProgresoAños()
            } catch (e) {
                console.log(e)
            }
            
            setShouldUpdate(false)
        }
    }, [nodos, propPad, shouldUpdate])

    const getProgresoAños = () => {
        let pesosStr = localStorage.getItem('pesosNodo')
        if (pesosStr == undefined) 
            pesosStr = '[]'
        
        let pesosNodo = JSON.parse(pesosStr as string)
        let progreso = [] as number[]
        const nodoss = pesosNodo.filter((item: PesosNodos) => item.Padre === props.Padre)
        for (let i = 0; i < años.length; i++) {
            let temp = 0
            nodoss.forEach((item: PesosNodos) => {
                const { porcentajes } = item
                if (porcentajes) {
                    temp += (porcentajes[i].progreso)*(item.Peso/100)
                }
            })
            temp = Math.round(temp*100)/100
            progreso.push(temp)
        }
        let temp = progreso.reduce((a, b) => a + b, 0)
        temp = Math.round(temp*100/años.length)
        setProgress(temp)
        setProgresoAño(progreso)
    }

    const handleBack = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.preventDefault();
        setShouldUpdate(true)
        if (props.index === 1) navigate(-1)
        try{
            const padre = props.Padre!.split('.')
            setPropPad(-1)
            padre.length > 2 ? 
                props.callback(props.index-2, padre.slice(0, padre.length-1).join('.') )
            :   props.callback(props.index-2, null)

        } catch (e) {
            
        }
    }

    const callback = (index: number, padre: (string | null)) => {
        setShouldUpdate(true)
        setPropPad(-1)
        props.callback(index, padre)
    }

    const backIconButton = () => {
        return (
            <IconButton aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={handleBack}
                        title="Regresar"
                        key={props.id}>
                <ArrowBackIosIcon/>
            </IconButton>
        )
    }

    const handleColor = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.preventDefault();
        setColor(!color);
    }

    return (
        <div className="tw-h-full tw-border
                        tw-bg-[url('/src/assets/images/bg-plan-indicativo.png')]
                        tw-opacity-80">
            <h1 className=" tw-ml-6 tw-mt-6 
                            tw-text-[#222222] 
                            tw-font-bold
                            tw-text-lg
                            tw-font-montserrat">
                Plan de proyectos
                {hadColor ?
                <div></div>
                :<button className="tw-mt-2 tw-ml-2 tw-p-2
                                    tw-bg-blueColory
                                    tw-rounded"
                          onClick={handleColor}>
                    <p className="tw-break-words tw-font-montserrat">Definir colorimetria</p>
                </button>
                }
            </h1>
            <div className="tw-flex tw-h-5/6 tw-mt-4">
                <div className="tw-rounded tw-shadow-lg
                                tw-bg-white
                                tw-w-1/3 tw-mx-6">
                    <p className="tw-ml-4 tw-mt-3 tw-font-montserrat tw-font-bold">
                        {backIconButton()}
                        {props.data.LevelName}
                    </p>
                    <div className="tw-pb-1 tw-mb-2">
                        {nodos.length === 0 ?
                        <div>
                            {(rol === "admin") || (rol === 'funcionario' && id === props.id) ?
                            <NodoForm   index={props.index}
                            id={props.data.id_nivel!}
                            Padre={props.Padre}
                            callback={callback}/>
                            : <div>
                                <p className="tw-ml-4">De momemnto no hay contenido en este PDT</p>
                            </div>
                            }
                        </div>
                        :<NodesList callback={callback}
                                    callback2={setShouldUpdate}
                                    nodos={nodos}
                                    id={props.id}
                                    index={props.index}
                                    año={añoSelect}
                                    colors={colors}
                                    len={props.len}
                                    />
                        }
                    </div>
                </div>
                <div className="tw-w-2/3 
                                tw-mb-3 tw-mr-6">
                    <div className="tw-flex-wrap tw-grow
                                    tw-justify-around
                                    tw-h-1/2 tw-rounded
                                    tw-bg-white
                                    tw-shadow-lg">
                        <p className="tw-font-montserrat tw-ml-4">
                            Plan de desarrollo. ¡Así vamos!
                        </p>
                        <TimeLine   año={añoSelect}
                                    progresoAño={progresoAño}/>
                    </div>
                    <div className="tw-mt-2 tw-h-1/2 tw-px-4 
                                    tw-flex tw-flex-col tw-justify-start
                                    tw-bg-white
                                    tw-rounded
                                    tw-shadow-lg">
                        <p className="tw-border">Cuatrenio  {new Date(plan.Fecha_inicio).getUTCFullYear()} - {new Date(plan.Fecha_fin).getUTCFullYear()}</p><br />
                        <Graph/>
                    </div>
                </div>
            </div>
            {hadColor ?
            <div></div>
            : <div>
                {color ? 
                <div></div> 
                : <ColorForm id={props.id} callback={setColor}/>}
            </div>
            }
        </div>
    );
}
