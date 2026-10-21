import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/store";
import { thunkAddLevel } from "@/store/plan/thunks";

import { FileInput, BackBtn } from "@/components/Citizen";
import { LevelInterface, LevelFormProps } from "@/interfaces";
import { getToken, decode } from "@/utils";

// Modernized, reordered and styled LevelForm — fields under labels
export const LevelForm = ( props: LevelFormProps ) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [levels, setLevels] = useState<LevelInterface[]>([
        { name: "", description: "" },
        { name: "", description: "" },
        { name: "", description: "" }
    ]);

    const [role, setRole] = useState<string>("");
    const [idPlan, setIdPlan] = useState<number>(0);
    const [saving, setSaving] = useState(false);

    // Run once on mount to decode token
    useEffect(() => {
        const token_info = getToken();
        try {
            if (!token_info) return;
            const { token } = token_info;
            if (token) {
                const decoded = decode(token);
                setIdPlan(decoded.id_plan);
                setRole(decoded.rol);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    const addLevel = () => setLevels(prev => [...prev, { name: "", description: "" }]);

    const removeLevelAt = (index: number) => {
        if (levels.length <= 1) return;
        setLevels(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const { name, value } = event.target as HTMLInputElement;
        setLevels(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [name]: value };
            return copy;
        });
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await dispatch(thunkAddLevel({ id: props.id, levels })).unwrap();
            navigate(-1);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const canEdit = (role === "admin") || (role === 'funcionario' && idPlan === parseInt(props.id || '0'));

    return (
        <div className="tw-min-h-screen tw-py-8 tw-px-4 md:tw-px-8">
            <div className="tw-max-w-4xl tw-mx-auto">
                {/* Header: back button, title, save */}
                <header className="tw-flex tw-items-center tw-justify-between tw-gap-4 tw-mb-6">
                    <div className="tw-flex tw-items-center tw-gap-3">
                        <BackBtn handle={() => navigate(-1)} id={idPlan} />
                        <h1 className="tw-text-white tw-font-extrabold tw-text-xl md:tw-text-2xl">
                            Definir niveles del plan
                        </h1>
                    </div>

                    <div className="tw-flex tw-items-center tw-gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={!canEdit || saving}
                            aria-label="Guardar niveles"
                            className="tw-inline-flex tw-items-center tw-gap-2 tw-bg-blue-600 hover:tw-bg-blue-500 disabled:tw-opacity-50 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg tw-shadow"
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </header>

                {/* Card */}
                <div className="tw-border tw-border-gray-700 tw-rounded-2xl tw-p-6 tw-shadow-lg tw-bg-white tw-text-black">

                    {/* File input row */}
                    <div className="tw-mb-6">
                        <FileInput />
                    </div>

                    {canEdit ? (
                        <form className="tw-grid tw-gap-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <ul className="tw-grid tw-gap-4">
                                {levels.map((lvl, i) => (
                                    <li
                                        key={i}
                                        className="tw-p-4 tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-lg tw-flex tw-flex-col md:tw-flex-row md:tw-items-start md:tw-gap-4"
                                    >
                                        <div className="tw-flex-1">
                                            {/* Label above field */}
                                            <label htmlFor={`name-${i}`} className="tw-block tw-text-sm tw-font-medium tw-mb-2">
                                                Nombre del Nivel
                                            </label>
                                            <input
                                                id={`name-${i}`}
                                                name="name"
                                                value={lvl.name}
                                                onChange={(e) => handleInputFormChange(e, i)}
                                                className="tw-w-full tw-text-black tw-bg-white tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2"
                                                type="text"
                                                placeholder="Escribe el nombre del nivel"
                                            />

                                            <label htmlFor={`description-${i}`} className="tw-block tw-text-sm tw-font-medium tw-mt-4 tw-mb-2">
                                                Descripción
                                            </label>
                                            <textarea
                                                id={`description-${i}`}
                                                name="description"
                                                value={lvl.description}
                                                onChange={(e) => handleInputFormChange(e, i)}
                                                className="tw-w-full tw-text-black tw-bg-white tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-min-h-[80px]"
                                                placeholder="Describe el nivel"
                                            />
                                        </div>

                                        <div className="tw-flex tw-flex-col tw-gap-2 tw-justify-start tw-items-center md:tw-items-end tw-ml-2">
                                            <button
                                                type="button"
                                                onClick={() => removeLevelAt(i)}
                                                aria-label={`Eliminar nivel ${i + 1}`}
                                                className="tw-bg-red-500 hover:tw-bg-red-400 tw-text-white tw-font-bold tw-px-3 tw-py-2 tw-rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Add / actions row */}
                            <div className="tw-flex tw-items-center tw-justify-between tw-gap-4 tw-pt-2">
                                <div>
                                    <button
                                        type="button"
                                        onClick={addLevel}
                                        title="Agregar un nuevo nivel"
                                        className="tw-inline-flex tw-items-center tw-gap-2 tw-bg-green-600 hover:tw-bg-green-500 tw-text-white tw-font-semibold tw-px-3 tw-py-2 tw-rounded"
                                    >
                                        + Agregar nivel
                                    </button>
                                </div>

                                <div className="tw-text-sm tw-text-gray-700">
                                    {levels.length} niveles
                                </div>
                            </div>

                        </form>
                    ) : (
                        <p className="tw-text-center tw-text-lg">Plan en proceso</p>
                    )}
                </div>

            </div>
        </div>
    );
}
