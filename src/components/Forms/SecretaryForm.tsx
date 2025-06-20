import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { thunkAddSecretaries, thunkUpdateSecretaries, thunkGetSecretaries } from "@/store/plan/thunks";
import { Secretary } from "@/interfaces";
import { validateEmail, notify } from "@/utils";
import { Box, CircularProgress } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";

export const SecretaryForm = () => {
    const dispatch = useAppDispatch();
    const { secretaries, loadingSecretaries } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);
    const blankSecretary = { id_plan: id_plan, name: "", email: "", phone: 0 };
    const [data, setData] = useState<Secretary[]>(secretaries ?? [blankSecretary]);

    const addSecretary = () => {
        setData([...data, { ...blankSecretary }]);
    };

    const deleteSecretary = () => {
        if (data.length > 1) setData(data.slice(0, -1));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newData = [...data];
        newData[index] = { ...newData[index], [name]: name === "phone" ? Number(value) : value };
        setData(newData);
    };

    const handleSubmit = async () => {
        for (const secretary of data) {
            if (secretary.name === "" || secretary.email === "" || secretary.phone === 0) {
                return notify("Por favor llene todos los campos", "warning");
            }
            if (!validateEmail(secretary.email)) {
                return notify("El correo no es válido", "warning");
            }
        }
        if (secretaries) {
            dispatch(thunkUpdateSecretaries({ id_plan, secretaries: data }))
            .then(() => dispatch(thunkGetSecretaries(id_plan)));
        } else {
            dispatch(thunkAddSecretaries({ id_plan, secretaries: data }))
            .then(() => dispatch(thunkGetSecretaries(id_plan)));
        }
    };

    return (
        <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">
            <form className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-p-6 tw-w-2/3 tw-my-12">
                <h2 className="tw-text-xl tw-font-bold tw-text-center tw-mb-6 text-gray-700">
                    Añadir Secretarias
                </h2>

                <div className="tw-space-y-4">
                    {data.map((secretary, index) => (
                        <div key={index} className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-items-center tw-border tw-rounded-lg tw-p-4">
                            <div>
                                <label className="tw-block tw-text-sm tw-font-semibold text-gray-600">Nombre</label>
                                <input
                                    className="tw-w-full tw-mt-1 tw-p-2 tw-rounded tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                                    onChange={(e) => handleInputChange(e, index)}
                                    value={secretary.name}
                                    type="text"
                                    name="name"
                                    placeholder="Nombre"
                                />
                            </div>
                            <div>
                                <label className="tw-block tw-text-sm tw-font-semibold text-gray-600">Correo</label>
                                <input
                                    className="tw-w-full tw-mt-1 tw-p-2 tw-rounded tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                                    onChange={(e) => handleInputChange(e, index)}
                                    value={secretary.email}
                                    type="email"
                                    name="email"
                                    placeholder="Correo"
                                />
                            </div>
                            <div>
                                <label className="tw-block tw-text-sm tw-font-semibold text-gray-600">Teléfono</label>
                                <input
                                    className="tw-w-full tw-mt-1 tw-p-2 tw-rounded tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                                    onChange={(e) => handleInputChange(e, index)}
                                    value={secretary.phone}
                                    type="number"
                                    name="phone"
                                    placeholder="Teléfono"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="tw-flex tw-justify-between tw-mt-6">
                    <button
                        type="button"
                        onClick={addSecretary}
                        className="tw-flex tw-items-center tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg"
                    >
                        <Plus className="tw-mr-2" size={18} /> Añadir
                    </button>
                    <button
                        type="button"
                        onClick={deleteSecretary}
                        className="tw-flex tw-items-center tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg"
                    >
                        <Trash2 className="tw-mr-2" size={18} /> Eliminar
                    </button>
                </div>

                <div className="tw-mt-8 tw-flex tw-justify-center">
                    {loadingSecretaries ? (
                        <CircularProgress />
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="tw-bg-blue-600 hover:tw-bg-blue-500 tw-text-white tw-font-semibold tw-px-6 tw-py-2 tw-rounded-lg"
                        >
                            Guardar Secretarias
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
