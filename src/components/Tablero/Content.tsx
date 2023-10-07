import { useState, useEffect } from "react";
import { Nodo, ContentProps, Token } from "../../interfaces";
import { getNodosNivel, getColors } from "../../services/api";
import { NodoForm, ColorForm } from "../Forms";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
import { ShowNodos } from "./ShowNodos";
import { ShowNodosUnidad } from "./ShowNodosUnidad";
import { decode } from "../../utils/decode";

export const Content = ( props : ContentProps ) => {
    const navigate = useNavigate();

    const [nodos, setNodos] = useState<Nodo[]>([]);
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
        const token = sessionStorage.getItem('token')
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
                getNodosNivel(props.data.id_nivel, props.Padre)
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
                        onClick={handleBack}> 
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
                                id={props.data.id_nivel}
                                Padre={props.Padre}
                                callback={callback}/>
                : <div>
                    <p>De momemnto no hay contenido en este PDT</p>
                </div>
                }
            </div>
            :<div className="   grid 
                                grid-cols-12
                                grid-flow-row">
                <div className="bg-gray-400 
                                py-1 mt-2 
                                col-span-3 flex">
                    {backIconButton()}
                    <h1 className=" mr-5 grow 
                                    justify-self-center">
                        {props.data.Nombre}
                    </h1>
                </div>
                {hadColor ?
                <div></div>
                :<button className=" mt-2 ml-2
                                  bg-blue-300 
                                  rounded"
                                  onClick={handleColor}>
                    <p className="break-words">Definir colorimetria</p>
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

                <div className="col-start-4 col-span-8
                                border-l-4 border-gray-400">
                    <div className="flex flex-wrap justify-around">
                        {años.map((año: number) => (
                            <button className ={`rounded-full
                                                ${añoSelect === año ? 'bg-cyan-400' : 'bg-white'}
                                                ml-3 w-16 h-16
                                              border-yellow-300 border-8
                                                translate-x-3
                                                scale-100`}
                                    onClick={ (event) => handleAños(event, año)}>
                                {año}
                            </button>
                        ))}
                    </div>
                </div>
                
                {hadColor ?
                <div></div>
                : <div className="col-start-4 col-span-8">
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
