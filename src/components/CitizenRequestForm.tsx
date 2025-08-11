import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { thunkGetServiciosByPlan, thunkAddServicio, thunkAddSolicitud, thunkAddServiciosBulk, thunkBuscarSolicitudesPorDocumento } from '@/store/pqrs/thunks';
import { decode } from '@/utils';
import { getPDTs } from '@/services/api';
import { FormData } from '@/interfaces/formInterfaces';

interface CitizenRequestFormProps {
    onNuevaSolicitud: (solicitud: FormData) => void;
}

const CitizenRequestForm: React.FC<CitizenRequestFormProps> = ({ onNuevaSolicitud }) => {
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        tipoDocumento: '',
        documento: '',
        genero: '',
        grupo: '',
        poblacional: '',
        otroPoblacional: '',
        discapacidad: '',
        otraDiscapacidad: '',
        escolaridad: '',
        otraEscolaridad: '',
        nacionalidad: 'COLOMBIA',
        telefono: '',
        correo: '',
        area: '',
        barrio: '',
        comuna: '',
        corregimiento: '',
        vereda: '',
        servicio: '',
        otroServicio: '',
        prioridad: 'Baja',
        tipoAtencion: '',
        modoAtencion: '',
        duracion: '',
        exclusividad: '',
        tipoUsuario: '',
        redireccionar: false,
        oficinaDestino: '',
        dependencia: '',
        funcionario: '',
        estado: 'pendiente',
        fechaResolucion: null,
        solicitudPadre: '',
        usuarioId: '',
        razonRedireccionamiento: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    type ServicioConfig = { nombre: string; tipo: 'N/A' | 'Valor' };
    const [servicios, setServicios] = useState<ServicioConfig[]>([]);
    const [loadingServicios, setLoadingServicios] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [configField, setConfigField] = useState<'servicios'>('servicios');
    const [editServicios, setEditServicios] = useState<ServicioConfig[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [newServicio, setNewServicio] = useState('');
    const dispatch = useAppDispatch();

    const { token_info } = useAppSelector(store => store.auth);

    const idPlanStr = localStorage.getItem('id_plan'); // Retorna string o null

    // Si quieres convertirlo a número y asegurarte de que exista:
    const idPlan_pdt = idPlanStr ? Number(idPlanStr) : null;

    const [id, setId] = useState(0);
    const [user, setUser] = useState('');
    const [rol, setRol] = useState('');
    const [idPlan, setIdPlan] = useState(0);
    const [forcedIdPlan, setForcedIdPlan] = useState<string>('');
    const [activeIdPlan, setActiveIdPlan] = useState<number>(idPlan_pdt || 0);
    const [planes, setPlanes] = useState<{ id_plan: number, name: string, department: string, description?: string }[]>([]);

    // Estado para el tipo de servicio cuando se selecciona 'Otro'
    const [otroTipo, setOtroTipo] = useState<'N/A' | 'Valor'>('N/A');




    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setId(decoded.id);
            setUser(decoded.user);
            setRol(decoded.rol);
            setIdPlan(decoded.id_plan);
            console.log('Token decodificado:', decoded);
        }
    }, []);

    useEffect(() => {
        console.log("[Servicios] useEffect ejecutado. activeIdPlan:", activeIdPlan);
    
        // Recuperar id_plan de localStorage si no hay activeIdPlan
        let planIdToUse = activeIdPlan || Number(localStorage.getItem('id_plan'));
    
        if (!planIdToUse) {
            console.warn("[Servicios] No se encontró ni activeIdPlan ni id_plan en localStorage. Se detiene la ejecución.");
            return;
        }
    
        console.log("[Servicios] Iniciando carga de servicios para el plan:", planIdToUse);
        setLoadingServicios(true);
    
        dispatch(thunkGetServiciosByPlan(planIdToUse))
            .unwrap()
            .then((res: any) => {
                console.log("[Servicios] Respuesta recibida del thunk:", res);
    
                let lista = Array.isArray(res) ? res : [];
                console.log("[Servicios] Lista inicial (validada como array):", lista);
    
                if (lista.length > 0 && typeof lista[0] === "object") {
                    console.log("[Servicios] Detectado formato de objetos con claves. Procesando mapeo...");
                    lista = lista.map((s: any) => ({
                        nombre: s.SERVICIO || s.nombre || s.name || s.servicio || s.value || "",
                        tipo: s.TIPO || "N/A"
                    }));
                } else {
                    console.log("[Servicios] Lista detectada como array de strings. Filtrando y mapeando...");
                    lista = lista
                        .filter((s: string) => s && s.toLowerCase() !== "otro")
                        .map((nombre: string) => ({ nombre, tipo: "N/A" }));
                }
    
                console.log("[Servicios] Lista final procesada:", lista);
                setServicios(lista);
            })
            .catch((err: any) => {
                console.error("[Servicios] Error al obtener servicios:", err);
            })
            .finally(() => {
                console.log("[Servicios] Carga de servicios finalizada.");
                setLoadingServicios(false);
            });
    }, [dispatch, activeIdPlan]);
    
    

    useEffect(() => {
        if (rol === 'admin') {
            getPDTs().then((res) => setPlanes(res)).catch(() => setPlanes([]));
        }
    }, [rol]);

    // Sincronizar editServicios cuando se abre el panel o cambia la lista
    useEffect(() => {
        if (showConfig && configField === 'servicios') {
            setEditServicios(servicios);
        }
    }, [showConfig, configField, servicios]);

    const handleEditServicio = (idx: number, value: string) => {
        setEditServicios(prev => prev.map((s, i) => i === idx ? { ...s, nombre: value } : s));
    };
    const handleEditTipoServicio = (idx: number, tipo: 'N/A' | 'Valor') => {
        setEditServicios(prev => prev.map((s, i) => i === idx ? { ...s, tipo } : s));
    };

    const handleSaveServicios = async () => {
        const serviciosLimpios = editServicios.filter(s => s.nombre.trim() !== '');
        const idPlanToUse = rol === 'admin' ? activeIdPlan : idPlan;
        setLoadingServicios(true);
        try {
            // Enviar el array de objetos {nombre, tipo} al backend
            await dispatch(thunkAddServiciosBulk({ id_plan: idPlanToUse, servicios: serviciosLimpios })).unwrap();
            setServicios(serviciosLimpios);
            setEditMode(false);
            setShowConfig(false);
        } catch (err) {
            alert('No se pudo guardar la lista de servicios.');
        } finally {
            setLoadingServicios(false);
        }
    };

    const handleAddServicio = () => {
        const value = newServicio.trim();
        // Por defecto, tipo 'N/A' al agregar
        if (value && !editServicios.some(s => s.nombre === value)) {
            setEditServicios(prev => [...prev, { nombre: value, tipo: 'N/A' }]);
            // Enviar al backend inmediatamente
            const idPlanToUse = rol === 'admin' ? activeIdPlan : idPlan;
            dispatch(thunkAddServicio({ SERVICIO: value, id_plan: idPlanToUse, tipo: 'N/A' }));
            setNewServicio('');
        }
    };
    const handleDeleteServicio = (idx: number) => {
        setEditServicios(prev => prev.filter((_, i) => i !== idx));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        // Obligatorios
        if (!formData.documento.trim()) newErrors.documento = 'El documento es obligatorio';
        else if (!/^\d+$/.test(formData.documento)) newErrors.documento = 'Solo números';
        else if (formData.documento.length < 5) newErrors.documento = 'Mínimo 5 dígitos';

        if (!formData.tipoDocumento) newErrors.tipoDocumento = 'El tipo de documento es obligatorio';
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!formData.genero) newErrors.genero = 'El género es obligatorio';
        if (!formData.grupo) newErrors.grupo = 'El grupo etario es obligatorio';
        if (!formData.poblacional) newErrors.poblacional = 'El grupo poblacional es obligatorio';
        if (formData.poblacional === 'Otros' && !formData.otroPoblacional?.trim()) newErrors.otroPoblacional = 'Debe especificar el grupo poblacional';
        if (!formData.discapacidad) newErrors.discapacidad = 'La discapacidad es obligatoria';
        if (formData.discapacidad === 'Otro' && !formData.otraDiscapacidad?.trim()) newErrors.otraDiscapacidad = 'Debe especificar la discapacidad';
        if (!formData.escolaridad) newErrors.escolaridad = 'La escolaridad es obligatoria';
        if (formData.escolaridad === 'Otro' && !formData.otraEscolaridad?.trim()) newErrors.otraEscolaridad = 'Debe especificar la escolaridad';
        if (!formData.nacionalidad) newErrors.nacionalidad = 'La nacionalidad es obligatoria';
        if (!formData.area) newErrors.area = 'El área es obligatoria';
        if (formData.area === 'Urbano' && !formData.barrio) newErrors.barrio = 'El barrio es obligatorio';
        if (formData.area === 'Rural' && !formData.vereda) newErrors.vereda = 'La vereda es obligatoria';
        if (!formData.servicio) newErrors.servicio = 'El servicio es obligatorio';
        if (formData.servicio === 'Otro' && !formData.otroServicio?.trim()) newErrors.otroServicio = 'Debe especificar el servicio';
        if (!formData.prioridad) newErrors.prioridad = 'La prioridad es obligatoria';
        if (!formData.tipoAtencion) newErrors.tipoAtencion = 'El tipo de atención es obligatorio';
        // Validaciones de formato
        if (formData.correo && !/^\S+@\S+\.\S+$/.test(formData.correo)) newErrors.correo = 'Correo inválido';
        if (formData.telefono && !/^\d+$/.test(formData.telefono)) newErrors.telefono = 'Solo números';
        if (formData.telefono && formData.telefono.length < 7) newErrors.telefono = 'Mínimo 7 dígitos';
        // Redirección
        if (formData.redireccionar) {
            if (!formData.razonRedireccionamiento?.trim()) newErrors.razonRedireccionamiento = 'Debe ingresar la razón de redireccionamiento';
            if (!formData.oficinaDestino) newErrors.oficinaDestino = 'Debe seleccionar la oficina de destino';
        }
        return newErrors;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('[CitizenRequestForm] Iniciando envío de solicitud...');

        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            console.warn('[CitizenRequestForm] Errores de validación encontrados:', validationErrors);
            return;
        }

        console.log('[CitizenRequestForm] Datos del formulario antes del procesamiento:', formData);

        // Si el usuario seleccionó 'Otro', agregar el nuevo servicio
        if (formData.servicio === 'Otro' && formData.otroServicio?.trim()) {
            const nuevoServicio = formData.otroServicio.trim();
            console.log('[CitizenRequestForm] Agregando nuevo servicio:', nuevoServicio);
            try {
                setLoadingServicios(true);
                const idPlanToUse = rol === 'admin' ? activeIdPlan : idPlan;
                // Buscar el tipo del nuevo servicio en la configuración
                const tipoNuevo = editServicios.find(s => s.nombre === nuevoServicio)?.tipo || 'N/A';
                await dispatch(thunkAddServicio({ SERVICIO: nuevoServicio, id_plan: idPlanToUse, tipo: tipoNuevo })).unwrap();
                console.log('[CitizenRequestForm] Nuevo servicio agregado exitosamente');
                setServicios(prev => [...prev, { nombre: nuevoServicio, tipo: 'N/A' }]);
                setFormData(prev => ({ ...prev, servicio: nuevoServicio, otroServicio: '' }));
            } catch (err) {
                console.error('[CitizenRequestForm] Error al agregar nuevo servicio:', err);
                setLoadingServicios(false);
                alert('No se pudo agregar el nuevo servicio.');
                return;
            } finally {
                setLoadingServicios(false);
            }
        }

        // Usar thunkAddSolicitud para registrar la solicitud
        try {
            console.log('[CitizenRequestForm] Preparando datos para envío...');

            // Copia limpia del formData
            const dataToSend = { ...formData };
            if (!dataToSend.fecha) {
                dataToSend.fecha = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
                console.log('[CitizenRequestForm] Fecha asignada:', dataToSend.fecha);
            }
            if (dataToSend.solicitudPadre === '') {
                delete dataToSend.solicitudPadre;
                console.log('[CitizenRequestForm] Campo solicitudPadre eliminado (vacío)');
            }
            // Asignar usuarioId desde el id del token decodificado
            if (id) {
                dataToSend.usuarioId = String(id);
                console.log('[CitizenRequestForm] UsuarioId asignado:', dataToSend.usuarioId);
            } else {
                delete dataToSend.usuarioId;
                console.log('[CitizenRequestForm] UsuarioId eliminado (no disponible)');
            }
            // Si el servicio es "Otro", usar el valor de otroServicio como servicio
            if (dataToSend.servicio === 'Otro' && dataToSend.otroServicio?.trim()) {
                dataToSend.servicio = dataToSend.otroServicio.trim();
            }

            console.log('[CitizenRequestForm] Datos finales a enviar:', dataToSend);
            console.log('[CitizenRequestForm] Enviando solicitud al backend...');

            await dispatch(thunkAddSolicitud(dataToSend)).unwrap();
            console.log('[CitizenRequestForm] Solicitud enviada exitosamente');

            onNuevaSolicitud(formData);
            console.log('[CitizenRequestForm] Llamando callback onNuevaSolicitud');

            setFormData({
                nombre: '',
                tipoDocumento: '',
                documento: '',
                genero: '',
                grupo: '',
                poblacional: '',
                otroPoblacional: '',
                discapacidad: '',
                otraDiscapacidad: '',
                escolaridad: '',
                otraEscolaridad: '',
                nacionalidad: 'COLOMBIA',
                telefono: '',
                correo: '',
                area: '',
                barrio: '',
                comuna: '',
                corregimiento: '',
                vereda: '',
                servicio: '',
                otroServicio: '',
                prioridad: 'Baja',
                tipoAtencion: '',
                modoAtencion: '',
                duracion: '',
                exclusividad: '',
                tipoUsuario: '',
                redireccionar: false,
                oficinaDestino: '',
                dependencia: '',
                funcionario: '',
                estado: 'pendiente',
                fechaResolucion: null,
                solicitudPadre: '',
                usuarioId: '',
                razonRedireccionamiento: ''
            });
            setOtroTipo('N/A');
            console.log('[CitizenRequestForm] Formulario reseteado');
            setErrors({});
            console.log('[CitizenRequestForm] Errores limpiados');
        } catch (err) {
            console.error('[CitizenRequestForm] Error al enviar solicitud:', err);
            alert('No se pudo registrar la solicitud.');
        }
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBarrioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        const optgroupLabel = (event.target.selectedOptions[0].parentElement as HTMLOptGroupElement)?.label || "";
        setFormData((prev) => ({
            ...prev,
            barrio: value,
            comuna: optgroupLabel // Asigna el label del optgroup como comuna
        }));
    };

    const handleVeredaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        const optgroupLabel = (event.target.selectedOptions[0].parentElement as HTMLOptGroupElement)?.label || "";
        setFormData((prev) => ({
            ...prev,
            vereda: value,
            corregimiento: optgroupLabel // Asigna el label del optgroup como corregimiento
        }));
    };

    // Determinar el tipo del servicio seleccionado
    const selectedServicio = servicios.find(s => s.nombre === formData.servicio);
    const isValorServicio = formData.servicio === 'Otro' ? otroTipo === 'Valor' : selectedServicio?.tipo === 'Valor';

    type SolicitudShort = {
        id: number;
        nombre: string;
        tipoDocumento: string;
        documento: string;
        genero?: string;
        grupo?: string;
        poblacional?: string;
        discapacidad?: string;
        escolaridad?: string;
        nacionalidad?: string;
        telefono?: string;
        correo?: string;
        barrio?: string;
        comuna?: string;
        corregimiento?: string;
        vereda?: string;
    };


    const [documentoBusqueda, setDocumentoBusqueda] = useState<string>("");
    const [resultados, setResultados] = useState<SolicitudShort[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const handleBuscar = async () => {
        console.log('[Busqueda] Iniciando búsqueda de documento', { documentoBusqueda });

        setError(null);



        const termino = documentoBusqueda.trim();
        console.log('[Busqueda] Término limpiado:', termino);

        setLoading(true);
        try {
            console.log('[Busqueda] Dispatch del thunk thunkBuscarSolicitudesPorDocumento', { termino });
            const payload = await dispatch(
                thunkBuscarSolicitudesPorDocumento(termino)
            ).unwrap();

            console.log('[Busqueda] Payload recibido del thunk:', payload);
            setResultados(payload || []);

            if (!payload || payload.length === 0) {
                console.log('[Busqueda] No se encontraron resultados para:', termino);
                setError("No se encontraron resultados.");
            } else {
                console.log('[Busqueda] Resultados encontrados:', payload.length);
                // opcional: mostrar tabla en consola para inspección
                console.table(payload);
            }
        } catch (err: any) {
            console.error('[Busqueda] Error al buscar solicitudes:', err);
            setResultados([]);
            // si usas rejectWithValue, err podría tener estructura propia; intentamos leer mensaje
            const message = err?.message || err?.msg || "Error al consultar. Intente de nuevo.";
            setError(message);
        } finally {
            setLoading(false);
            console.log('[Busqueda] Búsqueda finalizada');
        }
    };



    const handleSeleccionar = (item: SolicitudShort) => {
        setFormData((prev) => ({
            ...prev,
            nombre: item.nombre || '',
            tipoDocumento: item.tipoDocumento || '',
            documento: item.documento || '',
            genero: item.genero || '',
            grupo: item.grupo || '',
            poblacional: item.poblacional || '',
            discapacidad: item.discapacidad || '',
            escolaridad: item.escolaridad || '',
            nacionalidad: item.nacionalidad || 'COLOMBIA',
            telefono: item.telefono || '',
            correo: item.correo || '',
            barrio: item.barrio || '',
            comuna: item.comuna || '',
            corregimiento: item.corregimiento || '',
            vereda: item.vereda || '',
            // los demás campos que no vienen en SolicitudShort quedarán como estaban
        }));
    };
    


    return (
        <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-relative">

            {/* Panel admin para seleccionar o forzar idPlan en una sola fila */}
            {rol === 'admin' && (
                <div className="tw-mb-6 tw-p-4 tw-bg-yellow-50 tw-border tw-border-yellow-300 tw-rounded">
                    <label className="tw-block tw-font-medium tw-mb-2">Seleccionar o forzar idPlan para la consulta de servicios</label>
                    <div className="tw-flex tw-gap-2 tw-items-center">
                        {planes.length > 0 && (
                            <select
                                className="tw-p-2 tw-border tw-rounded"
                                value={activeIdPlan}
                                onChange={e => setActiveIdPlan(Number(e.target.value))}
                            >
                                {planes.map(plan => (
                                    <option key={plan.id_plan} value={plan.id_plan}>{plan.name} ({plan.department})</option>
                                ))}
                            </select>
                        )}
                        <input
                            type="text"
                            className="tw-p-2 tw-border tw-rounded tw-w-32"
                            value={forcedIdPlan}
                            onChange={e => setForcedIdPlan(e.target.value)}
                            placeholder="Forzar idPlan"
                        />
                        <button
                            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-rounded hover:tw-bg-blue-600"
                            onClick={() => setActiveIdPlan(Number(forcedIdPlan) || idPlan)}
                        >
                            Actualizar
                        </button>
                        <span className="tw-text-xs tw-ml-2">Id actual: <span className="tw-font-bold">{activeIdPlan}</span></span>
                    </div>
                </div>
            )}
            {/* Botón de configuración */}
            <button
                type="button"
                className="tw-absolute tw-top-4 tw-right-4 tw-bg-gray-200 tw-p-2 tw-rounded hover:tw-bg-gray-300"
                onClick={() => setShowConfig(true)}
                title="Configuración"
            >
                ⚙️
            </button>
            {/* Panel de configuración lateral */}
            {showConfig && (
                <div className="tw-fixed tw-top-0 tw-right-0 tw-h-full tw-bg-white tw-shadow-lg tw-z-50 tw-w-[400px] tw-p-6 tw-flex tw-flex-col">
                    <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                        <h3 className="tw-text-lg tw-font-bold">Configuración</h3>
                        <button onClick={() => setShowConfig(false)} className="tw-text-xl tw-font-bold">×</button>
                    </div>
                    <div className="tw-mb-4">
                        <label className="tw-block tw-font-medium tw-mb-2">Campo a configurar</label>
                        <select
                            value={configField}
                            onChange={e => setConfigField(e.target.value as 'servicios')}
                            className="tw-w-full tw-p-2 tw-border tw-rounded"
                        >
                            <option value="servicios">Servicios</option>
                        </select>
                    </div>
                    {configField === 'servicios' && (
                        <div>
                            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                                <span className="tw-font-medium">Lista de servicios</span>
                                <button onClick={() => setEditMode(m => !m)} className="tw-text-blue-600 hover:tw-underline tw-text-sm">
                                    {editMode ? 'Cancelar' : 'Editar'}
                                </button>
                            </div>
                            <ul className="tw-space-y-2">
                                {editServicios.map((serv, idx) => (
                                    <li key={idx} className="tw-flex tw-items-center tw-gap-2">
                                        {editMode ? (
                                            <>
                                                <input
                                                    className="tw-p-1 tw-border tw-rounded tw-w-full"
                                                    value={serv.nombre}
                                                    onChange={e => handleEditServicio(idx, e.target.value)}
                                                />
                                                <select
                                                    className="tw-p-1 tw-border tw-rounded"
                                                    value={serv.tipo}
                                                    onChange={e => handleEditTipoServicio(idx, e.target.value as 'N/A' | 'Valor')}
                                                >
                                                    <option value="N/A">N/A</option>
                                                    <option value="Valor">Valor</option>
                                                </select>
                                                <button
                                                    className="tw-text-red-500 tw-font-bold tw-ml-2"
                                                    title="Eliminar"
                                                    onClick={() => handleDeleteServicio(idx)}
                                                    type="button"
                                                >
                                                    ×
                                                </button>
                                            </>
                                        ) : (
                                            <span>{`${idx + 1}. ${serv.nombre}`} <span className="tw-text-xs tw-ml-2 tw-bg-gray-200 tw-px-2 tw-rounded">{serv.tipo}</span></span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {editMode && (
                                <>
                                    <div className="tw-flex tw-gap-2 tw-mt-4">
                                        <input
                                            className="tw-p-1 tw-border tw-rounded tw-w-full"
                                            value={newServicio}
                                            onChange={e => setNewServicio(e.target.value)}
                                            placeholder="Nuevo servicio"
                                        />
                                        <button
                                            className="tw-bg-blue-500 tw-text-white tw-px-3 tw-rounded hover:tw-bg-blue-600"
                                            type="button"
                                            onClick={handleAddServicio}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    <button
                                        className="tw-mt-4 tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-py-2 tw-px-4 tw-rounded"
                                        onClick={handleSaveServicios}
                                    >
                                        Guardar cambios
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
            <h1 className="tw-text-3xl tw-font-bold tw-text-green-700 tw-mb-4">
                Formulario Atencion Ciudadana
            </h1>

            <div>
                <h2 className="tw-text-xl tw-font-bold tw-text-green-700 tw-mb-4">
                    Búsqueda de Documento
                </h2>

                {/* Campo de búsqueda */}
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div className="md:tw-col-span-2">
                        <label className="tw-block tw-font-medium">
                            Número de Documento <span className="tw-text-red-500">*</span>
                        </label>
                        <div className="tw-flex tw-gap-2">
                            <input
                                type="text"
                                placeholder="Ingrese número de documento"
                                value={documentoBusqueda}
                                onChange={(e) => setDocumentoBusqueda(e.target.value)}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                            />
                            <button
                                onClick={handleBuscar}
                                className="tw-bg-green-700 tw-text-white tw-px-4 tw-rounded hover:tw-bg-green-800"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de resultados */}
                {resultados.length > 0 && (
                    <div className="tw-mt-4">
                        <label className="tw-block tw-font-medium tw-mb-2">
                            Resultados encontrados:
                        </label>
                        <div className="tw-border tw-rounded tw-max-h-48 tw-overflow-y-auto">
                            <ul>
                                {resultados.map((item) => (
                                    <li
                                        key={item.documento}
                                        onClick={() => handleSeleccionar(item)}
                                        className="tw-cursor-pointer tw-p-2 tw-border-b last:tw-border-b-0 hover:tw-bg-green-50"
                                    >
                                        <strong>{item.documento}</strong> - {item.nombre}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de datos básicos */}
            <h2 className="tw-text-xl tw-font-bold tw-text-green-700 tw-mb-4 tw-mt-4">Información Personal</h2>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">

                <div>
                    <label className="tw-block tw-font-medium">Documento<span className="tw-text-red-500">*</span></label>
                    <input
                        name="documento"
                        value={formData.documento}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                        title="Obligatorio. Solo números. Mínimo 5 dígitos."
                    />
                    {errors.documento && <span className="tw-text-red-500 tw-text-xs">{errors.documento}</span>}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Tipo de Documento<span className="tw-text-red-500">*</span></label>
                    <select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                        <option value="Cédula de Ciudadana">Cédula de Ciudadana</option>
                        <option value="Cédula de Extranjera">Cédula de Extranjera</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </select>
                    {errors.tipoDocumento && <span className="tw-text-red-500 tw-text-xs">{errors.tipoDocumento}</span>}
                </div>



                <div>
                    <label className="tw-block tw-font-medium">Nombre<span className="tw-text-red-500">*</span></label>
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    />
                    {errors.nombre && <span className="tw-text-red-500 tw-text-xs">{errors.nombre}</span>}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Género<span className="tw-text-red-500">*</span></label>
                    <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    </select>
                    {errors.genero && <span className="tw-text-red-500 tw-text-xs">{errors.genero}</span>}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Grupo Etario<span className="tw-text-red-500">*</span></label>
                    <select
                        name="grupo"
                        value={formData.grupo}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="0 a 13 años">0 a 13 años</option>
                        <option value="14 a 17 años">14 a 17 años</option>
                        <option value="18 a 28 años">18 a 28 años</option>
                        <option value="29 a 50 años">29 a 50 años</option>
                        <option value="51 años y mas">51 años y mas</option>
                    </select>
                    {errors.grupo && <span className="tw-text-red-500 tw-text-xs">{errors.grupo}</span>}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Poblacional<span className="tw-text-red-500">*</span></label>
                    <select
                        name="poblacional"
                        value={formData.poblacional}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        {[
                            "Ninguno",
                            "Negro",
                            "Afrocolombiano",
                            "Raizal",
                            "Palenquero",
                            "Indígena",
                            "Gitano o Rrom",
                            "Campesino",
                            "LGBTIQ+",
                            "Víctima del conflicto armado",
                            "Otros"
                        ].map((grupo, index) => (
                            <option key={index} value={grupo}>
                                {grupo}
                            </option>
                        ))}
                    </select>
                    {errors.poblacional && <span className="tw-text-red-500 tw-text-xs">{errors.poblacional}</span>}

                    {/* Campo para especificar "Otros" */}
                    {formData.poblacional === "Otros" && (
                        <div className="tw-mt-2">
                            <label htmlFor="otroPoblacional" className="tw-block tw-font-medium">
                                Ingrese otro grupo poblacional
                            </label>
                            <textarea
                                id="otroPoblacional"
                                name="otroPoblacional"
                                value={formData.otroPoblacional || ""}
                                onChange={handleChange}
                                rows={3}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                                placeholder="Describa el grupo poblacional"
                            />
                            {errors.otroPoblacional && <span className="tw-text-red-500 tw-text-xs">{errors.otroPoblacional}</span>}
                        </div>
                    )}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Discapacidad<span className="tw-text-red-500">*</span></label>
                    <select
                        name="discapacidad"
                        value={formData.discapacidad}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Ninguna">Ninguna</option>
                        <option value="Auditiva">Auditiva</option>
                        <option value="Visual">Visual</option>
                        <option value="Física">Física</option>
                        <option value="Intelectual">Intelectual</option>
                        <option value="Múltiple">Múltiple</option>
                        <option value="Psicosocial">Psicosocial</option>
                        <option value="Sordoceguera">Sordoceguera</option>
                        <option value="Otro">Otro</option>
                    </select>
                    {errors.discapacidad && <span className="tw-text-red-500 tw-text-xs">{errors.discapacidad}</span>}

                    {formData.discapacidad === "Otro" && (
                        <div className="tw-mt-2">
                            <label htmlFor="otraDiscapacidad" className="tw-block tw-font-medium">
                                Especifique otra discapacidad
                            </label>
                            <textarea
                                id="otraDiscapacidad"
                                name="otraDiscapacidad"
                                value={formData.otraDiscapacidad || ""}
                                onChange={handleChange}
                                rows={3}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                                placeholder="Ingrese su discapacidad"
                            />
                            {errors.otraDiscapacidad && <span className="tw-text-red-500 tw-text-xs">{errors.otraDiscapacidad}</span>}
                        </div>
                    )}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Escolaridad<span className="tw-text-red-500">*</span></label>
                    <select
                        name="escolaridad"
                        value={formData.escolaridad}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Ninguno">Ninguno</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Técnologo">Técnologo</option>
                        <option value="Profesional">Profesional</option>
                        <option value="Especialización">Especialización</option>
                        <option value="Maestria">Maestria</option>
                        <option value="Doctorado">Doctorado</option>
                        <option value="Otro">Otro</option>
                    </select>
                    {errors.escolaridad && <span className="tw-text-red-500 tw-text-xs">{errors.escolaridad}</span>}

                    {formData.escolaridad === "Otro" && (
                        <div className="tw-mt-2">
                            <label htmlFor="otraEscolaridad" className="tw-block tw-font-medium">
                                Especifique otra escolaridad
                            </label>
                            <textarea
                                id="otraEscolaridad"
                                name="otraEscolaridad"
                                value={formData.otraEscolaridad || ""}
                                onChange={handleChange}
                                rows={3}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                                placeholder="Ingrese su escolaridad"
                            />
                            {errors.otraEscolaridad && <span className="tw-text-red-500 tw-text-xs">{errors.otraEscolaridad}</span>}
                        </div>
                    )}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Nacionalidad<span className="tw-text-red-500">*</span></label>
                    <select
                        name="nacionalidad"
                        value={formData.nacionalidad}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="COLOMBIA">COLOMBIA</option>
                        <option value="VENEZUELA">VENEZUELA</option>
                        <option value="ECUADOR">ECUADOR</option>
                        <option value="PANAMA">PANAMA</option>
                        <option value="BRASIL">BRASIL</option>
                        <option value="EE.UU">EE.UU</option>
                        <option value="MEXICO">MEXICO</option>
                        <option value="ESPAÑA">ESPAÑA</option>
                        <option value="FRANCIA">FRANCIA</option>
                    </select>
                    {errors.nacionalidad && <span className="tw-text-red-500 tw-text-xs">{errors.nacionalidad}</span>}
                </div>
            </div>

            {/* Sección de información de contacto */}
            <div className="tw-mt-6">
                <h2 className="tw-text-xl tw-font-bold tw-text-green-700 tw-mb-4">Información de Contacto</h2>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>
                        <label className="tw-block tw-font-medium">Teléfono</label>
                        <input
                            name="telefono"
                            value={formData.telefono || ""}
                            onChange={handleChange}
                            placeholder="Opcional"
                            className="tw-w-full tw-p-2 tw-border tw-rounded"
                            title="Solo números. Mínimo 7 dígitos."
                        />
                        {errors.telefono && <span className="tw-text-red-500 tw-text-xs">{errors.telefono}</span>}
                    </div>
                    <div>
                        <label className="tw-block tw-font-medium">Correo</label>
                        <input
                            name="correo"
                            value={formData.correo || ""}
                            onChange={handleChange}
                            placeholder="Opcional"
                            className="tw-w-full tw-p-2 tw-border tw-rounded"
                            title="Debe ser un correo válido, ejemplo: usuario@dominio.com"
                        />
                        {errors.correo && <span className="tw-text-red-500 tw-text-xs">{errors.correo}</span>}
                    </div>
                </div>
            </div>

            {/* Sección de datos de solicitud */}
            <div className="tw-mt-6"></div>
            <h2 className="tw-text-xl tw-font-bold tw-text-green-700 tw-mb-4">Información De Ubicacion</h2>
            <div className="tw-mt-6 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">

                <div>
                    <label className="tw-block tw-font-medium">Área de Residencia<span className="tw-text-red-500">*</span></label>
                    <select
                        name="area"
                        value={formData.area}
                        onChange={handleAreaChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Urbano">Urbano</option>
                        <option value="Rural">Rural</option>
                    </select>
                    {errors.area && <span className="tw-text-red-500 tw-text-xs">{errors.area}</span>}
                </div>
                {formData.area === "Urbano" && (
                    <>
                        <div>
                            <label className="tw-block tw-font-medium">Barrio<span className="tw-text-red-500">*</span></label>

                            <select
                                name="barrio"
                                value={formData.barrio || ""}
                                onChange={handleBarrioChange}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                            >
                                <option value="">Seleccione...</option>
                                <optgroup label="AMOYA">
                                    <option value="Ambeima">Ambeima</option>
                                    <option value="Beltrán">Beltrán</option>
                                    <option value="Divino Niño">Divino Niño</option>
                                    <option value="El Edén">El Edén</option>
                                    <option value="La Loma">La Loma</option>
                                    <option value="Las Cabañas">Las Cabañas</option>
                                    <option value="Libertador">Libertador</option>
                                    <option value="Los Laureles">Los Laureles</option>
                                    <option value="Santa Luisa">Santa Luisa</option>
                                    <option value="Villa Café">Villa Café</option>
                                </optgroup>
                                <optgroup label="CALARMA">
                                    <option value="20 de Julio">20 de Julio</option>
                                    <option value="El Paraíso">El Paraíso</option>
                                    <option value="El Rocío">El Rocío</option>
                                    <option value="El Rocío Parte Alta Algodones">El Rocío Parte Alta Algodones</option>
                                    <option value="José María Melo">José María Melo</option>
                                    <option value="Las Brisas">Las Brisas</option>
                                    <option value="Pueblo Nuevo">Pueblo Nuevo</option>
                                    <option value="San Fernando">San Fernando</option>
                                    <option value="San Juan Bautista">San Juan Bautista</option>
                                    <option value="Versalles">Versalles</option>
                                    <option value="Villa del Rocío">Villa del Rocío</option>
                                </optgroup>
                                <optgroup label="EL LIMON">
                                    <option value="1 de Mayo">1 de Mayo</option>
                                    <option value="Carmenza Rocha">Carmenza Rocha</option>
                                    <option value="Castañal">Castañal</option>
                                    <option value="El Jardín">El Jardín</option>
                                    <option value="La Primavera">La Primavera</option>
                                    <option value="Las Américas">Las Américas</option>
                                    <option value="Los Fundadores">Los Fundadores</option>
                                    <option value="Obrero">Obrero</option>
                                    <option value="Salomón Umaña">Salomón Umaña</option>
                                    <option value="Santa Helena">Santa Helena</option>
                                    <option value="Santofimio">Santofimio</option>
                                    <option value="Tuluni">Tuluni</option>
                                    <option value="Villa Esperanza">Villa Esperanza</option>
                                </optgroup>
                            </select>
                            {errors.barrio && <span className="tw-text-red-500 tw-text-xs">{errors.barrio}</span>}
                        </div>
                    </>
                )}
                {formData.area === "Rural" && (
                    <>
                        <div>
                            <label className="tw-block tw-font-medium">Vereda<span className="tw-text-red-500">*</span></label>
                            <select
                                name="vereda"
                                value={formData.vereda || ""}
                                onChange={handleVeredaChange}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                            >
                                <option value="">Seleccione...</option>
                                <optgroup label="AMOYA">
                                    <option value="Amoya">Amoya</option>
                                    <option value="Aracamangas">Aracamangas</option>
                                    <option value="Brisas Carbonal">Brisas Carbonal</option>
                                    <option value="Brisas Totumo">Brisas Totumo</option>
                                    <option value="Carbonalito">Carbonalito</option>
                                    <option value="Copete Delicias">Copete Delicias</option>
                                    <option value="Copete Monserrate">Copete Monserrate</option>
                                    <option value="Copete Oriente">Copete Oriente</option>
                                    <option value="El Queso">El Queso</option>
                                    <option value="Guaini">Guaini</option>
                                    <option value="Guanabano Brasilia">Guanabano Brasilia</option>
                                    <option value="Hato Viejo">Hato Viejo</option>
                                    <option value="La Begonia">La Begonia</option>
                                    <option value="La Ceiba">La Ceiba</option>
                                    <option value="La Cima">La Cima</option>
                                    <option value="La Cortes">La Cortes</option>
                                    <option value="La Cristalina">La Cristalina</option>
                                    <option value="La Pradera">La Pradera</option>
                                    <option value="Las Tapias">Las Tapias</option>
                                    <option value="Linea Diamante">Linea Diamante</option>
                                    <option value="Los Angeles">Los Angeles</option>
                                    <option value="Mesa de Purace">Mesa de Purace</option>
                                    <option value="Mulicu Altagracia">Mulicu Altagracia</option>
                                    <option value="Mulicu Delicias">Mulicu Delicias</option>
                                    <option value="Mulicu el Agrado">Mulicu el Agrado</option>
                                    <option value="Mulicu Jardin">Mulicu Jardin</option>
                                    <option value="Mulicu Las Palmas">Mulicu Las Palmas</option>
                                    <option value="Pipini">Pipini</option>
                                    <option value="San Alfonso">San Alfonso</option>
                                    <option value="San Miguel">San Miguel</option>
                                    <option value="Santa Rosa Buenavista">Santa Rosa Buenavista</option>
                                    <option value="Tamarco">Tamarco</option>
                                    <option value="Tine">Tine</option>
                                    <option value="Tuluni">Tuluni</option>
                                    <option value="Union Coronillo">Union Coronillo</option>
                                    <option value="Violetas Totumo">Violetas Totumo</option>
                                </optgroup>
                                <optgroup label="CALARMA">
                                    <option value="Alto Redondo">Alto Redondo</option>
                                    <option value="Brazuelos Calarma">Brazuelos Calarma</option>
                                    <option value="Brazuelos Delicias">Brazuelos Delicias</option>
                                    <option value="Buena vista">Buena vista</option>
                                    <option value="Calarca Tetuan">Calarca Tetuan</option>
                                    <option value="Chitato">Chitato</option>
                                    <option value="Chontaduro">Chontaduro</option>
                                    <option value="La Julia">La Julia</option>
                                    <option value="La Nevada">La Nevada</option>
                                    <option value="La Palmera">La Palmera</option>
                                    <option value="La Siberia">La Siberia</option>
                                    <option value="Lemaya">Lemaya</option>
                                    <option value="Los Lirios Calarma">Los Lirios Calarma</option>
                                    <option value="Los Planes">Los Planes</option>
                                    <option value="Maito">Maito</option>
                                    <option value="Patalo">Patalo</option>
                                    <option value="Pedregal">Pedregal</option>
                                    <option value="Potrerito de Agua">Potrerito de Agua</option>
                                    <option value="Potrerito de Lugo">Potrerito de Lugo</option>
                                    <option value="Potrerito de Lugo Bajo">Potrerito de Lugo Bajo</option>
                                    <option value="Risalda Calarma">Risalda Calarma</option>
                                    <option value="Santo Domingo">Santo Domingo</option>
                                    <option value="Talani">Talani</option>
                                    <option value="Vista Hermosa Calarma">Vista Hermosa Calarma</option>
                                    <option value="Yaguara">Yaguara</option>
                                </optgroup>
                                <optgroup label="EL LIMON">
                                    <option value="Altamira">Altamira</option>
                                    <option value="Argentina Linday">Argentina Linday</option>
                                    <option value="Bruselas">Bruselas</option>
                                    <option value="Buenos Aires">Buenos Aires</option>
                                    <option value="Calibio">Calibio</option>
                                    <option value="Chicala">Chicala</option>
                                    <option value="El Jordan">El Jordan</option>
                                    <option value="El Limon">El Limon</option>
                                    <option value="El Prodigio">El Prodigio</option>
                                    <option value="El Tiber">El Tiber</option>
                                    <option value="El Viso">El Viso</option>
                                    <option value="Finlandia">Finlandia</option>
                                    <option value="Guayabal Cuira Adentro">Guayabal Cuira Adentro</option>
                                    <option value="Helechales">Helechales</option>
                                    <option value="Icarco">Icarco</option>
                                    <option value="Irco">Irco</option>
                                    <option value="La Aldea">La Aldea</option>
                                    <option value="La Barrialosa">La Barrialosa</option>
                                    <option value="La Florida">La Florida</option>
                                    <option value="La Germania">La Germania</option>
                                    <option value="La Glorieta">La Glorieta</option>
                                    <option value="La Holanda">La Holanda</option>
                                    <option value="La Jazminea">La Jazminea</option>
                                    <option value="La Lindosa">La Lindosa</option>
                                    <option value="La Profunda">La Profunda</option>
                                    <option value="La Sierra">La Sierra</option>
                                    <option value="Las Mesetas">Las Mesetas</option>
                                    <option value="Madrono">Madrono</option>
                                    <option value="Mendarco Carbonal">Mendarco Carbonal</option>
                                    <option value="Mesa de Aguayo">Mesa de Aguayo</option>
                                    <option value="Meson Betania">Meson Betania</option>
                                    <option value="Paraiso">Paraiso</option>
                                    <option value="Potrerito de Aguayo">Potrerito de Aguayo</option>
                                    <option value="Providencia">Providencia</option>
                                    <option value="Punterales">Punterales</option>
                                    <option value="Santa Cruz">Santa Cruz</option>
                                    <option value="Santa Rita">Santa Rita</option>
                                    <option value="Tres Esquinas Banqueo">Tres Esquinas Banqueo</option>
                                </optgroup>
                                <optgroup label="LA MARINA">
                                    <option value="Aguas Claras">Aguas Claras</option>
                                    <option value="Alto Ambeima">Alto Ambeima</option>
                                    <option value="Astilleros">Astilleros</option>
                                    <option value="Brisas San Pablo Ambeima">Brisas San Pablo Ambeima</option>
                                    <option value="Dos Quebradas">Dos Quebradas</option>
                                    <option value="El Bosque">El Bosque</option>
                                    <option value="El Cauchal">El Cauchal</option>
                                    <option value="El Guadual">El Guadual</option>
                                    <option value="Espiritu Santo Albania">Espiritu Santo Albania</option>
                                    <option value="Espiritu Santo Balcones">Espiritu Santo Balcones</option>
                                    <option value="Florestal Ambeima">Florestal Ambeima</option>
                                    <option value="Horizonte">Horizonte</option>
                                    <option value="La Granja Ambeima">La Granja Ambeima</option>
                                    <option value="La Ilusion">La Ilusion</option>
                                    <option value="La Marina">La Marina</option>
                                    <option value="La Primavera">La Primavera</option>
                                    <option value="La Sonrisa">La Sonrisa</option>
                                    <option value="Lagunilla">Lagunilla</option>
                                    <option value="Las Juntas">Las Juntas</option>
                                    <option value="Pando El Libano">Pando El Libano</option>
                                    <option value="San Fernando">San Fernando</option>
                                    <option value="San Marcos">San Marcos</option>
                                    <option value="San Pablo Ambeima">San Pablo Ambeima</option>
                                    <option value="San Pedro Ambeima">San Pedro Ambeima</option>
                                    <option value="Santuario">Santuario</option>
                                </optgroup>
                                <optgroup label="LAS HERMOSAS">
                                    <option value="Agua Bonita">Agua Bonita</option>
                                    <option value="Alemania">Alemania</option>
                                    <option value="Alto de Waterloo">Alto de Waterloo</option>
                                    <option value="Angostura">Angostura</option>
                                    <option value="Argentina Hermosas">Argentina Hermosas</option>
                                    <option value="Aurora Hermosas">Aurora Hermosas</option>
                                    <option value="Davis Janeiro">Davis Janeiro</option>
                                    <option value="El Cairo">El Cairo</option>
                                    <option value="El Escobal">El Escobal</option>
                                    <option value="El Jardin">El Jardin</option>
                                    <option value="El Moral">El Moral</option>
                                    <option value="El Porvenir Hermosas">El Porvenir Hermosas</option>
                                    <option value="El Recreo">El Recreo</option>
                                    <option value="Holanda Hermosas">Holanda Hermosas</option>
                                    <option value="La Cimarrona">La Cimarrona</option>
                                    <option value="La Cimarrona P.A">La Cimarrona P.A</option>
                                    <option value="La Salina">La Salina</option>
                                    <option value="La Virginia">La Virginia</option>
                                    <option value="La Virginia P.A.">La Virginia P.A.</option>
                                    <option value="Los Sauces">Los Sauces</option>
                                    <option value="Rio negro Hermosas">Rio negro Hermosas</option>
                                    <option value="San Jorge">San Jorge</option>
                                    <option value="San Jorge Parte Alta">San Jorge Parte Alta</option>
                                    <option value="San Jose de las Hermosas">San Jose de las Hermosas</option>
                                    <option value="San Pablo Hermosas">San Pablo Hermosas</option>
                                    <option value="San Roque">San Roque</option>
                                    <option value="Santa Barbara">Santa Barbara</option>
                                    <option value="Vega Chiquita">Vega Chiquita</option>
                                </optgroup>
                            </select>
                            {errors.vereda && <span className="tw-text-red-500 tw-text-xs">{errors.vereda}</span>}
                        </div>
                    </>
                )}
            </div>

            {/* Sección de Solicitud */}
            <div className="tw-mt-6"></div>
            <h2 className="tw-text-xl tw-font-bold tw-text-green-700 tw-mb-4">Detalles de la Solicitud</h2>
            <div className="tw-mt-6 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">

                <div>
                    <label className="tw-block tw-font-medium">Servicio<span className="tw-text-red-500">*</span></label>
                    <select
                        name="servicio"
                        value={formData.servicio || ""}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                        disabled={loadingServicios}
                    >
                        <option value="">Seleccione...</option>
                        {loadingServicios ? (
                            <option value="" disabled>Cargando servicios...</option>
                        ) : (
                            <>
                                {servicios.map((servicio, idx) => (
                                    <option key={servicio.nombre} value={servicio.nombre}>{`${idx + 1}. ${servicio.nombre}`}</option>
                                ))}
                                <option value="Otro">Otros</option>
                            </>
                        )}
                    </select>
                    {errors.servicio && <span className="tw-text-red-500 tw-text-xs">{errors.servicio}</span>}

                    {formData.servicio === "Otro" && (
                        <>
                            <input
                                name="otroServicio"
                                value={formData.otroServicio || ""}
                                onChange={handleChange}
                                placeholder="Especifique el servicio"
                                className="tw-mt-2 tw-w-full tw-p-2 tw-border tw-rounded"
                            />
                            {errors.otroServicio && <span className="tw-text-red-500 tw-text-xs">{errors.otroServicio}</span>}
                            <div className="tw-mt-2">
                                <label className="tw-block tw-font-medium">Tipo de servicio</label>
                                <select
                                    value={otroTipo}
                                    onChange={e => setOtroTipo(e.target.value as 'N/A' | 'Valor')}
                                    className="tw-w-full tw-p-2 tw-border tw-rounded"
                                >
                                    <option value="N/A">N/A</option>
                                    <option value="Valor">Valor</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Campo de cantidad si el servicio es de tipo Valor */}
                    {isValorServicio && (
                        <div className="tw-mt-2">
                            <label className="tw-block tw-font-medium">Cantidad</label>
                            <input
                                type="number"
                                name="cantidadServicio"
                                value={formData.cantidadServicio || ''}
                                onChange={e => setFormData(prev => ({ ...prev, cantidadServicio: Number(e.target.value) }))}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                                min={1}
                            />
                        </div>
                    )}
                </div>


                <div>
                    <label className="tw-block tw-font-medium">Prioridad<span className="tw-text-red-500">*</span></label>
                    <select
                        name="prioridad"
                        value={formData.prioridad || "Baja"}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                    {errors.prioridad && <span className="tw-text-red-500 tw-text-xs">{errors.prioridad}</span>}
                </div>
            </div>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-5 tw-gap-4 tw-mt-8">
                <div>
                    <label className="tw-block tw-font-medium">Tipo de Atención<span className="tw-text-red-500">*</span></label>
                    <select
                        name="tipoAtencion"
                        value={formData.tipoAtencion || ""}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Prioritaria">Prioritaria</option>
                        <option value="General">General</option>
                    </select>
                    {errors.tipoAtencion && <span className="tw-text-red-500 tw-text-xs">{errors.tipoAtencion}</span>}
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Modo de Atención</label>
                    <select
                        name="modoAtencion"
                        value={formData.modoAtencion || ""}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Llamada telefónica">Llamada telefónica</option>
                        <option value="Llamada celular">Llamada celular</option>
                        <option value="Vía WhatsApp">Vía WhatsApp</option>
                        <option value="Mensaje de texto">Mensaje de texto</option>
                    </select>
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Duración (minutos)</label>
                    <select
                        name="duracion"
                        value={formData.duracion || ""}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Menos de 1">Menos de 1</option>
                        <option value="1 a 2">1 a 2</option>
                        <option value="3 a 5">3 a 5</option>
                        <option value="6 a 10">6 a 10</option>
                        <option value="11 a 20">11 a 20</option>
                        <option value="más de 20">más de 20</option>
                    </select>
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Exclusividad</label>
                    <select
                        name="exclusividad"
                        value={formData.exclusividad || ""}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Propio de la oficina">Propio de la oficina</option>
                        <option value="De la Dependencia">De la Dependencia</option>
                        <option value="General">General</option>
                        <option value="Externa">Externa</option>
                    </select>
                </div>

                <div>
                    <label className="tw-block tw-font-medium">Tipo de Usuario</label>
                    <select
                        name="tipoUsuario"
                        value={formData.tipoUsuario || ""}
                        onChange={handleChange}
                        className="tw-w-full tw-p-2 tw-border tw-rounded"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Externo">Externo</option>
                        <option value="Interno">Interno</option>
                    </select>
                </div>


            </div>

            {/* Sección de redirección */}
            <div className="tw-mt-6"></div>
            <h2 className="tw-text-xl tw-font-bold tw-text-green-700 tw-mb-4">Redirecciónamiento</h2>
            <div className="tw-mt-6">
                <label className="tw-flex tw-items-center">
                    <input
                        type="checkbox"
                        name="redireccionar"
                        checked={formData.redireccionar || false}
                        onChange={handleCheckboxChange}
                        className="tw-mr-2"
                    />
                    ¿Redireccionar solicitud?
                </label>
                {errors.redireccionar && <span className="tw-text-red-500 tw-text-xs">{errors.redireccionar}</span>}

                {formData.redireccionar && (
                    <div className="tw-mt-2">
                        <label htmlFor="razonRedireccionamiento" className="tw-block tw-font-medium">
                            Razón de Redireccionamiento
                        </label>
                        <textarea
                            id="razonRedireccionamiento"
                            name="razonRedireccionamiento"
                            value={formData.razonRedireccionamiento || ""}
                            onChange={handleChange}
                            rows={3}
                            className="tw-w-full tw-p-2 tw-border tw-rounded"
                            placeholder="Ingrese la razón de redireccionamiento"
                        />
                        {errors.razonRedireccionamiento && <span className="tw-text-red-500 tw-text-xs">{errors.razonRedireccionamiento}</span>}
                    </div>
                )}
                {formData.redireccionar && (
                    <div className="tw-mt-2">
                        <label className="tw-block tw-font-medium">
                            Oficinas de destino
                        </label>
                        <select
                            name="oficinaDestino"
                            value={formData.oficinaDestino || ""}
                            onChange={handleChange}
                            className="tw-w-full tw-p-2 tw-border tw-rounded"
                        >
                            <option value="">Seleccione...</option>
                            <option value="Vent. Unica">Vent. Unica</option>
                            <option value="Despacho Hacienda">Despacho Hacienda</option>
                            <option value="Recepción Hacienda">Recepción Hacienda</option>
                            <option value="Recaudo">Recaudo</option>
                            <option value="Presupuesto">Presupuesto</option>
                            <option value="Coactivo">Coactivo</option>
                            <option value="Tesorería">Tesorería</option>
                            <option value="Pagaduría">Pagaduría</option>
                            <option value="Contabilidad">Contabilidad</option>
                            <option value="Despacho Dls">Despacho Dls</option>
                            <option value="Recepción Dls">Recepción Dls</option>
                            <option value="Regimen Subsidiado">Regimen Subsidiado</option>
                            <option value="Atencion Pqrs Salud">Atencion Pqrs Salud</option>
                            <option value="Auditoria">Auditoria</option>
                            <option value="Adulto Mayor">Adulto Mayor</option>
                            <option value="Despacho Alcalde">Despacho Alcalde</option>
                            <option value="Recepcion Alcalde">Recepcion Alcalde</option>
                            <option value="Apoyo Recepción">Apoyo Recepción</option>
                            <option value="Despacho Gobierno">Despacho Gobierno</option>
                            <option value="Recepción Gobierno">Recepción Gobierno</option>
                            <option value="Despacho Ejecutivo">Despacho Ejecutivo</option>
                            <option value="Recepción Ejecutivo">Recepción Ejecutivo</option>
                            <option value="Servicios Administrativos">Servicios Administrativos</option>
                            <option value="Gestion Documental">Gestion Documental</option>
                            <option value="Contratacion 1">Contratacion 1</option>
                            <option value="Contratacion 2">Contratacion 2</option>
                            <option value="Contratacion 3">Contratacion 3</option>
                            <option value="Despacho Planeación">Despacho Planeación</option>
                            <option value="Recepcion Planeación">Recepcion Planeación</option>
                            <option value="Estratificación">Estratificación</option>
                            <option value="Banco De Proyectos">Banco De Proyectos</option>
                            <option value="Apoyo 1 - Fredy">Apoyo 1 - Fredy</option>
                            <option value="Apoyo 2 - Orlando">Apoyo 2 - Orlando</option>
                            <option value="Apoyo 3 - Angela">Apoyo 3 - Angela</option>
                            <option value="Apoyo 4 - Katherine">Apoyo 4 - Katherine</option>
                            <option value="Apoyo 5 - Jimmy">Apoyo 5 - Jimmy</option>
                            <option value="Apoyo 6 - Cabrejo">Apoyo 6 - Cabrejo</option>
                            <option value="Apoyo 7 - Yate">Apoyo 7 - Yate</option>
                            <option value="Apoyo Spc 1">Apoyo Spc 1</option>
                            <option value="Apoyo Spc 2">Apoyo Spc 2</option>
                            <option value="Apoyo Spc 3">Apoyo Spc 3</option>
                            <option value="Apoyo Spc 4">Apoyo Spc 4</option>
                            <option value="Apoyo Spc 8">Apoyo Spc 8</option>
                            <option value="Coord. Desarr. Comunitario">Coord. Desarr. Comunitario</option>
                            <option value="Apoyo Desarr. Comunitario">Apoyo Desarr. Comunitario</option>
                            <option value="Control Interno">Control Interno</option>
                            <option value="Enlace Familias En Acción">Enlace Familias En Acción</option>
                            <option value="Apoyo Famiacción 1">Apoyo Famiacción 1</option>
                            <option value="Apoyo Famiacción 2">Apoyo Famiacción 2</option>
                            <option value="Apoyo Famiacción 3">Apoyo Famiacción 3</option>
                            <option value="Despacho Rural">Despacho Rural</option>
                            <option value="Apoyo Rural 1">Apoyo Rural 1</option>
                            <option value="Apoyo Rural 3">Apoyo Rural 3</option>
                            <option value="Sistemas Y Tic">Sistemas Y Tic</option>
                            <option value="Corregidores">Corregidores</option>
                            <option value="Copasst">Copasst</option>
                            <option value="Coord. Casa Cultura">Coord. Casa Cultura</option>
                            <option value="Recepción Cri">Recepción Cri</option>
                            <option value="Comisaria De Familia">Comisaria De Familia</option>
                            <option value="Inspección De Policía">Inspección De Policía</option>
                            <option value="Coord. Casa Lúdica">Coord. Casa Lúdica</option>
                            <option value="Almacenista">Almacenista</option>
                            <option value="Apoyo Almacén">Apoyo Almacén</option>
                            <option value="Biblioteca Darío Echandía Olaya">Biblioteca Darío Echandía Olaya</option>
                            <option value="Biblioteca Darío Vidales">Biblioteca Darío Vidales</option>
                            <option value="Pvd Biblioteca">Pvd Biblioteca</option>
                            <option value="Pvd Medalla Milagrosa">Pvd Medalla Milagrosa</option>
                            <option value="Deportes">Deportes</option>
                            <option value="Mensajero">Mensajero</option>
                            <option value="Eléctrico Contratista">Eléctrico Contratista</option>
                            <option value="Cis">Cis</option>
                            <option value="Campamento Municipal">Campamento Municipal</option>
                            <option value="Trabajadores Oficiales">Trabajadores Oficiales</option>
                            <option value="Conductores Contratistas">Conductores Contratistas</option>
                        </select>
                        {errors.oficinaDestino && <span className="tw-text-red-500 tw-text-xs">{errors.oficinaDestino}</span>}
                    </div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                className="tw-mt-4 tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded"
            >
                Registrar Solicitud
            </button>
        </div>
    );
};
export default CitizenRequestForm;
