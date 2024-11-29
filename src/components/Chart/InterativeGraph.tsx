import React, { useState, useEffect, useRef } from "react";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useAppDispatch, useAppSelector } from "@/store";
import { removeItemBoard, setIndexSelect, setCategories,
    setSubCategories, setYearSelect, setExecSelect,
    setCateSelect, setSubCateSelect, setFieldSelect
    } from '@/store/chart/chartSlice';
import { thunkGetSecretaries } from '@/store/plan/thunks';

import { getDataDashboardSecretary, getDataDashboardLocation,
    getDataDashboardEvidence, getDataDashboardExecution } from '@/services/api';
import { PropsChart, ComponentProps, ChartData,
    ResponseChartSecre, ResponseChartLocat, ResponseChartExecu,
    ResponseChartEvide, LocationInterface } from "@/interfaces";

import { Close, Dataset } from '@mui/icons-material';
import { fields, notify, convertLocations } from '@/utils';

const Component = ({index, children, type, callDataX, callDataY, callTitle}: ComponentProps) => {
    const dispatch = useAppDispatch();
    const { indexSelect, yearSelect, execSelect, cateSelect,
        categories, subCategories, fieldSelect, subCateSelect,
        indexLocations } = useAppSelector(store => store.chart);
    const { id_plan } = useAppSelector(store => store.content);
    const { years, secretaries, locations } = useAppSelector(store => store.plan);

    const [yearsDefault  , setYearsDefault] = useState<number>(years[0]);
    const [execDefault   , setExecDefault] = useState<string>('');
    const [cateDefault   , setCateDefault] = useState<string>('');
    const [subCateDefault, setSubCateDefault] = useState<string>('');
    const [categories_   , setCategories_] = useState<string[]>([]);
    const [subCategories_, setSubCategories_] = useState<string[]>([]);
    const [field         , setField] = useState<string>('');
    const [fieldDefault  , setFieldDefault] = useState<string>('');

    const [locationsMap  , setLocationsMap] = useState<Map<LocationInterface, LocationInterface[]>>();
    const [locations_    , setLocations_] = useState<LocationInterface[]>([]);
    const [locations__   , setLocations__] = useState<LocationInterface[]>([]);
    //const [indexLocations, setIndexLocations] = useState(0);

    const close = (index: number) => {
        dispatch(setExecSelect(''));
        dispatch(setYearSelect(0));
        dispatch(setCateSelect(''));
        dispatch(setSubCateSelect(''));
        dispatch(setCategories([]));
        dispatch(setSubCategories([]));
        dispatch(removeItemBoard(index));
        dispatch(setIndexSelect(-1));
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const item_id = e.dataTransfer.getData('item_id');
        if (item_id === '') return;
        const field = fields.find(fi => fi.id === item_id);
        if (field === undefined) return;
        dispatch(setCateSelect(field.value));
        setField(field.value);
        dispatch(setExecSelect(field.id === '3' ? 'financial_execution' : 'done'));
        dispatch(setFieldSelect(field.id));
        setFieldDefault(field.id);
        setYearsDefault(years[0]);
        setExecDefault('');
        setCateDefault('');
        setSubCateDefault('');
        setCategories_([]);
        setSubCategories_([]);
    };

    const onClick = () => {
        if (indexSelect === index) {
            dispatch(setIndexSelect(-1));
            dispatch(setExecSelect(''));
            dispatch(setYearSelect(0));
            dispatch(setCateSelect(''));
            dispatch(setSubCateSelect(''));
            dispatch(setCategories([]));
            dispatch(setSubCategories([]));
            dispatch(setFieldSelect(''));
        } else {
            dispatch(setIndexSelect(index));
            dispatch(setExecSelect(execDefault));
            dispatch(setYearSelect(yearsDefault));
            dispatch(setCateSelect(cateDefault));
            dispatch(setSubCateSelect(subCateDefault));
            dispatch(setCategories(categories_));
            dispatch(setSubCategories(subCategories_));
            dispatch(setFieldSelect(fieldDefault));
        }
    };

    useEffect(() => {
        if (secretaries != undefined) return;
        dispatch(thunkGetSecretaries(id_plan));
    }, []);

    useEffect(() => {
        if (locations == undefined) return;
        if (locations.length === 0) return;
        setLocationsMap(convertLocations(locations));
    }, [locations]);

    useEffect(() => {
        if (locationsMap === undefined) return;
        const locsTemp = Array.from(locationsMap.keys());
        const locTemp = locationsMap.get(locsTemp[indexLocations]);
        setLocations_(locsTemp);
        setLocations__(locTemp??[]);
    }, [locationsMap, indexLocations]);

    useEffect(() => {
        if (index === indexSelect) {
            setCateDefault(cateSelect);
            setSubCateDefault(subCateDefault);
            setYearsDefault(yearSelect);
            setExecDefault(execSelect);
            setCategories_(categories);
            setSubCategories_(subCategories);
            setFieldDefault(fieldSelect);
        }
    }, [cateSelect, yearSelect, execSelect, categories, subCategories]);

    useEffect(() => {
        switch (field) {
            case 'secretary':
                if (secretaries == undefined) return notify('Aun no se han defino secretarías para este plan', 'warning');
                dispatch(setCategories(secretaries.map(l => l.name)));
                dispatch(setSubCategories([]));
                getDataDashboardSecretary(id_plan, cateDefault.replace('secretary', ''), yearsDefault === 0 ? '' : yearsDefault.toString())
                .then((res: ResponseChartSecre[]) => {
                    const data = res.map(r => execDefault === 'financial_execution' ?
                        parseFloat(r.financial_execution.toString()) : r.physical_progress
                    );
                    const labels: string[] | number[] = yearsDefault === 0 ? res.map(r => r.year) : cateDefault === '' ? res.map(r => r.responsible) : res.map(r => r.name === null ? '' : r.name);
                    callDataX(labels);
                    callDataY([data]);
                    let val: number = 0, label: string = '';
                    if (type === 'min') {
                        val = Math.min(...data);
                        label = labels[data.indexOf(val)].toString();
                    } else if (type === 'max') {
                        val = Math.max(...data);
                        label = labels[data.indexOf(val)].toString();
                    }
                    callTitle(
                        `Secretarias: ${type === undefined ?
                        `Ejecución ${execDefault === 'financial_execution' ? 'financiera' : execDefault === 'physical_execution' ? `física` : `programada`}
                            ${cateDefault.replace('secretary', '') === `` ? `de todas las secretarías` : `de la secretaría ${cateDefault}`}
                            ${yearsDefault === 0 ? 'total por año' : `para el año ${yearsDefault}`}`
                        : `para la ejecución ${execDefault === 'financial_execution' ? 'financiera' : execDefault === 'physical_execution' ? `física` : `programada`}
                            ${cateDefault.replace('secretary', '') === `` ? `de todas las secretarías` : `de la secretaría ${cateDefault}`}
                            ${label} el ${type === 'min' ? 'mínimo' : 'máximo'} es ${val} ${yearsDefault === 0 ? 'total por año' : `para el año ${yearsDefault}`}`
                        }`
                    );
                });
                break;
            case 'evidences':
                dispatch(setCategories(locations_.map(l => l.name)));
                dispatch(setSubCategories(locations__.map(l => l.name)));
                getDataDashboardEvidence(id_plan, subCateDefault, cateDefault.replace('evidences', ''), yearsDefault === 0 ? '' : yearsDefault.toString())
                .then((res: ResponseChartEvide[]) => {
                    const data = res.map(r => execDefault === 'done' ?
                        r.done : execDefault === 'benefited_population_number' ?
                        r.benefited_population_number : r.executed_resources
                    );
                    const labels: string[] | number[] = yearsDefault === 0 ? res.map(r => r.year) : cateDefault === '' ? res.map(r => r.code!) : res.map(r => r.code!);
                    callDataX(labels);
                    callDataY([data]);
                    let val: number = 0, label: string = '';
                    if (type === 'min') {
                        val = Math.min(...data);
                        label = labels[data.indexOf(val)].toString();
                    } else if (type === 'max') {
                        val = Math.max(...data);
                        label = labels[data.indexOf(val)].toString();
                    }
                    callTitle(
                        `Evidencias: ${type === undefined ?
                        `${execDefault === 'done' ? `cantidad realizada` : execDefault === 'benefited_population_number' ? `población beneficiada` : `recursos ejecutados`}
                        ${subCateDefault === '' ? (
                            cateDefault.replace('evidences', '') === `` ? `en todas las ubicaciones` : `en la ubicación de ${cateDefault}`)
                            : `en la ubicación de ${subCateDefault}`}
                        ${yearsDefault === 0 ? 'total por año' : `para el año ${yearsDefault}`}`
                        : `${execDefault === 'done' ? `cantidad realizada` : execDefault === 'benefited_population_number' ? `población beneficiada` : `recursos ejecutados`}
                        ${subCateDefault === '' ? (
                            cateDefault.replace('evidences', '') === `` ? `en todas las ubicaciones` : `en la ubicación de ${cateDefault}`)
                            : `en la ubicación de ${subCateDefault}`}
                        ${yearsDefault === 0 ? 'total por año' : `para el año ${yearsDefault}`}`}
                    `);
                });
                break;
            case 'execution':
                dispatch(setCategories([]));
                dispatch(setSubCategories([]));
                getDataDashboardExecution(id_plan, cateDefault.replace('execution', ''), yearsDefault === 0 ? '' : yearsDefault.toString())
                .then((res: ResponseChartExecu[]) => {
                    const data = res.map(r => execDefault === 'financial_execution' ?
                        parseFloat(r.financial_execution.toString()) : r.physical_progress
                    );
                    const labels: string[] | number[] = yearsDefault === 0 ? res.map(r => r.year) : res.map(r => r.name);
                    callDataX(labels);
                    callDataY([data]);
                    let val: number = 0, label: string = '';
                    if (type === 'min') {
                        val = Math.min(...data);
                        label = labels[data.indexOf(val)].toString();
                    } else if (type === 'max') {
                        val = Math.max(...data);
                        label = labels[data.indexOf(val)].toString();
                    }
                    callTitle(
                        `Metas: ${type === undefined ?
                        `Ejecución ${execDefault === 'financial_execution' ? 'financiera' : `física`}
                            ${cateDefault.replace('secretary', '') === `` ? `de todas las metas` : `de la meta ${cateDefault}`}
                            ${yearsDefault === 0 ? 'total por año' : `para el año ${yearsDefault}`}`
                        : `para la ejecución ${execDefault === 'financial_execution' ? 'financiera' : `física`}
                            ${cateDefault.replace('secretary', '') === `` ? `de todas las metas` : `de la meta ${cateDefault}`}
                            ${label} el ${type === 'min' ? 'mínimo' : 'máximo'} es ${val} ${yearsDefault === 0 ? 'total por año' : `para el año ${yearsDefault}`}`
                        }`
                    );
                });
                break;
            default:
                dispatch(setCategories([]));
                dispatch(setSubCategories([]));
                callDataX([]);
                callDataY([]);
                callTitle('');
                notify('No se ha asignado un campo');
                break;
        }
    }, [field, yearsDefault, execDefault, cateDefault]);

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
            {field === '' ?
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

export const InterativeChart = ({type, index}: PropsChart) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { yearSelect, execSelect } = useAppSelector(store => store.chart);
    const { years, colorimeter } = useAppSelector(store => store.plan);

    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<number[][]>([]);
    const [title, setTitle] = useState<string>('');

    const options: Highcharts.Options = {
        title: {
            text: title
        },
        accessibility: {
            enabled: false,
        },
        plotOptions: {
            series: {
                dataLabels:[{
                    enabled: true,
                    //distance: -30,
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
        series: dataY.map(data => {
            const dataUse = data.map((d, i) => {
                return {
                    name: (yearSelect === 0 && years.length === data.length) ? years[i].toString() : dataX[i].toString(),
                    y: d
                }
            })
            return {
                name: 'Valor en M',
                type: type!.valueOf() as any,
                data: dataUse,
                size: '100%',
                innerSize: '80%',
                dataLabels: {
                    enabled: false,
                    crop: false,
                },
                zones: execSelect === 'physical_progress' ? [
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
                ] : undefined
            }
        }),
    };

    return (
        <Component
            index={index}
            title={title}
            callDataX={setDataX}
            callDataY={setDataY}
            callTitle={setTitle}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                containerProps={{ style: {width: '100%', height:'100%'} }}
            />
        </Component>
    );
}

export const InterativeCard = ({type, index}: PropsChart) => {
    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<number[][]>([]);
    const [X, setX] = useState<string>('');
    const [Y, setY] = useState<number>(0);
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        if (dataY.length === 0 && dataX.length === 0) return;
        let val: number = 0, label: string = '';
        if (type === 'min') {
            val = Math.min(...dataY[0]);
            label = dataX[dataY[0].indexOf(val)].toString();
        } else if (type === 'max') {
            val = Math.max(...dataY[0]);
            label = dataX[dataY[0].indexOf(val)].toString();
        }
        setX(label);
        setY(val);
    }, [dataX, dataY]);

    //useEffect(() => {
    //    console.log(dataX, dataY);
    //    console.log(X, Y);
    //}, [X, Y]);

    return (
        <Component
            index={index}
            title={title}
            type={type}
            callDataX={setDataX}
            callDataY={setDataY}
            callTitle={setTitle}>
            <div className="tw-bg-white tw-h-full
                            tw-flex tw-flex-col tw-items-stretch">
                <p className="tw-text-center tw-font-bold tw-text-4xl">
                    {type === 'min' ? 'MÍNIMO' : 'MÁXIMO'}
                </p>
                <p className="tw-text-center">{title}</p>
            </div>
        </Component>
    );
}