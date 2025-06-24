import React, { useState, useRef } from "react";
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

    // Estado para importación/exportación
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importMode, setImportMode] = useState<'overwrite' | 'add' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Exportar CSV
    const handleExportCSV = () => {
        const headers = ["name", "email", "phone"];
        // Usar los datos actuales del store si existen, si no, el estado local
        const exportData = secretaries && secretaries.length > 0 ? secretaries : data;
        const rows = exportData.map(sec => [sec.name, sec.email, sec.phone]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "secretarias.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Descargar plantilla CSV
    const handleDownloadTemplate = () => {
        const headers = ["name", "email", "phone"];
        const examples = [
            ["Nombre Ejemplo", "correo@ejemplo.com", "3001234567"],
            ["Ana Torres", "ana.torres@ejemplo.com", "3109876543"],
            ["Luis Pérez", "luis.perez@ejemplo.com", "3204567890"],
            ["María Gómez", "maria.gomez@ejemplo.com", "3012345678"],
            ["Carlos Ruiz", "carlos.ruiz@ejemplo.com", "3156789012"],
        ];
        const csvContent = [headers, ...examples].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "plantilla_secretarias.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Importar CSV (solo base visual y lectura de archivo)
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setImportFile(file);
            setShowImportConfirm(true);
        }
    };
    const handleImportConfirm = async (mode: 'overwrite' | 'add') => {
        if (!importFile) return;

        try {
            const text = await importFile.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            if (lines.length < 2) {
                notify("El archivo CSV debe tener al menos una fila de datos", "error");
                return;
            }

            // Verificar que la primera línea sea el header correcto
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const expectedHeaders = ['name', 'email', 'phone'];
            
            if (!expectedHeaders.every(header => headers.includes(header))) {
                notify("El archivo CSV debe tener las columnas: name, email, phone", "error");
                return;
            }

            // Parsear las filas de datos
            const importedSecretaries: Secretary[] = [];
            const errors: string[] = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                
                if (values.length < 3) {
                    errors.push(`Fila ${i + 1}: Datos incompletos`);
                    continue;
                }

                const [name, email, phone] = values;

                // Validaciones
                if (!name || name === '') {
                    errors.push(`Fila ${i + 1}: Nombre requerido`);
                    continue;
                }

                if (!email || !validateEmail(email)) {
                    errors.push(`Fila ${i + 1}: Email inválido`);
                    continue;
                }

                const phoneNumber = parseInt(phone);
                if (isNaN(phoneNumber) || phoneNumber <= 0) {
                    errors.push(`Fila ${i + 1}: Teléfono inválido`);
                    continue;
                }

                importedSecretaries.push({
                    id_plan,
                    name,
                    email,
                    phone: phoneNumber
                });
            }

            if (errors.length > 0) {
                notify(`Errores encontrados:\n${errors.join('\n')}`, "error");
                return;
            }

            if (importedSecretaries.length === 0) {
                notify("No se encontraron datos válidos para importar", "warning");
                return;
            }

            // Actualizar el estado según el modo
            if (mode === 'overwrite') {
                setData(importedSecretaries);
                notify(`Se importaron ${importedSecretaries.length} secretarias (modo sobrescribir)`, "success");
            } else {
                // Modo agregar: combinar con datos existentes
                const existingData = secretaries && secretaries.length > 0 ? secretaries : data;
                const combinedData = [...existingData, ...importedSecretaries];
                setData(combinedData);
                notify(`Se agregaron ${importedSecretaries.length} secretarias a la lista existente`, "success");
            }

        } catch (error) {
            notify("Error al leer el archivo CSV", "error");
            console.error('Error importing CSV:', error);
        }

        // Limpiar el estado
        setShowImportConfirm(false);
        setImportFile(null);
        setImportMode(null);
    };
    const handleImportCancel = () => {
        setShowImportConfirm(false);
        setImportFile(null);
        setImportMode(null);
    };

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
            <div className="tw-w-2/3">
                <form className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-p-6 tw-w-full tw-my-12">
                    <h2 className="tw-text-xl tw-font-bold tw-text-center tw-mb-6 text-gray-700">
                        Secretarias
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
                {/* Panel de exportar/importar mejorado debajo del formulario */}
                <div className="tw-bg-white tw-shadow-md tw-rounded-xl tw-p-6 tw-mb-8 tw-border tw-border-gray-200">
                    <div className="tw-mb-3">
                        <div className="tw-flex tw-items-center tw-mb-1">
                            <span className="tw-text-xl tw-font-bold tw-text-gray-700">Cargue de datos</span>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="tw-text-blue-400 tw-ml-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                        </div>
                        <p className="tw-text-gray-500 tw-text-sm tw-mt-1">
                            Utiliza esta herramienta para exportar la lista de secretarias a un archivo CSV o importar nuevas secretarias desde un archivo CSV. Puedes elegir si deseas sobrescribir los datos actuales o agregarlos a la lista existente.
                        </p>
                    </div>
                    <div className="tw-flex tw-gap-4 tw-mt-6">
                        <button
                            type="button"
                            onClick={handleDownloadTemplate}
                            className="tw-bg-amber-500 hover:tw-bg-amber-600 tw-text-white tw-font-semibold tw-py-3 tw-rounded-lg tw-shadow-sm tw-transition-colors tw-w-1/3"
                        >
                            Descargar plantilla
                        </button>
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            className="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-font-semibold tw-py-3 tw-rounded-lg tw-shadow-sm tw-transition-colors tw-w-1/3"
                        >
                            Exportar CSV
                        </button>
                        <button
                            type="button"
                            onClick={handleImportClick}
                            className="tw-bg-gray-500 hover:tw-bg-gray-600 tw-text-white tw-font-semibold tw-py-3 tw-rounded-lg tw-shadow-sm tw-transition-colors tw-w-1/3"
                        >
                            Importar CSV
                        </button>
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                {/* Panel de confirmación de importación al final */}
                {showImportConfirm && importFile && (
                    <div className="tw-bg-white tw-shadow-lg tw-rounded-xl tw-p-6 tw-mb-6 tw-border tw-border-gray-300">
                        <div className="tw-mb-4 tw-text-center">
                            <p className="tw-font-semibold tw-mb-2">¿Cómo deseas importar el archivo <span className='tw-text-blue-600'>{importFile.name}</span>?</p>
                            <p className="tw-text-sm tw-text-gray-600">Puedes sobrescribir los datos actuales o agregar los nuevos a la lista existente.</p>
                        </div>
                        <div className="tw-flex tw-justify-center tw-gap-4">
                            <button
                                type="button"
                                onClick={() => handleImportConfirm('overwrite')}
                                className="tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg"
                            >
                                Sobrescribir
                            </button>
                            <button
                                type="button"
                                onClick={() => handleImportConfirm('add')}
                                className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg"
                            >
                                Agregar
                            </button>
                            <button
                                type="button"
                                onClick={handleImportCancel}
                                className="tw-bg-gray-400 hover:tw-bg-gray-500 tw-text-white tw-font-semibold tw-px-4 tw-py-2 tw-rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
