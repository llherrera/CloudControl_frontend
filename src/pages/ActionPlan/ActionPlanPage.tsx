import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Frame, Options, BackBtn } from '@/components';
//import cclogo from "@/assets/images/ControlLand.png";
import cclogo from "@/assets/images/ControlLand2.png";

import { useAppSelector, useAppDispatch } from '@/store';
import { thunkGetSecretaries } from '@/store/plan/thunks';
import { thunkLogin } from '@/store/auth/thunks';

import { notify } from '@/utils';

export const ActionPlanPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { secretaries, plan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [logged, setLogged] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    useEffect(() => {
        if (id_plan <= 0) return;
        if (secretaries == undefined) dispatch(thunkGetSecretaries(id_plan));
    }, [id_plan]);

    const logout = () => setLogged(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = () => {
        //dispatch(thunkLogin(user))
        //.unwrap()
        //.then(res => {
        //    if (res === undefined) return notify("Usuario o contraseña incorrectos", 'error');
            setLogged(true);
        //})
        //.catch(() => {
        //    notify("Error, usuario o contraseña erronea", 'error');
        //});
    };

    if (plan == undefined) return (
        <Frame>
            <div className="tw-flex tw-justify-center tw-items-center tw-h-[60vh]">
                <div className="tw-bg-white tw-shadow-lg tw-rounded-xl tw-p-8 tw-text-center">
                    <p className="tw-text-lg tw-font-semibold tw-text-gray-700">No se ha programado un plan</p>
                </div>
            </div>
        </Frame>
    );

    return (
        <Frame>
            {logged ? (
                <Options callback={logout} />
            ) : (
                <div className="tw-flex tw-justify-center tw-items-center tw-min-h-[70vh]">
                    <div className="tw-bg-white tw-shadow-2xl tw-rounded-2xl tw-p-8 tw-flex tw-flex-col md:tw-flex-row tw-gap-8 tw-w-full tw-max-w-4xl">
                        {/* Lado Izquierdo: Login */}
                        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center">
                            <img src={cclogo} width={120} className="tw-mb-4 tw-drop-shadow" alt="Logo" />
                            <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Acceso al Plan de Acción</h2>
                            <form className="tw-w-full tw-max-w-xs tw-space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                                <div>
                                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600 mb-1">Secretaría</label>
                                    <select
                                        name="username"
                                        className="tw-w-full tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
                                        value={user.username}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione...</option>
                                        {secretaries && secretaries.map((s, i) => (
                                            <option key={i} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-600 mb-1">Clave</label>
                                    <input
                                        className="tw-w-full tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-300"
                                        onChange={handleChange}
                                        value={user.password}
                                        type='password'
                                        name="password"
                                        required
                                        placeholder="Ingrese su clave"
                                    />
                                </div>
                                <div className="tw-flex tw-gap-4 tw-mt-4">
                                    <button
                                        type="submit"
                                        className="tw-flex-1 tw-bg-green-600 hover:tw-bg-green-700 tw-text-white tw-font-bold tw-py-2 tw-rounded-lg tw-transition"
                                    >
                                        Entrar
                                    </button>
                                    <button
                                        type="button"
                                        className="tw-flex-1 tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-font-bold tw-py-2 tw-rounded-lg tw-transition"
                                        onClick={() => navigate(-1)}
                                    >
                                        Regresar
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Lado Derecho: Info */}
                        <div className="tw-flex-1 tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-gradient-to-br tw-from-green-200 tw-to-green-100 tw-rounded-xl tw-p-6">
                            <p className="tw-text-2xl tw-font-bold tw-text-green-800 tw-mb-2">
                                Control de entrada a plan de acción
                            </p>
                            <p className="tw-text-lg tw-text-gray-700 tw-font-semibold">
                                Alcaldía: <span className="tw-font-bold">{plan.municipality}</span>
                            </p>
                            <p className="tw-text-lg tw-text-gray-700 tw-font-semibold">
                                Por: <span className="tw-font-bold">{plan.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Frame>
    );
}