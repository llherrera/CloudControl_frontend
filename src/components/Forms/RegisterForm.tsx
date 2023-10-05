import React, { useState } from "react";
import { Input } from "../Inputs";

export const RegisterForm = () => {
    
    const [form, setForm] = useState({
        usuario: '',
        apellido: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    return (
        <form action="">
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
                    className=' bg-green-300 
                                px-3 py-2
                                rounded'>Registrarse</button>
        </form>
    );
}