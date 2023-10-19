import { useState, useEffect } from "react";
import { NodoInterface, Token, NivelInterface } from "../../interfaces";
import { getNodosNivel, getColors } from "../../services/api";
import { NodoForm, ColorForm } from "../Forms";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
import { ShowNodos } from "./ShowNodos";
import { ShowNodosUnidad } from "./ShowNodosUnidad";
import { decode } from "../../utils/decode";
import Cookies from "js-cookie";

interface Props {
    index: number;
    len: number;
    data: NivelInterface;
    callback: (index: number, padre: (string | null)) => void;
    Padre: (string | null);
    id: number;
    progress: boolean;
}

export const Content = ( props : Props ) => {
    const navigate = useNavigate();

    const [nodos, setNodos] = useState<NodoInterface[]>([]);
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const [propPad, setPropPad] = useState(props.index);

    const [años, setAños] = useState([2020, 2021, 2022, 2023]);
    const [añoSelect, setAño] = useState(2023);

    const [color, setColor] = useState(false);
    const [colors, setColors] = useState<number[]>([]);
    const [hadColor, setHadColor] = useState(false);
    
    const [rol, setRol] = useState("")
    const [id, setId] = useState(0)

    useEffect(() => {
        //const token = sessionStorage.getItem('token')
        const token = Cookies.get('token')
        try {
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
                        setNodos(res)
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
            } catch (e) {
                console.log(e)
            }
            setShouldUpdate(false)
        }
    }, [props.index, nodos, propPad])

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
    )
}
