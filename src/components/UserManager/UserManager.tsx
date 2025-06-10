import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { RegisterFormUser } from "@/components/Forms/RegisterFormUser";
import UserTable from "./UserTable";
import UserEditModal from "./UserEditModal";
import { User } from "@/interfaces";
import { thunkGetModulosUsuarioById, thunkGetUsersByPlan } from "@/store/pqrs/thunks";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";

export const UserManager = () => {
    const navigate = useNavigate();
    const { id_plan } = useAppSelector(store => store.content);
    const [selectedPanel, setSelectedPanel] = useState<'register' | 'edit' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const id_plan = Number(localStorage.getItem('id_plan'));
            dispatch(thunkGetUsersByPlan(id_plan))
                .unwrap()
                .then((result: any) => {
                    setUsers(result);
                })
                .catch((error: any) => {
                    console.error("Error al obtener usuarios:", error);
                });
        };
        fetchUsers();
    }, [dispatch]);

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
                const modulesAccess = Object.values(result[0]) as boolean[];
                setEditingUser({ ...user, modulesAccess });
            })
            .catch((error: any) => {
                console.error("Error al obtener Modulos:", error);
            });
    };

    const handleSaveUser = (updatedUser: User) => {
        setUsers(users.map(user => user.id_user === updatedUser.id_user ? updatedUser : user));
        setEditingUser(null);
    };

    const handleBack = () => navigate(-1); // función simple de regreso

    return (
        <div className="tw-container tw-mx-auto tw-p-4 tw-pt-12">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6 tw-w-full">
                <div className="tw-relative tw-flex tw-items-center tw-justify-center tw-mb-6">
                    <div className="tw-absolute tw-left-0">
                        <IconButton
                            aria-label="regresar"
                            size="small"
                            color="secondary"
                            onClick={handleBack}
                            title="Regresar"
                        >
                            <ArrowBackIos />
                        </IconButton>
                    </div>
                    <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">
                        Gestión de Usuarios
                    </h1>
                </div>


                <div className="tw-grid tw-grid-cols-2 tw-gap-8 tw-mb-6">
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
