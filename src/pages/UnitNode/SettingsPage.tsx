import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetSecretaries, thunkGetLevelName } from '@/store/plan/thunks';
import { thunkGetUnit } from '@/store/unit/thunks';

import { BackBtn } from '@/components';
import { UnitInterface, YearInterface } from '@/interfaces';
import { getLetter } from '@/utils';

export const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const id_plan = location.state?.id_plan;
    const id_nodo = location.state?.id_nodo;

    const { plan, years, namesTree, secretaries } = useAppSelector(store => store.plan);
    const { unit } = useAppSelector(store => store.unit);

    const [nodeUnit, setNodeUnit] = useState<UnitInterface>(unit!);

    const [nodeYear, setNodeYear] = useState<YearInterface[]>(unit!.years!);

    useEffect(() => {
        dispatch(thunkGetUnit({idPDT: id_plan, idNode: id_nodo}))
    }, []);

    useEffect(() => {
        setNodeUnit(unit!);
        setNodeYear(unit!.years!);
    }, [unit]);

    useEffect(() => {
        const ids = id_nodo!.split('.');
        let ids2 = ids.reduce((acumulator:string[], currentValue: string) => {
            if (acumulator.length === 0) {
                return [currentValue];
            } else {
                const ultimoElemento = acumulator[acumulator.length - 1];
                const concatenado = `${ultimoElemento}.${currentValue}`;
                return [...acumulator, concatenado];
            }
        }, []);
        ids2 = ids2.slice(1);
        dispatch(thunkGetLevelName(ids2))
    }, []);

    useEffect(() => {
        dispatch(thunkGetSecretaries(id_plan!));
    }, []);

    const handleChangeUnit = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNodeUnit({ ...nodeUnit, [name]: value });
    }

    const handleChangeYear = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...nodeYear];
        newData[index] = { ...newData[index], [name]: value };
        setNodeYear(newData);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <div className="tw-container tw-mx-auto tw-my-3
                        tw-bg-gray-200
                        tw-border-8 tw-border-gray-400 
                        tw-rounded-md">
            <div className='tw-flex tw-justify-between
                            tw-px-3 tw-my-4
                            tw-shadow-2xl
                            tw-border-b-2 tw-border-gray-400
                            tw-z-40'>
                <img src="/src/assets/images/CloudControlIcon.png" alt="" width={100}/>
                <img src="/src/assets/images/Logo-Municipio.png" alt="" width={250} className="tw-invisible" />
                <img src="/src/assets/images/Plan-indicativo.png" alt="" width={60} />
            </div>
            <BackBtn handle={() => navigate(-1)} id={plan?.id_plan!} />
            <ol className="tw-flex tw-justify-center tw-flex-wrap">
            {namesTree.length > 0 && namesTree.map((name, index) => {
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
                    <input  className='tw-m-3 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400'
                            placeholder='Descripción de la meta'
                            onChange={ (e)=>handleChangeUnit(e)}
                            type="text" name='description' required/><br />
                    <input  className='tw-m-3 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400'
                            placeholder='Indicador'
                            onChange={ (e)=>handleChangeUnit(e)}
                            type="text" name='indicator' required/><br />
                    <input  className='tw-m-3 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400'
                            placeholder='Meta'
                            onChange={ (e)=>handleChangeUnit(e)}
                            type="number" name='goal' required/><br />
                    <input  className='tw-m-3 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400'
                            placeholder='Línea base'
                            onChange={ (e)=>handleChangeUnit(e)}
                            type="text" name='base' required/>
                    <select name="responsible"
                            onChange={ (e)=>handleChangeUnit(e) }
                            className='tw-m-3 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400'>
                        {secretaries.map((secretary, index) => (
                            <option key={index} value={secretary}>{secretary}</option>
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
                    {years.map((year, index) => (
                        <div key={index}>
                            <label  htmlFor="">{year}</label>
                            <input  className="tw-m-2 tw-p-2 tw-rounded tw-border-2 tw-border-gray-400"
                                    onChange={ (e) => handleChangeYear(e, index) } 
                                    value={ nodeYear.length > 0 ? nodeYear[index].programed : 0 }
                                    type="number" 
                                    name="programed" 
                                    placeholder="Programacion" 
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
                                    tw-rounded'>
                    Guardar Cambios de la meta
                </button>
            </div>
        </div>
    );
}