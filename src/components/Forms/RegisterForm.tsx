import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input, BackBtn } from "@/components";
import { doRegister } from "@/services/api";
import { RegisterInterface, IdNumProps } from "@/interfaces";
import { validateEmail, notify } from "@/utils";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/configs/firebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const RegisterForm = ({id}: IdNumProps) => {
    const navigate = useNavigate();

    const min = 6, max = 16;
    const [loading, setLoading] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasMayus, setHasMayus] = useState(false);
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
            const hasMayus  = /[A-Z]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-\\/]/.test(value);
            const noHasSpace = !/\s/.test(value);
            setHasNumber(hasNumber);
            setHasMayus(hasMayus);
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
            if (hasNumber && hasMayus && hasSpecialChar && noHasSpace) return true;
            else return false;
        } else {
            return false;
        }
    }

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validatePassword(form.password))
            return notify('La contraseña no cunple los requerimientos');
        if (form.password !== form.confirm_password)
            return notify("Las contraseñas no coinciden");
        if (form.username === '' || form.lastname === '' || 
            form.email === '' || form.password === '')
            return notify("Por favor llene todos los campos");
        if (!validateEmail(form.email))
            return notify("El correo no es válido");
        setLoading(true);
        createUserWithEmailAndPassword(auth, form.email, form.password)
        .then(() => {
            doRegister(id, form)
            .then(() => {
                navigate(`/pdt/PlanIndicativo`, {replace: true})
            })
            .catch(err => {
                console.log(err);
                notify(`Error al registrar usuario: ${err.response.data.msg}`);
            })
            .finally(() => {
                setLoading(false);
            })
        })
        .catch(err => {
            notify(`Error al registrar usuario: ${err.response.data.msg}`);
        })
        .finally(() => {
            setLoading(false);
        })
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
                <div>
                <Input  label={"Usuario"}
                        type={"text"}
                        id={"username"}
                        name={"username"}
                        onChange={(event)=>handleInputChange(event)}/>
                <Input  label={"Apellido"}
                        type={"text"}
                        id={"lastname"}
                        name={"lastname"}
                        onChange={(event)=>handleInputChange(event)}/>
                <Input  label={"Correo"}
                        type={"text"}
                        id={"email"}
                        name={"email"}
                        onChange={(event)=>handleInputChange(event)}/>
                <Input
                    label={"Contraseña"}
                    type={"password"}
                    id={"password"}
                    name={"password"}
                    onChange={(event)=>handleInputChange(event)}/>
                <Input  label={"Confirmar Contraseña"}
                        type={"password"}
                        id={"confirm_password"}
                        name={"confirm_password"}
                        onChange={(event)=>handleInputChange(event)}/>
                <div className="tw-shadow tw-mb-3">
                    Requerimientos de la contraseña:
                    <p className={`${form.password.length >= min && form.password.length <= max ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {form.password.length >= min && form.password.length <= max ?
                        '✓' : 'X'} Entre 6 y 16 caracteres
                    </p>
                    <p className={`${hasMayus ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {hasNumber ? '✓' : 'X'} Al menos una letra mayuscula
                    </p>
                    <p className={`${hasNumber ? 'tw-text-green-400' : 'tw-text-red-400'}`}>
                        {hasMayus ? '✓' : 'X'} Al menos un número
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
                        onClick={()=>handleChangeRol('funcionario')}>
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
                        onClick={()=>handleChangeRol('planeacion')}>
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
                        onClick={()=>handleChangeRol('sectorialista')}>
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
                        <svg aria-hidden="true" className="tw-w-8 tw-h-8 tw-text-gray-200 tw-animate-spin dark:tw-text-gray-600 tw-fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    :   <p>Registrar funcionario</p>
                    }
                </button>
            </form>
        </div>
    );
}