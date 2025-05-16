import React, { useState, useEffect } from "react";

interface FormData {
    id?: string;
    fecha?: string;
    nombre: string;
    tipoDocumento: string;
    documento: string;
    genero: string;
    grupoEtario: string;
    poblacional: string;
    otroPoblacional?: string;
    discapacidad: string;
    otraDiscapacidad?: string;
    escolaridad: string;
    otraEscolaridad?: string;
    nacionalidad: string;
    telefono?: string;
    correo?: string;
    area: string;
    barrio?: string;
    comuna?: string;
    corregimiento?: string;
    vereda?: string;
    servicio: string;
    otroServicio?: string;
    prioridad: string;
    tipoAtencion: string;
    modoAtencion?: string;
    duracion?: string;
    exclusividad?: string;
    tipoUsuario?: string;
    redireccionar: boolean;
    oficinaDestino?: string;
    dependencia?: string;
    funcionario: string;
    estado: 'pendiente' | 'en proceso' | 'resuelto';
    fechaResolucion?: string | null;
    solicitudPadre?: string;
    usuarioId?: string;
    razonRedireccionamiento?: string;
}

interface Props {
    solicitudes: FormData[];
    onRedirect: (id: string, oficinaDestino: string) => void;
    onResolve: (id: string) => void;
}

export const CitizenRequestSearch: React.FC<Props> = ({
    solicitudes,
    onRedirect,
    onResolve,
}) => {
    // Obtener el valor de oficina desde localStorage
    const oficinaDefault = localStorage.getItem('office') || "";

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

    // Vista de detalle
    if (expandedId) {
        const sol = solicitudes.find((s) => s.id === expandedId)!;

        return (
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
                        <p><span className="tw-font-semibold">Grupo etario:</span> {sol.grupoEtario}</p>
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
                    </div>
                </div>


                {/* Acciones */}
                <div className="tw-mt-6 tw-space-y-4">
                    <label className="tw-flex tw-items-center tw-gap-2">
                        <input
                            type="checkbox"
                            checked={shouldRedirect}
                            onChange={(e) => setShouldRedirect(e.target.checked)}
                            className="tw-form-checkbox"
                        />
                        <span>Redireccionar solicitud</span>
                    </label>

                    {shouldRedirect && (
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

                        <button
                            onClick={() => {
                                if (sol.id) {
                                    onResolve(sol.id);
                                    setExpandedId(null);
                                    setShouldRedirect(false);
                                    setNuevaOficina("");
                                }
                            }}
                            className="tw-flex-1 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                        >
                            Marcar como resuelta
                        </button>

                        <button
                            onClick={() => {
                                if (sol.id && nuevaOficina) {
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
                    </div>
                </div>
            </div>
        );
    }

    // Vista de lista
    return (
        <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-mt-6">
            <h3 className="tw-text-2xl tw-font-bold tw-text-green-700 tw-mb-6">
                Búsqueda Avanzada de Solicitudes
            </h3>

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

            {/* Lista */}
            <div className="tw-grid lg:tw-grid-cols-2 tw-gap-6">
                {resultados.map((s) => {
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
                                    {s.fecha}
                                </span>
                            </div>
                            <div className="tw-flex tw-gap-4 tw-flex-wrap tw-text-sm">
                                <p>
                                    <strong>Nombre:</strong> {s.nombre}
                                </p>
                                <p>
                                    <strong>Servicio:</strong> {s.servicio}
                                </p>
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
    );
};

export default CitizenRequestSearch;
