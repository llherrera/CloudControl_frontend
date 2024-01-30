import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetSecretaries } from '@/store/plan/thunks';
import { thunkGetUnit, thunkAddUnit, thunkUpdateUnit } from '@/store/unit/thunks';
import { setUnit } from '@/store/unit/unitSlice';

import { BackBtn } from '@/components';
import { UnitInterface, YearInterface } from '@/interfaces';
import { Spinner } from "@/assets/icons";
import cclogo from '@/assets/images/CloudControlIcon.png';

export const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { 
        id_plan, 
        node, 
        url_logo } = useAppSelector(store => store.content);
    const { unit, loadingUnit } = useAppSelector(store => store.unit);
    const { 
        plan, 
        years, 
        rootTree, 
        secretaries } = useAppSelector(store => store.plan);

    useEffect(() => {
        if (node === undefined) return;
        dispatch(thunkGetUnit({id_plan: id_plan.toString(), id_node: node.id_node}));
    }, []);

    useEffect(() => {
        dispatch(thunkGetSecretaries(id_plan!));
    }, []);

    const handleChangeUnit = (event: React.ChangeEvent<
            HTMLInputElement | 
            HTMLSelectElement | 
            HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const unit_: UnitInterface = {
            ...unit,
            [name]: value,
        };
        dispatch(setUnit(unit_));
    };

    const handleChangeYear = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const unit_: UnitInterface = {
            ...unit,
            years: unit.years.map((year, i) => {
                if (i === index) {
                    const year_: YearInterface = {
                        ...year,
                        [name]: value,
                        ['year']: years[i],
                    }
                    return year_;
                } else {
                    return year;
                }
            })
        }
        dispatch(setUnit(unit_));
    };

    const handleSubmit = async () => {
        if (plan === undefined) return;
        if (unit.description === '')
            return alert('Debe ingresar una descripción');
        if (unit.indicator === '')
            return alert('Debe ingresar un indicador');
        if (unit.goal < 0)
            return alert('Debe ingresar una meta');
        if (unit.responsible === '')
            return alert('Debe ingresar un responsable');
        if (unit.years.length <= 0)
            return alert('Debe ingresar una programación');
        
        const id_city = parseInt(plan.id_municipality);
        if (unit.code.length > 0) {
            dispatch(thunkUpdateUnit({
                id_plan: id_plan.toString(),
                id_node: node!.id_node,
                unit: unit,
                years: unit.years,
            }))
        } else {
            dispatch(thunkAddUnit({
                id_plan: id_plan.toString(),
                id_node: node!.id_node,
                unit: unit,
                years: unit.years,
                id_city: id_city
            }))
        }
    };

    return (
        loadingUnit ? <Spinner/>:
        <div className="tw-container tw-mx-auto tw-my-3
                        tw-bg-gray-200
                        tw-border-8 tw-border-gray-400 
                        tw-rounded-md">
            <div className='tw-flex tw-justify-between
                            tw-shadow-2xl
                            tw-border-b-2 tw-border-gray-400
                            tw-z-40'>
                <img src={cclogo} alt="" width={100} height={100}/>
                {url_logo && <img src={url_logo} alt="" width={100} /> }
                <img src="/src/assets/images/Plan-indicativo.png" alt="" width={60} />
            </div>
            <BackBtn handle={() => navigate(-1)} id={plan?.id_plan!} />
            <ol className="tw-col-start-1 tw-col-span-full tw-flex tw-justify-center tw-flex-wrap">
            {rootTree.map((name, index) => {
                return (
                    <li className="tw-flex tw-mx-3" key={index}>
                        <p className="tw-text-green-600 tw-text-xl tw-font-bold">{name[1]}:</p> 
                        <p className="tw-ml-1 tw-text-xl tw-font-bold">{name[0]}</p>
                    </li>
                );
            })}
            </ol>
            <div className="tw-p-3">
                <p className='tw-block'>Información de la meta:</p>
                <form   className=' tw-shadow-2xl tw-rounded tw-border-2
                                    tw-flex tw-flex-wrap
                                    tw-p-2
                                    tw-bg-white'>
                    <textarea
                            name="description"
                            placeholder='Descripción'
                            className=' tw-m-3 tw-p-2
                                        tw-rounded tw-border-2
                                        tw-border-gray-400'
                            value={unit.description}
                            onChange={(e) => handleChangeUnit(e)}/><br />
                    <input  className=' tw-m-3 tw-p-2
                                        tw-rounded tw-border-2
                                        tw-border-gray-400'
                            placeholder='Indicador'
                            value={unit.indicator}
                            onChange={ (e)=>handleChangeUnit(e)}
                            type="text"
                            name='indicator'
                            required/><br />
                    <input  className=' tw-m-3 tw-p-2
                                        tw-rounded tw-border-2
                                        tw-border-gray-400'
                            placeholder='Meta'
                            value={unit.goal}
                            onChange={ (e)=>handleChangeUnit(e)}
                            type="number"
                            name='goal'
                            required/><br />
                    <input  className=' tw-m-3 tw-p-2
                                        tw-rounded tw-border-2
                                        tw-border-gray-400'
                            placeholder='Línea base'
                            value={unit.base}
                            onChange={ (e)=>handleChangeUnit(e)}
                            type="text"
                            name='base'
                            required/>
                    <select name="responsible"
                            onChange={ (e)=>handleChangeUnit(e) }
                            className=' tw-m-3 tw-p-2
                                        tw-rounded tw-border-2
                                        tw-border-gray-400'>
                        {secretaries.map((secretary, index) => (
                            <option key={index} value={secretary.name}>
                                {secretary.name}
                            </option>
                        ))}
                    </select>
                </form>
            </div>
            <div className="tw-p-3">
                <p>Información de la programación</p>
                <form   className=' tw-shadow-2xl tw-rounded tw-border-2
                                    tw-flex tw-flex-wrap
                                    tw-p-2 
                                    tw-bg-white'>
                    {unit.years.map((year, index) => (
                        <div key={index}>
                            <label  htmlFor="">{years[index]}</label>
                            <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                    onChange={ (e) => handleChangeYear(e, index) } 
                                    value={ year.physical_programming??0 }
                                    type="number" 
                                    name="physical_programming" 
                                    placeholder="Programacion" 
                                    required/>
                        </div>
                    ))}
                </form>
            </div>
            <div className="tw-p-3">
                <p>Información de la ejecución financiera</p>
                <form   className=' tw-shadow-2xl tw-rounded tw-border-2
                                    tw-flex tw-flex-wrap
                                    tw-p-2 
                                    tw-bg-white'>
                    {unit.years.map((year, index) => (
                        <div key={index}>
                            <label  htmlFor="">{years[index]}</label>
                            <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                    onChange={ (e) => handleChangeYear(e, index) } 
                                    value={ year.financial_execution??0 }
                                    type="number" 
                                    name="financial_execution" 
                                    placeholder="Recursos ejecutados" 
                                    required/>
                        </div>
                    ))}
                </form>
            </div>
            <div className='tw-p-3 tw-flex tw-justify-center'>
                <button className=' tw-bg-blue-400 hover:tw-bg-blue-300
                                    tw-text-white hover:tw-text-gray-900
                                    tw-font-bold
                                    tw-p-2 tw-mb-4
                                    tw-rounded'
                        onClick={handleSubmit}>
                    Guardar Cambios de la meta
                </button>
            </div>
        </div>
    );
}