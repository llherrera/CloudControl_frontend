import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, List, ListItemText, ListItemButton,
    ListItemIcon } from '@mui/material';

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkAddUnitNodeResult, thunkUpdateUnitNodeResult } from '@/store/unit/thunks';

import { NodeInterface, UnitInfoProps, UnitNodeResultInterface } from '@/interfaces';
import { Input, CloseBtn } from '@/components';
import { notify } from "@/utils";

export const NodeResultForm = ({unit}: UnitInfoProps) => {
    const dispatch = useAppDispatch();
    const { nodes } = useAppSelector(store => store.plan);
    const { loadingUnitResult } = useAppSelector(store => store.unit);
    const { id_plan } = useAppSelector(store => store.content);

    const [selectNodes, setSelectNodes] = useState<NodeInterface[]>([]);
    const [data, setData] = useState<UnitNodeResultInterface>(
        unit ?? {
            id_node: '',
            code: '',
            id_plan: id_plan,
            description: '',
            indicator: '',
            base_line: 0,
            goal: 0,
            executed: 0,
            responsible: '',
            unitMeter: '',
            unitNodes: [],
        }
    );

    const handleChangeUnit = (event: React.ChangeEvent<
                                        HTMLInputElement |
                                        HTMLSelectElement |
                                        HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = e.target.selectedIndex - 1;
        const temp = selectNodes.map(item => item.id_node);
        if (index < 0) return;
        if (!temp.includes(nodes[index].id_node)) setSelectNodes(prevItems => [...prevItems, nodes[index]]);
        else notify('No puede relacionar la misma meta mas de una vez', 'warning');
    };

    const deleteItem = (index: number) => setSelectNodes(items => items.filter((item, i) => i !== index));

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let temp = selectNodes.map(s => s.id_node);
        if (unit == undefined)
            dispatch(thunkAddUnitNodeResult({id_plan, id_node: temp[0].split('.').slice(0, -1).join('.'), node: data, nodes: temp}))
        else
            dispatch(thunkUpdateUnitNodeResult({id_plan: -1, id_node: '', node: data, nodes: temp}))
    };

    return (
        <form
            onSubmit={handleSubmit}
            className=' tw-ml-4 tw-mb-4 tw-p-2
                        tw-border tw-border-slate-500
                        tw-flex tw-flex-wrap tw-items-stretch
                        tw-bg-white tw-shadow-2xl'>
            <div className='tw-flex tw-flex-col tw-ml-3'>
                <p>Descripción</p>
                <textarea
                    name="description"
                    placeholder='Descripción'
                    className=' tw-p-2 tw-w-full
                                tw-rounded tw-border-2
                                tw-border-gray-400'
                    value={data.description}
                    onChange={e => handleChangeUnit(e)}
                />
            </div>
            <Input
                classname='tw-flex-col'
                type='text'
                label='Indicador'
                placeholder='Indicator'
                id='indicator'
                name='indicator'
                value={data.indicator}
                onChange={e => handleChangeUnit(e)}
                center={false}
            />
            <Input
                classname='tw-flex-col'
                type='number'
                label='Línea base'
                placeholder='Línea base'
                id='base_line'
                name='base_line'
                value={data.base_line}
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
                value={data.goal}
                onChange={e => handleChangeUnit(e)}
                center={false}
            />
            <Input
                classname='tw-flex-col'
                type='text'
                label='Encargado'
                placeholder='Encargado'
                id='responsible'
                name='responsible'
                value={data.responsible}
                onChange={e => handleChangeUnit(e)}
                center={false}
            />
            <Input
                classname='tw-flex-col'
                type='text'
                label='Unidad de medida'
                placeholder='Unidad de medida'
                id='unitMeter'
                name='unitMeter'
                value={data.unitMeter}
                onChange={e => handleChangeUnit(e)}
                center={false}
            />
            <div className="tw-basis-full tw-flex tw-flex-grow  tw-gap-2 tw-ml-3">
                <div className="tw-basis-1/2 tw-flex tw-flex-col">
                    <label>
                        Metas de producto
                    </label>
                    <select className=" tw-p-2 tw-w-full tw-rounded
                                        tw-border-2 tw-border-gray-400"
                        onChange={e => handleSelectChange(e)}>
                        <option value=""></option>
                        {nodes.map((l, i) =>
                            <option value={l.id_node} key={i}>
                                {l.name}
                            </option>
                        )}
                    </select>
                </div>
                <List className="tw-basis-1/2 tw-bg-white">
                    {selectNodes.map((node, index) =>
                        <ListItemButton
                            key={index}
                            sx={{
                                marginTop: 1,
                                border: 1,
                                borderRadius: 2
                            }}
                        >
                            <ListItemText
                                primary={node.name}
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}
                            />
                            <ListItemIcon>
                                <CloseBtn handle={deleteItem} id={index} />
                            </ListItemIcon>
                        </ListItemButton>
                    )}
                </List>
            </div>
            <button type="submit"
                className=' tw-bg-blue-500 hover:tw-bg-blue-300
                            tw-text-white tw-font-bold
                            tw-flex tw-justify-center
                            tw-rounded tw-w-full
                            tw-p-2 tw-mt-2'>
                {loadingUnitResult ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                    : <p>Guardar meta</p>
                }
            </button>
        </form>
    );
}
