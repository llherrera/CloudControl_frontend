import React, { useState, useEffect, useRef } from "react";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppDispatch, useAppSelector } from "@/store";

import { getDataDashboardSecretary,
    getDataDashboardLocation } from '@/services/api'

import { Close, Dataset } from '@mui/icons-material';
import { fields, notify } from '@/utils';
import { Field, LocationInterface, YearDetail } from "@/interfaces";
import {
    removeItemBoard,
    setIndexSelect,
    setCategories,
    setYearSelect,
    setExecSelect,
    setCateSelect } from '@/store/chart/chartSlice';

interface Props {
    type?: string;
    index: number;
}
interface ComponentProps {
    index: number;
    children: JSX.Element;
    callDataX: React.Dispatch<React.SetStateAction<string[] | number[]>>;
    callDataY: React.Dispatch<React.SetStateAction<number[][]>>;
}
interface ChartData {
    name: string;
    y: number | number[];
}

interface ResponseChartSecre {
    responsible: string;
    name: null | string;
    year: number;
    financial_execution: number;
    physical_execution: number;
    physical_programming: number;
}

interface ResponseChartLocat {
    neighborhood: string;
    year: number;
    executed_resources: number;
    amount: number;
}

const Component = ({index, children, callDataX, callDataY}: ComponentProps) => {
    const dispatch = useAppDispatch();
    const { indexSelect, yearSelect, execSelect, cateSelect, categories } = useAppSelector(state => state.chart);
    const { id_plan } = useAppSelector(state => state.content);
    const { years, secretaries, locations } = useAppSelector(state => state.plan);

    const [yearsDefault, setYearsDefault] = useState<number>(years[0]);
    const [execDefault, setExecDefault] = useState<string>('financial_execution');
    const [cateDefault, setCateDefault] = useState<string>('');
    const [categories_, setCategories_] = useState<string[]>([]);

    const close = (index: number) => {
        dispatch(setExecSelect(''));
        dispatch(setYearSelect(0));
        dispatch(setCateSelect(''));
        dispatch(removeItemBoard(index));
        dispatch(setIndexSelect(-1));
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const item_id = e.dataTransfer.getData('item_id');
        if (item_id === '') return;
        const field = fields.find(fi => fi.id === item_id);
        if (field === undefined) return;
        dispatch(setCateSelect(field.value));
    };

    const onClick = () => {
        if (indexSelect === index) {
            dispatch(setIndexSelect(-1));
            dispatch(setExecSelect(''));
            dispatch(setYearSelect(0));
            dispatch(setCateSelect(''));
            dispatch(setCategories([]));
        } else {
            dispatch(setIndexSelect(index));
            dispatch(setExecSelect(execDefault));
            dispatch(setYearSelect(yearsDefault));
            dispatch(setCateSelect(cateDefault));
            dispatch(setCategories(categories_));
        }
    };

    useEffect(() => {
        if (index === indexSelect) {
            setCateDefault(cateSelect);
            setYearsDefault(yearSelect);
            setExecDefault(execSelect);
            setCategories_(categories);
        }
    }, [cateSelect, yearSelect, execSelect, categories]);

    useEffect(() => {
        let temp;
        switch (cateDefault) {
            case 'commune':
                temp = locations.filter(l => l.belongs !== '');
                dispatch(setCategories(temp.map(l => l.name)));
                getDataDashboardLocation(id_plan, cateSelect, yearSelect === 0 ? '' : yearSelect.toString())
                .then((res: ResponseChartLocat) => {
                    console.log(res);
                });
                break;
            case 'neighborhood':
                temp = locations.filter(l => l.belongs === '');
                dispatch(setCategories(temp.map(l => l.name)));
                getDataDashboardLocation(id_plan, cateSelect, yearSelect === 0 ? '' : yearSelect.toString())
                .then((res: ResponseChartLocat) => {
                    console.log(res);
                });
                break;
            case 'secretary':
                dispatch(setCategories(secretaries.map(l => l.name)));
                getDataDashboardSecretary(id_plan, cateSelect, yearSelect === 0 ? '' : yearSelect.toString())
                .then((res: ResponseChartSecre[]) => {
                    console.log(res);
                    const data = res.map(r => execDefault === 'financial_execution' ?
                        r.financial_execution : execDefault === 'physical_execution' ?
                        r.physical_execution : r.physical_programming);
                    callDataY([data]);
                });
                break;
            default:
                dispatch(setCategories([]));
                notify('No se ha asignado un campo');
                break;
        }
    }, [cateDefault]);

/*
    const getLocation = (sw: boolean) => {
        getLocations(id_plan).then(res => {
            if (!res) return;
            let locs: LocationInterface[] = res
            let temp: string[] = [];
            if (sw) locs = locs.filter(loc => loc.belongs === null || loc.belongs === '');
            else if (!sw) locs = locs.filter(loc => loc.belongs && loc.belongs !== '');
            locs.map(loc => {
                temp.push(loc.name);
            });
            callDataX(temp);
            dispatch(setCategories(temp));
        })
    };

    const getDataSecretary = () => {
        const detalleStr = localStorage.getItem('YearDeta');
        const detalle: YearDetail[] = detalleStr ? JSON.parse(detalleStr) : [];
        let tempSecs = detalle.map(temp => temp.responsible);
        tempSecs = [...new Set(tempSecs)];
        let maps: Map<string, Map<number, YearDetail[]>> = new Map();
        for (const element of tempSecs) {
            const details = detalle.filter(det => det.responsible === element);
            let yearsMap: Map<number, YearDetail[]> = new Map();
            for (const year of years) {
                const detailsYear = details.filter(det => det.year === year)
                yearsMap.set(year, detailsYear);
            }
            maps.set(element!, yearsMap);
        }
        const keys = Array.from(maps.keys());
        callDataX(keys);
        dispatch(setCategories(keys));
        let acumA = [];
        for (const year of yearsDefault === 0 ? years : [yearsDefault]) {
            const list = tempSecs.map(sec => maps.get(sec!)!.get(year));
            let acum: number[] = [];
            if (execDefault === 'physical_execution')
                acum = list.map(temp => temp!.reduce((a, b) => a + b.physical_execution, 0));
            else if (execDefault === 'financial_execution')
                acum = list.map(temp => temp!.reduce((a, b) => a + (b.financial_execution/1000000), 0));
            else if (execDefault === 'physical_programming')
                acum = list.map(temp => temp!.reduce((a, b) => a + b.physical_programming, 0));
            acum = acum.map(a => parseFloat(a.toFixed(2)));
            acumA.push(acum)
        }
        callDataY(acumA);
    };
*/
    return (
        <div role='button'
            onDrop={(e) => onDrop(e)}
            className={`tw-relative tw-cursor-pointer
            ${index === indexSelect ? 'tw-ring-4' : ''}`}
            onClick={()=>onClick()}>
            <button className="tw-right-0 tw-absolute tw-z-10"
                    onClick={()=>close(index)}>
                <Close/>
            </button>
            {cateDefault === undefined ? 
            <div className="tw-bg-white tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center">
                <Dataset sx={{ fontSize: 80 }}/>
                <p>Cargue un campo</p>
            </div> :
            <div className="tw-h-full">
                {children}
            </div>
            }
        </div>
    );
};

export const InterativeChart = ({type, index}: Props) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { yearSelect } = useAppSelector(state => state.chart);
    const { years } = useAppSelector(state => state.plan);

    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<number[][]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (dataX.length === 0 || dataY.length === 0) return;
        const temp = dataY.map((data, index) => {
            return {
                name: dataY.length === 1 ? yearSelect.toString() : years[index].toString(),
                y: dataY[index]
            }
        });
        setChartData(temp);
    }, [dataX, dataY]);

    const options: Highcharts.Options = {
        title: {
            text: ''
        },
        accessibility: {
            enabled: false,
        },
        plotOptions: {
            series: {
                dataLabels:[{
                    enabled: true,
                    distance: -30,
                    format: '{point.percentage:.1f}%',
                }],
            },
            pie: {
                dataLabels: {
                    enabled: true,
                },
                showInLegend: true,
            },
            bar: {
                dataLabels: {
                    enabled: true,
                },
                groupPadding: 0.1
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
            categories: dataX.map(x => x.toString()),
            title: {
                text: null
            },
            gridLineWidth: 1,
            lineWidth: 0,
        },
        yAxis: {
            min: 0,
            title: {
                text: null,
            },
            labels: {
                overflow: 'justify',
            },
            gridLineWidth: 0
        },
        series: dataY.map((data, index) => ({
                name: dataY.length === 1 ? yearSelect.toString() : years[index].toString(),
                type: type!.valueOf() as any,
                data: data,
                size: `${100 - ((20 * index) - (5 * index))}%`,
                innerSize: `${100 - ((20 * (index + 1)) - (5 * index))}%`,
                dataLabels: {
                    enabled: false,
                    crop: false,
                }
        })),
    };

    return (
        <Component
            index={index}
            callDataX={setDataX}
            callDataY={setDataY}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                containerProps={{ style: {width: '100%', height:'100%'} }}
            />
        </Component>
    );
}

export const InterativeCard = ({index}: Props) => {

    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<number[][]>([]);

    return (
        <Component
            index={index}
            callDataX={setDataX}
            callDataY={setDataY}>
            <div className="tw-bg-white tw-h-full">
                Hola
            </div>
        </Component>
    );
}