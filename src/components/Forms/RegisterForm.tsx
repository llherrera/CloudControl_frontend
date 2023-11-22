import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Input } from "../Inputs";
import { doRegister } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { RegisterInterface } from "../../interfaces";

interface Props {
    id: number;
}

export const RegisterForm = (props: Props) => {
    const navigate = useNavigate();

    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    const [form, setForm] = useState<RegisterInterface>({
        usuario: '',
        apellido: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
        rol: 'sectorialista'
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    const handleChangeRol = (value: string) => {
        setForm({ ...form, ['rol']: value });
    }

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (form.contraseña !== form.confirmarContraseña) return alert("Las contraseñas no coinciden");
        if (form.usuario === '' || form.apellido === '' || form.correo === '' || form.contraseña === '') return alert("Por favor llene todos los campos");
        if (!regexp.test(form.correo)) return alert("El correo no es válido");
        doRegister(props.id, form)
            .then(() => {
                navigate(`/pdt/${props.id}`, { replace: true})
            })
            .catch(() => {
                alert("Error al registrar usuario");
            })
    }

    const backIconButton = () => {
        return (
            <IconButton aria-label="delete"
                        size="small"
                        color="secondary"
                        onClick={()=>navigate(-1)}
                        title="Regresar">
                <ArrowBackIosIcon/>
            </IconButton>
        )
    }

    return (
        <div className="tw-flex tw-justify-center">
            <div className="tw-float">
                {backIconButton()}
            </div>
            <form onSubmit={submitForm}>
                <h1 className="tw-mb-4 tw-grow tw-text-center tw-text-xl">Registrar funcionario</h1>
                <Input  label={"Usuario"}
                        type={"text"}
                        id={"usuario"}
                        name={"usuario"}
                        value={form.usuario}
                        onChange={ (event) => handleInputChange(event)}/><br />
                <Input  label={"Apellido"}
                        type={"text"}
                        id={"apellido"}
                        name={"apellido"}
                        value={form.apellido}
                        onChange={ (event) => handleInputChange(event)}/><br />
                <Input  label={"Correo"}
                        type={"text"}
                        id={"correo"}
                        name={"correo"}
                        value={form.correo}
                        onChange={ (event) => handleInputChange(event)}/><br />
                <Input  label={"Contraseña"}
                        type={"password"}
                        id={"contraseña"}
                        name={"contraseña"}
                        value={form.contraseña}
                        onChange={ (event) => handleInputChange(event)}/><br />
                <Input  label={"Confirmar Contraseña"}
                        type={"password"}
                        id={"confirmarContraseña"}
                        name={"confirmarContraseña"}
                        value={form.confirmarContraseña}
                        onChange={ (event) => handleInputChange(event)}/><br /> 
                <div className="tw-flex tw-justify-center tw-mb-3">
                    <button
                        className={`${form.rol === 'funcionario' ? 'tw-bg-red-300 hover:tw-bg-red-400':'tw-bg-gray-300 hover:tw-bg-gray-400'}
                                    tw-p-1 tw-rounded tw-mx-1`}
                        name="rol"
                        value={'funcionario'}
                        type="button"
                        onClick={()=>handleChangeRol('funcionario')}>Funcionario</button>
                    <button
                        className={`${form.rol === 'planeacion' ? 'tw-bg-red-300 hover:tw-bg-red-400':'tw-bg-gray-300 hover:tw-bg-gray-400'}
                                    tw-p-1 tw-rounded tw-mx-1`}
                        name="rol"
                        value={'planeacion'}
                        type="button"
                        onClick={()=>handleChangeRol('planeacion')}>Planeación</button>
                    <button
                        className={`${form.rol === 'sectorialista' ? 'tw-bg-red-300 hover:tw-bg-red-400':'tw-bg-gray-300 hover:tw-bg-gray-400'}
                                    tw-p-1 tw-rounded tw-mx-1`}
                        name="rol"
                        value={'sectorialista'}
                        type="button"
                        onClick={()=>handleChangeRol('sectorialista')}>Sectorialista</button>
                </div>
                <button type="submit"
                        className=' tw-bg-green-300 hover:tw-bg-green-400
                                    tw-py-2
                                    tw-rounded 
                                    tw-w-full
                                    tw-grow'>
                    Registrar funcionario
                </button>
            </form>
        </div>
    );
}