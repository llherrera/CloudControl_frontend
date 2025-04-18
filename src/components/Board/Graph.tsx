import React, { useRef, useState, useEffect } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppSelector, useAppDispatch } from "@/store";
import { setRadioBtn } from '@/store/plan/planSlice';
import { setType } from '@/store/chart/chartSlice';

import { GraphProps } from '@/interfaces';
import { ModalTotalPDT, ModalSecretary, ModalProgram } from '@/components/Modals';
import { decode } from "@/utils";

export const Graph = ( props: GraphProps ) => {
    const dispatch = useAppDispatch();
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { token_info } = useAppSelector(store => store.auth);
    const { colorimeter, radioBtn, nodes } = useAppSelector(store => store.plan);
    const { type } = useAppSelector(store => store.chart);
    const [indexType, setIndexType] = useState(0);
    const typeList = [
        {
            type: 'Dona',
            value: 'donut'
        },
        {
            type: 'Torta',
            value: 'pie'
        },
        {
            type: 'Linea',
            value: 'line'
        },
        {
            type: 'Barras',
            value: 'bar'
        },
    ];

    const [rol, setRol] = useState("");

    const categories = nodes.map((node) => node.name);
    const pieValues = props.dataValues.map((value, index) => {
        return {
            name: categories[index],
            y: value
        }
    });

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
        }
    }, []);

    const options: Highcharts.Options = {
        title: {
            text: `Gráfico de ${typeList[indexType].type}`
        },
        accessibility: {
            enabled: false,
        },
        plotOptions: {
            series: {
                dataLabels:[{
                    enabled: true,
                    //distance: -30,
                    format: radioBtn === 'fisica' ? '{y}%' : '{y} M',
                    formatter: function() {
                        return Highcharts.numberFormat(this.y??0, 0, ',', '.');
                    }
                }],
            },
            pie: {
                dataLabels: {
                    enabled: false,
                },
                showInLegend: true,
            },
        },
        annotations: [
            {
                labels: [
                    {
                        point: {
                            x: 0,
                            y: 0,
                            xAxis: 0,
                            yAxis: 0,
                        },
                        text: '0',
                    },
                    {
                        point: {
                            x: 0,
                            y: 0,
                            xAxis: 0,
                            yAxis: 0,
                        },
                        text: '100',
                    },
                ],
            },
        ],
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: radioBtn === 'fisica' ? 'Porcentajes de ejecución física' : 'Ejecución financiera',
            },
            labels: {
                formatter: function () {
                    return this.value + (radioBtn === 'fisica' ? '%' : 'M');
                },
            },
        },
        series: [
            {
                name: radioBtn === 'fisica' ? 'Porcentajes de ejecución física año' : 'Ejecución financiera año',
                type: type === 'donut' ? 'pie' : type.valueOf() as any,
                data: pieValues,
                zones: radioBtn === 'fisica' ? [
                    {
                        value: colorimeter[0],
                        color: '#FE1700',
                    },
                    {
                        value: colorimeter[1],
                        color: '#FCC623',
                    },
                    {
                        value: colorimeter[2],
                        color: '#119432',
                    },
                    {
                        color: '#008DCC',
                    },
                ] : undefined,
                size: type === 'donut' ? '100%' : undefined,
                innerSize: type === 'donut' ? '70%' : undefined,
                dataLabels: {
                    enabled: true,
                    crop: false,
                }
            },
        ],
    };

    const onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = e.target.selectedIndex;
        const value = typeList[newIndex].value;
        dispatch(setType(value));
        setIndexType(newIndex);
    };

    return (
        <div className="tw-flex tw-flex-col
                        tw-pb-3
                        tw-items-center
                        md:tw-flex-row
                        md:tw-flex-wrap
                        md:tw-justify-around">
            <div className='tw-flex tw-flex-col
                            tw-w-full md:tw-w-1/3 tw-h-full
                            tw-justify-around'>
                <select name="type" id="type"
                        onChange={onChangeType}
                        value={typeList[indexType].value}
                        className='tw-border tw-self-start tw-p-2 tw-m-2'>
                    {typeList.map((type)=><option value={type.value} key={type.value}>{type.type}</option>)}
                </select>
                <div className='tw-ml-10 tw-mt-3'>
                    <input  type="radio"
                            id='fisica'
                            className='tw-mr-2'
                            onChange={ ()=> dispatch(setRadioBtn('fisica'))}
                            checked={radioBtn === 'fisica'}/>
                    <label htmlFor='fisica'>Ejecución física</label><br />
                    <input  type="radio"
                            id='financiera'
                            className='tw-mr-2'
                            onChange={ ()=> dispatch(setRadioBtn('financiera'))}
                            checked={radioBtn === 'financiera'}/>
                    <label htmlFor="financiera">Ejecución financiera</label>
                </div>
                {rol === '' ? null :
                <div className='tw-flex tw-justify-around'>
                    <ModalProgram />
                    <ModalSecretary />
                    <ModalTotalPDT />
                </div>
                }
            </div>
            <div className='tw-w-full md:tw-w-1/2 tw-shadow-2xl'>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartComponentRef}
                    containerProps={{ style: {width: '100%', height:'100%'} }}/>
            </div>
        </div>
    );
}
