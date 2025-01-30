import React, { useState, useEffect, useRef, Fragment } from "react";
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import { Icon } from 'leaflet';

import { useAppDispatch, useAppSelector } from "@/store";
import { removeItemBoard, setCategories, setSubCategories, setExecSelect, setCateSelect,
    setFieldSelect, setBoardInfo, setBoardInfoCamp, setInfoSelect } from '@/store/chart/chartSlice';
import { thunkGetSecretaries } from '@/store/plan/thunks';

import { getDataDashboardSecretary, getDataDashboardEvidence, getDataDashboardExecution,
    getDataDashboardMapsSecretary, getDataDashboardMapsEvidence, getDataDashboardMapsExecution
    } from '@/services/api';
import { PropsChart, ComponentProps, ChartData, ResponseChartSecre, ResponseChartLocat,
    ResponseChartExecu, ResponseChartEvide, LocationInterface, PointsMarketDash } from "@/interfaces";
import { LevelsSelectFilter } from "../MapFilters";

import { Close, Dataset, Height } from '@mui/icons-material';
import { fields, notify, convertLocations } from '@/utils';

import MarkerIcon from '@/assets/icons/location.svg';
import "react-toastify/dist/ReactToastify.css";
import 'leaflet/dist/leaflet.css';

const Component = ({index, children, info, type, callDataX, callDataY, callTitle, callMarkers}: ComponentProps) => {
    const dispatch = useAppDispatch();

    const { indexSelect, yearSelect, execSelect, cateSelect, categories, subCategories, deleteAct,
        fieldSelect, subCateSelect, indexLocations } = useAppSelector(store => store.chart);
    const { id_plan } = useAppSelector(store => store.content);
    const { secretaries, locations, levels } = useAppSelector(store => store.plan);

    const [locationsMap  , setLocationsMap] = useState<Map<LocationInterface, LocationInterface[]>>();

    const close = () => {
        dispatch(setInfoSelect(
            {
                index,
                deleteAct: true,
                data: {
                    execSelect: '',
                    yearSelect: 0,
                    cateSelect: '',
                    subCateSelect: '',
                    categories_: [],
                    subCategories_: [],
                    fieldSelect: '',
                }
            }
        ));
        dispatch(removeItemBoard(index));
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const item_id = e.dataTransfer.getData('item_id');
        if (item_id === '') return;
        const field = fields.find(fi => fi.id === item_id);
        if (field === undefined) return;
        dispatch(setCateSelect(field.value));
        dispatch(setExecSelect(field.id === '3' ? 'financial_execution' : 'done'));
        dispatch(setFieldSelect(field.id));
        dispatch(setBoardInfo({
            index,
            info: {
                yearSelect: 0,
                execSelect: field.id === '3' ? 'financial_execution' : 'done',
                cateSelect: field.value,
                subCateSelect: '',
                categories_: [],
                subCategories_: [],
                field: field.value,
                fieldSelect: field.id,
                locations_: [],
                locations__: [],
            }
        }));
    };

    const onClick = () => {
        if (indexSelect === index) {
            dispatch(setInfoSelect(
                {
                    index: -1,
                    deleteAct: false,
                    data: {
                        execSelect: '',
                        yearSelect: 0,
                        cateSelect: '',
                        subCateSelect: '',
                        categories_: [],
                        subCategories_: [],
                        fieldSelect: '',
                    }
                }
            ));
        } else {
            dispatch(setInfoSelect(
                {
                    index,
                    deleteAct: false,
                    data: {
                        execSelect: info.execSelect,
                        yearSelect: info.yearSelect,
                        cateSelect: info.cateSelect,
                        subCateSelect: info.subCateSelect,
                        categories_: info.categories_,
                        subCategories_: info.subCategories_,
                        fieldSelect: info.fieldSelect,
                    }
                }
            ));
        }
    };

    const generateMarkers = (locs: PointsMarketDash[]) => {
        if (!callMarkers) return;
        if (locs.length === 0) {
            callMarkers([]);
        } else {
            let markers: JSX.Element[] = [];
            locs.forEach((loc, index) => {
                const { lat, lng } = loc;
                const marker = 
                <Marker key={index}
                    position={[lat, lng]}
                    icon={new Icon({
                        iconUrl: MarkerIcon,
                        iconSize: [25,41],
                        iconAnchor: [12, 41]
                    })}>
                    <Popup>
                        <div>
                            <div className='tw-flex tw-gap-1 tw--mb-4'>
                                <p className='tw-font-bold'>Fecha de evidencia: </p>
                                <p>{loc.year}</p>
                            </div>
                            <p className='tw-font-bold'>{loc.responsible}</p>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Meta:</p> <p>{loc.code}</p>
                            </div>
                            <p>{loc.name}</p>
                            <div className='tw-flex tw-gap-1'>
                                <p className='tw-font-bold'>Actividades: </p>
                                <p>{loc.activitiesDesc}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Población beneficiada:</p>
                                <p>{loc.benefited_population}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Cantidad de personas beneficiadas:</p>
                                <p>{loc.benefited_population_number}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Fuente de recursos:</p><p>{loc.resource_font}</p>
                            </div>
                            <div className='tw-flex tw-gap'>
                                <p className='tw-font-bold'>Recursos ejecutados:</p><p>{loc.executed_resources}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
                markers.push(marker);
            });
            callMarkers(markers);
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
        dispatch(setBoardInfoCamp({index, name: 'locations_', value: locsTemp}));
        dispatch(setBoardInfoCamp({index, name: 'locations__', value: locTemp??[]}));
    }, [locationsMap, indexLocations]);

    useEffect(() => {
        if (index === indexSelect) {
            dispatch(setBoardInfoCamp({index, name: 'cateSelect', value: cateSelect}));
            dispatch(setBoardInfoCamp({index, name: 'subCateSelect', value: subCateSelect}));
            dispatch(setBoardInfoCamp({index, name: 'yearSelect', value: yearSelect}));
            dispatch(setBoardInfoCamp({index, name: 'execSelect', value: execSelect}));
            dispatch(setBoardInfoCamp({index, name: 'categories_', value: categories}));
            dispatch(setBoardInfoCamp({index, name: 'subCategories_', value: subCategories}));
            dispatch(setBoardInfoCamp({index, name: 'fieldSelect', value: fieldSelect}));
        }
    }, [cateSelect, yearSelect, execSelect, categories, subCategories]);

    useEffect(() => {
        switch (info.field) {
            case 'secretary':
                if (secretaries == undefined) return notify('Aun no se han defino secretarías para este plan', 'warning');
                dispatch(setCategories(secretaries.map(l => l.name)));
                dispatch(setSubCategories([]));
                getDataDashboardSecretary(id_plan, info.cateSelect.replace('secretary', ''), info.yearSelect === 0 ? 0 : info.yearSelect)
                .then((res: ResponseChartSecre[]) => {
                    const data = res.map(r => info.execSelect === 'financial_execution' ?
                        parseFloat(r.financial_execution.toString()) : r.physical_progress
                    );
                    const labels: string[] | number[] = info.yearSelect === 0 ? res.map(r => r.year) : info.cateSelect === '' ? res.map(r => r.responsible) : res.map(r => r.name === null ? '' : r.name);
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
                        `Ejecución ${info.execSelect === 'financial_execution' ? 'financiera' : info.execSelect === 'physical_execution' ? `física` : `ejecutada`}
                            ${info.cateSelect.replace('secretary', '') === `` ? `de todas las secretarías` : `de la secretaría ${info.cateSelect}`}
                            ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`
                        : `para la ejecución ${info.execSelect === 'financial_execution' ? 'financiera' : info.execSelect === 'physical_execution' ? `física` : `ejecutada`}
                            ${info.cateSelect.replace('secretary', '') === `` ? `de todas las secretarías` : `de la secretaría ${info.cateSelect}`}
                            ${label} el ${type === 'min' ? 'mínimo' : 'máximo'} es ${val} ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`
                        }`
                    );
                });
                break;
            case 'evidences':
                dispatch(setCategories(info.locations_.map(l => l.name)));
                dispatch(setSubCategories(info.locations__.map(l => l.name)));
                if (type === 'map') {
                    getDataDashboardMapsEvidence(id_plan, info.subCateSelect, info.cateSelect.replace('evidences', ''), info.yearSelect === 0 ? 0 : info.yearSelect)
                    .then((res: (PointsMarketDash[])) => {
                    const data = res.map(r => info.execSelect === 'done' ?
                        r.done : info.execSelect === 'benefited_population_number' ?
                        r.benefited_population_number : r.executed_resources
                    );
                    const labels: string[] | number[] = info.yearSelect === 0 ? res.map(r => r.year) : info.cateSelect === '' ? res.map(r => r.code!) : res.map(r => r.code!);
                    callDataX(labels);
                    callDataY([data]);
                    callTitle(
                        `Evidencias: ${type === undefined ?
                        `${info.execSelect === 'done' ? `cantidad realizada` : info.execSelect === 'benefited_population_number' ? `población beneficiada` : `recursos ejecutados`}
                        ${info.subCateSelect === '' ? (
                            info.cateSelect.replace('evidences', '') === `` ? `en todas las ubicaciones` : `en la ubicación de ${info.cateSelect}`)
                            : `en la ubicación de ${info.subCateSelect}`}
                        ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`
                        : `${info.execSelect === 'done' ? `cantidad realizada` : info.execSelect === 'benefited_population_number' ? `población beneficiada` : `recursos ejecutados`}
                        ${info.subCateSelect === '' ? (
                            info.cateSelect.replace('evidences', '') === `` ? `en todas las ubicaciones` : `en la ubicación de ${info.cateSelect}`)
                            : `en la ubicación de ${info.subCateSelect}`}
                            ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`}
                    `);
                    generateMarkers(res);
                    });
                } else {
                    getDataDashboardEvidence(id_plan, info.subCateSelect, info.cateSelect.replace('evidences', ''), info.yearSelect === 0 ? 0 : info.yearSelect)
                    .then((res: (ResponseChartEvide[])) => {
                    const data = res.map(r => info.execSelect === 'done' ?
                        r.done : info.execSelect === 'benefited_population_number' ?
                        r.benefited_population_number : r.executed_resources
                    );
                    const labels: string[] | number[] = info.yearSelect === 0 ? res.map(r => r.year) : info.cateSelect === '' ? res.map(r => r.code!) : res.map(r => r.code!);
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
                        `${info.execSelect === 'done' ? `cantidad realizada` : info.execSelect === 'benefited_population_number' ? `población beneficiada` : `recursos ejecutados`}
                        ${info.subCateSelect === '' ? (
                            info.cateSelect.replace('evidences', '') === `` ? `en todas las ubicaciones` : `en la ubicación de ${info.cateSelect}`)
                            : `en la ubicación de ${info.subCateSelect}`}
                        ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`
                        : `${info.execSelect === 'done' ? `cantidad realizada` : info.execSelect === 'benefited_population_number' ? `población beneficiada` : `recursos ejecutados`}
                        ${info.subCateSelect === '' ? (
                            info.cateSelect.replace('evidences', '') === `` ? `en todas las ubicaciones` : `en la ubicación de ${info.cateSelect}`)
                            : `en la ubicación de ${info.subCateSelect}`}
                            ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`}
                    `);
                    });
                }
                break;
            case 'execution':
                dispatch(setCategories([]));
                dispatch(setSubCategories([]));
                getDataDashboardExecution(id_plan, info.cateSelect.replace('execution', '').trim() === '' ? levels[0].id_level!.toString() : info.cateSelect.replace('execution', ''), info.yearSelect === 0 ? 0 : info.yearSelect)
                .then((res: ResponseChartExecu[]) => {
                    const data = res.map(r => info.execSelect === 'financial_execution' ?
                        parseFloat(r.financial_execution.toString()) : r.physical_progress
                    );
                    const labels: string[] | number[] = info.yearSelect === 0 ? res.map(r => r.year) : res.map(r => r.code);
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
                        `Ejecución ${info.execSelect === 'financial_execution' ? 'financiera' : `física`}
                            ${info.cateSelect.replace('secretary', '') === `` ? `de todas las metas` : `de la meta ${info.cateSelect}`}
                            ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`
                        : `para la ejecución ${info.execSelect === 'financial_execution' ? 'financiera' : `física`}
                            ${info.cateSelect.replace('secretary', '') === `` ? `de todas las metas` : `de la meta ${info.cateSelect}`}
                            ${label} el ${type === 'min' ? 'mínimo' : 'máximo'} es ${val} ${info.yearSelect === 0 ? 'total por año' : `para el año ${info.yearSelect}`}`
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
                notify('No se ha asignado un campo', 'warning');
                break;
        }
    }, [info.field, info.yearSelect, info.execSelect, info.cateSelect]);

    return (
        <div role='button'
            onDrop={e => onDrop(e)}
            className={`tw-relative tw-cursor-pointer
            ${index === indexSelect ? 'tw-ring-4' : ''}`}
            onClick={() => onClick()}>
            {index === indexSelect ?
            <button className="tw-right-0 tw-absolute tw-z-10"
                    onClick={() => close()}>
                <Close/>
            </button>
            : null}
            {info.field === '' ?
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

export const InterativeChart = ({type, info, index}: PropsChart) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { yearSelect, execSelect } = useAppSelector(store => store.chart);
    const { years, colorimeter } = useAppSelector(store => store.plan);

    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<number[][]>([]);
    const [title, setTitle] = useState<string>('');

    const options: Highcharts.Options = {
        title: {
            text: title,
            style: {
                fontSize: '24px'
            }
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
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 640
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '16px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 641,
                        maxWidth: 768
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '18px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 769,
                        maxWidth: 1024
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '20px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 1025,
                        maxWidth: 1280
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '22px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 1281,
                        maxWidth: 1536
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '24px'
                            }
                        }
                    }
                }
            ]
        }
    };

    return (
        <Component
            index={index}
            title={title}
            type={type}
            info={info}
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

export const InterativeCard = ({type, info, index}: PropsChart) => {
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

    return (
        <Component
            index={index}
            title={title}
            type={type}
            info={info}
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

export const InterativeMap = ({type, info, index}: PropsChart) => {
    const { planLocation, bounding1, bounding2, bounding3, bounding4 } = useAppSelector(store => store.plan);
    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<number[][]>([]);
    const [X, setX] = useState<string>('');
    const [Y, setY] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    return (
        <Component
            index={index}
            title={title}
            type={type}
            info={info}
            callDataX={setDataX}
            callDataY={setDataY}
            callTitle={setTitle}
            callMarkers={setMarkers}>
            {!planLocation ? <></> :
            <MapContainer
                style={{height: '100%', width: '100%'}}
                center={[planLocation.lat, planLocation.lng]}
                zoom={13}
                bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers}
                <Rectangle
                    bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                    pathOptions={{color:'blue', fillOpacity: 0}}
                />
            </MapContainer>
            }
        </Component>
    );
}

interface PropsChart2 {
    field: string;
    id: string;
    index: number;
    onClose: (index: any) => void;
}

export const ChartComponent = ({ field, id, index, onClose }: PropsChart2) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const { planLocation, bounding1, bounding2, bounding3, bounding4 } = useAppSelector(store => store.plan);
    const { levels, years, colorimeter, secretaries, locations } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const visualization = [
        {id: '1', title:'Torta', value: 'pie'},
        {id: '2', title:'Barra', value: 'bar'},
        {id: '3', title:'Linea', value: 'line'},
        {id: '4', title:'Máximo', value: 'max'},
        {id: '5', title:'Mínimo', value: 'min'},
        {id: '6', title:'Mapa', value: 'map'},
    ];

    const [dataX, setDataX] = useState<string[] | number[]>([]);
    const [dataY, setDataY] = useState<number[][]>([]);
    const [title, setTitle] = useState<string>(
        field === 'secretary' ? 'Secretarías\n' :
        field === 'evidences' ? 'Evidencias' :
        field === 'execution' ? 'Metas de producto' :
        'Error'
    );
    const [type, setType] = useState('bar');

    //filters
    const [year, setYear] = useState(0);
    const [execution, setExecution] = useState(
        field === 'execution' ? 'physical_progress' :
        '');
    const [filter, setFilter] = useState('');
    const [subFilter, setSubFilter] = useState('');
    const [filters, setFilters] = useState<string[]>([]);
    const [subFilters, setSubFilters] = useState<string[]>([]);
    const [filterIndex, setFilterIndex] = useState(-1);
    const [subFilterIndex, setSubFilterIndex] = useState(0);

    const [markers, setMarkers] = useState<JSX.Element[]>([]);
    const [locationsMap  , setLocationsMap] = useState<Map<LocationInterface, LocationInterface[]>>();
//point.percentage:.1f
    Highcharts.setOptions({
        lang: {
            thousandsSep:'.'
        }
    });
    const options: Highcharts.Options = {
        title: {
            text: '',
            style: {
                fontSize: '24px'
            }
        },
        accessibility: {
            enabled: false,
        },
        plotOptions: {
            series: {
                dataLabels:[{
                    enabled: true,
                    //distance: -30,
                    format: execution === 'financial_execution' ? '{y} M' : '{y}%',
                    formatter: function() {
                        return Highcharts.numberFormat(this.y??0, 0, ',', '.');
                    }
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
                    name: (year === 0 && years.length === data.length) ? years[i].toString() : dataX[i].toString(),
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
                zones: execution === 'physical_progress' ? [
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
                ] : undefined
            }
        }),
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 640
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '16px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 641,
                        maxWidth: 768
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '18px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 769,
                        maxWidth: 1024
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '20px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 1025,
                        maxWidth: 1280
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '22px'
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 1281,
                        maxWidth: 1536
                    },
                    chartOptions: {
                        title: {
                            style: {
                                fontSize: '24px'
                            }
                        }
                    }
                }
            ]
        }
    };

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTitle(value);
    };

    const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setType(value);
    };

    const handleChangeYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setYear(parseInt(value));
    };

    const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value, selectedIndex } = e.target;
        setFilter(value);
        setFilterIndex(selectedIndex - 1);
    };

    const handleChangeExecution = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setExecution(value);
    };

    const handleChangeSubFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value, selectedIndex } = e.target;
        setSubFilter(value);
        setSubFilterIndex(selectedIndex - 1);
    };

    const generateMarkers = (locs: PointsMarketDash[]) => {
        if (locs.length === 0) {
            setMarkers([]);
        } else {
            let markers: JSX.Element[] = [];
            locs.forEach((loc, index) => {
                const { lat, lng } = loc;
                const marker = 
                <Marker key={index}
                    position={[lat, lng]}
                    icon={new Icon({
                        iconUrl: MarkerIcon,
                        iconSize: [25,41],
                        iconAnchor: [12, 41]
                    })}>
                    <Popup>
                        <div>
                            <div className='tw-flex tw-gap-1 tw--mb-4'>
                                <p className='tw-font-bold'>Fecha de evidencia: </p>
                                <p>{loc.year}</p>
                            </div>
                            <p className='tw-font-bold'>{loc.responsible}</p>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Meta:</p> <p>{loc.code}</p>
                            </div>
                            <p>{loc.name}</p>
                            <div className='tw-flex tw-gap-1'>
                                <p className='tw-font-bold'>Actividades: </p>
                                <p>{loc.activitiesDesc}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Población beneficiada:</p>
                                <p>{loc.benefited_population}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Cantidad de personas beneficiadas:</p>
                                <p>{loc.benefited_population_number}</p>
                            </div>
                            <div className='tw-flex tw-gap-1 tw--my-4'>
                                <p className='tw-font-bold'>Fuente de recursos:</p><p>{loc.resource_font}</p>
                            </div>
                            <div className='tw-flex tw-gap'>
                                <p className='tw-font-bold'>Recursos ejecutados:</p><p>{loc.executed_resources}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
                markers.push(marker);
            });
            setMarkers(markers);
        }
    };

    useEffect(() => {
        if (locations == undefined) return;
        if (locations.length === 0) return;
        setLocationsMap(convertLocations(locations));
    }, [locations]);

    useEffect(() => {
        switch (field) {
            case 'secretary':
                setFilters(secretaries ? secretaries.map(l => l.name) : []);
                setSubFilters([]);
                break;
            case 'evidences':
                if (locationsMap === undefined) return;
                const locsTemp = Array.from(locationsMap.keys());
                const locTemp = locationsMap.get(locsTemp[filterIndex]);
                setFilters(locsTemp.map(l => l.name));
                setSubFilters(locTemp?.map(l => l.name) ?? []);
                break;
            case 'execution':
                break;
            default:
                break;
        }
    }, [secretaries, locationsMap, filterIndex]);

    useEffect(() => {
        switch (field) {
            case 'secretary':
                if (secretaries == undefined) return notify('Aun no se han defino secretarías para este plan', 'warning');
                if (type === 'map') {
                    getDataDashboardMapsSecretary(id_plan, filter.replace('evidences', ''), year === 0 ? 0 : year)
                    .then((res: (PointsMarketDash[])) => {
                    const data = res.map(r => execution === 'done' ?
                        r.done : execution === 'benefited_population_number' ?
                        r.benefited_population_number : r.executed_resources
                    );
                    const labels: string[] | number[] = year === 0 ? res.map(r => r.year) : filter === '' ? res.map(r => r.code!) : res.map(r => r.code!);
                    setDataX(labels);
                    setDataY([data]);
                    generateMarkers(res);
                    });
                } else {
                    getDataDashboardSecretary(id_plan, filter.replace('secretary', ''), year === 0 ? 0 : year)
                    .then((res: ResponseChartSecre[]) => {
                        const data = res.map(r => execution === 'financial_execution' ?
                            r.financial_execution : r.physical_progress
                        );
                        const labels: string[] | number[] = year === 0 ? res.map(r => r.year) : filter === '' ? res.map(r => r.responsible) : res.map(r => r.name === null ? '' : r.name);
                        setDataX(labels);
                        setDataY([data]);
                        let val: number = 0, label: string = '';
                        if (type === 'min') {
                            val = Math.min(...data);
                            label = labels[data.indexOf(val)].toString();
                        } else if (type === 'max') {
                            val = Math.max(...data);
                            label = labels[data.indexOf(val)].toString();
                        }
                    });
                }
                break;
            case 'evidences':
                if (type === 'map') {
                    getDataDashboardMapsEvidence(id_plan, subFilter, filter.replace('evidences', ''), year === 0 ? 0 : year)
                    .then((res: (PointsMarketDash[])) => {
                    const data = res.map(r => execution === 'done' ?
                        r.done : execution === 'benefited_population_number' ?
                        r.benefited_population_number : r.executed_resources
                    );
                    const labels: string[] | number[] = year === 0 ? res.map(r => r.year) : filter === '' ? res.map(r => r.code!) : res.map(r => r.code!);
                    setDataX(labels);
                    setDataY([data]);
                    generateMarkers(res);
                    });
                } else {
                    getDataDashboardEvidence(id_plan, subFilter, filter.replace('evidences', ''), year === 0 ? 0 : year)
                    .then((res: (ResponseChartEvide[])) => {
                    const data = res.map(r => execution === 'done' ?
                        r.done : execution === 'benefited_population_number' ?
                        r.benefited_population_number : r.executed_resources
                    );
                    const labels: string[] | number[] = year === 0 ? res.map(r => r.year) : filter === '' ? res.map(r => r.code!) : res.map(r => r.code!);
                    setDataX(labels);
                    setDataY([data]);
                    let val: number = 0, label: string = '';
                    if (type === 'min') {
                        val = Math.min(...data);
                        label = labels[data.indexOf(val)].toString();
                    } else if (type === 'max') {
                        val = Math.max(...data);
                        label = labels[data.indexOf(val)].toString();
                    }
                    });
                }
                break;
            case 'execution':
                if (type === 'map') {
                    getDataDashboardMapsExecution(id_plan, filter.replace('evidences', ''), year === 0 ? 0 : year)
                    .then((res: (PointsMarketDash[])) => {
                    const data = res.map(r => execution === 'done' ?
                        r.done : execution === 'benefited_population_number' ?
                        r.benefited_population_number : r.executed_resources
                    );
                    const labels: string[] | number[] = year === 0 ? res.map(r => r.year) : filter === '' ? res.map(r => r.code!) : res.map(r => r.code!);
                    setDataX(labels);
                    setDataY([data]);
                    generateMarkers(res);
                    });
                } else {
                    getDataDashboardExecution(id_plan, filter.replace('execution', '').trim() === '' ? levels[0].id_level!.toString() : filter.replace('execution', ''), year === 0 ? 0 : year)
                    .then((res: ResponseChartExecu[]) => {
                        const data = res.map(r => execution === 'financial_execution' ?
                            parseFloat(r.financial_execution.toString()) : r.physical_progress
                        );
                        const labels: string[] | number[] = year === 0 ? res.map(r => r.year) : res.map(r => r.code);
                        setDataX(labels);
                        setDataY([data]);
                        let val: number = 0, label: string = '';
                        if (type === 'min') {
                            val = Math.min(...data);
                            label = labels[data.indexOf(val)].toString();
                        } else if (type === 'max') {
                            val = Math.max(...data);
                            label = labels[data.indexOf(val)].toString();
                        }
                    });
                }
                break;
            default:
                //dispatch(setCategories([]));
                //dispatch(setSubCategories([]));
                setDataX([]);
                setDataY([]);
                notify('No se ha asignado un campo', 'warning');
                break;
        }
    }, [year, type, execution, filter, subFilter]);

    return(
        <div className={`tw-h-full tw-w-full
                        tw-relative tw-bg-white`}>
            <button className="tw-right-0 tw-absolute tw-z-10"
                    onClick={onClose}>
                <Close/>
            </button>
            <div>
                <div className="tw-w-full tw-flex">
                    <select
                        className="tw-border tw-m-1"
                        value={type}
                        onChange={e => handleChangeType(e)}>
                        {visualization.map(v =>
                            <option key={v.title}>
                                {v.value}
                            </option>
                        )}
                    </select>
                    <select
                        className="tw-border tw-m-1"
                        onChange={handleChangeYear}
                        value={year}>
                        <option value={0}>Año...</option>
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    {field === 'secretary' ?
                        <select
                            className="tw-border tw-m-1 tw-w-32"
                            onChange={handleChangeFilter}
                            value={filter}>
                            <option value={''}>Secretaría...</option>
                            {filters.map(f => <option key={f} value={f}>{f}</option>)}
                        </select> :
                    field === 'evidences' ?
                    <>
                        <select
                            className="tw-border tw-m-1 tw-w-32"
                            onChange={handleChangeFilter}
                            value={filter}>
                            <option value={''}>Localidad...</option>
                            {filters.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <select
                            className="tw-border tw-m-1 tw-w-32"
                            onChange={handleChangeSubFilter}
                            value={subFilter}>
                            <option value={''}>Barrio...</option>
                            {subFilters.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </> :
                        <LevelsSelectFilter callback={handleChangeFilter}/>
                    }
                </div>
                <div>
                {field === 'secretary' ?
                    <select className='tw-w-36'
                            onChange={handleChangeExecution}
                            value={execution}>
                        <option value="">Ejecutado...</option>
                        <option value="financial_execution">Financiera</option>
                        <option value="physical_progress">Porcentaje</option>
                    </select> :
                field === 'evidences' ?
                    <select className='tw-w-36'
                            onChange={handleChangeExecution}
                            value={execution}>
                        <option value="">Ejecutado...</option>
                        <option value="done">Realizado</option>
                        <option value="benefited_population_number">Población beneficiada</option>
                        <option value="executed_resources">Recursos ejecutados</option>
                    </select> :
                field === 'execution' ?
                    <select className="tw-w-36"
                            onChange={handleChangeExecution}
                            value={execution}>
                        <option value="">Ejecutado...</option>
                        <option value="financial_execution">Dinero ejecutado</option>
                        <option value="physical_progress">Porcentaje ejecutado</option>
                    </select>
                    : null
                }
                </div>
                <input
                    placeholder="Título"
                    onChange={e => handleChangeTitle(e)}
                    value={title}
                    className={`tw-border tw-w-full tw-text-center
                                tw-font-bold tw-text-2xl`}
                />
                {type === 'map' ?
                <>{!planLocation ? <></> :
                    <MapContainer
                        style={{width: '100%', height: '100%'}}
                        center={[planLocation.lat, planLocation.lng]}
                        zoom={13}
                        bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                        scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {markers}
                        <Rectangle
                            bounds={[[bounding1, bounding3],[bounding2, bounding4]]}
                            pathOptions={{color:'blue', fillOpacity: 0}}
                        />
                    </MapContainer>
                }</> :
                (type === 'min' || type === 'max') ?
                <div className="tw-bg-white
                                tw-flex tw-flex-col tw-items-stretch">
                    <p className="tw-text-center tw-font-bold tw-text-4xl">
                        {type === 'min' ? 'MÍNIMO' : 'MÁXIMO'}
                    </p>
                    <p className="tw-text-center">{title}</p>
                </div> :
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartComponentRef}
                    containerProps={{ style: {width: '100%', height: '80%'} }}
                />}
            </div>
        </div>
    );
}