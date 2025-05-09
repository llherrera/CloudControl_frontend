import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetSecretaries } from '@/store/plan/thunks';
import { thunkGetUnit, thunkAddUnit, thunkUpdateUnit } from '@/store/unit/thunks';
import { setUnit } from '@/store/unit/unitSlice';

import { BackBtn, UnitFrame, Input, SelectInput } from '@/components';
import { UnitInterface, YearInterface } from '@/interfaces';
import { Spinner } from "@/assets/icons";

import { notify } from '@/utils';

export const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { id_plan, node } = useAppSelector(store => store.content);
    const { unit, loadingUnit } = useAppSelector(store => store.unit);
    const { plan, years, rootTree, secretaries } = useAppSelector(store => store.plan);

    useEffect(() => {
        if (node === undefined) return;
        dispatch(thunkGetUnit({id_plan: id_plan.toString(), id_node: node.id_node}));
    }, []);

    useEffect(() => {
        if (id_plan <= 0) return;
        if (secretaries == undefined)
            dispatch(thunkGetSecretaries(id_plan));
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
        if (unit.description === '') notify('Debe ingresar una descripción');
        if (unit.indicator === '') notify('Debe ingresar un indicador');
        if (unit.goal < 0) notify('Debe ingresar una meta');
        if (unit.responsible === '') notify('Debe ingresar un responsable');
        if (unit.years.length <= 0) return notify('Debe ingresar una programación');
        
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
        <UnitFrame>
            <BackBtn handle={() => navigate(-1)} id={plan?.id_plan!} />
            <ol className="tw-flex tw-justify-center tw-flex-wrap">
            {rootTree.map((name) => {
                return (
                    <li className="tw-flex tw-mx-3" key={name[1]}>
                        <p className="tw-text-green-600 tw-text-xl tw-font-bold">{name[1]}:</p> 
                        <p className="tw-ml-1 tw-text-xl tw-font-bold">{name[0]}</p>
                    </li>
                );
            })}
            </ol>
            <div className="tw-p-3">
                <p className='tw-block'>Información de la meta:</p>
                <form   className=' tw-shadow-2xl
                                    tw-border tw-border-slate-500
                                    tw-flex tw-flex-wrap
                                    tw-p-2 tw-bg-white'>
                    <div className='tw-flex tw-flex-col tw-ml-3'>
                        <p>Descripción</p>
                        <textarea
                                name="description"
                                placeholder='Descripción'
                                className=' tw-p-2
                                            tw-rounded tw-border-2
                                            tw-border-gray-400'
                                value={unit.description}
                                onChange={(e) => handleChangeUnit(e)}/>
                    </div>
                    <Input
                        classname='tw-flex-col'
                        type='text'
                        label='Indicador'
                        placeholder='Indicator'
                        id='indicator'
                        name='indicator'
                        value={unit.indicator}
                        onChange={e => handleChangeUnit(e)}
                        center={false}
                    />
                    <Input
                        classname='tw-flex-col'
                        type='number'
                        label='Meta'
                        placeholder='Meta'
                        id='goal'
                        name='goal'
                        value={unit.goal}
                        onChange={e => handleChangeUnit(e)}
                        center={false}
                    />
                    <Input
                        classname='tw-flex-col'
                        type='number'
                        label='Línea base'
                        placeholder='Línea base'
                        id='base'
                        name='base'
                        value={unit.base}
                        onChange={e => handleChangeUnit(e)}
                        center={false}
                    />
                    <SelectInput
                        classname='tw-flex-col'
                        id='responsible'
                        name='responsible'
                        label='Secretaría'
                        value={unit.responsible}
                        onChange={e => handleChangeUnit(e)}
                        options={secretaries ? secretaries.map(s => s.name) : []}
                        center={false}
                    />
                </form>
            </div>
            <div className="tw-p-3">
                <p>Información de la programación</p>
                <form   className=' tw-shadow-2xl
                                    tw-border tw-border-slate-500 
                                    tw-flex tw-flex-wrap
                                    tw-p-2 tw-bg-white'>
                    {years.map((year, i) => (
                        <div key={year}>
                            <label>{year}</label>
                            <input  
                                className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                onChange={ (e) => handleChangeYear(e, i) } 
                                value={ unit.years[i].physical_programming ?? 0 }
                                type="number" 
                                name="physical_programming" 
                                placeholder="Programacion" 
                                required/>
                        </div>
                    ))}
                </form>
            </div>
            {/*<div className="tw-p-3">
                <p>Información de la ejecución financiera</p>
                <form   className=' tw-shadow-2xl
                                    tw-border tw-border-slate-500 
                                    tw-flex tw-flex-wrap
                                    tw-p-2 tw-bg-white'>
                    {years.map((year, i) => (
                        <div key={year}>
                            <label  htmlFor="">{year}</label>
                            <input  
                                className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                onChange={ (e) => handleChangeYear(e, i) } 
                                value={ unit.years[i].financial_execution ?? 0 }
                                type="number" 
                                name="financial_execution" 
                                placeholder="Recursos ejecutados" 
                                required/>
                        </div>
                    ))}
                </form>
            </div>*/}
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
        </UnitFrame>
    );
}

/*
{unit.years.map((year, index) => (
                        <div key={year.year}>
                            <label>{years[index]}</label>
                            <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                    onChange={ (e) => handleChangeYear(e, index) } 
                                    value={ year.physical_programming??0 }
                                    type="number" 
                                    name="physical_programming" 
                                    placeholder="Programacion" 
                                    required/>
                        </div>
                    ))}
*/