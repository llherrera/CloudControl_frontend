import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { RegisterFormUser } from "@/components/Forms/RegisterFormUser";
import UserTable from "./UserTable";
import UserEditModal from "./UserEditModal";
import { User } from "@/interfaces";
import { thunkGetModulosUsuarioById, thunkGetUsersByPlan } from "@/store/pqrs/thunks";

export const UserManager = () => {
    const { id_plan } = useAppSelector(store => store.content);
    const [selectedPanel, setSelectedPanel] = useState<'register' | 'edit' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            const id_plan = 6031;
            dispatch(thunkGetUsersByPlan(id_plan))
                .unwrap()
                .then((result: any) => {
                    setUsers(result); // Actualiza el estado con los usuarios obtenidos
                })
                .catch((error: any) => {
                    console.error("Error al obtener usuarios:", error);
                });
        };
        fetchUsers();
    }, [dispatch]);

    // Initialize users state with useState
    const [users, setUsers] = useState<User[]>([]);

    const handlePanelChange = (panel: 'register' | 'edit' | null) => {
        setIsAnimating(true);
        setSelectedPanel(panel);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleEditUser = (user: User) => {
        const userID = user.id_user;
        dispatch(thunkGetModulosUsuarioById(userID))
            .unwrap()
            .then((result: any) => {
                // Convertir el objeto en un arreglo de booleanos
                const modulesAccess = Object.values(result[0]) as boolean[];
                // Actualizar el usuario en edición con el nuevo campo modulesAccess
                setEditingUser({ ...user, modulesAccess });
            })
            .catch((error: any) => {
                console.error("Error al obtener Modulos:", error);
            });
    };

    const handleSaveUser = (updatedUser: User) => {
        setUsers(users.map(user => user.id_user === updatedUser.id_user ? updatedUser : user));
        setEditingUser(null);
        // Optionally, make an API call to save changes
    };

    return (
        <div className="tw-container tw-mx-auto tw-p-4">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6 tw-max-w-5xl tw-mx-auto">
                <h1 className="tw-text-2xl tw-font-bold tw-text-center tw-text-gray-800 tw-mb-6">
                    Gestión de Usuarios
                </h1>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-6">
                    <button
                        onClick={() => handlePanelChange(selectedPanel === 'edit' ? null : 'edit')}
                        className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold tw-text-center
                            tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-shadow-lg
                            ${selectedPanel === 'edit'
                                ? 'tw-bg-green-500 tw-text-white tw-scale-105 tw-shadow-md'
                                : 'tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300'}`}
                    >
                        Editar Usuarios
                    </button>

                    <button
                        onClick={() => handlePanelChange(selectedPanel === 'register' ? null : 'register')}
                        className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold tw-text-center
                            tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-shadow-lg
                            ${selectedPanel === 'register'
                                ? 'tw-bg-green-500 tw-text-white tw-scale-105 tw-shadow-md'
                                : 'tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300'}`}
                    >
                        Registrar Usuario
                    </button>
                </div>

                <div className="tw-relative tw-overflow-hidden">
                    <div className={`tw-transition-all tw-duration-300 tw-ease-in-out
                        ${selectedPanel ? 'tw-max-h-[2000px] tw-opacity-100' : 'tw-max-h-0 tw-opacity-0'}
                        ${isAnimating ? 'tw-blur-[1px]' : ''}`}>

                        <div className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out
                            ${selectedPanel === 'edit' ? 'tw-translate-x-0 tw-relative' : 'tw-translate-x-full tw-absolute tw-inset-0'}
                            ${!selectedPanel ? 'tw-hidden' : ''}`}>
                            <div className="tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-shadow-inner">
                                <UserTable users={users} onEdit={handleEditUser} />
                            </div>
                        </div>

                        <div className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out
                            ${selectedPanel === 'register' ? 'tw-translate-x-0 tw-relative' : 'tw-translate-x-full tw-absolute tw-inset-0'}
                            ${!selectedPanel ? 'tw-hidden' : ''}`}>
                            <div className="tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-shadow-inner">
                                <RegisterFormUser id={id_plan} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editingUser && (
                <UserEditModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};