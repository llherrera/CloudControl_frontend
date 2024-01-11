import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Input } from "../Inputs";
import { doRegister } from "../../services/api";
import { RegisterInterface, RegisterFormProps } from "@/interfaces";
import { validateEmail } from "@/utils";

export const RegisterForm = (props: RegisterFormProps) => {
    const navigate = useNavigate();

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
        setForm({ ...form, [name]: value });
    };

    const handleChangeRol = (value: string) => {
        setForm({ ...form, ['rol']: value });
    };

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (form.password !== form.confirm_password) 
            return alert("Las contraseñas no coinciden");
        if (form.username === '' || form.lastname === '' || 
            form.email === '' || form.password === '') 
            return alert("Por favor llene todos los campos");
        if (!validateEmail(form.email)) 
            return alert("El correo no es válido");
        doRegister(props.id, form)
        .then(() => {
            navigate(`/pdt/PlanIndicativo`, {replace: true})
        })
        .catch(() => {
            alert("Error al registrar usuario");
        })
    };

    const backIconButton = () => {
        return (
            <IconButton aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={()=>navigate(-1)}
                        title="Regresar">
                <ArrowBackIosIcon/>
            </IconButton>
        );
    }

    return (
        <div className="tw-flex tw-justify-center tw-my-4">
            <div className="tw-float">
                {backIconButton()}
            </div>
            <form   onSubmit={submitForm}
                    className=" tw-px-10 tw-shadow-2xl
                                tw-rounded ">
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
                <Input  label={"Contraseña"}
                        type={"password"}
                        id={"password"}
                        name={"password"}
                        onChange={(event)=>handleInputChange(event)}/>
                <Input  label={"Confirmar Contraseña"}
                        type={"password"}
                        id={"confirm_password"}
                        name={"confirm_password"}
                        onChange={(event)=>handleInputChange(event)}/>
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
                    Registrar funcionario
                </button>
            </form>
        </div>
    );
}