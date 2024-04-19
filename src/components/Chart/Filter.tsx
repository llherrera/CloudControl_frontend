import { ToastContainer } from 'react-toastify';

import { useAppDispatch, useAppSelector } from "@/store";
import {
    setYearSelect,
    setExecSelect,
    setCateSelect } from '@/store/chart/chartSlice';

export const Filter = () => {
    const dispatch = useAppDispatch();
    const { years, secretaries, locations } = useAppSelector(state => state.plan);
    const { board, yearSelect, execSelect, cateSelect, categories } = useAppSelector(state => state.chart);

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

    return (
        <div>
            <ToastContainer/>
            <p>Categorias</p>
            <select className='tw-w-full'
                    onChange={handleCategorySelect}
                    value={cateSelect}>
                <option value=""></option>
                {categories && categories.map(cat => <option key={cat} className='tw-text-clip' value={cat}>{cat}</option>)}
            </select>
            <p>Año</p>
            <select className='tw-w-full'
                    onChange={handleYearSelect}
                    value={yearSelect}>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
                <option value={0}>Todos</option>
            </select>
            <p>Ejecución</p>
            <select className='tw-w-full'
                    onChange={handleExecutionSelect}
                    value={execSelect}>
                <option value="financial_execution">Financiera</option>
                <option value="physical_execution">Fisica</option>
                <option value="physical_programming">Programación</option>
            </select>
        </div>
    );
}