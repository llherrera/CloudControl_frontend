import { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppSelector, useAppDispatch } from "@/store";
import { UnitInfoProps } from "@/interfaces";

export const UnitResultInfo = ({unit}: UnitInfoProps) => {
    if (unit == undefined) return <div>
        No hay una meta seleccionada
    </div>;

    return (
        <div className='tw-ml-4 tw-mb-4 tw-p-2
                        tw-border tw-border-slate-500
                        tw-flex tw-flex-col tw-flex-wrap tw-items-stretch
                        tw-bg-white tw-shadow-2xl'>
            <table>
                <thead className="tw-border-4 tw-border-double tw-border-gray-500">
                    <tr>
                        <th className={`tw-bg-yellow-300
                                        tw-border-4 tw-border-double
                                        tw-border-gray-500`}>
                            Código de la meta:
                        </th>
                        <th className=" tw-border-4 tw-border-double
                                        tw-border-gray-500">
                            Indicador de la meta:
                        </th>
                        <th className={`tw-bg-yellow-300
                                        tw-border-4 tw-border-double
                                        tw-border-gray-500`}>
                            Línea base:
                        </th>
                        <th className=" tw-border-4 tw-border-double
                                        tw-border-gray-500">
                            Meta:
                        </th>
                        <th className=" tw-border-4 tw-border-double
                                        tw-border-gray-500">
                            Ejecutado:
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className=" tw-border-4 tw-border-double
                                        tw-border-gray-500
                                        tw-text-center">
                            {unit.code}
                        </td>
                        <td className=" tw-border-4 tw-border-double
                                        tw-border-gray-500
                                        tw-text-center">
                            {unit.indicator}
                        </td>
                        <td className=" tw-border-4 tw-border-double
                                        tw-border-gray-500
                                        tw-text-center">
                            {unit.base_line}
                        </td>
                        <td className=" tw-border-4 tw-border-double
                                        tw-border-gray-500
                                        tw-text-center">
                            {unit.goal}
                        </td>
                        <td className=" tw-border-4 tw-border-double
                                        tw-border-gray-500
                                        tw-text-center">
                            {unit.executed == null ? 0 : unit.executed}
                        </td>
                    </tr>
                </tbody>
            </table>
            <Chart/>
            <div className='tw-border-4 tw-border-double tw-border-gray-500
                            tw-text-justify'>
                {unit.description}
            </div>
        </div>
    );
}

const Chart = () => {
    const { years } = useAppSelector(store => store.plan);
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const proy = [null, 28, 35, 40, 28, null];
    const exec = [null, 32, 35, 38, 34, null];

    const options: Highcharts.Options = {
        title: {
            text: `Avance vs Proyección`
        },
        accessibility: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                },
                showInLegend: true,
            },
        },
        xAxis: {
            categories: [(years[0] - 1)+'', ...years.map(y => y+''), (years[3] + 1)+'']
        },
        yAxis: {
            title: {
                text: '',
            },
        },
        series: [
            {
                name: 'Proyección',
                type: 'line',
                data: proy,
                color: "#FFA500"
            },
            {
                name: 'Avance',
                type: 'line',
                data: exec,
                color: "#4169E1"
            }
        ],
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartComponentRef}
            containerProps={{ style: {width: '100%', height:'100%'} }}
        />
    );
}