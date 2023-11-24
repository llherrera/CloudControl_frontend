import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppSelector, useAppDispatch } from "@/store";
import { setRadioBtn } from '@/store/plan/planSlice';
import { setType } from '@/store/chart/chartSlice';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from "@mui/material/IconButton";

import { GraphProps } from '@/interfaces';
import { getDataFromPrograms } from '@/services/api';

export const Graph = ( props: GraphProps ) => {
    const dispatch = useAppDispatch();
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { years, colorimeter, radioBtn, plan } = useAppSelector(store => store.plan)
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

    const handleDownload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        e.preventDefault()
        getDataFromPrograms(plan?.id_plan!, index)
        .then((res) => { //TO DO
            alert('Reporte generado')
        })
        .catch((err) => {
            alert('Error al generar el reporte')
        })
    }

    return (
        <div className="tw-flex tw-flex-col 
                        tw-items-center 
                        md:tw-flex-row
                        md:tw-flex-wrap
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
            <div className='tw-w-full tw-flex tw-flex-col md:tw-w-1/2 md:tw-self-start'>
                <label>
                    <input type="radio" name='fisica' value='fisica'
                            onChange={ ()=> dispatch(setRadioBtn('fisica'))}
                            checked={radioBtn === 'fisica'}/>
                    Ejecución fisica
                </label>
                
                <label htmlFor="">
                    <input type="radio" name='financiera' value='financiera'
                            onChange={ ()=> dispatch(setRadioBtn('financiera'))}
                            checked={radioBtn === 'financiera'}/>
                    Ejecución financiera
                </label>
            </div>
            <div className=''>
                <IconButton aria-label="delete" 
                            size="large" 
                            color='primary' 
                            title='Generar reporte por Programas'
                            onClick={(e)=>handleDownload(e, 0)}>
                    <LibraryBooksIcon />
                </IconButton>
                <IconButton aria-label="delete" 
                            size="large" 
                            color='secondary' 
                            title='Generar reporte por Secretarias'
                            onClick={(e)=>handleDownload(e, 1)}>
                    <LibraryBooksIcon />
                </IconButton>
                <IconButton aria-label="delete" 
                            size="large" 
                            color='inherit' 
                            title='Generar reporte del Plan Indicativo Total'
                            onClick={(e)=>handleDownload(e, 1)}>
                    <LibraryBooksIcon />
                </IconButton>
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
