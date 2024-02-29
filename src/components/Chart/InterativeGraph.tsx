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
    setCategories } from '@/store/chart/chartSlice';

interface Props {
    type?: string;
    index: number;
}
interface ComponentProps {
    index: number;
    children: JSX.Element;
    callDataX: React.Dispatch<React.SetStateAction<string[] | number[]>>;
    callDataY: React.Dispatch<React.SetStateAction<string[] | number[]>>;
}
interface ChartData {
    name: string,
    y: number
}

const Component = ({index, children, callDataX, callDataY}: ComponentProps) => {
    const dispatch = useAppDispatch();
    const { indexSelect, yearSelect } = useAppSelector(state => state.chart);
    const { id_plan } = useAppSelector(state => state.content);
    const { years } = useAppSelector(state => state.plan);

    const [filterFields, setFilterFields] = useState<Field[]>([]);
    const [yearsDefault, setYearsDefault] = useState<number>(years[0]);
    const [fieldX, setFieldX] = useState<Field|undefined>(undefined);
    const [fieldY, setFieldY] = useState<Field|undefined>(undefined);

    let acumAll = 0;
    
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
        }
    };

    useEffect(() => {
        if (index === indexSelect) setYearsDefault(yearSelect);
    }, [yearSelect]);

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
    }, [fieldX, yearsDefault]);

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
    }, [fieldY, yearsDefault]);

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
            if (sw2) callDataX(temp);
            else if (!sw2) callDataY(temp);
        })
    };

    const getYears = (sw: boolean) => {
        const temp = years.map(year => year+'');
        if (sw) callDataX(temp);
        else if (!sw) callDataY(temp);
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
        const list = tempSecs.map(sec => maps.get(sec!)!.get(yearsDefault));
        let acum = list.map(temp => temp!.reduce((a, b) => a + (b.financial_execution/1000000), 0));
        acumAll = acum.reduce((a, b) => a + b, 0);
        acum = acum.map(a => parseFloat(a.toFixed(2)));
        callDataY(acum);
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

    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<string[] | number[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (dataX.length === 0 || dataY.length === 0) return;
        const temp = dataX.map((data, index) => {
            return {
                name: data.toString(),
                y: parseFloat(dataY[index].toString())
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
                name: '',
                type: type!.valueOf() as any,
                data: chartData,
                dataLabels: {
                    enabled: false,
                    crop: false,
                }
            },
        ],
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
    const [dataY, setDataY] = useState<string[] | number[]>([]);

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