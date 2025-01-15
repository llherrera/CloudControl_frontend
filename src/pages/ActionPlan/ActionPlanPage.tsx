import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Frame, Options, BackBtn } from '@/components';
import cclogo from "@/assets/images/ControlLand.png";

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

    if (plan == undefined) return <>No se ha programado un plan</>;

    return (
        <Frame>
            {logged ? <Options callback={logout}/> :
            <div className='tw-flex tw-justify-center tw-items-center'>
                <div className='tw-basis-1/2 tw-border-r tw-mr-2 tw-flex tw-flex-col tw-justify-center'>
                    <img src={cclogo} width={350} className='tw-self-center'/>
                    <div className='tw-self-center'>
                        {secretaries == undefined ? <p>No se han definido las secretarías</p> :
                        <select name="username"
                                className=" tw-m-2 tw-p-2 tw-w-48
                                            tw-rounded tw-border-2 tw-border-gray-400"
                                value={user.username}
                                placeholder='Secretaría'
                                onChange={e =>handleChange(e)}>
                            <option value=""></option>
                            {secretaries.map((s, i) => <option key={i} value={s.name}>
                                {s.name}
                            </option>)}
                        </select>
                        }
                        <input  className=" tw-m-2 tw-p-2 tw-rounded
                                            tw-border-2 tw-border-gray-400"
                                onChange={e => handleChange(e)}
                                value={user.password}
                                type='password'
                                name="password"
                                required
                                placeholder="Clave"
                        />
                    </div>
                    <div className='tw-flex tw-justify-around'>
                        <button className=' tw-p-2 tw-mb-10
                                            tw-rounded tw-border
                                            tw-font-bold tw-text-white hover:tw-text-black
                                            tw-bg-green-700 hover:tw-bg-green-400'
                                onClick={() => handleSubmit()}>
                            Entrar
                        </button>
                        <button className=' tw-p-2 tw-mb-10
                                            tw-rounded tw-border
                                            tw-font-bold tw-text-white hover:tw-text-black
                                            tw-bg-red-700 hover:tw-bg-red-400'
                                onClick={() => navigate(-1)}>
                            Regresar
                        </button>
                    </div>
                </div>
                <div className='tw-basis-1/2'>
                    <p className="tw-text-2xl tw-text-white tw-font-bold
                                tw-drop-shadow-[0_2px_2px_rgba(0,255,0,0.9)]">
                        Control de entrada a plan de acción
                    </p>
                    <p className="tw-text-2xl tw-text-white tw-font-bold
                                tw-drop-shadow-[0_2px_2px_rgba(0,255,0,0.9)]">
                        Alcaldia: {plan.municipality}
                    </p>
                    <p className="tw-text-2xl tw-text-white tw-font-bold
                                tw-drop-shadow-[0_1.2px_1.2px_rgba(0,255,0,0.9)]">
                        Por: {plan.name}
                    </p>
                </div>
            </div>
            }
        </Frame>
    );
}