import  React, 
    {   useState, 
        useCallback, 
        useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import {
    GoogleMap, 
    useJsApiLoader, 
    InfoWindow, 
    Marker } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import icono from "@/assets/icons/location.svg";

import { useAppDispatch, useAppSelector } from '@/store';
import { setEvidences } from '@/store/evidence/evidenceSlice';

import {
    BackBtn, 
    Frame } from '@/components';
import {
    Coordinates, 
    NodeInterface, 
    Node, 
    EvidenceInterface } from '@/interfaces';
import { 
    getLevelNodes, 
    getUbiEvidences, 
    getCodeEvidences } from '@/services/api';

export const InterventionMap = () => {
    return (
        <Frame
            data={<Section/>}
        />
    );
}

const API_KEY = process.env.VITE_API_KEY_MAPS as string;

const containerStyle = {
    width: '500px',
    height: '500px',
    borderRadius: '15px'
};

const mapOptions = {
    disableDefaultUI: true,
    zoom: 0,
    restriction: {
        latLngBounds: {
            north: 13.011493,
            east: -66.9,
            south: -4.334669,
            west: -79.314914
        }
    },
};

const Section = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { levels, planLocation } = useAppSelector(state => state.plan);
    const { evidences } = useAppSelector(store => store.evidence);
    const { id_plan } = useAppSelector(store => store.content);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const [map, setMap] = useState<google.maps.Map|null>(null);
    const [ubication, setUbication] = useState<Coordinates>({lat: 10.96854, lng: -74.78132});

    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex] = useState<number[]>([0, 0]);
    const [codes, setCodes] = useState<string[]>([]);

    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUbication({lat: position.coords.latitude, lng: position.coords.longitude});
        }, (error) => {
            console.log(error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }, []);

    useEffect(() => {
        if (!map || !planLocation) return;
        map.setCenter(planLocation);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            await getUbiEvidences(id_plan)
            .then((res)=> {
                localStorage.setItem('evidences', JSON.stringify(res));
                if (res.length === 0)
                    notify();
            });
        }
        fetch();
    }, []);

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

    useEffect(() => {
        const fetch = async () => {
            if (programs.length === 0) return;
            await getCodeEvidences(programs[1][index_[1]].id_node, id_plan)
            .then((res) => {
                setCodes(res);
            });
        }
        fetch();
    }, [programs]);

    useEffect(() => {
        if (codes.length === 0) return;
        const evidencesLocal = localStorage.getItem('evidences');
        const evidens = JSON.parse(evidencesLocal as string) as EvidenceInterface[];
        let temp = [] as EvidenceInterface[];
        evidens.forEach((item: EvidenceInterface) => {
            if (codes.includes(item.code)) {
                temp.push(item);
            }
        });
        dispatch(setEvidences(temp));
    }, [codes]);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    const handleBack = () => navigate(-1);

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
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
    };

    const handleShowTooltip = () => setShowTooltip(true);

    const notify = () => toast("No hay evidencias para mostrar", { 
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    return (
        <div className={`tw-bg-[url('/src/assets/images/bg-plan-indicativo.png')]
                        tw-pb-3`} >
            <div className='tw-flex tw-my-4'>
                <BackBtn handle={handleBack} id={id_plan} />
                <h1 className='tw-grow tw-text-center'>Mapa de intervenciones</h1>
            </div>
            <ToastContainer />

            <div className='tw-flex tw-justify-center tw-mb-3'>
                {programs.map((program, index) => (
                    <div className='tw-flex tw-flex-col' key={index}>
                        <label className='tw-text-center'>
                            {levels[index].name}
                        </label>
                        <select value={program[index_[index]].name}
                                onChange={(e)=>handleChangePrograms(index, e)}
                                className='tw-border tw-border-gray-300 tw-rounded tw-mr-3 '>
                            {program.map((node, index) => (<option value={node.name} key={index}>{node.name}</option>))}
                        </select>
                    </div>
                ))}
            </div>
            {isLoaded ? (<div className='tw-flex tw-justify-center'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{lat: ubication.lat, lng: ubication.lng}}
                    zoom={10}
                    options={mapOptions}
                    onLoad={onLoad}
                    onUnmount={onUnmount}>
                    {evidences.length > 0 ? evidences.map((item) => (
                        item.locations.map((location, index) => {
                            const { lat, lng } = location;
                            return <Marker 
                                position={{lat, lng}}
                                onClick={handleShowTooltip}
                                icon={{
                                    url: icono,
                                    scaledSize: new window.google.maps.Size(30, 30),
                                }}>
                                {showTooltip && (
                                    <InfoWindow onCloseClick={()=>setShowTooltip(false)}>
                                        <div>
                                            <p>{item.code}</p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        })
                    )):null}
                </GoogleMap>
            </div>
            ) : <p>Cargando...</p>}
        </div>
    );
}