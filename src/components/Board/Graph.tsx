import React, { useState, useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppSelector, useAppDispatch } from "@/store";
import { setType } from '@/store/chart/chartSlice';

interface Props {
    dataValues: number[];
}

export const Graph = ( props: Props ) => {
    const dispatch = useAppDispatch();
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { years, colorimeter } = useAppSelector(store => store.plan)
    const { type } = useAppSelector(store => store.chart)

    const categories = years.map((year) => year.toString())
    const pieValues = props.dataValues.map((value, index) => {
        return {
            name: categories[index],
            y: value,
        }
    })

    const options: Highcharts.Options = {
        title: {
            text: `Gráfico de ${type}`
        },
        plotOptions: {
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
        series: [
            {
                name: 'Porcentaje año',
                type: type === 'donut' ? 'pie' : type.valueOf() as any,
                data: pieValues,
                zones: [
                    {
                        value: colorimeter[0]/100,
                        color: '#FE1700',
                    },
                    {
                        value: colorimeter[1]/100,
                        color: '#FCC623',
                    },
                    {
                        value: colorimeter[2]/100,
                        color: '#119432',
                    },
                    {
                        color: '#008DCC',
                    },
                ],
                size: type === 'donut' ? '100%' : undefined,
                innerSize: type === 'donut' ? '70%' : undefined,
                dataLabels: {
                    enabled: true,
                    crop: false,
                }
            },
        ],
    }

    const onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        if (value === 'pie') {
            dispatch(setType('pie'))
        } else if (value === 'line') {
            dispatch(setType('line'))
        } else if (value === 'donut') {
            dispatch(setType('donut'))
        } else if (value === 'bar') {
            dispatch(setType('bar'))
        } else {
            dispatch(setType('pie'))
        }
    }

    return (
        <div className="tw-flex tw-flex-col 
                        tw-items-center 
                        md:tw-flex-row 
                        md:tw-justify-around
                        ">
            <div className='tw-w-full md:tw-w-1/2 md:tw-self-start'>
                <select name="type" id="type" onChange={onChangeType} value={type}>
                    <option value="donut">Donut</option>
                    <option value="pie">Pie</option>
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                </select>
            </div>
            <div className='tw-w-full md:tw-w-1/2 tw-shadow'>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                containerProps={{ style: {width: '100%', height:'100%'} }}/>
            </div>
        </div>
    );
}
