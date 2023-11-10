import React, { useState, useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppSelector } from "@/store";

interface Props {
    yearsProgress: number;
    dataValues: number[];
}

export const Graph = ( props: Props ) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { color, years } = useAppSelector(store => store.plan)
    const { colorimeter } = useAppSelector(store => store.plan)

    const [progress, setProgress] = useState(0);
    const [colors, setColors] = useState<number[]>([]);

    const categories = years.map((year) => year.toString())
    const pieValues = props.dataValues.map((value, index) => {
        return {
            name: categories[index],
            y: value,
        }
    })
    const colorsPie = props.dataValues.map((value) => value*100 < colorimeter[0] ? '#FE1700' : 
                                                    value*100 < colorimeter[1] ? '#FCC623' : 
                                                    value*100 < colorimeter[2] ? '#119432' : '#008DCC')

    useEffect(() => {
        if (color) {
            setColors(colorimeter)
        }
    }, [color])

    const options: Highcharts.Options = {
        title: {
            text: 'Años'
        },
        yAxis: {
            title: {
                text: 'Porcentaje'
            }
        },
        xAxis: {
            categories: categories,
        },
        series: [
            {
                name: 'Porcentaje año',
                type: 'line',
                data: props.dataValues,
            },
        ],
        
    }

    const options2: Highcharts.Options = {
        title: {
            text: 'Grafico 2'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                },
                showInLegend: true,
            },
        },
        colors: colorsPie,
        series: [
            {
                name: 'Porcentaje año',
                type: 'pie',
                size: '100%',
                innerSize: '70%',
                data: pieValues,
                dataLabels: {
                    enabled: true,
                    crop: false,
                }
            },
        ],
    }

    return (
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center lg:tw-justify-around">
            <div className='tw-w-full md:tw-w-1/2 lg:tw-w-1/3'>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                containerProps={{ style: {width: '100%'} }}/>
            </div>
            <div className='tw-w-full md:tw-w-1/2 lg:tw-w-1/3'>
            <HighchartsReact
                highcharts={Highcharts}
                options={options2}
                ref={chartComponentRef}
                containerProps={{ style: {width: '100%'} }}/>
            </div>
        </div>
    );
}

/*
<button className={`tw-rounded 
                                tw-flex tw-justify-center tw-items-center
                                tw-border-4
                                tw-self-center
                                tw-w-12 tw-h-12
                                ${progress < colors[0] ? 'tw-border-redColory'   : 
                                  progress < colors[1] ? 'tw-border-yellowColory':
                                  progress < colors[2] ? 'tw-border-greenColory' : 'tw-border-blueColory'}
                                tw-ml-3`}>
                <p className="tw-break-words tw-font-bold">
                    {props.yearsProgress}%
                </p>
            </button>
 */