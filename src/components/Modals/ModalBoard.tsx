import React, { Fragment, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { addBoard, setIndexSelect, setFieldSelect } from "@/store/chart/chartSlice";

import IconButton from "@mui/material/IconButton";
import { OpenInFull, PieChart, BarChart, Timeline, ArrowUpward, Map, ArrowDownward, Dataset, Close } from '@mui/icons-material';
import { Visualization, ModalProps } from "@/interfaces";
import { manageVisualization, notify, fields } from '@/utils';
import { InterativeChart, InterativeCard, InterativeMap, Filter, ChartComponent } from "../Chart";

export const ModalBoard = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Dashboard2Lavenganza
                modalIsOpen={isOpen}
                callback={setIsOpen}/>
            <IconButton aria-label="delete"
                        size="large"
                        color='inherit'
                        title='Generar reporte del Plan Indicativo Total'
                        className="tw-transition
                            hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={() => setIsOpen(true)}>
                <OpenInFull/>
            </IconButton>
        </div>
    )
}

const Dashboard = (props: ModalProps) => {
    const dispatch = useAppDispatch();

    const { board, indexSelect } = useAppSelector(store => store.chart);

    const visualization: Visualization[] = [
        {id: '1', icon: <PieChart/>, title:'Torta',  value: 'pie', chart: true},
        {id: '2', icon: <BarChart/>, title:'Barra', value: 'bar', chart: true},
        {id: '3', icon: <Timeline/>, title:'Linea', value: 'line', chart: true},
        {id: '4', icon: <ArrowUpward/>, title:'Máximo', value: 'max', count: true},
        {id: '5', icon: <ArrowDownward/>, title:'Mínimo', value: 'min', count: true},
        {id: '6', icon: <Map/>, title:'Mapa', value: 'map', map: true},
    ];

    const startDragFields = (e: React.DragEvent<HTMLLIElement>, item_id: string) => e.dataTransfer.setData('item_id', item_id);

    const startDragViews = (e: React.DragEvent<HTMLLIElement>, item_id: string) => e.dataTransfer.setData('chart_id', item_id);

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
        dispatch(setFieldSelect(''));
        props.callback(false);
    };


    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={() => onClose()}
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
                    onDragOver={e =>dragOver(e)}
                    onDrop={e => onDrop(e)}>
                    {board.map((bo, index) => {
                        if (bo.chart) return <InterativeChart key={bo.id + index} type={bo.value} index={index} info={bo.info}/>
                        else if (bo.count) return <InterativeCard key={bo.id + index} type={bo.value} index={index} info={bo.info}/>
                        else if (bo.map) return <InterativeMap key={bo.id + index} type={bo.value} index={index} info={bo.info}/>
                        else return null
                    })}
                    <div className="tw-hidden">a</div>
                </ul>
                <div className="tw-flex tw-justify-between">
                    <ul role="menuitem"
                        className="tw-border tw-border-black tw-w-[10rem]">
                        <div className="tw-h-1/4">
                            <p className="tw-mx-2 tw-mb-4">Campos</p>
                            {fields.map(item =>
                                <li role="menuitem"
                                    className="tw-mx-2 tw-flex tw-cursor-grab"
                                    title={item.title}
                                    draggable onDragStart={e => startDragFields(e, item.id)}
                                    key={item.id}>
                                    <Dataset/>
                                    {item.name}
                                </li>
                            )}
                        </div>
                        <div className="tw-h- tw-border tw-bg-gray-200">
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
                                draggable onDragStart={e => startDragViews(e, item.id)}
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
/*
<div className="tw-flex tw-justify-between">
                    <ul role="menuitem"
                        className="tw-border tw-border-black tw-w-[10rem]">
                        <div className="tw-mb-3">
                            <select name="" id="">
                                <option value="">
                                    Gráfico...
                                </option>
                                {visualization.map((v, i) => <option key={i}>
                                    {v.title}
                                </option>)}
                            </select>
                        </div>
                        <div>
                            <select name="" id="">
                                <option value="">Campos...</option>
                                {fields.map((f, i) => <option>
                                    {f.name}
                                </option>)}
                            </select>
                        </div>
                        <div className="tw-h- tw-border tw-bg-gray-200">
                            {indexSelect === -1 ? null :
                            <Filter/>}
                        </div>
                    </ul>
                    
                </div>
*/

const Dashboard2Lavenganza = (props: ModalProps) => {
    const [board, setBoard] = useState<JSX.Element[]>([]);

    const startDragFields = (e: React.DragEvent<HTMLLIElement>, item_id: string) => e.dataTransfer.setData('item_id', item_id);

    const dragOver = (e: React.DragEvent<HTMLUListElement>) => e.preventDefault();

    const onDrop = (e: React.DragEvent<HTMLUListElement>) => {
        const item_id = e.dataTransfer.getData('item_id');
        if (item_id === '') return;
        if (board.length === 4) return notify('Solo se pueden agregar 4 campos');
        const item = fields.find(it => it.id === item_id);
        if (item === undefined) return;
        const newIndex_ = board.length;
        const id = new Date().toISOString();
        const newChart_ = <ChartComponent
            key={id}
            field={item.value}
            id={id}
            index={newIndex_}
            onClose={() => doClose_(id)}
        />;
        setBoard(prev => [...prev, newChart_ ]);
    };

    const onClose = () => {
        setBoard([]);
        props.callback(false);
    };

    const doClose = (index: number) => setBoard(prev => prev.filter((_, i) => i !== index));
    const doClose_ = (id: string) => setBoard(prev => prev.filter(b => b.props.id !== id));

    return(
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={() => onClose()}
                contentLabel=''>
            <div className="tw-h-full tw-flex tw-justify-between
                            tw-flex-col lg:tw-flex-row">
                <ul role="menuitem"
                    className={`tw-w-full tw-h-full
                                tw-bg-gray-300
                                tw-p-2
                                lg:tw-grid tw-gap-2
                                tw-overflow-y-scroll lg:tw-overflow-y-auto
                                ${board.length === 1 ? '' :
                                board.length === 2 ? 'lg:tw-grid-cols-2' :
                                'lg:tw-grid-cols-2 lg:tw-grid-rows-2'} `}
                    onDragOver={e => dragOver(e)}
                    onDrop={e => onDrop(e)}>
                    {board.map(bo => bo)}
                    <div className="tw-hidden">a</div>
                </ul>
                <div className="tw-order-first lg:tw-order-last">
                    <ul role="menuitem"
                        className=" tw-border tw-border-black
                                    tw-sticky tw-top-0
                                    tw-flex lg:tw-flex-col">
                        <p className="tw-mx-2">Campos</p>
                        {fields.map(item =>
                            <li role="menuitem"
                                className="tw-mx-2 tw-flex tw-cursor-grab"
                                title={item.title}
                                draggable onDragStart={e => startDragFields(e, item.id)}
                                key={item.id}>
                                <Dataset/>
                                {item.name}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </Modal>
    );
}