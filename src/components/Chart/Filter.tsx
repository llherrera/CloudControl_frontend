import { ToastContainer } from 'react-toastify';

import { useAppDispatch, useAppSelector } from "@/store";
import {
    setYearSelect,
    setExecSelect,
    setCateSelect,
    setSubCateSelect } from '@/store/chart/chartSlice';

export const Filter = () => {
    const dispatch = useAppDispatch();
    const { years } = useAppSelector(state => state.plan);
    const { board, yearSelect, execSelect, cateSelect, subCateSelect, categories, subCategories, fieldSelect } = useAppSelector(state => state.chart);

    if (board.length === 0) return null;

    const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        dispatch(setYearSelect(parseInt(value)));
    };

    const handleExecutionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        dispatch(setExecSelect(value));
    };

    const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        dispatch(setCateSelect(value));
    };

    const handleSubCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        dispatch(setSubCateSelect(value));
    };

    return (
        <div>
            <ToastContainer/>
            <p>{(fieldSelect === '1' || fieldSelect === '2' || fieldSelect === '3') ?
            'Secretarias' : (fieldSelect === '4') ? 'Localidades' : 'Categorias'
            }</p>
            <select className='tw-w-full'
                    onChange={handleCategorySelect}
                    value={cateSelect}>
                <option value=""></option>
                {categories && categories.map(cat => <option key={cat} className='tw-text-clip' value={cat}>{cat}</option>)}
            </select>
            {fieldSelect === '4' ? <div>
                <p>Barrios</p>
                <select className='tw-w-full'
                    onChange={handleSubCategorySelect}
                    value={subCateSelect}>
                <option value=""></option>
                {subCategories && subCategories.map(cat => <option key={cat} className='tw-text-clip' value={cat}>{cat}</option>)}
            </select>
            </div> : null}
            <p>Año</p>
            <select className='tw-w-full'
                    onChange={handleYearSelect}
                    value={yearSelect}>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
                <option value={0}>Todos</option>
            </select>
            {(fieldSelect === '1' || fieldSelect === '2' || fieldSelect === '3') ?
            <div>
                <p>Ejecución</p>
                <select className='tw-w-full'
                        onChange={handleExecutionSelect}
                        value={execSelect}>
                    <option value="financial_execution">Financiera</option>
                    <option value="physical_execution">Fisica</option>
                    <option value="physical_programming">Programación</option>
                </select>
            </div> : (fieldSelect === '4') ? <div>
                <p>Barrios</p>
                <select className='tw-w-full'
                        onChange={handleExecutionSelect}
                        value={execSelect}>
                    <option value="done">Realizado</option>
                    <option value="benefited_population_number">Población beneficiada</option>
                    <option value="executed_resources">Recursos ejecutados</option>
                </select>
            </div> : null
            }
        </div>
    );
}