import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../store';
import { thunkLogin } from '../../store/auth/thunks';

import { decode } from '../../utils/decode';

export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [user, setuser] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setuser({
            ...user,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await dispatch(thunkLogin(user))
            .unwrap()
            .then((res) => {
                if (res === undefined) return alert("Usuario o contraseña incorrectos")
                const info = decode(res.token)
                info.rol === "admin" ? 
                navigate('/pdt') :
                (info.rol === "funcionario" || info.rol === 'planeacion' || info.rol === 'sectorialista') ?
                navigate('/pdt/PlanIndicativo', {state: {id: info.id_plan}}) :
                navigate('/')
            })
            .catch((err) => {
                console.log(err)
            }
        )
    };

    const handleCancelar = () => {
        navigate('/')
    };

    return (
        <form className='   tw-rounded
                            tw-flex tw-flex-col
                            tw-px-10 tw-mx-6
                            tw-bg-[#FCFCFE]
                            tw-shadow-2xl'
                onSubmit={handleSubmit}>
            <label className='tw-font-montserrat'>Usuario</label>
            <input  type="text" 
                    name="username" 
                    onChange={handleChange}
                    className='tw-border tw-rounded'
                    required/><br/>
            <label className='tw-font-montserrat'>Clave</label>
            <input  type="password" 
                    name="password" 
                    onChange={handleChange}
                    className='tw-border tw-rounded'
                    required/><br/>
            <button className='tw-bg-greenBtn hover:tw-opacity-50
                                tw-text-white tw-font-montserrat
                                tw-rounded tw-py-2'>
                Iniciar sesión</button><br />
            <input  type="button" 
                    value={'¿Olvidaste tu contraseña?'}
                    className='tw-pb-10 hover:tw-bg-black-50' />
        </form>
    );
}