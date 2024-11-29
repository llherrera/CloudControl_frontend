import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input, BackBtn } from "@/components";
import { doRegister } from "@/services/api";
import { RegisterInterface, IdProps } from "@/interfaces";
import { validateEmail, notify } from "@/utils";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/configs/firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

import { Box, CircularProgress } from '@mui/material';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const RegisterForm = ({id}: IdProps) => {
    const navigate = useNavigate();

    const min = 6, max = 16;
    const [loading, setLoading] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    //const [hasMayus, setHasMayus] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [noHasSpace, setNoHasSpace] = useState(false);
    const [form, setForm] = useState<RegisterInterface>({
        username: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: '',
        rol: 'sectorialista'
    });

    const handleInputChange = (event:
            React.ChangeEvent<HTMLInputElement |
            HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name == 'password') {
            const hasNumber = /[0-9]/.test(value);
            //const hasMayus  = /[A-Z]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-\\/]/.test(value);
            const noHasSpace = !/\s/.test(value);
            setHasNumber(hasNumber);
            //setHasMayus(hasMayus);
            setHasSpecialChar(hasSpecialChar);
            setNoHasSpace(noHasSpace);
        }

        setForm({ ...form, [name]: value });
    };

    const handleChangeRol = (value: string) => {
        setForm({ ...form, ['rol']: value });
    };

    const validatePassword = (password: string) => {
        if (password.length >= min && password.length <= max) {
            //if (hasNumber && hasMayus && hasSpecialChar && noHasSpace) return true;
            if (hasNumber && hasSpecialChar && noHasSpace) return true;
            else return false;
        } else {
            return false;
        }
    };

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validatePassword(form.password))
            return notify('La contraseña no cunple los requerimientos', 'warning');
        if (form.password !== form.confirm_password)
            return notify("Las contraseñas no coinciden", 'warning');
        if (form.username === '' || form.lastname === '' ||
            form.email === '' || form.password === '')
            return notify("Por favor llene todos los campos", 'warning');
        if (!validateEmail(form.email))
            return notify("El correo no es válido");
        setLoading(true);
        createUserWithEmailAndPassword(auth, form.email, form.password)
        .then(() => {
            doRegister(id, form)
            .then(() => navigate(`/pdt/PlanIndicativo`, {replace: true}))
            .catch(err => {
                console.log(err);
                notify(`Error al registrar usuario: ${err.response.data.msg}`, 'error');
            })
            .finally(() => setLoading(false))
        })
        .catch(err => {
            notify(`Error al registrar usuario: ${err.response.data.msg}`, 'error');
        })
        .finally(() => setLoading(false));
    };

    return (
        <div className="tw-flex tw-justify-center tw-my-4">
            <div className="tw-float">
                <BackBtn handle={()=>navigate(-1)} id={form.username.length}/>
            </div>
            <form   onSubmit={submitForm}
                    className=" tw-px-10 tw-shadow-2xl
                                tw-rounded tw-bg-white">
                <h1 className=" tw-mb-4 tw-grow
                                tw-text-center tw-text-xl">
                    Registrar funcionario
                </h1>
                <div className="tw-flex tw-flex-col tw-gap-3">
                <Input  label={"Usuario"}
                        type={"text"}
                        id={"username"}
                        name={"username"}
                        onChange={ event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                <Input  label={"Apellido"}
                        type={"text"}
                        id={"lastname"}
                        name={"lastname"}
                        onChange={ event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                <Input  label={"Correo"}
                        type={"text"}
                        id={"email"}
                        name={"email"}
                        onChange={ event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                <Input  label={"Contraseña"}
                        type={"password"}
                        id={"password"}
                        name={"password"}
                        onChange={ event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                <Input  label={"Confirmar Contraseña"}
                        type={"password"}
                        id={"confirm_password"}
                        name={"confirm_password"}
                        onChange={ event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2"/>
                <div className="tw-shadow tw-mb-3">
                    Requerimientos de la contraseña:
                    <p className={`${form.password.length >= min && form.password.length <= max ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {form.password.length >= min && form.password.length <= max ?
                        '✓' : 'X'} Entre 6 y 16 caracteres
                    </p>

                    <p className={`${hasNumber ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {hasNumber ? '✓' : 'X'} Al menos un número
                    </p>
                    <p className={`${hasSpecialChar ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {hasSpecialChar ? '✓' : 'X'} Al menos un caracter especia
                    </p>
                    <p className={`${noHasSpace ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {noHasSpace ? '✓' : 'X'} No espacios
                    </p>
                </div>
                <div className="tw-flex tw-justify-center tw-mb-3">
                    <button
                        className={`${form.rol === 'funcionario' ?
                                    'tw-bg-red-300 hover:tw-bg-red-400':
                                    'tw-bg-gray-300 hover:tw-bg-gray-400'}
                                    tw-p-1 tw-rounded tw-mx-1`}
                        name="rol"
                        value={'funcionario'}
                        type="button"
                        onClick={() => handleChangeRol('funcionario')}>
                        Administrador
                    </button>
                    <button
                        className={`${form.rol === 'planeacion' ?
                                    'tw-bg-red-300 hover:tw-bg-red-400':
                                    'tw-bg-gray-300 hover:tw-bg-gray-400'}
                                    tw-p-1 tw-rounded tw-mx-1`}
                        name="rol"
                        value={'planeacion'}
                        type="button"
                        onClick={() => handleChangeRol('planeacion')}>
                        Planeación
                    </button>
                    <button
                        className={`${form.rol === 'sectorialista' ?
                                    'tw-bg-red-300 hover:tw-bg-red-400':
                                    'tw-bg-gray-300 hover:tw-bg-gray-400'}
                                    tw-p-1 tw-rounded tw-mx-1`}
                        name="rol"
                        value={'sectorialista'}
                        type="button"
                        onClick={() => handleChangeRol('sectorialista')}>
                        Sectorialista
                    </button>
                </div>
                </div>
                <button type="submit"
                        className=' tw-bg-green-300 hover:tw-bg-green-400
                                    tw-py-2 tw-mb-4
                                    tw-rounded
                                    tw-w-full
                                    tw-grow'>
                    {loading ?
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    :   <p>Registrar funcionario</p>
                    }
                </button>
            </form>
        </div>
    );
}

/*

<p className={`${hasMayus ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {hasMayus ? '✓' : 'X'} Al menos una letra mayuscula
                    </p>
*/