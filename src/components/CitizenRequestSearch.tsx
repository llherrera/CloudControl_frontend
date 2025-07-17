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
            console.log('Token decodificado:', decoded);
        }
    }, [token_info]);

    useEffect(() => {
        if (!activeIdPlan) return;
        dispatch(thunkGetAllSolicitudes({ id_plan: activeIdPlan }))
            .unwrap()
            .then((res: any) => {
                console.log('Solicitudes recibidas del thunk:', res);
                if (Array.isArray(res)) setSolicitudes(res);
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
            <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-mt-6">
                
                <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-mt-6">

                    <h3 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-800">
                        Detalle de la Solicitud #{sol.id}
                    </h3>

                    <div className="tw-space-y-4 tw-text-base tw-text-gray-700 tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow">
                        <p><span className="tw-font-semibold">Fecha:</span> {sol.fecha}</p>

                        {sol.oficinaDestino && (
                            <p>
                                <span className="tw-font-semibold">Oficina Destino:</span> {sol.oficinaDestino}
                            </p>
                        )}

                        <p><span className="tw-font-semibold">Nombre:</span> {sol.nombre}</p>
                        <p><span className="tw-font-semibold">Documento:</span> {sol.tipoDocumento} {sol.documento}</p>
                        <p><span className="tw-font-semibold">Género:</span> {sol.genero}</p>
                        <p><span className="tw-font-semibold">Grupo etario:</span> {sol.grupo}</p>
                        <p><span className="tw-font-semibold">Poblacional:</span> {sol.poblacional}</p>
                        <p><span className="tw-font-semibold">Discapacidad:</span> {sol.discapacidad}</p>
                        <p><span className="tw-font-semibold">Escolaridad:</span> {sol.escolaridad}</p>
                        <p><span className="tw-font-semibold">Nacionalidad:</span> {sol.nacionalidad}</p>
                        <p>
                            <span className="tw-font-semibold">Ubicación:</span>{" "}
                            {[sol.barrio, sol.comuna, sol.corregimiento, sol.vereda]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                        <p><span className="tw-font-semibold">Servicio:</span> {sol.servicio}</p>
                        <p><span className="tw-font-semibold">Prioridad:</span> {sol.prioridad}</p>
                        <p><span className="tw-font-semibold">Tipo Atención:</span> {sol.tipoAtencion}</p>
                        <p><span className="tw-font-semibold">Dependencia:</span> {sol.dependencia}</p>
                        <p><span className="tw-font-semibold">Funcionario:</span> {sol.funcionario}</p>
                        <p><span className="tw-font-semibold">Estado:</span> {sol.estado}</p>
                        <p><span className="tw-font-semibold">Fecha Resolución:</span> {sol.fechaResolucion || "—"}</p>

                        {/* Nuevos campos */}
                        {sol.modoAtencion && (
                            <p><span className="tw-font-semibold">Modo de Atención:</span> {sol.modoAtencion}</p>
                        )}

                        {sol.duracion && (
                            <p><span className="tw-font-semibold">Duración (minutos):</span> {sol.duracion}</p>
                        )}

                        {sol.exclusividad && (
                            <p><span className="tw-font-semibold">Exclusividad:</span> {sol.exclusividad}</p>
                        )}

                        {sol.tipoUsuario && (
                            <p><span className="tw-font-semibold">Tipo de Usuario:</span> {sol.tipoUsuario}</p>
                        )}

                        {sol.razonRedireccionamiento && (
                            <p><span className="tw-font-semibold">Razón de Redireccionamiento:</span> {sol.razonRedireccionamiento}</p>
                        )}
                        {sol.cantidadServicio !== undefined && sol.cantidadServicio !== null && (
                            <p><span className="tw-font-semibold">Cantidad de Servicio:</span> {sol.cantidadServicio}</p>
                        )}
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
                                            // Actualizar localmente el estado de la solicitud a 'resuelto'
                                            setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'resuelto' } : s));
                                            console.log('[CitizenRequestSearch] Estado local actualizado a resuelto para id', sol.id);
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
                                                // refreshSolicitudes();
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

    // Agrupar y ordenar solicitudes por fecha y por id descendente
    const solicitudesAgrupadas = resultados.reduce((acc: Record<string, FormData[]>, solicitud) => {
        const fecha = solicitud.fecha || 'Sin fecha';
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(solicitud);
        return acc;
    }, {});
    // Ordenar fechas de más reciente a más vieja
    const fechasOrdenadas = Object.keys(solicitudesAgrupadas).sort((a, b) => {
        // Manejar fechas vacías o inválidas
        if (a === 'Sin fecha') return 1;
        if (b === 'Sin fecha') return -1;
        return new Date(b).getTime() - new Date(a).getTime();
    });

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

            {/* Lista agrupada por fecha */}
            <div className="tw-space-y-8">
                {fechasOrdenadas.map(fecha => (
                    <div key={fecha}>
                        <div className="tw-font-bold tw-text-lg tw-mb-2 tw-text-gray-700">
                            {formatearFecha(fecha)}
                        </div>
                        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-6">
                            {solicitudesAgrupadas[fecha]
                                .slice()
                                .sort((a, b) => {
                                    // Ordenar por id descendente (más reciente primero)
                                    const idA = Number(a.id) || 0;
                                    const idB = Number(b.id) || 0;
                                    return idB - idA;
                                })
                                .map((s) => {
                                    const borderColor =
                                        s.estado === "pendiente"
                                            ? "tw-border-yellow-500"
                                            : s.prioridad === "Alta"
                                                ? "tw-border-red-500"
                                                : s.prioridad === "Media"
                                                    ? "tw-border-orange-500"
                                                    : "tw-border-green-500";

                                    return (
                                        <div
                                            key={s.id}
                                            onClick={() => setExpandedId(s.id || null)}
                                            className={`tw-border ${borderColor} tw-rounded-2xl tw-shadow-sm tw-p-5 tw-transition hover:tw-shadow-md tw-cursor-pointer`}
                                        >
                                            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                                                <h5 className="tw-font-semibold tw-text-lg">
                                                    Solicitud #{s.id}
                                                </h5>
                                                <span className="tw-text-sm tw-text-gray-500">
                                                    {formatearFecha(s.fecha || '')}
                                                </span>
                                            </div>
                                            <div className="tw-flex tw-gap-4 tw-flex-wrap tw-text-sm">
                                                <p>
                                                    <strong>Nombre:</strong> {s.nombre}
                                                </p>
                                                <p>
                                                    <strong>Servicio:</strong> {s.servicio}
                                                </p>
                                                {s.cantidadServicio !== undefined && s.cantidadServicio !== null && (
                                                    <p><strong>Cantidad:</strong> {s.cantidadServicio}</p>
                                                )}
                                                <p>
                                                    <strong>Prioridad:</strong> {s.prioridad}
                                                </p>
                                                <p>
                                                    <strong>Estado:</strong> {s.estado}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CitizenRequestSearch;
