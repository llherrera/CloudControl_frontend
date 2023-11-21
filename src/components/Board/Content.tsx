import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkGetNodes, thunkUpdateYears } from "@/store/plan/thunks";
import { decrementLevelIndex, setParent } from "@/store/plan/planSlice";

import { NodoInterface, Token, PesosNodos } from "@/interfaces";
import { NodoForm, ColorForm, NodesList, TimeLine, Graph } from "@/components";
import { getToken, decode, getYears } from "@/utils";

interface Props {
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
    const dispatch = useAppDispatch();

    const { plan, colorimeter, color, years, indexLevel, levels, parent } = useAppSelector(store => store.plan)

    const [nodos, setNodos] = useState<NodoInterface[]>([]);

    const [yearProgress, setYearProgress] = useState<number[]>([])
    const [yearsprogress, setYearsProgress] = useState(0);

    const [showColorForm, setShowColorForm] = useState(false);
    const [colors, setColors] = useState<number[]>([]);
    
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
    }, [])

    useEffect(() => {
        if (plan){
            let years = getYears(plan.Fecha_inicio)
            dispatch(thunkUpdateYears(years))
        }
    }, [plan])

    useEffect(() => {
        dispatch(thunkGetNodes({id_level: levels[indexLevel!].id_nivel!, parent: parent}))
        .unwrap()
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
            getYearProgresss()
        })
        .catch((err) => {console.log(err)})
    }, [years, indexLevel])

    useEffect(() => {
        if (color) {
            setColors(colorimeter)
        }
    }, [color])

    const getYearProgresss = () => {
        let pesosStr = localStorage.getItem('pesosNodo')
        if (pesosStr == undefined) 
            pesosStr = '[]'
        
        let pesosNodo = JSON.parse(pesosStr as string)
        let progreso = [] as number[]
        const nodoss = pesosNodo.filter((item: PesosNodos) => item.Padre === parent)
        
        for (let i = 0; i < years.length; i++) {
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
        temp = Math.round(temp*100/years.length)
        setYearsProgress(temp)
        setYearProgress(progreso)
    }

    const handleBack = () => {
        if (indexLevel === 0) {
            navigate(-1)
            return
        }
        try{
            let temp = parent!.split('.')
            let temp_ = temp.slice(0, temp.length-1)
            temp.length === 2 ? 
                dispatch(setParent(null))
            : dispatch(setParent(temp_.join('.')))

            dispatch(decrementLevelIndex(indexLevel!-1))
        } catch (e) {
            console.log(e);
        }
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
        setShowColorForm(!showColorForm)
    }

    return (
        <div className="tw-h-full tw-border
                        tw-bg-[url('/src/assets/images/bg-plan-indicativo.png')]
                        tw-opacity-80">
            <h1 className=" tw-ml-6 tw-mt-6 
                            tw-text-[#222222] 
                            tw-font-bold
                            tw-text-lg
                            tw-font-montserrat
                            tw-text-center
                            md:tw-text-left">
                Plan de proyectos
                {!color && ((rol === "admin") || (rol === 'funcionario' && id === props.id)) ?
                <button className="tw-mt-2 tw-ml-2 tw-p-2
                                    tw-bg-blueColory
                                    tw-rounded"
                          onClick={handleColor}>
                    <p className="tw-break-words tw-font-montserrat">Definir colorimetria</p>
                </button>
                :null
                }
            </h1>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-mb-2">

                <div className="tw-mx-6 tw-py-3
                                md:tw-ml-12
                                lg:tw-ml-6
                                tw-rounded tw-shadow-lg
                                tw-bg-white
                                md:tw-col-span-2
                                xl:">
                    <p className="tw-font-montserrat tw-ml-4 tw-mb-3">
                        Plan de desarrollo. ¡Así vamos!
                    </p>
                    <TimeLine   yearProgress={yearProgress}
                                yearsProgress={yearsprogress}
                                colors={colors}/>
                </div>

                <div className="tw-rounded tw-shadow-lg
                                tw-bg-white
                                tw-mx-6 tw-mt-6 
                                md:tw-ml-6 md:tw-mr-3 md:tw-mt-0
                                tw-overflow-scroll
                                md:tw-order-first
                                md:tw-w-[290px]
                                md:tw-h-[270px]
                                lg:tw-w-4/5 lg:tw-h-full lg:tw-row-span-2
                                xl:tw-row-span-2">
                    <p className="tw-ml-4 tw-mt-3 tw-font-montserrat tw-font-bold">
                        {backIconButton()}
                        {levels[indexLevel!].LevelName}
                    </p>
                    <div className="tw-pb-1 tw-mb-2">
                        {nodos.length === 0 ?
                        <div>
                            {(rol === "admin") || (rol === 'funcionario' && id === props.id) ?
                            <NodoForm   index={indexLevel!}
                                        id={levels[indexLevel!].id_nivel!}/>
                            : <div>
                                <p className="tw-mx-4 tw-text-center">De momemnto no hay contenido en este Plan</p>
                            </div>
                            }
                        </div>
                        :<NodesList nodes={nodos}
                                    id={props.id}
                                    colors={colors}
                                    />
                        }
                    </div>
                </div>

                <div className="tw-mt-6 tw-mx-6 tw-px-4
                                tw-flex tw-flex-col tw-justify-start
                                tw-bg-white
                                tw-rounded
                                tw-shadow-lg
                                md:tw-col-span-full
                                lg:tw-col-start-2">
                    <p>Cuatrenio  {new Date(plan!.Fecha_inicio).getUTCFullYear()} - {new Date(plan!.Fecha_fin).getUTCFullYear()}</p><br />
                    <Graph
                        dataValues={yearProgress}/>
                </div>

            </div>
            {color ?
            <div></div>
            : <div>
                {showColorForm ? 
                <div></div> 
                : <ColorForm id={props.id}/>}
            </div>
            }
        </div>
    );
}
