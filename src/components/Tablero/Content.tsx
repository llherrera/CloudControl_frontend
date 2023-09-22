import React, { useState } from "react";
import { Nodo } from "../../interfaces";
import { getNodosNivel } from "../../services/api";
import { NodoForm } from "../Forms";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
import { ShowNodos } from "./ShowNodos";
import { ShowNodosUnidad } from "./ShowNodosUnidad";

export const Content = ( props : any ) => {
    const navigate = useNavigate();

    const [nodos, setNodos] = useState([] as Nodo[]);
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const [propPad, setPropPad] = useState(props.index);

    React.useEffect(() => {
        if ( shouldUpdate ) {
            try{
                getNodosNivel(props.data.id_nivel, props.Padre)
                    .then((res) => {
                        setNodos(res)
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
            const padre = props.Padre.split('.')
            setPropPad(-1)
            padre.length > 2 ? 
                props.callback(props.index-2, padre.slice(0, padre.length-1).join('.') )
            :   props.callback(props.index-2, null)

        } catch (e) {
            
        }
    }

    const callback = (index: number, padre: any) => {
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

    return (
        <div className="">
            {nodos.length === 0 ? 
            <div>
                <div className="bg-gray-400 py-1 mt-2 col-span-3 flex">
                    {backIconButton()}
                    <h1 className="bg-gray-400 py-1 my-2 mr-5 grow justify-self-center"> {props.data.Nombre} </h1>
                </div>
                <NodoForm   index={props.index}
                            id={props.data.id_nivel}
                            Padre={props.Padre} 
                            callback={callback}/>
            </div> 
            :<div className="grid grid-cols-12 grid-flow-row">
                <div className="bg-gray-400 py-1 mt-2 col-span-3 flex">
                    {backIconButton()}
                    <h1 className="mr-5 grow justify-self-center"> {props.data.Nombre} </h1>
                </div>
                {props.index !== props.len ?
                <ShowNodos  callback={props.callback}
                            callback2={setShouldUpdate} 
                            nodos={nodos} 
                            index={props.index} /> 
                : <ShowNodosUnidad id={props.id} nodos={nodos}/>}
            </div>
            }
        </div>
    )
}
