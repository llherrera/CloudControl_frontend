import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { decrementLevelIndex, setParent,
    AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";
import { thunkGetNodes } from '@/store/plan/thunks';
import { setMode } from "@/store/content/contentSlice";

import { IdProps } from "@/interfaces";
import { NodeForm, NodesList, TimeLine, CopilotPopover,
    Graph, BackBtn, DoubleBackBtn, SettingsBtn } from "@/components";

import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { ModalBoard, ModalAi, ModalAi2, ModalShare } from "../Modals";
import { decode } from "@/utils";

export const Content = ( props : IdProps ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { token_info } = useAppSelector(store => store.auth);
    const { plan, years, indexLevel, levels, parent,
            progressNodes, financial, radioBtn, nodes,
            colorimeter, rootTree } = useAppSelector(store => store.plan);
    const { mode } = useAppSelector(store => store.content);

    const [rol, setRol] = useState("");
    const [user, setUser] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
            setId(decoded.id_plan);
            setUser(decoded.user);
        }
    }, []);

    //useEffect(() => {
    //    if (id_plan <= 0) return;
    //    if (secretaries == undefined)
    //        dispatch(thunkGetSecretaries(id_plan));
    //    if (locations == undefined)
    //        dispatch(thunkGetLocations(id_plan));
    //}, [id_plan]);

    useEffect(() => {
        dispatch(thunkGetNodes({id_level: levels[indexLevel].id_level!, parent: parent}))
        .unwrap()
        .catch((err) => {console.log(err)});
    }, [years, indexLevel]);

    const handleStartReturn = () => {
        dispatch(AddRootTree([]));
        dispatch(setZeroLevelIndex());
    };

    const handleBack = () => {
        if (indexLevel === 0) {
            navigate(-1);
            return;
        }
        try{
            let newRoot = rootTree;
            newRoot = newRoot.slice(0, -1);
            dispatch(AddRootTree(newRoot));
            let temp = parent!.split('.');
            let temp_ = temp.slice(0, temp.length-1);
            temp.length === 2 ? 
                dispatch(setParent(null))
            : dispatch(setParent(temp_.join('.')));

            dispatch(decrementLevelIndex(indexLevel-1));
        } catch (e) {
            console.log(e);
        }
    };

    const handleSettings = (page: number = 0) => navigate(`/pdt/PlanIndicativo/configuracion`, {
        state: {
            pageN: page
        }
    });

    const handleMode = () => dispatch(setMode(!mode));

    const handleAddUser = () => navigate(`/register`);

    const colorimeterCircles = (index: number) => (
        index === 0 ? 'tw-bg-redColory hover:tw-bg-red-200' :
        index === 1 ? 'tw-bg-yellowColory hover:tw-bg-yellow-200' :
        index === 2 ? 'tw-bg-greenColory hover:tw-bg-green-200' :
        index === 3 ? 'tw-bg-blueColory hover:tw-bg-blue-200' :null
    );

    const HandleRol = () => (
        rol === 'admin' || (rol === 'funcionario' && id === props.id) ? 
        <button onClick={()=>handleSettings(1)}>Definir colorimetría</button>
        : <p>No se ha definido una colorimetría aún</p>
    );

    return (
        <div className="tw-h-full">
            <h1 className=" tw-mx-6 tw-mt-6
                            tw-text-[#222222]
                            tw-font-bold tw-font-montserrat
                            tw-text-lg tw-text-center md:tw-text-left
                            tw-flex tw-justify-between">
                <div className="tw-flex tw-items-center">
                    Plan indicativo
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === props.id) ? 
                        <SettingsBtn handle={() => handleSettings()} id={props.id}/>
                        : null
                    }
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === props.id) ? 
                        <ModalShare plan/>
                        : null
                    }
                    {rol === 'admin' || (rol === 'funcionario' && id === props.id) ?
                        <IconButton color="success"
                                    aria-label="delete"
                                    onClick={() => handleAddUser()}
                                    title="Agregar funcionario al plan">
                            <PersonAddAltIcon/>
                        </IconButton>
                        : null
                    }
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion' || rol === 'sectorialista') && id === props.id) ?
                        <p  className={`tw-truncate tw-w-6 hover:tw-w-24`}
                            title="usuario">
                            {user}
                        </p>
                        : null
                    }
                </div>
                <div className="tw-mb-2 tw-flex tw-items-center">
                    {colorimeter.length > 0 ?
                        <ul className="tw-flex tw-gap-2">
                            <div className={`tw-rounded-full
                                            tw-w-8 tw-h-8
                                            tw-bg-gray-400
                                            hover:tw-bg-gray-200`}
                                title="No tiene programado ejecuciones">
                                <p className="tw-invisible">a</p>
                            </div>
                            {colorimeter.map((color, index) => (
                                <div className={`tw-rounded-full
                                                tw-w-8 tw-h-8
                                                ${colorimeterCircles(index)}`}
                                    title={`Ejecutado ${
                                        isNaN(colorimeter[index-1]) ? 0 : colorimeter[index-1] + 1
                                        }% - ${colorimeter[index]}%`}
                                    key={color}>
                                    <p className="tw-invisible">a</p>
                                </div>
                            ))}
                        </ul>
                        : <HandleRol/>
                    }
                    {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion' || rol === 'sectorialista') && id === props.id) ?
                        <ModalAi/>
                        : null
                    }
                    {/*rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion' || rol === 'sectorialista') && id === props.id) ?
                        <CopilotPopover/>
                        : null
                    */}
                </div>
            </h1>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-mb-2">
                <div className="tw-mx-6 tw-py-3
                                md:tw-ml-12
                                lg:tw-ml-6
                                tw-rounded tw-shadow-lg tw-border
                                tw-bg-white
                                md:tw-col-span-2">
                    <p className="tw-font-montserrat tw-ml-4 tw-font-bold">
                        Plan de desarrollo. ¡Así vamos!
                    </p>
                    <div className="tw-ml-4 tw-mb-3">
                    {rootTree.length <= 0 ? null :
                        <ul className=" tw-flex tw-flex-wrap tw-gap-3
                                        tw-font-montserrat
                                        tw-underline tw-underline-offset-2">
                            {rootTree.map((item) => (
                                <li key={item[0]}>
                                    {item[0]}
                                </li>
                            ))}
                        </ul>
                    }
                    </div>
                    <TimeLine/>
                </div>

                <div className="tw-rounded tw-shadow-lg tw-border
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
                        {indexLevel < 2 ? null : <DoubleBackBtn handle={handleStartReturn} id={props.id} />}
                        <BackBtn 
                            handle={handleBack}
                            id={props.id}
                            className={`${indexLevel < 2 ? '' : 'tw--translate-x-6'}`}/>
                        {levels[indexLevel].name}
                        {rol === 'admin' || (rol === 'funcionario' && id === props.id) ?
                        <button className={`tw-ml-4 tw-p-2 
                                            tw-rounded
                                            ${mode? 'tw-bg-red-300 hover:tw-bg-red-500' :
                                            'tw-bg-green-300 hover:tw-bg-green-500'}`}
                                onClick={handleMode}>
                            Editar
                        </button>
                        : null}
                    </p>
                    <div className="tw-pb-1 tw-mb-2">
                        {nodes.length === 0 ?
                        <div>
                            {(rol === "admin") || (rol === 'funcionario' && id === props.id) ?
                            <NodeForm   index={indexLevel}
                                        id={levels[indexLevel].id_level!}/>
                            : <div>
                                <p className="tw-mx-4 tw-text-center">De momemnto no hay contenido en este Plan</p>
                            </div>
                            }
                        </div>
                        :<NodesList id={props.id}/>
                        }
                    </div>
                </div>

                <div className="tw-mt-6 tw-mx-6 tw-px-4
                                tw-flex tw-flex-col tw-justify-start
                                tw-bg-white
                                tw-rounded tw-border
                                tw-shadow-lg
                                md:tw-col-span-full
                                lg:tw-col-start-2">
                    <div className="tw-flex tw-justify-between">
                        <p className="tw-font-montserrat tw-ml-2 tw-font-bold tw-mt-3">
                            Cuatrenio  {new Date(plan!.start_date).getUTCFullYear()} - {new Date(plan!.end_date).getUTCFullYear()}
                        </p>
                        <ModalBoard/>
                    </div>
                    <Graph
                        dataValues={ radioBtn === 'fisica' ? progressNodes : financial}/>
                </div>

            </div>
            
        </div>
    );
}
