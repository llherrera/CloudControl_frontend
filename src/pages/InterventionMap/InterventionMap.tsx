import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkGetEvidence } from '@/store/evidence/thunks';
import { thunkGetUnit } from "@/store/unit/thunks";
import { setEvidence } from '@/store/evidence/evidenceSlice';

import { BackBtn, Frame } from '@/components';
import { Coordinates, NodoInterface, Node, EvidenceInterface } from '@/interfaces';
import { getLevelNodes } from '@/services/api';

export const InterventionMap = () => {
    return (
        <Frame
            data={<Section/>}
        />
    )
}

const API_KEY = import.meta.env.VITE_API_KEY_MAPS as string;

const containerStyle = {
    width: '400px',
    height: '400px'
};

const Section = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { levels, plan } = useAppSelector(state => state.plan);
    const { unit } = useAppSelector(store => store.unit);
    const { evidence, eviSelected } = useAppSelector(store => store.evidence);

    const id = location.state?.id;
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY
    });

    const [map, setMap] = useState<google.maps.Map|null>(null);
    const [ubication, setUbication] = useState<Coordinates>({lat: 10.96854, lng: -74.78132});
    
    const [programs, setPrograms] = useState<NodoInterface[][]>([]);
    const [index_, setIndex] = useState<number[]>(levels.map(() => 0));

    useEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            setUbication({lat: position.coords.latitude, lng: position.coords.longitude})
        }, (error) => {
            console.log(error)
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        })
    }, []);

    useEffect(() => {
        const fetch = async () => {
            let parent: (string | null) = null;
            let response = [] as NodoInterface[][];
            for (let i = 0; i < levels.length; i++) {
                const { id_nivel } = levels[i];
                if (id_nivel) {
                    const res = await getLevelNodes({id_level: id_nivel, parent: parent});
                    const temp_ = [] as NodoInterface[];
                    res.forEach((item:Node) => {
                        temp_.push({
                            id_node: item.id_nodo,
                            NodeName: item.Nombre,
                            Description: item.Descripcion,
                            Parent: item.Padre,
                            id_level: item.id_nivel,
                            Weight: 0,
                        });
                    });
                    const temp = [...programs];
                    temp[i] = temp_;
                    parent = res[index_[i]].id_nodo;
                    response.push(temp_);
                }
            }
            setPrograms(response);
        }
        fetch();
    }, [index_]);

    useEffect(() => {
        const fetch = async () => {
            dispatch(thunkGetUnit({idPDT: plan!.id_plan!.toString(), idNode: programs[levels.length-1][index_[levels.length-1]].id_node}))
                .unwrap()
                .catch((err) => {
                    alert('Ha ocurrido un error al cargar la unidad')
                })
        }
        fetch();
    }, [programs]);

    useEffect(() => {
        const fetch = async () => {
        dispatch(thunkGetEvidence({id_plan: plan!.id_plan!, codigo: unit!.code}))
            .unwrap()
            .then((res) => {
                if (res.length === 0) {
                    alert('No hay evidencias para esta unidad')
                }
            })
        }
        fetch();
    }, [unit]);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, []);

    const handleBack = () => {
        navigate(-1)
    };

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
        let newIndex_ = [...index_];
        if (newIndex === 0) {
            newIndex_[index] = newIndex;
        } else {
            newIndex_[index] = newIndex;
            for (let i = index+1; i < newIndex_.length; i++) {
                newIndex_[i] = 0;
            }
        }
        setIndex(newIndex_);
    };

    const handleChangeEvidence = (item: EvidenceInterface) => {
        dispatch(setEvidence(item));
    };

    return (
        <div>
            <div className='tw-flex tw-my-4'>
                <BackBtn handle={handleBack} id={id} />
                <h1 className='tw-grow tw-text-center'>Mapa de intervenciones</h1>
            </div>

            <div className='tw-flex tw-justify-center tw-mb-3'>
                {programs.map((program, index) => (
                    <select value={program[index_[index]].NodeName}
                            onChange={(e)=>handleChangePrograms(index, e)}
                            className='tw-border tw-border-gray-300 tw-rounded tw-mr-3 '
                            key={index}>
                        {program.map((node, index) => (<option value={node.NodeName} key={index}>{node.NodeName}</option>))}
                    </select>
                
                ))}
            </div>
            {isLoaded ? (<div className='tw-flex tw-justify-center'>
                <div className='tw-flex tw-flex-col tw-mr-3'>
                    {evidence.map((item, index) => (
                        <button key={index}
                                className=' tw-border tw-rounded 
                                            tw-mb-2 tw-p-1
                                            tw-bg-slate-300 hover:tw-bg-slate-400'
                                onClick={()=>handleChangeEvidence(item)}>
                            <p className='tw-text-start'>{index + 1} - {item.nombreDocumento}</p>
                        </button>
                    ))}
                </div>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={ubication}
                    zoom={14}
                    onLoad={onLoad}
                    onUnmount={onUnmount}>
                    {eviSelected !== undefined ? (
                        eviSelected.ubicaciones.map((item, index) => (
                            <Marker key={index} position={{lat:item.Latitud, lng:item.Longitud}} />
                        ))
                    ): null}
                </GoogleMap>
            </div>
            ) : <p>Cargando...</p>}
        </div>
    )
}