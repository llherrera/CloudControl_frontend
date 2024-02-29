import React, { useState, useEffect, useRef } from "react";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppDispatch, useAppSelector } from "@/store";

import { getLocations } from '@/services/api'

import { Close, Dataset } from '@mui/icons-material';
import { fields, notify } from '@/utils';
import { Field, LocationInterface, YearDetail } from "@/interfaces";
import {
    removeItemBoard,
    setIndexSelect,
    setCategories,
    setYearSelect,
    setExecSelect } from '@/store/chart/chartSlice';

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

const Component = ({index, children, callDataX, callDataY}: ComponentProps) => {
    const dispatch = useAppDispatch();
    const { indexSelect, yearSelect, execSelect } = useAppSelector(state => state.chart);
    const { id_plan } = useAppSelector(state => state.content);
    const { years } = useAppSelector(state => state.plan);

    const [filterFields, setFilterFields] = useState<Field[]>([]);
    const [yearsDefault, setYearsDefault] = useState<number>(years[0]);
    const [execDefault, setExecDefault] = useState<string>('financial_execution');
    const [fieldX, setFieldX] = useState<Field|undefined>(undefined);
    const [fieldY, setFieldY] = useState<Field|undefined>(undefined);
    
    const close = (index: number) => {
        dispatch(removeItemBoard(index));
        dispatch(setIndexSelect(-1));
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const item_id = e.dataTransfer.getData('item_id');
        const field = fields.find(fi => fi.id.toString() === item_id);
        if (field === undefined) return;
        if (fieldX === undefined) setFieldX(field);
        else if (fieldY === undefined) setFieldY(field);
        const newFilters = [...filterFields, field];
        setFilterFields(newFilters);
    };

    const onClick = () => {
        if (indexSelect === index) {
            dispatch(setIndexSelect(-1));
        } else {
            dispatch(setIndexSelect(index));
            dispatch(setExecSelect(execDefault));
            dispatch(setYearSelect(yearsDefault));
        }
    };

    useEffect(() => {
        if (index === indexSelect) setYearsDefault(yearSelect);
    }, [yearSelect]);

    useEffect(() => {
        if (index === indexSelect) setExecDefault(execSelect);
    }, [execSelect]);

    useEffect(() => {
        if (fieldX === undefined) return;
        const { value } = fieldX; //el eje X se quiere usar para las etiquetas
        switch (value) {
            case 'commune':
                // To Do: obtener los nombres en forma de array de las ubicaciones que no tengan un 'belongs'
                getLocation(true, true);
                break;
            case 'neighborhood':
                // To Do: obtener los nombres en forma de array de las ubicaciones que si tengan un 'belongs'
                getLocation(false, true);
                break;
            case 'secretary':
                // To Do: obtener los nombres en forma de array de las secretarias
                getDataSecretary();
                break;
            case 'execution':
                // To Do: supongo que se quiere elegir entre programacion, fisica y financiera
                break;
            case 'years':
                // To Do: obtener los años del plan
                getYears(true);
                break;
            default:
                notify('No se ha asignado un campo');
                break;
        }
    }, [fieldX, yearsDefault, execDefault]);

    useEffect(() => {
        if (fieldY === undefined) return;
        const { value } = fieldY; //el eje Y se quiere usar para los valores de las etiquetas
        switch (value) {
            case 'commune':
                // To Do: obtener la data y asignarla dispatch(thunkGetLocations(id_plan));
                getLocation(true, false);
                break;
            case 'neighborhood':
                // To Do: obtener la data y asignarla dispatch(thunkGetLocations(id_plan));
                getLocation(false, false);
                break;
            case 'secretary':
                // To Do: obtener la data y asignarla dispatch(thunkGetSecretaries(id_plan));
                getDataSecretary();
                break;
            case 'execution':
                // To Do: obtener la data y asignarla 
                break;
            case 'years':
                // To Do: obtener la data y asignarla setItemsX(yearsToItem());
                getYears(false);
                break;
            default:
                notify('No se ha asignado un campo');
                break;
        }
    }, [fieldY, yearsDefault, execDefault]);

    const getLocation = (sw: boolean, sw2: boolean) => {
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
        })
    };

    const getYears = (sw: boolean) => {
        const temp = years.map(year => year+'');
        callDataX(temp);
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
        //if (yearsDefault === 0) {
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
        console.log(acumA);
        
        callDataY(acumA);
        //} else {
        //    const list = tempSecs.map(sec => maps.get(sec!)!.get(yearsDefault));
        //    let acum: number[] = [];
        //    if (execDefault === 'physical_execution')
        //        acum = list.map(temp => temp!.reduce((a, b) => a + b.physical_execution, 0));
        //    else if (execDefault === 'financial_execution')
        //        acum = list.map(temp => temp!.reduce((a, b) => a + (b.financial_execution/1000000), 0));
        //    else if (execDefault === 'physical_programming')
        //        acum = list.map(temp => temp!.reduce((a, b) => a + b.physical_programming, 0));
        //    acum = acum.map(a => parseFloat(a.toFixed(2)));
        //    callDataY(acum);
        //}
    };

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
            {filterFields.length === 0 ? 
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

    const { indexSelect, yearSelect, execSelect } = useAppSelector(state => state.chart);
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
        console.log(temp);
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