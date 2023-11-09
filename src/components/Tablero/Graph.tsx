import React, { useState, useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppSelector } from "@/store";

export const Graph = () => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);


    const { color } = useAppSelector(store => store.plan)
    const { colorimeter } = useAppSelector(store => store.plan)

    const [progress, setProgress] = useState(0);
    const [colors, setColors] = useState<number[]>([]);

    useEffect(() => {
        if (color) {
            setColors(colorimeter)
        }
    }, [color])

    const options: Highcharts.Options = {
        title: {
            text: 'Grafico'
        },
        series: [
            {
              type: 'line',
              data: [1, 2, 4],
            },
        ],
    }

    const options2: Highcharts.Options = {
        title: {
            text: 'Grafico 2'
        },
        series: [
            {
                type: 'pie',
                size: '100%',
                innerSize: '70%',
                data: [1, 2, 4],
            },
        ],
    }

    return (
        <div className="tw-flex tw-h-full tw-border">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                containerProps={{ style: {width: '50%'} }}/>
            <HighchartsReact
                highcharts={Highcharts}
                options={options2}
                ref={chartComponentRef}
                containerProps={{ style: {width: '50%'} }}/>
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
                    {progress}%
                </p>
            </button>
        </div>
    );
}