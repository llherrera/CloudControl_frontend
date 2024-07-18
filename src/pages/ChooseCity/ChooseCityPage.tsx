import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from "@/store";
import { thunkGetPDTByDept } from "@/store/plan/thunks";

import { Header, SelectDept, BackBtn } from '@/components';
import { Coordinates } from '@/interfaces';
import { getReverseGeocode } from "@/services/map_api";

export const ChooseCityPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
            setError('Geolocation is not supported by your browser');
            return;
        }

        const success = (position: any) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLocation({ lat: latitude, lng: longitude });
        };

        const error = () => {
            setError('Unable to retrieve your location');
        };

        navigator.geolocation.getCurrentPosition(success, error);
    }, []);

    useEffect(() => {
        if (location.lat && location.lng) {
            getReverseGeocode(location.lat, location.lng)
            .then(res => {
                console.log('1');
                const data = res.data;
                if (data.results.length > 0) {
                    const result = data.results[0];
                    const componentsAddress = result.components;
                    setLocationsNames({
                        department: componentsAddress.state,
                        municipality: componentsAddress.city,
                        id_municipality: '0'
                    });
                } else {
                    setError('No address found for these coordinates');
                }
            })
            .catch(error => {
                setError('Failed to fetch address');
            });
        }
    }, [location]);

    useEffect(() => {
        if (!press) return;
        searchPlan()
        .then(res => {

        })
        .catch(error => {

        });
    }, [locationNames.municipality]);

    const handleDepartmentChange = (name: string, code: string) => {
        setLocationsNames({
            ...locationNames,
            department: name,
            municipality: '',
        });
    };

    const handleMunicipioChange = (name: string, code: string) => {
        setLocationsNames({
            ...locationNames,
            municipality: name,
            id_municipality: code,
        });
    };

    const searchPlan = async () => {
        if (locationNames.department === "") return;
        dispatch(thunkGetPDTByDept({
            dept: locationNames.department,
            muni: locationNames.municipality
        }));
    }

    const handleSearchPlan = async () => {
        setPress(true);
        await searchPlan();
    };

    return (
        <Header>
            <BackBtn
                handle={() => navigate(-1)}
                id={location.lat}
                key={location.lat}
            />
            <div key={locationNames.id_municipality}>
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
                                            tw-p-2"
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
                {loadingPlan ? 'cargando' : plan ? plan.id_plan : 'Nada'}
            </p>
        </Header>
    );
}
