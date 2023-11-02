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

    const [form, setForm] = useState<RegisterInterface>({
        usuario: '',
        apellido: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
        rol: 'funcionario'
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (form.contraseña !== form.confirmarContraseña) {
            alert("Las contraseñas no coinciden");
            return;
        }
        doRegister(props.id, form)
            .then((res) => {
                navigate(`/pdt/${props.id}`, { replace: true})
            })
            .catch((err) => {
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
                <button type="submit"
                        className=' tw-bg-green-300 
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