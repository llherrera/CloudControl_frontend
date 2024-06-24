import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { notify, decode } from '@/utils';

import { useAppDispatch, useAppSelector } from '@/store';
import { thunkLogin } from '@/store/auth/thunks';
import { setIdPlan } from "@/store/content/contentSlice";
import { Token } from '@/interfaces';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/configs/firebaseConfig';
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Spinner } from '@/assets/icons';

const app = initializeApp(firebaseConfig);
const auth = getAuth();


export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { authenticating } = useAppSelector(state => state.auth)

    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const validateRol = (info: Token) => (
        (info.rol === "funcionario" || info.rol === 'planeacion' || info.rol === 'sectorialista') ?
        (dispatch(setIdPlan(info.id_plan)),
        navigate('/lobby')
        ) : navigate('/')
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (authenticating) return;
        e.preventDefault();
        await dispatch(thunkLogin(user))
        .unwrap()
        .then(res => {
            if (res === undefined) return alert("Usuario o contraseña incorrectos");
            const info = decode(res.token);
            signInWithEmailAndPassword(auth, info.email, user.password)
            .then((userCredential) => {
                info.rol === "admin" ? navigate('/pdt') : validateRol(info);
            })
            .catch(err => {
                console.log(err);
                alert('Error al autenticar usuario');
            })
        })
        .catch(() => {
            notify("Error, usuario o contraseña erronea");
        }
        );
    };

    return (
        <form className='   tw-rounded
                            tw-flex tw-flex-col
                            tw-px-10 tw-mx-6
                            tw-bg-[#FCFCFE]
                            tw-shadow-2xl'
                onSubmit={handleSubmit}>
            <p className='tw-font-montserrat'>Usuario</p>
            <input  type="text" 
                    name="username" 
                    onChange={handleChange}
                    className='tw-border tw-rounded'
                    required/><br/>
            <p className='tw-font-montserrat'>Clave</p>
            <input  type="password" 
                    name="password" 
                    onChange={handleChange}
                    className='tw-border tw-rounded'
                    required/><br/>
            <button className='tw-bg-greenBtn hover:tw-opacity-50
                                tw-text-white tw-font-montserrat
                                tw-rounded tw-h-10'>
                {authenticating ?
                <div className='tw-h-10 tw-flex'><Spinner/></div> :
                <p className='tw-font-bold'>Iniciar sesión</p>}
            </button><br />
            <input  type="button" 
                    value={'¿Olvidaste tu contraseña?'}
                    className='tw-pb-10 hover:tw-bg-black-50' />
        </form>
    );
}
    