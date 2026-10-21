import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { thunkGetAllSolicitudes } from '@/store/pqrs/thunks';
import { decode } from '@/utils';
import { getPDTs } from '@/services/api';
import { FormData } from '@/interfaces/formInterfaces';

interface Props {
    solicitudes: FormData[];
    onRedirect: (id: string, oficinaDestino: string) => void;
    onResolve: (id: string) => void;
}

export const CitizenRequestSearch: React.FC<Props> = ({
    solicitudes: _solicitudes,
    onRedirect,
    onResolve,
}) => {
    // Obtener el valor de oficina desde localStorage
    const oficinaDefault = localStorage.getItem('office') || "";
    const dispatch = useAppDispatch();
    const [solicitudes, setSolicitudes] = useState<FormData[]>(_solicitudes);
    // Obtener id_plan de localStorage
    const id_plan = localStorage.getItem('id_plan') || '';

    const [forcedIdPlan, setForcedIdPlan] = useState<string>('');
    const [activeIdPlan, setActiveIdPlan] = useState<string>(id_plan);
    const [planes, setPlanes] = useState<{ id_plan: number, name: string, department: string, description?: string }[]>([]);

    // Decodificar token y exponer variables del usuario
    const { token_info } = useAppSelector(store => store.auth);
    const [id, setId] = useState(0);
    const [user, setUser] = useState('');
    const [rol, setRol] = useState('');
    const [idPlan, setIdPlan] = useState(0);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setId(decoded.id);
            setUser(decoded.user);
            setRol(decoded.rol);
            setIdPlan(decoded.id_plan);

            if (decoded.id_plan) {
                setActiveIdPlan(String(decoded.id_plan));
                localStorage.setItem('id_plan', String(decoded.id_plan)); // opcional, para persistir
            }
    

            console.log('Token decodificado:', decoded);
        }
    }, [token_info]);

    useEffect(() => {
        if (!activeIdPlan) {
            console.log("No hay activeIdPlan, no se hace petición");
            return;
        }
    
        console.log("Ejecutando thunkGetAllSolicitudes con id_plan:", activeIdPlan);
    
        dispatch(thunkGetAllSolicitudes({ id_plan: activeIdPlan }))
            .unwrap()
            .then((res: any) => {
                console.log("✅ Respuesta exitosa del thunk:", res);
    
                if (Array.isArray(res)) {
                    console.log("Es un array, se setean las solicitudes");
                    setSolicitudes(res);
                } else {
                    console.log("No es un array la respuesta, valor recibido:", res);
                }
            })
            .catch((err: any) => {
                console.error("❌ Error al obtener solicitudes:", err);
            });
    }, [dispatch, activeIdPlan]);
    

    useEffect(() => {
        if (rol === 'admin') {
            getPDTs().then((res) => setPlanes(res)).catch(() => setPlanes([]));
        }
    }, [rol]);

    // Filtros
    const [filtros, setFiltros] = useState({
        estado: "pendiente",
        nombre: "",
        documento: "",
        servicio: "",
        oficina: oficinaDefault, // Establecer el valor por defecto desde localStorage
    });
    const [resultados, setResultados] = useState<FormData[]>([]);
    // Paginación
    const [pageSize, setPageSize] = useState<number | 'all'>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Estado de detalle
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [nuevaOficina, setNuevaOficina] = useState("");

    // Aplicar filtros
    useEffect(() => {
        let arr = solicitudes;
        if (filtros.estado !== "todos")
            arr = arr.filter((s) => s.estado === filtros.estado);
        if (filtros.nombre) {
            const v = filtros.nombre.toLowerCase();
            arr = arr.filter((s) => s.nombre.toLowerCase().includes(v));
        }
        if (filtros.documento) {
            const v = filtros.documento.toLowerCase();
            arr = arr.filter((s) => s.documento.toLowerCase().includes(v));
        }
        if (filtros.servicio) {
            const v = filtros.servicio.toLowerCase();
            arr = arr.filter((s) => s.servicio.toLowerCase().includes(v));
        }
        setResultados(arr);
        // Al cambiar filtros/solicitudes, resetear a la primera página
        setCurrentPage(1);
    }, [solicitudes, filtros]);

    const handleChangeFiltro = (
        campo: keyof typeof filtros,
        valor: string
    ) => {
        setFiltros((prev) => ({ ...prev, [campo]: valor }));
    };

    // Elimino la función para refrescar la lista de solicitudes
    // const refreshSolicitudes = () => {
    //     dispatch(thunkGetAllSolicitudes({ id_plan: activeIdPlan }))
    //         .unwrap()
    //         .then((res: any) => {
    //             setSolicitudes([])
    //             console.log('Solicitudes actualizadas:', res);
    //             if (Array.isArray(res)) setSolicitudes(res);
    //         });
    // };

    // Lógica de detalle
    let detalleSolicitud: React.ReactNode = null;
    if (expandedId) {
        const sol = solicitudes.find((s) => s.id === expandedId)!;
        detalleSolicitud = (
            <div className="tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-md tw-mt-6">
                <div className="tw-flex tw-items-start tw-justify-between tw-mb-6">
                    <div>
                        <h3 className="tw-text-3xl tw-font-bold tw-text-gray-800">Solicitud #{sol.Ticket_ID ?? 'N/A'}</h3>
                        <div className="tw-mt-2 tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                            <span className="tw-text-sm tw-text-gray-500">Fecha:</span>
                            <span className="tw-text-sm tw-font-medium tw-text-gray-700">{sol.fecha ? formatearFecha(sol.fecha) : 'N/A'}</span>
                            <span className="tw-h-4 tw-w-px tw-bg-gray-300" />
                            <span className="tw-text-sm tw-text-gray-500">Estado:</span>
                            <span className={`tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-full ${sol.estado === 'resuelto' ? 'tw-bg-green-100 tw-text-green-700' : sol.estado === 'en proceso' ? 'tw-bg-yellow-100 tw-text-yellow-700' : 'tw-bg-red-100 tw-text-red-700'}`}>{sol.estado || 'N/A'}</span>
                            {sol.prioridad && (
                                <>
                                    <span className="tw-h-4 tw-w-px tw-bg-gray-300" />
                                    <span className="tw-text-sm tw-text-gray-500">Prioridad:</span>
                                    <span className="tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-full tw-bg-blue-100 tw-text-blue-700">{sol.prioridad}</span>
                                </>
                            )}
                        </div>
                    </div>
                    {sol.oficinaDestino && (
                        <div className="tw-text-right">
                            <div className="tw-text-xs tw-text-gray-500">Oficina destino</div>
                            <div className="tw-text-sm tw-font-semibold tw-text-gray-700">{sol.oficinaDestino}</div>
                        </div>
                    )}
                </div>

                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-4">
                    <div className="tw-bg-white tw-border tw-rounded-xl tw-p-4 tw-shadow-sm">
                        <div className="tw-text-sm tw-font-semibold tw-text-gray-600 tw-mb-3">Ciudadano</div>
                        <div className="tw-space-y-2 tw-text-sm tw-text-gray-700">
                            <div><span className="tw-text-gray-500">Nombre:</span> <span className="tw-font-medium">{sol.nombre || 'N/A'}</span></div>
                            <div><span className="tw-text-gray-500">Documento:</span> <span className="tw-font-medium">{[sol.documento].filter(Boolean).join(' ') || 'N/A'}</span></div>
                            <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                                <div><span className="tw-text-gray-500">Género:</span> <span className="tw-font-medium">{sol.genero || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Grupo etario:</span> <span className="tw-font-medium">{sol.grupo || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Poblacional:</span> <span className="tw-font-medium">{sol.poblacional || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Discapacidad:</span> <span className="tw-font-medium">{sol.discapacidad || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Escolaridad:</span> <span className="tw-font-medium">{sol.escolaridad || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Nacionalidad:</span> <span className="tw-font-medium">{sol.nacionalidad || 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-bg-white tw-border tw-rounded-xl tw-p-4 tw-shadow-sm">
                        <div className="tw-text-sm tw-font-semibold tw-text-gray-600 tw-mb-3">Ubicación</div>
                        <div className="tw-space-y-2 tw-text-sm tw-text-gray-700">
                            <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                                <div><span className="tw-text-gray-500">Barrio:</span> <span className="tw-font-medium">{sol.barrio || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Comuna:</span> <span className="tw-font-medium">{sol.comuna || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Corregimiento:</span> <span className="tw-font-medium">{sol.corregimiento || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Vereda:</span> <span className="tw-font-medium">{sol.vereda || 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-bg-white tw-border tw-rounded-xl tw-p-4 tw-shadow-sm">
                        <div className="tw-text-sm tw-font-semibold tw-text-gray-600 tw-mb-3">Solicitud</div>
                        <div className="tw-space-y-2 tw-text-sm tw-text-gray-700">
                            <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                                <div><span className="tw-text-gray-500">Servicio:</span> <span className="tw-font-medium">{sol.servicio || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Cantidad:</span> <span className="tw-font-medium">{(sol as any).cantidadServicio ?? 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Tipo atención:</span> <span className="tw-font-medium">{sol.tipoAtencion || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Dependencia:</span> <span className="tw-font-medium">{sol.dependencia || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Funcionario:</span> <span className="tw-font-medium">{sol.funcionario || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Fecha resolución:</span> <span className="tw-font-medium">{sol.fechaResolucion ? formatearFecha(sol.fechaResolucion) : '—'}</span></div>
                                <div><span className="tw-text-gray-500">Modo atención:</span> <span className="tw-font-medium">{(sol as any).modoAtencion || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Duración (min):</span> <span className="tw-font-medium">{(sol as any).duracion || (sol as any).duracionAtencion || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Exclusividad:</span> <span className="tw-font-medium">{(sol as any).exclusividad || 'N/A'}</span></div>
                                <div><span className="tw-text-gray-500">Tipo usuario:</span> <span className="tw-font-medium">{(sol as any).tipoUsuario || 'N/A'}</span></div>
                                <div className="tw-col-span-2"><span className="tw-text-gray-500">Razón redireccionamiento:</span> <span className="tw-font-medium">{(sol as any).razonRedireccionamiento || 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="tw-mt-6 tw-space-y-4">
                    {sol.estado !== 'resuelto' && (
                        <label className="tw-flex tw-items-center tw-gap-2">
                            <input
                                type="checkbox"
                                checked={shouldRedirect}
                                onChange={(e) => setShouldRedirect(e.target.checked)}
                                className="tw-form-checkbox"
                            />
                            <span>Redireccionar solicitud</span>
                        </label>
                    )}

                    {shouldRedirect && String(sol.estado) !== 'resuelto' && (
                        <div>
                            <label className="tw-block tw-font-medium tw-mb-1">
                                Nueva Oficina Destino
                            </label>
                            <select
                                name="oficinaDestino"
                                value={nuevaOficina}
                                onChange={(e) => setNuevaOficina(e.target.value)}
                                className="tw-w-full tw-p-2 tw-border tw-rounded"
                            >
                                <option value="">Seleccione...</option>
                                <option value="Adulto Mayor">Adulto Mayor</option>
                                <option value="Almacenista">Almacenista</option>
                                <option value="Apoyo 1 - Fredy">Apoyo 1 - Fredy</option>
                                <option value="Apoyo 2 - Orlando">Apoyo 2 - Orlando</option>
                                <option value="Apoyo 3 - Angela">Apoyo 3 - Angela</option>
                                <option value="Apoyo 4 - Katherine">Apoyo 4 - Katherine</option>
                                <option value="Apoyo 5 - Jimmy">Apoyo 5 - Jimmy</option>
                                <option value="Apoyo 6 - Cabrejo">Apoyo 6 - Cabrejo</option>
                                <option value="Apoyo 7 - Yate">Apoyo 7 - Yate</option>
                                <option value="Apoyo Almacén">Apoyo Almacén</option>
                                <option value="Apoyo Desarr. Comunitario">Apoyo Desarr. Comunitario</option>
                                <option value="Apoyo Famiacción 1">Apoyo Famiacción 1</option>
                                <option value="Apoyo Famiacción 2">Apoyo Famiacción 2</option>
                                <option value="Apoyo Famiacción 3">Apoyo Famiacción 3</option>
                                <option value="Apoyo Recepción">Apoyo Recepción</option>
                                <option value="Apoyo Rural 1">Apoyo Rural 1</option>
                                <option value="Apoyo Rural 3">Apoyo Rural 3</option>
                                <option value="Apoyo Spc 1">Apoyo Spc 1</option>
                                <option value="Apoyo Spc 2">Apoyo Spc 2</option>
                                <option value="Apoyo Spc 3">Apoyo Spc 3</option>
                                <option value="Apoyo Spc 4">Apoyo Spc 4</option>
                                <option value="Apoyo Spc 8">Apoyo Spc 8</option>
                                <option value="Auditoria">Auditoria</option>
                                <option value="Banco De Proyectos">Banco De Proyectos</option>
                                <option value="Biblioteca Darío Echandía Olaya">Biblioteca Darío Echandía Olaya</option>
                                <option value="Biblioteca Darío Vidales">Biblioteca Darío Vidales</option>
                                <option value="Campamento Municipal">Campamento Municipal</option>
                                <option value="Cis">Cis</option>
                                <option value="Comisaria De Familia">Comisaria De Familia</option>
                                <option value="Conductores Contratistas">Conductores Contratistas</option>
                                <option value="Contratacion 1">Contratacion 1</option>
                                <option value="Contratacion 2">Contratacion 2</option>
                                <option value="Contratacion 3">Contratacion 3</option>
                                <option value="Coord. Casa Cultura">Coord. Casa Cultura</option>
                                <option value="Coord. Casa Lúdica">Coord. Casa Lúdica</option>
                                <option value="Coord. Desarr. Comunitario">Coord. Desarr. Comunitario</option>
                                <option value="Control Interno">Control Interno</option>
                                <option value="Copasst">Copasst</option>
                                <option value="Corregidores">Corregidores</option>
                                <option value="Deportes">Deportes</option>
                                <option value="Despacho Alcalde">Despacho Alcalde</option>
                                <option value="Despacho Dls">Despacho Dls</option>
                                <option value="Despacho Ejecutivo">Despacho Ejecutivo</option>
                                <option value="Despacho Gobierno">Despacho Gobierno</option>
                                <option value="Despacho Hacienda">Despacho Hacienda</option>
                                <option value="Despacho Planeación">Despacho Planeación</option>
                                <option value="Despacho Rural">Despacho Rural</option>
                                <option value="Eléctrico Contratista">Eléctrico Contratista</option>
                                <option value="Enlace Familias En Acción">Enlace Familias En Acción</option>
                                <option value="Estratificación">Estratificación</option>
                                <option value="Gestion Documental">Gestion Documental</option>
                                <option value="Inspección De Policía">Inspección De Policía</option>
                                <option value="Mensajero">Mensajero</option>
                                <option value="Pagaduría">Pagaduría</option>
                                <option value="Presupuesto">Presupuesto</option>
                                <option value="Pvd Biblioteca">Pvd Biblioteca</option>
                                <option value="Pvd Medalla Milagrosa">Pvd Medalla Milagrosa</option>
                                <option value="Recepcion Alcalde">Recepcion Alcalde</option>
                                <option value="Recepcion Planeación">Recepcion Planeación</option>
                                <option value="Recepción Cri">Recepción Cri</option>
                                <option value="Recepción Dls">Recepción Dls</option>
                                <option value="Recepción Ejecutivo">Recepción Ejecutivo</option>
                                <option value="Recepción Gobierno">Recepción Gobierno</option>
                                <option value="Recepción Hacienda">Recepción Hacienda</option>
                                <option value="Regimen Subsidiado">Regimen Subsidiado</option>
                                <option value="Recaudo">Recaudo</option>
                                <option value="Servicios Administrativos">Servicios Administrativos</option>
                                <option value="Sistemas Y Tic">Sistemas Y Tic</option>
                                <option value="Tesorería">Tesorería</option>
                                <option value="Trabajadores Oficiales">Trabajadores Oficiales</option>
                                <option value="Vent. Unica">Vent. Unica</option>
                            </select>
                        </div>
                    )}

                    <div className="tw-flex tw-gap-4">
                        <button
                            onClick={() => {
                                setExpandedId(null);
                                setShouldRedirect(false);
                                setNuevaOficina("");
                            }}
                            className="tw-flex-1 tw-px-4 tw-py-2 tw-border tw-rounded tw-text-gray-700 hover:tw-bg-gray-100"
                        >
                            Regresar
                        </button>

                        {sol.estado !== 'resuelto' && (
                            <>
                                <button
                                    onClick={async () => {
                                        if (sol.id) {
                                            console.log('[CitizenRequestSearch] Marcar como resuelta: id', sol.id);
                                            await onResolve(sol.id);
                                            setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'resuelto' } : s));
                                            setExpandedId(null);
                                            setShouldRedirect(false);
                                            setNuevaOficina("");
                                        }
                                    }}
                                    className="tw-flex-1 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                                >
                                    Marcar como resuelta
                                </button>

                                {shouldRedirect && String(sol.estado) !== 'resuelto' && (
                                    <button
                                        onClick={() => {
                                            if (sol.id && nuevaOficina) {
                                                console.log('Redireccionar:', sol.id, nuevaOficina);
                                                onRedirect(sol.id, nuevaOficina);
                                                setExpandedId(null);
                                                setShouldRedirect(false);
                                                setNuevaOficina("");
                                            }
                                        }}
                                        className="tw-flex-1 tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                                    >
                                        Redireccionar
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Utilidad para formatear fecha a DD/MM/YYYY
    function formatearFecha(fecha: string) {
        if (!fecha || fecha === 'Sin fecha') return fecha;
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return fecha;
        return d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    // Ordenar resultados por fecha (desc) y por id (desc)
    const sortedResultados = resultados.slice().sort((a, b) => {
        const da = a.fecha ? new Date(a.fecha).getTime() : -Infinity;
        const db = b.fecha ? new Date(b.fecha).getTime() : -Infinity;
        if (db !== da) return db - da;
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        return idB - idA;
    });

    // Calcular paginación
    const totalItems = sortedResultados.length;
    const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = pageSize === 'all' ? 0 : (safeCurrentPage - 1) * pageSize;
    const endIndex = pageSize === 'all' ? totalItems : startIndex + pageSize;
    const pagedResultados = pageSize === 'all' ? sortedResultados : sortedResultados.slice(startIndex, endIndex);

    // Vista de lista agrupada
    if (detalleSolicitud) {
        return (
            <>
                <button
                    className="tw-mb-4 tw-bg-gray-200 tw-px-4 tw-py-2 tw-rounded hover:tw-bg-gray-300"
                    onClick={() => setExpandedId(null)}
                >
                    ← Volver a la lista
                </button>
                {detalleSolicitud}
            </>
        );
    }

    return (
        <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-mt-6">
            <h3 className="tw-text-2xl tw-font-bold tw-text-green-700 tw-mb-6">
                Búsqueda Avanzada de Solicitudes
            </h3>

            {/* Panel admin para seleccionar o forzar idPlan en una sola fila */}
            {rol === 'admin' && (
                <div className="tw-mb-6 tw-p-4 tw-bg-yellow-50 tw-border tw-border-yellow-300 tw-rounded">
                    <label className="tw-block tw-font-medium tw-mb-2">Seleccionar o forzar idPlan para la consulta</label>
                    <div className="tw-flex tw-gap-2 tw-items-center">
                        {planes.length > 0 && (
                            <select
                                className="tw-p-2 tw-border tw-rounded"
                                value={activeIdPlan}
                                onChange={e => setActiveIdPlan(e.target.value)}
                            >
                                {planes.map(plan => (
                                    <option key={plan.id_plan} value={String(plan.id_plan)}>{plan.name} ({plan.department})</option>
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
                            onClick={() => setActiveIdPlan(forcedIdPlan || id_plan)}
                        >
                            Actualizar
                        </button>
                        <span className="tw-text-xs tw-ml-2">Id actual: <span className="tw-font-bold">{activeIdPlan}</span></span>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="tw-grid md:tw-grid-cols-3 tw-gap-4 tw-mb-6">
                {(["estado", "nombre", "documento", "servicio", "oficina"] as (keyof typeof filtros)[]).map(
                    (campo) => (
                        <div key={campo}>
                            <label className="tw-block tw-font-medium tw-mb-1">
                                {campo.charAt(0).toUpperCase() + campo.slice(1)}
                            </label>
                            {campo === "estado" ? (
                                <select
                                    value={filtros.estado}
                                    onChange={(e) => handleChangeFiltro("estado", e.target.value)}
                                    className="tw-w-full tw-p-2 tw-border tw-rounded"
                                >
                                    <option value="pendiente">Pendientes</option>
                                    <option value="en proceso">En espera</option>
                                    <option value="resuelto">Resuelto</option>
                                    <option value="todos">Todos</option>
                                </select>
                            ) : campo === "oficina" ? (
                                <select
                                    value={filtros.oficina}
                                    onChange={(e) => handleChangeFiltro("oficina", e.target.value)}
                                    className="tw-w-full tw-p-2 tw-border tw-rounded"
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="Adulto Mayor">Adulto Mayor</option>
                                    <option value="Almacenista">Almacenista</option>
                                    <option value="Apoyo 1 - Fredy">Apoyo 1 - Fredy</option>
                                    <option value="Apoyo 2 - Orlando">Apoyo 2 - Orlando</option>
                                    <option value="Apoyo 3 - Angela">Apoyo 3 - Angela</option>
                                    <option value="Apoyo 4 - Katherine">Apoyo 4 - Katherine</option>
                                    <option value="Apoyo 5 - Jimmy">Apoyo 5 - Jimmy</option>
                                    <option value="Apoyo 6 - Cabrejo">Apoyo 6 - Cabrejo</option>
                                    <option value="Apoyo 7 - Yate">Apoyo 7 - Yate</option>
                                    <option value="Apoyo Almacén">Apoyo Almacén</option>
                                    <option value="Apoyo Desarr. Comunitario">Apoyo Desarr. Comunitario</option>
                                    <option value="Apoyo Famiacción 1">Apoyo Famiacción 1</option>
                                    <option value="Apoyo Famiacción 2">Apoyo Famiacción 2</option>
                                    <option value="Apoyo Famiacción 3">Apoyo Famiacción 3</option>
                                    <option value="Apoyo Recepción">Apoyo Recepción</option>
                                    <option value="Apoyo Rural 1">Apoyo Rural 1</option>
                                    <option value="Apoyo Rural 3">Apoyo Rural 3</option>
                                    <option value="Apoyo Spc 1">Apoyo Spc 1</option>
                                    <option value="Apoyo Spc 2">Apoyo Spc 2</option>
                                    <option value="Apoyo Spc 3">Apoyo Spc 3</option>
                                    <option value="Apoyo Spc 4">Apoyo Spc 4</option>
                                    <option value="Apoyo Spc 8">Apoyo Spc 8</option>
                                    <option value="Auditoria">Auditoria</option>
                                    <option value="Banco De Proyectos">Banco De Proyectos</option>
                                    <option value="Biblioteca Darío Echandía Olaya">Biblioteca Darío Echandía Olaya</option>
                                    <option value="Biblioteca Darío Vidales">Biblioteca Darío Vidales</option>
                                    <option value="Campamento Municipal">Campamento Municipal</option>
                                    <option value="Cis">Cis</option>
                                    <option value="Comisaria De Familia">Comisaria De Familia</option>
                                    <option value="Conductores Contratistas">Conductores Contratistas</option>
                                    <option value="Contratacion 1">Contratacion 1</option>
                                    <option value="Contratacion 2">Contratacion 2</option>
                                    <option value="Contratacion 3">Contratacion 3</option>
                                    <option value="Coord. Casa Cultura">Coord. Casa Cultura</option>
                                    <option value="Coord. Casa Lúdica">Coord. Casa Lúdica</option>
                                    <option value="Coord. Desarr. Comunitario">Coord. Desarr. Comunitario</option>
                                    <option value="Control Interno">Control Interno</option>
                                    <option value="Copasst">Copasst</option>
                                    <option value="Corregidores">Corregidores</option>
                                    <option value="Deportes">Deportes</option>
                                    <option value="Despacho Alcalde">Despacho Alcalde</option>
                                    <option value="Despacho Dls">Despacho Dls</option>
                                    <option value="Despacho Ejecutivo">Despacho Ejecutivo</option>
                                    <option value="Despacho Gobierno">Despacho Gobierno</option>
                                    <option value="Despacho Hacienda">Despacho Hacienda</option>
                                    <option value="Despacho Planeación">Despacho Planeación</option>
                                    <option value="Despacho Rural">Despacho Rural</option>
                                    <option value="Eléctrico Contratista">Eléctrico Contratista</option>
                                    <option value="Enlace Familias En Acción">Enlace Familias En Acción</option>
                                    <option value="Estratificación">Estratificación</option>
                                    <option value="Gestion Documental">Gestion Documental</option>
                                    <option value="Inspección De Policía">Inspección De Policía</option>
                                    <option value="Mensajero">Mensajero</option>
                                    <option value="Pagaduría">Pagaduría</option>
                                    <option value="Presupuesto">Presupuesto</option>
                                    <option value="Pvd Biblioteca">Pvd Biblioteca</option>
                                    <option value="Pvd Medalla Milagrosa">Pvd Medalla Milagrosa</option>
                                    <option value="Recepcion Alcalde">Recepcion Alcalde</option>
                                    <option value="Recepcion Planeación">Recepcion Planeación</option>
                                    <option value="Recepción Cri">Recepción Cri</option>
                                    <option value="Recepción Dls">Recepción Dls</option>
                                    <option value="Recepción Ejecutivo">Recepción Ejecutivo</option>
                                    <option value="Recepción Gobierno">Recepción Gobierno</option>
                                    <option value="Recepción Hacienda">Recepción Hacienda</option>
                                    <option value="Regimen Subsidiado">Regimen Subsidiado</option>
                                    <option value="Recaudo">Recaudo</option>
                                    <option value="Servicios Administrativos">Servicios Administrativos</option>
                                    <option value="Sistemas Y Tic">Sistemas Y Tic</option>
                                    <option value="Tesorería">Tesorería</option>
                                    <option value="Trabajadores Oficiales">Trabajadores Oficiales</option>
                                    <option value="Vent. Unica">Vent. Unica</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={filtros[campo]}
                                    onChange={(e) => handleChangeFiltro(campo, e.target.value)}
                                    className="tw-w-full tw-p-2 tw-border tw-rounded"
                                    placeholder={`Filtrar por ${campo}`}
                                />
                            )}
                        </div>
                    )
                )}
            </div>

            {/* Controles de paginación y tamaño de página */}
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4 tw-gap-4">
                <div className="tw-flex tw-items-center tw-gap-2">
                    <span className="tw-text-sm tw-text-gray-600">Mostrar</span>
                    <select
                        className="tw-p-2 tw-border tw-rounded"
                        value={pageSize === 'all' ? 'all' : String(pageSize)}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (v === 'all') {
                                setPageSize('all');
                                setCurrentPage(1);
                            } else {
                                const n = Number(v) as 10 | 50 | 100;
                                setPageSize(n);
                                setCurrentPage(1);
                            }
                        }}
                    >
                        <option value="10">10</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="all">Todos</option>
                    </select>
                    <span className="tw-text-sm tw-text-gray-600">registros</span>
                </div>
                <div className="tw-text-sm tw-text-gray-600">
                    {totalItems === 0 ? 'Sin resultados' : `Mostrando ${pageSize === 'all' ? 1 : startIndex + 1}-${pageSize === 'all' ? totalItems : Math.min(endIndex, totalItems)} de ${totalItems}`}
                </div>
                <div className="tw-flex tw-items-center tw-gap-2">
                    <button
                        className="tw-px-3 tw-py-2 tw-border tw-rounded tw-text-sm disabled:tw-opacity-50"
                        onClick={() => setCurrentPage(1)}
                        disabled={safeCurrentPage <= 1}
                    >
                        « Primero
                    </button>
                    <button
                        className="tw-px-3 tw-py-2 tw-border tw-rounded tw-text-sm disabled:tw-opacity-50"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={safeCurrentPage <= 1}
                    >
                        ‹ Anterior
                    </button>
                    <span className="tw-text-sm tw-text-gray-700">{safeCurrentPage} / {totalPages}</span>
                    <button
                        className="tw-px-3 tw-py-2 tw-border tw-rounded tw-text-sm disabled:tw-opacity-50"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={safeCurrentPage >= totalPages}
                    >
                        Siguiente ›
                    </button>
                    <button
                        className="tw-px-3 tw-py-2 tw-border tw-rounded tw-text-sm disabled:tw-opacity-50"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={safeCurrentPage >= totalPages}
                    >
                        Último »
                    </button>
                </div>
            </div>

            {/* Tabla de resultados */}
            <div className="tw-overflow-auto">
                <table className="tw-min-w-full tw-border tw-rounded-2xl tw-overflow-hidden">
                    <thead className="tw-bg-gray-50">
                        <tr>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Ticket</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Fecha</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Documento</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Nombre</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Servicio</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Cantidad</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Prioridad</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Estado</th>
                            <th className="tw-text-left tw-text-xs tw-font-semibold tw-text-gray-600 tw-px-4 tw-py-2">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedResultados.map((s) => (
                            <tr
                                key={s.id}
                                onClick={() => setExpandedId(s.id || null)}
                                className="hover:tw-bg-gray-50 tw-cursor-pointer"
                            >
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.Ticket_ID ?? 'N/A'}</td>
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.fecha ? formatearFecha(s.fecha) : 'N/A'}</td>
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.documento || 'N/A'}</td>
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.nombre || 'N/A'}</td>
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.servicio || 'N/A'}</td>
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.cantidadServicio ?? 'N/A'}</td>
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.prioridad || 'N/A'}</td>
                                <td className="tw-border-t tw-px-4 tw-py-2">{s.estado || 'N/A'}</td>
                                <td className="tw-p-3 tw-text-center">
                                    <button
                                        onClick={() => setExpandedId(s.id!)}
                                        className="tw-bg-blue-500 tw-text-white tw-px-3 tw-py-1 tw-rounded hover:tw-bg-blue-600"
                                    >
                                        Ver detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pagedResultados.length === 0 && (
                            <tr>
                                <td className="tw-text-center tw-text-sm tw-text-gray-500 tw-px-4 tw-py-6" colSpan={9}>No hay resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CitizenRequestSearch;
