import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from "@/store";
import { setIdPlan } from "@/store/content/contentSlice";
import { thunkGetPDTByDept, thunkGetPDTid } from "@/store/plan/thunks";

import { Header, SelectDept, BackBtn } from '@/components';
import { Coordinates } from '@/interfaces';
import { getReverseGeocode } from "@/services/map_api";
import { notify } from '@/utils';

export const ChooseCityPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const { plan, loadingPlan } = useAppSelector(store => store.plan);

    const [location, setLocation] = useState<Coordinates>({ lat: 0, lng: 0 });
    const [error, setError] = useState('');
    const [press, setPress] = useState(false);
    const [locationNames, setLocationsNames] = useState({
        department: "",
        municipality: "",
        id_municipality: "",
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocación no está soportada en tu navegador');
            return;
        }

        const success = (position: any) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLocation({ lat: latitude, lng: longitude });
        };

        const error = () => {
            setError('No se puede acceder a su ubicación');
        };

        navigator.geolocation.getCurrentPosition(success, error);
    }, []);

    useEffect(() => {
        if (location.lat && location.lng) {
            getReverseGeocode(location.lat, location.lng)
            .then(res => {
                const data = res.data;
                if (data.results.length > 0) {
                    const result = data.results[0];
                    const componentsAddress = result.components;
                    setLocationsNames({
                        department: componentsAddress.state,
                        municipality: componentsAddress.city,
                        id_municipality: '0'
                    });
                    setPress(true);
                } else {
                    setError('No se encontró la ciudad o departamento para estas coordenadas');
                }
            })
            .catch(() => {
                setError('Fallo al acceder a su ciudad o departamento');
            });
        }
    }, [location]);

    useEffect(() => {
        if (!press) return notify('No se ha encontrado un Plan de Desarrollo en esta localidad');
        if (locationNames.department === "") return notify('No se ha encontrado un Plan de Desarrollo en este Departamente');
        dispatch(thunkGetPDTByDept({
            dept: locationNames.department,
            muni: locationNames.municipality
        }));
    }, [press]);

    useEffect(() => {
        if (plan === undefined || plan.toString() == '') return notify('No se ha encontrado un Plan de Desarrollo en esta localidad');
        setPress(false);
        dispatch(setIdPlan(plan.id_plan!));
        navigate(`/lobby`);
    }, [plan]);

    const handleDepartmentChange = (name: string, code: string) => {
        setLocationsNames({
            department: name,
            municipality: '',
            id_municipality: code + '000'
        });
    };

    const handleMunicipioChange = (name: string, code: string) => {
        setLocationsNames({
            ...locationNames,
            municipality: name,
            id_municipality: code,
        });
    };

    const handleSearchPlan = () => {
        if (locationNames.department === "") return notify('No se ha encontrado un Plan de Desarrollo en este Departamento');
        dispatch(thunkGetPDTByDept({
            dept: locationNames.department,
            muni: locationNames.municipality
        }));
    }

    return (
        <Header>
            <BackBtn
                handle={() => navigate(-1)}
                id={location.lat}
                key={location.lat}
            />
            <div>
                {error ? (
                    <div>
                        <SelectDept
                            callbackDept={handleDepartmentChange}
                            callbackMuni={handleMunicipioChange}
                        />
                        <button className=" tw-bg-green-500 hover:tw-bg-green-300
                                            tw-text-white tw-font-bold
                                            hover:tw-text-black
                                            tw-rounded
                                            tw-p-2
                                            tw-justify-self-center"
                            onClick={handleSearchPlan}>
                            Buscar Plan Territorial
                        </button>
                    </div>
                ) : (
                    <div>
                        <h3>Localidad</h3>
                        <p>Departamento: {locationNames.department}</p>
                        <p>Ciudad: {locationNames.municipality}</p>
                    </div>
                )}
            </div>
            <p>
                {loadingPlan ? 'cargando' :
                plan ? 'Plan encontrado en esta zona' :
                'No se encuentra un plan en esta zona'}
            </p>
        </Header>
    );
}
