import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";

import { NodoInterface, Token, NivelInterface, PesosNodos } from "@/interfaces";
import { getNodosNivel, getColors } from '@/services/api';
import { NodoForm, ColorForm, ShowNodos, ShowNodosUnidad } from "@/components";
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

    const [nodos, setNodos] = useState<NodoInterface[]>([]);
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const [propPad, setPropPad] = useState(props.index);

    const [años, setAños] = useState([2020, 2021, 2022, 2023]);
    const [añoSelect, setAño] = useState(2023);
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
                getNodosNivel(props.data.id_nivel!, props.Padre)
                    .then((res) => {
                        const resArr = [...res];
                        const temp = [] as NodoInterface[]
                        resArr.forEach((item:nodos) => {
                            temp.push({
                                id_nodo: item.id_nodo,
                                NodeName: item.Nombre,
                                Description: item.Descripcion,
                                Parent: item.Padre,
                                id_level: item.id_nivel,
                                Weight: 0,
                            })
                        })
                        setNodos(temp)
                })
                getColors(props.id)
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
    }, [props.index, nodos, propPad, shouldUpdate])

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
                        title="Regresar">
                <ArrowBackIosIcon/>
            </IconButton>
        )
    }

    const handleAños = ( event: React.MouseEvent<HTMLButtonElement>, año: number ) => {
        event.preventDefault();
        setAño(año);
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
            </h1>
            <div className="tw-flex tw-h-5/6 tw-mt-4">
                <div className="tw-rounded tw-drop-shadow-lg
                                tw-bg-white
                                tw-ring-1 tw-ring-gray-300
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
                        : <div>
                            { props.index !== props.len ?
                            <ShowNodos  callback={callback}
                                        callback2={setShouldUpdate}
                                        nodos={nodos}
                                        index={props.index}
                                        año={añoSelect}
                                        progress={props.progress}
                                        colors={colors}/>
                            : <ShowNodosUnidad  id={props.id}
                                                nodos={nodos}
                                                año={añoSelect}
                                                colors={colors}
                                                index={props.index}/>
                                    }
                        </div>
                        }
                    </div>
                </div>
                <div className="tw-w-2/3 
                                tw-flex tw-flex-col 
                                tw-justify-between 
                                tw-mb-3 tw-mr-6">
                    <div className="tw-flex-wrap tw-grow
                                    tw-justify-around
                                    tw-h-1/2 tw-rounded
                                    tw-bg-white
                                    tw-ring-1 tw-ring-gray-300
                                    tw-shadow-lg">
                        <p className="tw-font-montserrat tw-ml-4">
                            Plan de desarrollo. ¡Así vamos!
                        </p>
                        <ol className="tw-flex tw-h-4/5 tw-justify-center tw-items-center tw-mx-4">
                        {años.map((año: number, index: number) => (
                            <li className="tw-grid tw-grid-rows-3 tw-w-full tw-justify-items-center">
                                <button className={`tw-rounded 
                                                    tw-flex tw-justify-center tw-items-center
                                                    ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-border-redColory'   : 
                                                      (progresoAño[index]??0)*100 < colors[1] ? 'tw-border-yellowColory':
                                                      (progresoAño[index]??0)*100 < colors[2] ? 'tw-border-greenColory' : 'tw-border-blueColory'}
                                                    ${añoSelect === año ? 'tw-ring' : null}
                                                    ${index%2 === 0 ? 'tw-row-start-1' : 'tw-row-start-3'}
                                                    tw-border-4
                                                    tw-w-12 tw-h-12
                                                    tw-font-bold`}
                                        onClick={ (event) => handleAños(event, año)}>
                                    {(progresoAño[index]*100)}%
                                </button>
                                <div className="tw-flex tw-items-center tw-w-full tw-relative tw-row-start-2">
                                    <div className={`tw-w-full tw-h-2
                                                    tw-px-3
                                                    tw-z-10 tw-absolute 
                                                    ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-bg-redColory'   : 
                                                      (progresoAño[index]??0)*100 < colors[1] ? 'tw-bg-yellowColory':
                                                      (progresoAño[index]??0)*100 < colors[2] ? 'tw-bg-greenColory' : 'tw-bg-blueColory'}`}>
                                    </div>
                                    <div className={`tw-h-full
                                                    tw-grow
                                                    tw-flex tw-flex-col`}>
                                        {index%2 === 0 ? 
                                            <button className={`tw-grow tw-self-center
                                                                tw-h-1/4 tw-w-2
                                                                ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-bg-redColory'   : 
                                                                  (progresoAño[index]??0)*100 < colors[1] ? 'tw-bg-yellowColory':
                                                                  (progresoAño[index]??0)*100 < colors[2] ? 'tw-bg-greenColory' : 'tw-bg-blueColory'}`}
                                                    onClick={ (event) => handleAños(event, año)}>
                                            </button>
                                        : null}
                                        <button className={`tw-self-center tw-font-bold tw-font-montserrat tw-text-[#222222]
                                                            ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-text-redColory'   : 
                                                            (progresoAño[index]??0)*100 < colors[1] ? 'tw-text-yellowColory':
                                                            (progresoAño[index]??0)*100 < colors[2] ? 'tw-text-greenColory' : 'tw-text-blueColory'}`}
                                                onClick={ (event) => handleAños(event, año)}>
                                            {año}
                                        </button>
                                        {index%2 === 1 ? 
                                            <button className={`tw-grow tw-self-center
                                                                tw-h-1/4 tw-w-2
                                                                ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-bg-redColory'   : 
                                                                  (progresoAño[index]??0)*100 < colors[1] ? 'tw-bg-yellowColory':
                                                                  (progresoAño[index]??0)*100 < colors[2] ? 'tw-bg-greenColory' : 'tw-bg-blueColory'}`}
                                                    onClick={ (event) => handleAños(event, año)}>
                                            </button>
                                        : null}
                                    </div>
                                </div>
                            </li>
                        ))}
                        </ol>
                    </div>
                    <div className="tw-mt-2 tw-h-1/2
                                    tw-px-4
                                    tw-bg-white
                                    tw-ring-1 tw-ring-gray-300
                                    tw-rounded
                                    tw-shadow-lg">
                        <p>Cuaternio</p><br />
                        <div className="tw-flex">
                        <svg width="489" height="59" viewBox="0 0 489 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M278.136 3.18734L460.447 1.18536L487.63 28.0992L461.017 53.1298L278.707 55.1318L278.136 3.18734Z" fill="#008DCC"/>
                            <path d="M278.136 3.18734L460.447 1.18536L487.63 28.0992L461.017 53.1298L278.707 55.1318L278.136 3.18734Z" stroke="#FCC623"/>
                            <path d="M278.136 3.18734L460.447 1.18536L487.63 28.0992L461.017 53.1298L278.707 55.1318L278.136 3.18734Z" stroke="#008DCC"/>
                            <path d="M226.047 3.75936L408.358 1.75738L435.541 28.6712L408.928 53.7019L226.618 55.7038L226.047 3.75936Z" fill="#119432" stroke="#119432"/>
                            <path d="M133.632 4.77426L315.943 2.77227L343.126 29.6861L316.513 54.7168L134.203 56.7187L133.632 4.77426Z" fill="#FCC623" stroke="#FCC623"/>
                            <path d="M0.890247 6.2319L183.2 4.22992L210.384 31.1437L183.771 56.1744L1.46066 58.1764L0.890247 6.2319Z" fill="#FE1700" stroke="#FE1700"/>
                        </svg>
                        <button className={`tw-rounded 
                                            tw-flex tw-justify-center tw-items-center
                                            tw-border-4
                                            tw-self-center
                                            tw-w-12 tw-h-12
                                            ${progress < colors[0] ? 'tw-border-redColory'   : 
                                              progress < colors[1] ? 'tw-border-yellowColory':
                                              progress < colors[2] ? 'tw-border-greenColory' : 'tw-border-blueColory'}
                                            tw-ml-3`}>
                            <p className="tw-break-words tw-font-bold">
                                {progress}%
                            </p>
                        </button>
                        </div>
                        <p>
                            2020-2023
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    /*return (
        <div className="">
            {nodos.length === 0 ? 
            <div>
                <div className="  bg-gray-400 
                                    py-1 mt-2 
                                    col-span-3 flex">
                    {backIconButton()}
                    <h1 className="   bg-gray-400 
                                        py-1 my-2 mr-5 
                                        grow justify-self-center">
                        {props.data.Nombre}
                    </h1>
                </div>
                {(rol === "admin") || (rol === 'funcionario' && id === props.id) ?
                    <NodoForm   index={props.index}
                                id={props.data.id_nivel!}
                                Padre={props.Padre}
                                callback={callback}/>
                : <div>
                    <p>De momemnto no hay contenido en este PDT</p>
                </div>
                }
            </div>
            :<div className="   tw-grid 
                                tw-grid-cols-12
                                tw-grid-flow-row">
                <div className="tw-bg-gray-400 
                                tw-py-1 tw-mt-2 
                                tw-col-span-3 tw-flex">
                    {backIconButton()}
                    <h1 className=" tw-mr-5 tw-grow 
                                    tw-justify-self-center">
                        {props.data.Nombre}
                    </h1>
                </div>
                {hadColor ?
                <div></div>
                :<button className="tw-mt-2 tw-ml-2
                                    tw-bg-blue-300 
                                    tw-rounded"
                          onClick={handleColor}>
                    <p className="tw-break-words">Definir colorimetria</p>
                </button>
                }
                {props.index !== props.len ?
                <ShowNodos  callback={props.callback}
                            callback2={setShouldUpdate}
                            nodos={nodos}
                            index={props.index}
                            año={añoSelect}
                            progress={props.progress}
                            colors={colors}/>
                : <ShowNodosUnidad  id={props.id}
                                    nodos={nodos}
                                    año={añoSelect}
                                    colors={colors}/>
                }

                <div className="tw-col-start-4 tw-col-span-8
                                tw-border-l-4 tw-border-gray-400">
                    <div className="tw-flex tw-flex-wrap tw-justify-around">
                        {años.map((año: number) => (
                            <button className ={`tw-rounded-full
                                                ${añoSelect === año ? 'tw-bg-cyan-400' : 'tw-bg-white'}
                                                tw-ml-3 tw-w-16 tw-h-16
                                                tw-border-yellow-300 tw-border-8
                                                tw-translate-x-3
                                                tw-scale-100`}
                                    onClick={ (event) => handleAños(event, año)}>
                                {año}
                            </button>
                        ))}
                    </div>
                </div>
                
                {hadColor ?
                <div></div>
                : <div className="tw-col-start-4 tw-col-span-8">
                    {color ? 
                    <div></div> 
                    : <ColorForm id={props.id} callback={setColor}/>}
                </div>
                }
            </div>
            }
        </div>
    )*/
}
