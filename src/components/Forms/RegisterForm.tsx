import React, { useState } from "react";
import { Input } from "../Inputs";
import { doRegister } from "../../services/api";
import { useNavigate } from "react-router-dom";

export const RegisterForm = (props: any) => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
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

    return (
        <form onSubmit={submitForm}>
            <h1>Registro</h1>
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
                    type={"text"}
                    id={"contraseña"}
                    name={"contraseña"}
                    value={form.contraseña}
                    onChange={ (event) => handleInputChange(event)}/><br />
            <Input  label={"Confirmar Contraseña"}
                    type={"text"}
                    id={"confirmarContraseña"}
                    name={"confirmarContraseña"}
                    value={form.confirmarContraseña}
                    onChange={ (event) => handleInputChange(event)}/><br />    
            <button type="submit"
                    className='bg-green-300 
                                px-3 py-2
                                rounded'>Registrarse</button>
        </form>
    );
}