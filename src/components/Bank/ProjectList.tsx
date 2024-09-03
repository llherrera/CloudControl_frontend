import { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetProjects, thunkGetCountProjects } from '@/store/plan/thunks';

import { ProjectForm } from '@/components';
import { ModalSettingPro } from '../Modals';
import { decode } from "@/utils";

export const ProjectList = () => {
    const dispatch = useAppDispatch();

    const { token_info } = useAppSelector(store => store.auth);
    const { years, secretaries, projects, proje_s } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [seeForm, setSeeForm] = useState(false);
    const [yearSe, setYearSe] = useState(new Date().getFullYear());
    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(thunkGetCountProjects({id_plan, year: yearSe}));
    }, []);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
            setId(decoded.id_plan);
        }
    }, []);

    useEffect(() => {
        dispatch(thunkGetProjects({id_plan, page, year: yearSe}));
    }, [yearSe]);

    const handleForm = () => setSeeForm(!seeForm);

    const handlePage = (page: number) => setPage(page);

    const handleYearChange = (year: number) => setYearSe(year);

    return(
        <div className="tw-flex tw-flex-col tw-justify-center ">
            <div className='tw-flex tw-justify-center'>
                {(rol === "admin") || ((rol === 'funcionario' || rol === 'planeacion') && id === id_plan) ?
                    <button
                        onClick={() => handleForm()}
                        className='tw-bg-blueBar hover:tw-bg-blueColory tw-p-2 tw-rounded tw-mt-2'>
                        {seeForm ? 'Ver listado de proyectos' : 'Definir proyectos'}
                    </button>
                : null}
            </div>
            {!seeForm ?
            <div>
                <ul className='tw-bg-white tw-mx-4 tw-p-2 tw-rounded'>
                    <ul className='tw-flex tw-gap-1'>
                        {years.map(y => 
                            <button className={`tw-p-2 tw-rounded-t-lg hover:tw-bg-blueBar
                                    tw-font-bold
                                    ${yearSe === y ? '' : 'tw-bg-hoverBlueBar tw-text-white'}`}
                                onClick={() => handleYearChange(y)}
                                key={y}>
                                {y}
                            </button>
                        )}
                    </ul>
                    <li className='tw-flex tw-items-stretch
                                    tw-bg-blueBar '>
                        <p className='  tw-basis-1/4 tw-p-1
                                        hover:tw-bg-hoverBlueBar
                                        tw-font-bold'>
                            Codigo de viabilidad
                        </p>
                        <p className='  tw-basis-1/4 tw-p-1 tw-mx-2
                                        hover:tw-bg-hoverBlueBar
                                        tw-font-bold'>
                            Entidad proponente Secretaría y/o dependencia
                        </p>
                        <p className='  tw-basis-1/2 tw-p-1
                                        hover:tw-bg-hoverBlueBar
                                        tw-font-bold'>
                            Nombre del proyecto
                        </p>
                    </li>
                    {projects === undefined || projects.length == 0 ?
                    <p className='tw-basis-full tw-p-1'>Aún no se han definido los proyectos</p>
                    : projects.map((p, i) => <li key={i} className='tw-flex tw-border'>
                        <div className='tw-basis-1/4 tw-p-1'>
                            <a  href={p.link}
                                target="_blank">
                                {p.BPIM}
                            </a>
                        </div>
                        <p className='tw-basis-1/4 tw-p-1 tw-mx-2'>
                            {p.entity}
                        </p>
                        <div className='tw-basis-1/2 tw-p-1 tw-flex tw-justify-between'>
                            {p.name}
                            <ModalSettingPro index={i} id={p.id_project}/>
                        </div>
                    </li>
                    )}
                </ul>
                <div className="tw-w-full md:tw-w-1/2
                            tw-flex tw-justify-between
                            tw-mt-3">
                    {page > 1 ? 
                    <button onClick={()=>{handlePage(page-1)}}
                            className=" tw-py-2 tw-px-3 
                                        tw-font-bold tw-text-xl
                                        tw-bg-slate-400 hover:tw-bg-slate-500
                                        tw-rounded tw-border">{'<'}</button>
                    : <div></div>
                    }
                    {page*10 < proje_s ?
                    <button onClick={()=>handlePage(page+1)}
                            className=" tw-py-2 tw-px-3
                                        tw-font-bold tw-text-xl
                                        tw-bg-slate-400 hover:tw-bg-slate-500
                                        tw-rounded tw-border">{'>'}</button>
                    : <div></div>
                    }
                </div>
            </div>
            : secretaries == undefined ? <p>No se han definido las secretarías</p>
            : <ProjectForm/>}
        </div>
    );
}
