import { User } from '@/interfaces';
import React, { useState, useEffect } from 'react';
import { thunkGetUsersByPlan } from '@/store/pqrs/thunks';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/store';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void; // Add a prop for handling edit actions
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10); // State for users per pa


    // Calculate the indices for the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Calculate total pages
    const totalPages = Math.ceil(users.length / usersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleUsersPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUsersPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when changing users per page
    };

    return (
        <div>
            <table className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow-md tw-table-auto">
                <thead>
                    <tr className="tw-bg-gray-200">
                        <th className="tw-px-4 tw-py-2 tw-text-center">ID</th>
                        <th className="tw-px-4 tw-py-2 tw-text-center">Oficina</th>
                        <th className="tw-px-4 tw-py-2 tw-text-center">Activo</th>
                        <th className="tw-px-4 tw-py-2 tw-text-center">Nombre</th>
                        <th className="tw-px-4 tw-py-2 tw-text-center">Apellido</th>
                        <th className="tw-px-4 tw-py-2 tw-text-center">Correo</th>
                        <th className="tw-px-4 tw-py-2 tw-text-center">Rol</th>
                        <th className="tw-px-4 tw-py-2 tw-text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id_user} className="tw-border-b">
                            <td className="tw-px-4 tw-py-2 tw-text-center">{user.id_user}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-center">{user.office}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-center">{user.isActive ? 'Sí' : 'No'}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-center">{user.name}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-center">{user.lastname}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-center">{user.email}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-center">{user.rol}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-center">
                                <button
                                    onClick={() => onEdit(user)}
                                    className="tw-bg-blue-500 tw-text-white tw-px-3 tw-py-1 tw-rounded tw-shadow hover:tw-bg-blue-600"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="tw-flex tw-justify-between tw-mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="tw-bg-gray-300 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded tw-mr-2 disabled:tw-opacity-50"
                >
                    Anterior
                </button>
                <span className="tw-text-center tw-px-4 tw-py-2">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="tw-bg-gray-300 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded tw-ml-2 disabled:tw-opacity-50"
                >
                    Siguiente
                </button>
            </div>
            <div className="tw-flex tw-justify-end tw-mt-4">
                <span className="tw-mr-2">Usuarios por página:</span>
                <select
                    value={usersPerPage}
                    onChange={handleUsersPerPageChange}
                    className="tw-border tw-rounded tw-px-2 tw-py-1"
                >
                    {[5, 10, 20, 50].map((number) => (
                        <option key={number} value={number}>
                            {number}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default UserTable;