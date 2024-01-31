import  React, 
    {   useState, 
        useCallback, 
        useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { ToastContainer } from 'react-toastify';
import { notify } from '@/utils';
import "react-toastify/dist/ReactToastify.css";
import icono from "@/assets/icons/location.svg";

import { useAppDispatch, useAppSelector } from '@/store';
import { setEvidences } from '@/store/evidence/evidenceSlice';

import { BackBtn, Frame } from '@/components';
import {
    NodeInterface, 
    Node, 
    EvidenceInterface } from '@/interfaces';
import { 
    getLevelNodes, 
    getUbiEvidences, 
    getCodeEvidences } from '@/services/api';
import { getEnvironment } from '@/utils';

export const InterventionMap = () => {
    return (
        <Frame
            data={<Section/>}
        />
    );
}

const { API_KEY } = getEnvironment();

const containerStyle = {
    width: '90%',
    height: '600px',
    borderRadius: '15px'
};

const Section = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { levels, planLocation } = useAppSelector(state => state.plan);
    const { evidences } = useAppSelector(store => store.evidence);
    const { id_plan } = useAppSelector(store => store.content);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY??''
    });

    const [map, setMap] = useState<google.maps.Map|null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex] = useState<number[]>([0, 0]);
    const [codes, setCodes] = useState<string[]>([]);

    const infoWindow = new google.maps.InfoWindow();
    const mapOptions: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoom: 14,
        restriction: {
            latLngBounds: {
                north: 13.011493,
                east: -66.9,
                south: -4.334669,
                west: -79.314914
            }
        },
        center: planLocation
    };

    //ubicaciones
    useEffect(() => {
        const fetch = async () => {
            await getUbiEvidences(id_plan)
            .then((res)=> {
                localStorage.setItem('evidences', JSON.stringify(res));
                if (res.length === 0)
                    notify("No hay evidencias para mostrar");
            });
        }
        fetch();
    }, []);

    //filtros
    useEffect(() => {
        const fetch = async () => {
            if (levels.length === 0) return;
            let parent: (string | null) = null;
            let response = [] as NodeInterface[][];
            for (let i = 0; i < 2; i++) {
                const { id_level } = levels[i];
                if (id_level) {
                    const res: NodeInterface[] = await getLevelNodes({id_level: id_level, parent: parent});
                    let temp_ = [] as NodeInterface[];
                    res.forEach((item:Node) => {
                        temp_.push({
                            id_node: item.id_node,
                            name: item.name,
                            description: item.description,
                            parent: item.parent,
                            id_level: item.id_level,
                            weight: 0,
                        });
                    });
                    if (res.length === 0) break;
                    const temp = [...programs];
                    temp[i] = temp_;
                    parent = res[index_[i]].id_node;
                    response.push(temp_);
                }
            }
            response[0].push({
                id_node: '',
                name: 'Todas',
                description: '',
                parent: null,
                id_level: 0,
                weight: 0,
            })
            setPrograms(response);
        }
        fetch();
    }, [index_]);

    //obtiene los codigos de las metas del programa seleccionado
    /**
     * la idea es cruzar los codigos de las metas con las evidencias
     * y asi obtener las evidencias de la meta
     */
    useEffect(() => {
        const fetch = async () => {
            if (programs.length === 0) return;
            if (programs.length === 1) return notify("No hay evidencias para mostrar");
            await getCodeEvidences(programs[1][index_[1]].id_node, id_plan)
            .then((res) => {
                setCodes(res);
            });
        }
        fetch();
    }, [programs]);

    useEffect(() => {
        if (codes.length === 0) {
            dispatch(setEvidences([]));
        } else {
            const evidencesLocal = localStorage.getItem('evidences');
            const evidens = JSON.parse(evidencesLocal as string) as EvidenceInterface[];
            let temp = [] as EvidenceInterface[];
            evidens.forEach((item: EvidenceInterface) => {
                if (codes.includes(item.code)) {
                    temp.push(item);
                }
            });
            dispatch(setEvidences(temp));
        }
    }, [codes]);

    useEffect(() => {
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        if (evidences.length === 0) {
            setMarkers([]);
        } else {
            let markers_: google.maps.Marker[] = [];
            evidences.forEach((item) => {
                item.locations.forEach((location) => {
                    const { lat, lng } = location;
                    const marker = new google.maps.Marker({
                        clickable: true,
                        draggable: false,
                        position: {lat, lng},
                        map,
                        title: item.code,
                        icon: {
                            url: icono,
                            scaledSize: new window.google.maps.Size(30, 30),
                        },
                        optimized: false
                    });
                    marker.addListener('click', () => {
                        infoWindow.close();
                        infoWindow.setContent(item.code + ' - ' + item.activitiesDesc);
                        infoWindow.open(map, marker);
                    });
                    markers_.push(marker);
                });
            });
            setMarkers(markers_);
        }
    }, [evidences]);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
        setMarkers([]);
    }, []);

    const handleBack = () => navigate(-1);

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
        console.log(index, newIndex, programs[0].length);

        if (index === 0 && programs[0].length - 1 === newIndex) {

        } else {
            let newIndex_ = [...index_];
            if (newIndex === 0) {
                newIndex_[index] = newIndex;
            } else if (newIndex === programs[index].length) {
                const evidencesLocal = localStorage.getItem('evidence');
                const evidens = JSON.parse(evidencesLocal as string);
                dispatch(setEvidences(evidens));
            } else {
                newIndex_[index] = newIndex;
                for (let i = index+1; i < newIndex_.length; i++) {
                    newIndex_[i] = 0;
                }
            }
            setIndex(newIndex_);
        }
    };

    return (
        <div className={`tw-bg-[url('/src/assets/images/bg-pi-1.png')]
                         tw-bg-cover
                         tw-h-full tw-border
                         tw-opacity-80`} >
            <div className='tw-flex tw-my-4'>
                <BackBtn handle={handleBack} id={id_plan} />
                <h1 className='tw-grow tw-text-center'>Mapa de intervenciones</h1>
            </div>
            <ToastContainer />

            <div className='tw-flex tw-justify-center tw-mb-3'>
                {programs.map((program, i) => (
                    <div className='tw-flex tw-flex-col' key={i}>
                        <label className='tw-text-center'>
                            {levels[i].name}
                        </label>
                        <select value={program[index_[i]].name}
                                onChange={(e)=>handleChangePrograms(i, e)}
                                className='tw-border tw-border-gray-300 tw-rounded tw-mr-3 '>
                            {program.map((node, index) => (<option value={node.name} key={index}>{node.name}</option>))}
                        </select>
                    </div>
                ))}
            </div>
            {isLoaded ? (<div className='tw-flex tw-justify-center'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={planLocation}
                    zoom={14}
                    options={mapOptions}
                    onLoad={onLoad}
                    onUnmount={onUnmount}>
                </GoogleMap>
            </div>
            ) : <p>Cargando...</p>}
        </div>
    );
}