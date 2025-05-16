import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Input, BackBtn } from "@/components";
import { doRegister } from "@/services/api";
import { RegisterInterface, IdProps } from "@/interfaces";
import { validateEmail, notify, parseErrorAxios } from "@/utils";

import { Box, CircularProgress } from '@mui/material';
import { log } from "util";

export const RegisterFormUser = ({ id }: IdProps) => {
    const navigate = useNavigate();

    // Add this near the top with other state declarations
    const [searchOffice, setSearchOffice] = useState('');
    const [selectedOffice, setSelectedOffice] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // New state for dropdown visibility
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

    const min = 6, max = 16;
    const [loading, setLoading] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [noHasSpace, setNoHasSpace] = useState(false);
    // Update the initial form state
    const [form, setForm] = useState<RegisterInterface>({
        id_user: 0,
        username: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: '',
        rol: 'sectorialista',
        office: ''  // Add this field
    });

    // Update submitForm validation
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validatePassword(form.password))
            return notify('La contraseña no cunple los requerimientos', 'warning');
        if (form.password !== form.confirm_password)
            return notify("Las contraseñas no coinciden", 'warning');
        if (form.username === '' || form.lastname === '' ||
            form.email === '' || form.password === '')
            return notify("Por favor llene todos los campos", 'warning');
        if (form.rol === 'funcionario' && !form.office) {
            return notify("Por favor seleccione una oficina", 'warning');
        }
        if (!validateEmail(form.email))
            return notify("El correo no es válido");
        try {
            setLoading(true);
            await doRegister(id, form);
            notify('Usuario registrado correctamente', 'success');
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                try {
                    await doRegister(id, form);  
                } catch (error) {
                    const error_ = parseErrorAxios(error);
                    if (error_.error_description === 'User already register') notify('Usuario ya registrado', 'error')
                    else notify('Ha ocurrido un error, vuelva a intentar mas tarde', 'error');
                }
            } else {
                let msgError = err.response.data['msg'];
                if (msgError.includes('already')) notify(`Error al registrar usuario: Usuario ya registrado`, 'error');
                else notify(`Error al registrar usuario: ${err.message}`, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const offices = [
        "Almacenista", "Apoyo Almacén", "Apoyo Desarr. Comunitario", "Apoyo Famiacción 1",
        "Apoyo Famiacción 2", "Apoyo Famiacción 3", "Apoyo Recepción", "Apoyo Rural 1",
        "Apoyo Rural 3", "Apoyo Spc 1", "Apoyo Spc 2", "Apoyo Spc 3", "Apoyo Spc 4",
        "Apoyo Spc 8", "Apoyo 1 - Fredy", "Apoyo 2 - Orlando", "Apoyo 3 - Angela",
        "Apoyo 4 - Katherine", "Apoyo 5 - Jimmy", "Apoyo 6 - Cabrejo", "Apoyo 7 - Yate",
        "Atencion Pqrs Salud", "Auditoria", "Adulto Mayor", "Banco De Proyectos",
        "Biblioteca Darío Echandía Olaya", "Biblioteca Darío Vidales", "Campamento Municipal",
        "Cis", "Coactivo", "Comisaria De Familia", "Contabilidad", "Contratacion 1",
        "Contratacion 2", "Contratacion 3", "Conductores Contratistas", "Control Interno",
        "Coord. Casa Cultura", "Coord. Casa Lúdica", "Coord. Desarr. Comunitario",
        "Copasst", "Corregidores", "Deportes", "Despacho Alcalde", "Despacho Dls",
        "Despacho Ejecutivo", "Despacho Gobierno", "Despacho Hacienda", "Despacho Planeación",
        "Despacho Rural", "Eléctrico Contratista", "Enlace Familias En Acción",
        "Estratificación", "Gestion Documental", "Inspección De Policía", "Mensajero",
        "Pagaduría", "Presupuesto", "Pvd Biblioteca", "Pvd Medalla Milagrosa", "Recaudo",
        "Recepcion Alcalde", "Recepcion Ejecutivo", "Recepcion Gobierno", "Recepcion Planeación",
        "Recepción Cri", "Recepción Dls", "Recepción Hacienda", "Regimen Subsidiado",
        "Servicios Administrativos", "Sistemas Y Tic", "Tesorería", "Trabajadores Oficiales",
        "Vent. Unica"
    ];

    // Add this function with other handlers
    const handleOfficeSelect = (office: string) => {
        setSelectedOffice(office);
        setSearchOffice(office);
        setForm({ ...form, office });
        setIsDropdownVisible(false); // Hide dropdown after selection
    };

    const handleInputFocus = () => {
        setIsDropdownVisible(true); // Show dropdown on input focus
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false); // Hide dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (event:
        React.ChangeEvent<HTMLInputElement |
            HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name == 'password') {
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-\\/]/.test(value);
            const noHasSpace = !/\s/.test(value);
            setHasNumber(hasNumber);
            setHasSpecialChar(hasSpecialChar);
            setNoHasSpace(noHasSpace);
        }

        setForm({ ...form, [name]: value });
    };

    const validatePassword = (password: string) => {
        if (password.length >= min && password.length <= max) {
            if (hasNumber && hasSpecialChar && noHasSpace) return true;
            else return false;
        } else {
            return false;
        }
    };

    // Update handleChangeRol to reset office when changing roles
    const handleChangeRol = (value: string) => {
        setForm({ ...form, rol: value, office: '' });
        setSearchOffice('');
        setSelectedOffice('');
    };

    return (
        <div className="tw-flex tw-justify-center tw-my-8">
            <form onSubmit={submitForm}
                className="tw-w-full tw-max-w-md tw-px-8 tw-py-6 
                            tw-bg-white tw-rounded-xl tw-shadow-xl 
                            tw-border tw-border-gray-100">
                <h1 className="tw-text-2xl tw-font-bold tw-text-center 
                              tw-text-gray-800 tw-mb-8">
                    Registrar Funcionario
                </h1>
                <div className="tw-flex tw-flex-col tw-gap-4">
                    <Input label={"Usuario"}
                        type={"text"}
                        id={"username"}
                        name={"username"}
                        onChange={event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2" />
                    <Input label={"Apellido"}
                        type={"text"}
                        id={"lastname"}
                        name={"lastname"}
                        onChange={event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2" />
                    <Input label={"Correo"}
                        type={"text"}
                        id={"email"}
                        name={"email"}
                        onChange={event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2" />
                    <Input label={"Contraseña"}
                        type={"password"}
                        id={"password"}
                        name={"password"}
                        onChange={event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2" />
                    <Input label={"Confirmar Contraseña"}
                        type={"password"}
                        id={"confirm_password"}
                        name={"confirm_password"}
                        onChange={event => handleInputChange(event)}
                        center={true}
                        classname="tw-justify-between tw-gap-2" />

                    <div className="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-mb-4">
                        <h2 className="tw-font-semibold tw-mb-2 tw-text-gray-700">
                            Requerimientos de la contraseña:
                        </h2>
                        <div className="tw-space-y-2">
                            <p className={`tw-flex tw-items-center tw-gap-2 ${form.password.length >= min && form.password.length <= max ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                <span className="tw-text-lg">{form.password.length >= min && form.password.length <= max ? '✓' : '×'}</span>
                                Entre 6 y 16 caracteres
                            </p>
                            <p className={`tw-flex tw-items-center tw-gap-2 ${hasNumber ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                <span className="tw-text-lg">{hasNumber ? '✓' : '×'}</span>
                                Al menos un número
                            </p>
                            <p className={`tw-flex tw-items-center tw-gap-2 ${hasSpecialChar ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                <span className="tw-text-lg">{hasSpecialChar ? '✓' : '×'}</span>
                                Al menos un caracter especial
                            </p>
                            <p className={`tw-flex tw-items-center tw-gap-2 ${noHasSpace ? 'tw-text-green-600' : 'tw-text-red-500'}`}>
                                <span className="tw-text-lg">{noHasSpace ? '✓' : '×'}</span>
                                No espacios
                            </p>
                        </div>
                    </div>

                    <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-3 tw-mb-6">
                        {[
                            { value: 'funcionario', label: 'Funcionario' },
                            { value: 'planeacion', label: 'Planeación' },
                            { value: 'sectorialista', label: 'Sectorialista' },
                            { value: 'administrador', label: 'Administrador' }
                        ].map((role) => (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() => handleChangeRol(role.value)}
                                className={`tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-all
                                    ${form.rol === role.value
                                        ? 'tw-bg-blue-500 tw-text-white tw-shadow-md'
                                        : 'tw-bg-gray-100 tw-text-gray-700 hover:tw-bg-gray-200'}`}>
                                {role.label}
                            </button>
                        ))}
                    </div>
                    {form.rol === 'funcionario' && (
                        <div className="tw-relative" ref={dropdownRef}>
                            <input
                                type="text"
                                value={searchOffice}
                                onChange={(e) => setSearchOffice(e.target.value)}
                                onFocus={handleInputFocus} // Show dropdown on focus
                                placeholder="Buscar oficina..."
                                className="tw-w-full tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-mb-2"
                            />
                            {isDropdownVisible && searchOffice && (
                                <div className="tw-absolute tw-z-10 tw-w-full tw-max-h-60 tw-overflow-y-auto 
                                              tw-bg-white tw-border tw-rounded-lg tw-shadow-lg">
                                    {offices
                                        .filter(office =>
                                            office.toLowerCase().includes(searchOffice.toLowerCase()))
                                        .map(office => (
                                            <button
                                                key={office}
                                                type="button"
                                                onClick={() => handleOfficeSelect(office)}
                                                className={`tw-w-full tw-text-left tw-px-4 tw-py-2 hover:tw-bg-gray-100
                                ${selectedOffice === office ? 'tw-bg-blue-50' : ''}`}
                                            >
                                                {office}
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="tw-bg-green-500 hover:tw-bg-green-600 
                                 tw-text-white tw-font-semibold
                                 tw-py-3 tw-rounded-lg tw-shadow-md
                                 tw-transition-all tw-duration-200">
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress size={24} color="inherit" />
                            </Box>
                        ) : (
                            <span>Registrar Funcionario</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
