import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { useAppDispatch, useAppSelector } from "@/store";
import { setYearSelect, setExecSelect } from '@/store/chart/chartSlice';

export const Filter = () => {
    const dispatch = useAppDispatch();
    const { years } = useAppSelector(state => state.plan);
    const { board, indexSelect, categories } = useAppSelector(state => state.chart);

    if (board.length === 0) return null;

    const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (value === 'all') {
        } else {
            dispatch(setYearSelect(parseInt(value)));
        }
    };

    const handleExecutionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        dispatch(setExecSelect(value));
    };

    return (
        <div>
            <ToastContainer/>
            <p>Categorias</p>
            <select className='tw-w-full'>
                <option value=""></option>
                {categories && categories.map(cat => <option key={cat} className='tw-text-clip' value={cat}>{cat}</option>)}
            </select>
            <p>Año</p>
            <select className='tw-w-full'
                    onChange={handleYearSelect}>
                {years.map(year => <option key={year} className='tw-text-clip' value={year}>{year}</option>)}
                <option value="all">Todos</option>
            </select>
            <p>Ejecución</p>
            <select className='tw-w-full'
                    onChange={handleExecutionSelect}>
                <option value="fis">Fisica</option>
                <option value="fin">Financiera</option>
                <option value="pro">Programación</option>
            </select>
        </div>
    );
}