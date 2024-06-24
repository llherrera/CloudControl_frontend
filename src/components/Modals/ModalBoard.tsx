import React, { useState } from "react";
import Modal from 'react-modal';


import { useAppSelector, useAppDispatch } from "@/store";
import { addBoard, setIndexSelect } from "@/store/chart/chartSlice";

import IconButton from "@mui/material/IconButton";
import { 
    OpenInFull, 
    PieChart, 
    BarChart, 
    Timeline, 
    ArrowUpward, 
    ArrowDownward, 
    Dataset } from '@mui/icons-material';
import { Visualization } from "@/interfaces";
import { 
    manageVisualization, 
    notify, 
    fields } from '@/utils';
import { 
    InterativeChart, 
    InterativeCard, 
    Filter } from "../Chart";

interface Props {
    isOpen: boolean;
    callback: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalBoard = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Dashboard
                isOpen={isOpen}
                callback={setIsOpen}/>
            <IconButton aria-label="delete" 
                        size="large" 
                        color='inherit' 
                        title='Generar reporte del Plan Indicativo Total'
                        className="tw-transition 
                            hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={()=>setIsOpen(true)}>
                <OpenInFull/>
            </IconButton>
        </div>
    )
}

const Dashboard = (props: Props) => {
    const dispatch = useAppDispatch();

    const { board, indexSelect } = useAppSelector((state) => state.chart);

    const visualization: Visualization[] = [
        {id: '1', icon: <PieChart/>, title:'Torta',  value: 'pie', chart: true, count: false},
        {id: '2', icon: <BarChart/>, title:'Barra', value: 'bar', chart: true, count: false},
        {id: '3', icon: <Timeline/>, title:'Linea', value: 'line', chart: true, count: false},
        {id: '4', icon: <ArrowUpward/>, title:'Maximo', value: 'max', chart: false, count: true},
        {id: '5', icon: <ArrowDownward/>, title:'Minimo', value: 'min', chart: false, count:true},
    ];

    const startDrag = (e: React.DragEvent<HTMLLIElement>, item_id: string) => e.dataTransfer.setData('item_id', item_id);

    const startDrag2 = (e: React.DragEvent<HTMLLIElement>, item_id: string) => e.dataTransfer.setData('chart_id', item_id);

    const dragOver = (e: React.DragEvent<HTMLUListElement>) => e.preventDefault();

    const onDrop = (e: React.DragEvent<HTMLUListElement>) => {
        const item_id = e.dataTransfer.getData('chart_id');
        if (item_id === '') return;
        if (board.length === 4) return notify('Solo se pueden agregar 4 visualizaciones');
        const item = visualization.find(it => it.id === item_id);
        if (item === undefined) return;
        const newBoard = [...board, manageVisualization(item)];
        dispatch(addBoard(newBoard));
    };

    const onClose = () => {
        dispatch(addBoard([]));
        dispatch(setIndexSelect(-1));
        props.callback(false);
    };

    
    return (
        <Modal  isOpen={props.isOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''>
            <div className="tw-h-full tw-flex tw-justify-between">
                <ul role="menuitem"
                    className={`tw-w-full tw-h-full
                                tw-bg-gray-300 
                                tw-mr-2 tw-p-2
                                tw-grid tw-gap-2
                                ${board.length === 1 ? '' : 
                                board.length === 2 ? 'tw-grid-cols-2' :
                                'tw-grid-cols-2 tw-grid-rows-2'} `}
                    onDragOver={(e)=>dragOver(e)}
                    onDrop={(e)=>onDrop(e)}>
                    {board.map((bo, index) => {
                        if (bo.chart) return <InterativeChart key={index} type={bo.value} index={index}/>
                        else if (bo.count) return <InterativeCard key={index} type={bo.value} index={index}/>
                        else return null
                    })}
                    <div className="tw-hidden">a</div>
                </ul>
                <div className="tw-flex tw-justify-between">
                    <ul role="menuitem"
                        className="tw-border tw-border-black tw-w-[10rem]">
                        <div className="tw-h-1/2">
                            <p className="tw-mx-2 tw-mb-4">Campos</p>
                            {fields.map(item =>
                                <li role="menuitem"
                                    className="tw-mx-2 tw-flex tw-cursor-grab"
                                    title={item.title}
                                    draggable onDragStart={(e)=>startDrag(e, item.id)}
                                    key={item.id}>
                                    <Dataset/>
                                    {item.name}
                                </li>
                            )}
                        </div>
                        <div className="tw-h-1/2 tw-border tw-bg-gray-200">
                            {indexSelect === -1 ? null : 
                            <Filter/>}
                        </div>
                    </ul>
                    <ul role="menuitem"
                        className=" tw-border tw-border-black 
                                    tw-grid tw-justify-items-center">
                        <p className="tw-px-2">Visualización</p>
                        {visualization.map(item =>
                            <li role="menuitem"
                                className="tw-cursor-grab"
                                title={item.title}
                                draggable onDragStart={(e)=>startDrag2(e, item.id)}
                                key={item.id}>
                                {item.icon}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </Modal>
    );
}