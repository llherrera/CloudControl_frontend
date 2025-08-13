import React, { Fragment, useState } from "react";
import Modal from 'react-modal';

import { useAppSelector, useAppDispatch } from "@/store";
import { addBoard, setIndexSelect, setFieldSelect } from "@/store/chart/chartSlice";

import IconButton from "@mui/material/IconButton";
import { OpenInFull, PieChart, BarChart, Timeline, ArrowUpward, Map, ArrowDownward, Dataset } from '@mui/icons-material';
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
            <IconButton aria-label="abrir dashboard"
                        size="large"
                        color='inherit'
                        title='Abrir panel de visualizaciones'
                        className="tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
                        onClick={() => setIsOpen(true)}>
                <OpenInFull/>
            </IconButton>
        </div>
    )
}

/* ---------- Dashboard (usa estado global: board desde redux) ---------- */
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

    const startDragFields = (e: React.DragEvent<HTMLLIElement>, item_id: string) => {
        e.dataTransfer.setData('item_id', item_id);
    };

    const startDragViews = (e: React.DragEvent<HTMLLIElement>, item_id: string) => {
        e.dataTransfer.setData('chart_id', item_id);
    };

    const dragOver = (e: React.DragEvent<HTMLUListElement>) => e.preventDefault();

    const onDrop = (e: React.DragEvent<HTMLUListElement>) => {
        const item_id = e.dataTransfer.getData('chart_id');
        if (!item_id) return;
        if (board.length === 4) return notify('Solo se pueden agregar 4 visualizaciones');
        const item = visualization.find(it => it.id === item_id);
        if (!item) return;
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
        <Modal isOpen={props.modalIsOpen}
               onRequestClose={() => onClose()}
               contentLabel='Panel de visualizaciones'>
            <div className="tw-h-full tw-flex tw-justify-between">
                <ul role="menu"
                    className={`tw-w-full tw-h-full tw-bg-gray-300 tw-mr-2 tw-p-2 tw-grid tw-gap-2
                                ${board.length === 1 ? '' :
                                  board.length === 2 ? 'tw-grid-cols-2' :
                                  'tw-grid-cols-2 tw-grid-rows-2'}`}
                    onDragOver={dragOver}
                    onDrop={onDrop}>
                    {board.map((bo, index) => {
                        // bo es la estructura de datos que viene del store (Visualization)
                        if (bo.chart) return <InterativeChart key={bo.id + index} type={bo.value} index={index} info={bo.info}/>
                        if (bo.count) return <InterativeCard key={bo.id + index} type={bo.value} index={index} info={bo.info}/>
                        if (bo.map) return <InterativeMap key={bo.id + index} type={bo.value} index={index} info={bo.info}/>
                        return null;
                    })}
                    <li className="tw-hidden">placeholder</li>
                </ul>

                <div className="tw-flex tw-justify-between">
                    <ul role="menu"
                        className="tw-border tw-border-black tw-w-[10rem] tw-p-2">
                        <p className="tw-mx-2 tw-mb-2">Campos</p>
                        {fields.map(item =>
                            <li role="menuitem"
                                className="tw-mx-2 tw-flex tw-cursor-grab"
                                title={item.title}
                                draggable
                                onDragStart={e => startDragFields(e, item.id)}
                                key={item.id}>
                                <Dataset className="tw-mr-2"/>
                                {item.name}
                            </li>
                        )}

                        <li className="tw-mt-2">
                            {indexSelect === -1 ? null : <Filter/>}
                        </li>
                    </ul>

                    <ul role="menu"
                        className="tw-border tw-border-black tw-grid tw-justify-items-center tw-p-2">
                        <p className="tw-px-2">Visualización</p>
                        {visualization.map(item =>
                            <li role="menuitem"
                                className="tw-cursor-grab"
                                title={item.title}
                                draggable
                                onDragStart={e => startDragViews(e, item.id)}
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

/* ---------- Dashboard2Lavenganza (modo local, agrega charts por campos) ---------- */
type BoardItem = { id: string; element: JSX.Element; field: string };

const Dashboard2Lavenganza = (props: ModalProps) => {
    const [board, setBoard] = useState<BoardItem[]>([]);

    const startDragFields = (e: React.DragEvent<HTMLLIElement>, item_id: string) => {
        e.dataTransfer.setData('item_id', item_id);
    };

    const dragOver = (e: React.DragEvent<HTMLUListElement>) => e.preventDefault();

    const doClose = (index: number) => setBoard(prev => prev.filter((_, i) => i !== index));
    const doCloseById = (id: string) => setBoard(prev => prev.filter(b => b.id !== id));

    const onDrop = (e: React.DragEvent<HTMLUListElement>) => {
        const item_id = e.dataTransfer.getData('item_id');
        if (!item_id) return;
        if (board.length === 4) return notify('Solo se pueden agregar 4 campos');
        const item = fields.find(it => it.id === item_id);
        if (!item) return;

        const newIndex_ = board.length;
        const id = new Date().toISOString();

        const newElement = (
            <ChartComponent
                key={id}
                field={item.value}
                id={id}
                index={newIndex_}
                onClose={() => doCloseById(id)}
            />
        );

        setBoard(prev => [...prev, { id, element: newElement, field: item.value }]);
    };

    const onClose = () => {
        setBoard([]);
        props.callback(false);
    };

    return(
        <Modal isOpen={props.modalIsOpen}
               onRequestClose={() => onClose()}
               contentLabel='Panel de campos'>
            <div className="tw-h-full tw-flex tw-justify-between tw-flex-col lg:tw-flex-row">
                <ul role="menu"
                    className={`tw-w-full tw-h-full tw-bg-gray-300 tw-p-2 lg:tw-grid tw-gap-2 tw-overflow-y-scroll lg:tw-overflow-y-auto
                                ${board.length === 1 ? '' :
                                  board.length === 2 ? 'lg:tw-grid-cols-2' :
                                  'lg:tw-grid-cols-2 lg:tw-grid-rows-2'}`}
                    onDragOver={dragOver}
                    onDrop={onDrop}>
                    {board.map((b, i) => <Fragment key={b.id}>{b.element}</Fragment>)}
                    <li className="tw-hidden">placeholder</li>
                </ul>

                <div className="tw-order-first lg:tw-order-last">
                    <ul role="menu"
                        className="tw-border tw-border-black tw-sticky tw-top-0 tw-flex lg:tw-flex-col tw-p-2">
                        <p className="tw-mx-2 tw-mb-2">Campos</p>
                        {fields.map(item =>
                            <li role="menuitem"
                                className="tw-mx-2 tw-flex tw-cursor-grab"
                                title={item.title}
                                draggable
                                onDragStart={e => startDragFields(e, item.id)}
                                key={item.id}>
                                <Dataset className="tw-mr-2"/>
                                {item.name}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </Modal>
    );
}
