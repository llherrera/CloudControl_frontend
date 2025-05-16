import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CitizenRequestForm from './CitizenRequestForm';
import CitizenRequestSearch from './CitizenRequestSearch';
import { useAppDispatch } from '@/store';
import { thunkGetAllSolicitudes, thunkRedirectionSolicitud, thunkSolveSolicitud } from '../store/pqrs/thunks'; // Asegúrate de que la ruta sea correcta
import { thunkAddSolicitud } from '../store/pqrs/thunks';

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

const ManagerCitizenAttention: React.FC = () => {
    const [modo, setModo] = useState('nueva');
    const dispatch = useAppDispatch();
    const [solicitudes, setSolicitudes] = useState<FormData[]>([

        {
            id: '1',
            fecha: '2023-10-01',
            nombre: 'Juan Pérez',
            tipoDocumento: 'Cédula',
            documento: '123456789',
            genero: 'Masculino',
            grupoEtario: 'Adulto',
            poblacional: 'General',
            discapacidad: 'Ninguna',
            escolaridad: 'Universitaria',
            nacionalidad: 'Colombiana',
            area: 'Urbano',
            servicio: 'Salud',
            prioridad: 'Alta',
            tipoAtencion: 'Presencial',
            redireccionar: false,
            funcionario: 'Funcionario 1',
            estado: 'pendiente'
        },
        {
            id: '2',
            fecha: '2023-10-02',
            nombre: 'María López',
            tipoDocumento: 'Pasaporte',
            documento: '987654321',
            genero: 'Femenino',
            grupoEtario: 'Joven',
            poblacional: 'Desplazado',
            discapacidad: 'Visual',
            escolaridad: 'Secundaria',
            nacionalidad: 'Venezolana',
            area: 'Rural',
            servicio: 'Educación',
            prioridad: 'Media',
            tipoAtencion: 'Llamada telefónica',
            redireccionar: true,
            oficinaDestino: 'Oficina 2',
            funcionario: 'Funcionario 2',
            estado: 'en proceso'
        }
    ]);


    const fetchSolicitudes = async () => {
        const id_plan = localStorage.getItem('id_plan'); // Obtener el id_plan desde localStorage
        if (!id_plan) {
            console.error("No se encontró id_plan en localStorage");
            return;
        }
        dispatch(thunkGetAllSolicitudes({ id_plan }))
            .unwrap()
            .then((result: any) => {
                setSolicitudes(result); // Actualiza el estado con las solicitudes obtenidas
            })
            .catch((error: any) => {
                console.error("Error al obtener solicitudes:", error);
            });
    };

    useEffect(() => {
        fetchSolicitudes();
    }, [dispatch]);

    const handleBuscarSolicitudes = () => {
        setModo('buscar'); // Asegúrate de que el modo se actualice a 'buscar'
    };

    const handleRedirect = (id: string, oficinaDestino: string) => {
        dispatch(thunkRedirectionSolicitud({ id_solicitud: id, oficinaDestino }))
            .unwrap()
            .then(() => {
                fetchSolicitudes(); // Vuelve a cargar las solicitudes
            })
            .catch((error: any) => {
                console.error("Error al redirigir la solicitud:", error);
            });
    };
    
    const handleResolve = (id: string) => {
        dispatch(thunkSolveSolicitud({ id_solicitud: id }))
            .unwrap()
            .then(() => {
                fetchSolicitudes(); // Vuelve a cargar las solicitudes
            })
            .catch((error: any) => {
                console.error("Error al resolver la solicitud:", error);
            });
    };
    


    const obtenerFechaActual = () => {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
        const anio = fecha.getFullYear();

        return `${anio}-${mes}-${dia}`;
    };

    // Uso de la función en el formato de la solicitud
    const formatSolicitud = (solicitud: FormData) => {
        const area = solicitud.area;
        let barrio = null;
        let comuna = null;
        let corregimiento = null;
        let vereda = null;

        if (area === "Urbano") {
            barrio = solicitud.barrio;
            comuna = solicitud.comuna; // Aquí puedes obtener la comuna del optgroup correspondiente
        } else if (area === "Rural") {
            corregimiento = solicitud.corregimiento;
            vereda = solicitud.vereda; // Aquí puedes obtener la vereda del optgroup correspondiente
        }

        const fechaActual = obtenerFechaActual();

        return {
            fecha: fechaActual,
            nombre: solicitud.nombre,
            tipoDocumento: solicitud.tipoDocumento,
            documento: solicitud.documento,
            genero: solicitud.genero,
            grupo: solicitud.grupoEtario,
            poblacional: solicitud.poblacional === "Otro" ? solicitud.otroPoblacional : solicitud.poblacional,
            discapacidad: solicitud.discapacidad === "Otro" ? solicitud.otraDiscapacidad : solicitud.discapacidad,
            escolaridad: solicitud.escolaridad === "Otro" ? solicitud.otraEscolaridad : solicitud.escolaridad,
            nacionalidad: solicitud.nacionalidad,
            telefono: solicitud.telefono,
            correo: solicitud.correo,
            barrio: barrio,
            comuna: comuna,
            corregimiento: corregimiento,
            vereda: vereda,
            servicio: solicitud.servicio === "Otro" ? solicitud.otroServicio : solicitud.servicio,
            prioridad: solicitud.prioridad,
            tipoAtencion: solicitud.tipoAtencion,
            modoAtencion: solicitud.modoAtencion,
            duracion: solicitud.duracion,
            exclusividad: solicitud.exclusividad,
            tipoUsuario: solicitud.tipoUsuario,
            redireccionar: solicitud.redireccionar,
            oficinaDestino: solicitud.redireccionar ? solicitud.oficinaDestino : null,
            dependencia: solicitud.dependencia,
            funcionario: localStorage.getItem("user") as string,
            estado: solicitud.redireccionar ? solicitud.estado : 'resuelto',
            fechaResolucion: solicitud.redireccionar ? null : fechaActual,
            solicitudPadre: solicitud.solicitudPadre || null,
            usuarioId: localStorage.getItem("id") as string, // Asegúrate de que esta propiedad exista en tu lógi,
            razonRedireccionamiento: solicitud.razonRedireccionamiento || null
        };
    };

    // Uso de la función antes de enviar la solicitud
    const onNuevaSolicitud = (solicitud: FormData) => {
        const formattedSolicitud = formatSolicitud(solicitud);
        dispatch(thunkAddSolicitud(formattedSolicitud));
    };




    return (
        <div className="tw-bg-gray-100 tw-p-6 tw-rounded-lg tw-shadow-md">
            <div className="tw-flex tw-justify-center tw-gap-4 tw-mb-6">
                <button
                    onClick={() => setModo("nueva")}
                    className={`tw-px-4 tw-py-2 tw-font-semibold tw-rounded ${modo === "nueva"
                        ? "tw-bg-green-600 tw-text-white"
                        : "tw-bg-white tw-border tw-text-green-600"
                        }`}
                >
                    Nueva Solicitud
                </button>
                <button
                    onClick={handleBuscarSolicitudes}
                    className={`tw-px-4 tw-py-2 tw-font-semibold tw-rounded ${modo === "buscar"
                        ? "tw-bg-blue-600 tw-text-white"
                        : "tw-bg-white tw-border tw-text-blue-600"
                        }`}
                >
                    Buscar Solicitud
                </button>
            </div>

            {modo === "nueva" ? (
                <CitizenRequestForm
                    onNuevaSolicitud={(sol) => {
                        onNuevaSolicitud(sol);
                        setSolicitudes((prev) => [...prev, sol]);
                    }}
                />
            ) : (
                <CitizenRequestSearch
                    solicitudes={solicitudes}
                    onRedirect={handleRedirect}
                    onResolve={handleResolve}
                />
            )}
        </div>
    );
};

export default ManagerCitizenAttention;

