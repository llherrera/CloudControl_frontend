import React, { useState, useRef, useEffect } from 'react';
import { User } from '@/interfaces';

import { useDispatch } from 'react-redux';
import { thunkUpdateUserData, thunkUpdateModulosUsuarioById, thunkUpdateUserRol } from '../../store/pqrs/thunks';
import { useAppDispatch } from '@/store';

interface UserEditModalProps {
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
    const [editedUser, setEditedUser] = useState<User>(user);
    const [searchOffice, setSearchOffice] = useState('');
    const [selectedOffice, setSelectedOffice] = useState(user.office);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const toggleModuleAccess = (index: number) => {
        const updatedModulesAccess = [...editedUser.modulesAccess];
        updatedModulesAccess[index] = !updatedModulesAccess[index];
        setEditedUser({ ...editedUser, modulesAccess: updatedModulesAccess });
    };

    const toggleActiveStatus = () => {
        setEditedUser({ ...editedUser, isActive: !editedUser.isActive });
    };

    const moduleNames = [
        'Plan Indicativo',
        'Plan De Accion',
        'Banco De Proyectos',
        'POAI',
        'Atencion Ciudadana',
        'Mapa De Intervencion'
    ];

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

    const handleOfficeSelect = (office: string) => {
        setSelectedOffice(office);
        setSearchOffice(office);
        setEditedUser({ ...editedUser, office });
        setIsDropdownVisible(false);
    };

    const handleInputFocus = () => {
        setIsDropdownVisible(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChangeRol = (value: string) => {
        setEditedUser({ ...editedUser, rol: value, office: '' });
        setSearchOffice('');
        setSelectedOffice('');
    };

    const handleSave = () => {
        if (editedUser.rol === 'funcionario' && !selectedOffice) {
            alert("Office is required for the role of Funcionario.");
            return;
        }

        const userToSave = {
            ...editedUser,
            office: selectedOffice || 'N/A' // Set office to 'N/A' if not selected
        };

        // Dispatch the thunk to update user data
        dispatch(thunkUpdateUserData({
            id_user: userToSave.id_user,
            office: userToSave.office,
            isActive: userToSave.isActive
        }));

        const convertModulesAccessToEndpointFormat = (modulesAccess: boolean[]) => {
            return {
                PlanIndicativo: modulesAccess[0] ? "1" : "0",
                PlanDeAccion: modulesAccess[1] ? "1" : "0",
                BancoDeProyectos: modulesAccess[2] ? "1" : "0",
                POAI: modulesAccess[3] ? "1" : "0",
                AtencionCiudadana: modulesAccess[4] ? "1" : "0",
                MapaDeIntervencion: modulesAccess[5] ? "1" : "0"
            };
        };
        
        const formattedModules = convertModulesAccessToEndpointFormat(userToSave.modulesAccess);

        // Dispatch the thunk to update user modules
        dispatch(thunkUpdateModulosUsuarioById({
            idUsuario: userToSave.id_user,
            modulos: formattedModules
        }));

        // Aquí puedes añadir el nuevo thunk que acabas de crear
        dispatch(thunkUpdateUserRol({
            id_user: userToSave.id_user,
            rol: userToSave.rol
        }));

        onSave(userToSave);
    };

    return (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-8 tw-w-3/4 md:tw-w-1/2 lg:tw-w-1/3">
                <h2 className="tw-text-2xl tw-font-bold tw-mb-6 tw-text-center">Editar Usuario</h2>
                <div className="tw-space-y-6">
                    <div className="tw-space-y-4">
                        <h3 className="tw-text-lg tw-font-semibold">Información Personal</h3>
                        <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleChange}
                            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded tw-bg-gray-50 tw-shadow-inner"
                            placeholder="Nombre"
                            disabled // Deshabilitar el campo de nombre
                        />
                        <input
                            type="text"
                            name="lastname"
                            value={editedUser.lastname}
                            onChange={handleChange}
                            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded tw-bg-gray-50 tw-shadow-inner"
                            placeholder="Apellido"
                            disabled // Deshabilitar el campo de apellido
                        />
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            disabled
                            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded tw-bg-gray-100 tw-shadow-inner"
                            placeholder="Correo Electrónico"
                        />
                    </div>
                    <div className="tw-space-y-4">
                        <h3 className="tw-text-lg tw-font-semibold">Rol y Oficina</h3>
                        <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-3 tw-mb-4">
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
                                        ${editedUser.rol === role.value
                                            ? 'tw-bg-blue-500 tw-text-white tw-shadow-md'
                                            : 'tw-bg-gray-100 tw-text-gray-700 hover:tw-bg-gray-200'}`}>
                                    {role.label}
                                </button>
                            ))}
                        </div>
                        {editedUser.rol === 'funcionario' && (
                            <div className="tw-relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    value={searchOffice}
                                    onChange={(e) => setSearchOffice(e.target.value)}
                                    onFocus={handleInputFocus}
                                    placeholder="Buscar oficina..."
                                    className="tw-w-full tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-mb-2 tw-bg-gray-50 tw-shadow-inner"
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
                    </div>
                    <div className="tw-space-y-4">
                        <h3 className="tw-text-lg tw-font-semibold">Acceso a Módulos</h3>
                        <div className="tw-flex tw-flex-wrap tw-gap-2 tw-justify-center">
                            {editedUser.modulesAccess.map((access, index) => (
                                <button
                                    key={index}
                                    onClick={() => toggleModuleAccess(index)}
                                    className={`tw-px-3 tw-py-1 tw-rounded tw-border tw-text-sm ${
                                        access ? 'tw-bg-green-500 tw-text-white' : 'tw-bg-gray-200 tw-text-gray-700'
                                    }`}
                                >
                                    {moduleNames[index]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={toggleActiveStatus}
                        className={`tw-w-full tw-px-3 tw-py-2 tw-rounded tw-text-white ${
                            editedUser.isActive ? 'tw-bg-green-500' : 'tw-bg-red-500'
                        }`}
                    >
                        {editedUser.isActive ? 'Activar Usuario' : 'Desactivar'}
                    </button>
                </div>
                <div className="tw-flex tw-justify-end tw-mt-6">
                    <button
                        onClick={onClose}
                        className="tw-bg-gray-300 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded tw-mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserEditModal;