import { useState, useEffect } from 'react';
import { thunkDeleteEvidence } from '@/store/evidence/thunks';
import { EvidenceDetailProps } from '@/interfaces';
import { useAppDispatch, useAppSelector } from '@/store';
import { decode } from "@/utils";

interface ShowEvidenceProps extends EvidenceDetailProps {
  handleEvidence: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  forceExpand?: boolean;
}

export const ShowEvidence = ({ evi, index, handleEvidence, isExpanded, onToggle, forceExpand }: ShowEvidenceProps) => {
  const dispatch = useAppDispatch();
  const { token_info } = useAppSelector(store => store.auth);
  const { id_plan } = useAppSelector(store => store.content);

  const [internalExpanded, setInternalExpanded] = useState(false);
  const effectiveExpanded = isExpanded !== undefined ? isExpanded : (forceExpand !== undefined ? forceExpand : internalExpanded);
  const handleToggle = onToggle || (() => setInternalExpanded(prev => !prev));

  const [showModal, setShowModal] = useState(false);
  const [rol, setRol] = useState("");
  const [user, setUser] = useState("");
  const [id, setId] = useState(0);

  useEffect(() => {
    if (token_info?.token !== undefined) {
      const decoded = decode(token_info.token);
      setRol(decoded.rol);
      setId(decoded.id_plan);
      setUser(decoded.user);
    }
  }, []);

  const handleDeleteConfirm = () => {
    dispatch(thunkDeleteEvidence(evi.id_evidence));
    setShowModal(false);
    handleEvidence();
  };

  const formatDate = (val?: string) => {
    if (!val) return '-';
    try {
      return val.split('T')[0];
    } catch {
      return val;
    }
  };

  const getSupportCount = (fileLink?: string) => {
    if (!fileLink) return 0;
    if (fileLink.startsWith('[')) {
      try {
        const list = JSON.parse(fileLink);
        if (Array.isArray(list)) return list.length;
      } catch {}
    }
    return 1;
  };

  const supportCount = getSupportCount(evi.file_link);

  const renderSupports = (fileLink?: string) => {
    if (!fileLink) {
      return (
        <span className="tw-text-xs tw-text-gray-400 tw-italic">
          No hay soportes adjuntos
        </span>
      );
    }

    if (fileLink.startsWith('[')) {
      try {
        const list = JSON.parse(fileLink);
        if (Array.isArray(list) && list.length > 0) {
          return (
            <div className="tw-flex tw-flex-wrap tw-gap-2.5 tw-mt-1">
              {list.map((item: any, idx: number) => {
                const href = item.link || item.url;
                const isPdf = item.type === 'file' || (href && href.includes('.pdf'));
                const label = item.name
                  ? item.name
                  : isPdf
                  ? `Archivo PDF #${idx + 1}`
                  : `Enlace Web #${idx + 1}`;

                if (!href) {
                  return (
                    <div
                      key={idx}
                      className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-text-xs"
                    >
                      <span>📄</span>
                      <span className="tw-font-medium tw-text-gray-700">{label}</span>
                      {item.place && <span className="tw-text-gray-400">({item.place})</span>}
                    </div>
                  );
                }

                return (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-flex tw-items-center tw-gap-2 tw-bg-white hover:tw-bg-blue-50 tw-border-2 tw-border-blue-400 hover:tw-border-blue-600 tw-rounded-md tw-px-3 tw-py-2 tw-text-xs tw-transition-all tw-shadow-sm"
                  >
                    <span className="tw-text-base">{isPdf ? '📄' : '🔗'}</span>
                    <div className="tw-flex tw-flex-col">
                      <span className="tw-font-bold tw-text-blue-900 hover:tw-underline">
                        {label}
                      </span>
                      <span className="tw-text-[11px] tw-text-gray-500">
                        {isPdf ? 'Documento PDF' : 'Enlace Web'}
                        {item.place ? ` • ${item.place}` : ''}
                      </span>
                    </div>
                    <span className="tw-text-blue-500 tw-font-bold tw-ml-1">↗</span>
                  </a>
                );
              })}
            </div>
          );
        }
      } catch {}
    }

    return (
      <div className="tw-mt-1">
        <a
          href={fileLink}
          target="_blank"
          rel="noopener noreferrer"
          className="tw-inline-flex tw-items-center tw-gap-2 tw-bg-white hover:tw-bg-blue-50 tw-border-2 tw-border-blue-400 hover:tw-border-blue-600 tw-rounded-md tw-px-3.5 tw-py-2 tw-text-xs tw-transition-all tw-shadow-sm"
        >
          <span className="tw-text-base">🔗</span>
          <div className="tw-flex tw-flex-col">
            <span className="tw-font-bold tw-text-blue-900">
              {evi.name_file || 'Ver Soporte Principal'}
            </span>
            <span className="tw-text-[11px] tw-text-gray-500">
              {fileLink.includes('firebasestorage') ? 'Archivo PDF en almacenamiento' : 'Enlace Web'}
            </span>
          </div>
          <span className="tw-text-blue-500 tw-font-bold tw-ml-1">↗</span>
        </a>
      </div>
    );
  };

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-border-2 tw-border-black tw-shadow-md hover:tw-shadow-lg tw-transition-all tw-overflow-hidden">
        {/* Fila Resumen / Vista Minimizada interactiva */}
        <div
          onClick={handleToggle}
          className="tw-p-3.5 tw-cursor-pointer hover:tw-bg-slate-50 tw-transition-colors tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center tw-justify-between tw-gap-3"
        >
          {/* Datos clave de resumen */}
          <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2.5">
            <span className="tw-bg-yellow-300 tw-text-black tw-border tw-border-black tw-font-bold tw-text-xs tw-px-2.5 tw-py-1 tw-rounded">
              #{index + 1}
            </span>
            <span className="tw-text-xs tw-font-bold tw-text-gray-700">
              📅 {formatDate(evi.date)}
            </span>
            <span className="tw-bg-blue-100 tw-text-blue-900 tw-border tw-border-blue-300 tw-font-bold tw-text-xs tw-px-2.5 tw-py-1 tw-rounded">
              ⚡ {evi.amount} {evi.unit}
            </span>
            <span className="tw-bg-gray-100 tw-text-gray-800 tw-border tw-border-gray-300 tw-text-xs tw-px-2.5 tw-py-1 tw-rounded">
              📍 {evi.commune || 'Sin comuna'}{evi.neighborhood ? ` • ${evi.neighborhood}` : ''}
            </span>
            {supportCount > 0 && (
              <span className="tw-bg-emerald-100 tw-text-emerald-900 tw-border tw-border-emerald-300 tw-text-xs tw-font-bold tw-px-2 tw-py-1 tw-rounded">
                📎 {supportCount} {supportCount === 1 ? 'soporte' : 'soportes'}
              </span>
            )}
          </div>

          {/* Botones de acción (Expandir / Eliminar) */}
          <div className="tw-flex tw-items-center tw-gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleToggle}
              className="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-border tw-border-black tw-text-xs tw-font-bold tw-px-3 tw-py-1.5 tw-rounded tw-flex tw-items-center tw-gap-1"
            >
              <span>{effectiveExpanded ? 'Ocultar detalle ▲' : 'Ver detalle ▼'}</span>
            </button>

            {rol === 'admin' || (rol === 'funcionario' && id === id_plan) ? (
              <button
                className="tw-bg-red-500 hover:tw-bg-red-700 tw-text-white tw-border tw-border-black tw-text-xs tw-font-bold tw-px-2.5 tw-py-1.5 tw-rounded active:tw-scale-95"
                onClick={() => setShowModal(true)}
                title="Eliminar evidencia"
              >
                Eliminar
              </button>
            ) : null}
          </div>
        </div>

        {/* Resumen breve de actividad en vista minimizada */}
        {!effectiveExpanded && evi.activitiesDesc && (
          <div
            onClick={handleToggle}
            className="tw-px-4 tw-py-2 tw-bg-slate-50 tw-border-t tw-border-gray-200 tw-text-xs tw-text-gray-600 tw-truncate tw-cursor-pointer hover:tw-text-gray-900"
            title="Haga clic para ver toda la información"
          >
            <span className="tw-font-bold tw-text-gray-700">Actividad: </span>
            {evi.activitiesDesc}
          </div>
        )}

        {/* Vista Extendida con Toda la Información */}
        {effectiveExpanded && (
          <div className="tw-p-5 tw-border-t-2 tw-border-gray-300 tw-bg-white tw-flex tw-flex-col tw-gap-4">
            {/* Descripción completa */}
            <div>
              <h4 className="tw-text-xs tw-uppercase tw-font-bold tw-text-gray-600 tw-tracking-wide tw-mb-1.5">
                Descripción detallada de actividades
              </h4>
              <p className="tw-text-sm tw-text-gray-800 tw-bg-slate-50 tw-p-3.5 tw-rounded tw-border tw-border-gray-300 tw-leading-relaxed tw-whitespace-pre-wrap">
                {evi.activitiesDesc || 'Sin descripción'}
              </p>
            </div>

            {/* Grid de 3 tarjetas métricas */}
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3.5 tw-text-sm">
              {/* Avance físico */}
              <div className="tw-bg-blue-50 tw-border tw-border-blue-300 tw-p-3 tw-rounded">
                <span className="tw-text-xs tw-font-bold tw-text-blue-900 tw-block tw-uppercase tw-mb-1">
                  📊 Cantidad y Unidad
                </span>
                <span className="tw-text-lg tw-font-bold tw-text-blue-950">
                  {evi.amount} <span className="tw-text-sm tw-font-medium tw-text-blue-800">({evi.unit})</span>
                </span>
              </div>

              {/* Ubicación territorial */}
              <div className="tw-bg-emerald-50 tw-border tw-border-emerald-300 tw-p-3 tw-rounded">
                <span className="tw-text-xs tw-font-bold tw-text-emerald-900 tw-block tw-uppercase tw-mb-1">
                  📍 Ubicación Territorial
                </span>
                <div className="tw-text-sm tw-text-emerald-950 tw-font-bold">
                  Comuna: {evi.commune || 'No registrada'}
                </div>
                <div className="tw-text-xs tw-text-emerald-800 tw-mt-0.5">
                  Barrio / Vereda: {evi.neighborhood || '-'}{evi.corregimiento ? ` • Corregimiento: ${evi.corregimiento}` : ''}
                </div>
              </div>

              {/* Población beneficiada */}
              <div className="tw-bg-amber-50 tw-border tw-border-amber-300 tw-p-3 tw-rounded">
                <span className="tw-text-xs tw-font-bold tw-text-amber-900 tw-block tw-uppercase tw-mb-1">
                  👥 Población Beneficiada
                </span>
                <div className="tw-text-sm tw-text-amber-950 tw-font-bold">
                  {evi.benefited_population || 'No especificada'}
                </div>
                <div className="tw-text-xs tw-text-amber-800 tw-mt-0.5">
                  Beneficiarios: <span className="tw-font-bold">{evi.benefited_population_number?.toLocaleString() || 0}</span> personas
                </div>
              </div>
            </div>

            {/* Metadatos adicionales de soporte si existen */}
            {(evi.name_file || evi.place || evi.date_file || evi.resources_font) && (
              <div className="tw-flex tw-flex-wrap tw-gap-4 tw-text-xs tw-bg-gray-50 tw-p-3 tw-rounded tw-border tw-border-gray-200">
                {evi.name_file && (
                  <div>
                    <span className="tw-font-bold tw-text-gray-600">Documento: </span>
                    <span className="tw-text-gray-900 tw-font-medium">{evi.name_file}</span>
                  </div>
                )}
                {evi.place && (
                  <div>
                    <span className="tw-font-bold tw-text-gray-600">Lugar: </span>
                    <span className="tw-text-gray-900 tw-font-medium">{evi.place}</span>
                  </div>
                )}
                {evi.date_file && (
                  <div>
                    <span className="tw-font-bold tw-text-gray-600">Fecha documento: </span>
                    <span className="tw-text-gray-900 tw-font-medium">{formatDate(evi.date_file)}</span>
                  </div>
                )}
                {evi.resources_font && (
                  <div>
                    <span className="tw-font-bold tw-text-gray-600">Fuente: </span>
                    <span className="tw-text-gray-900 tw-font-medium">{evi.resources_font}</span>
                  </div>
                )}
              </div>
            )}

            {/* Soportes y Enlaces detallados */}
            <div className="tw-border-t tw-border-gray-200 tw-pt-3">
              <h4 className="tw-text-xs tw-uppercase tw-font-bold tw-text-gray-600 tw-tracking-wide tw-mb-2">
                📎 Soportes Documentales y Enlaces Web ({supportCount})
              </h4>
              {renderSupports(evi.file_link)}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50">
          <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-6 tw-w-full tw-max-w-md tw-border-2 tw-border-black">
            <h2 className="tw-text-xl tw-font-bold tw-mb-3">Confirmar eliminación</h2>
            <p className="tw-mb-4 tw-text-sm tw-text-gray-700">¿Estás seguro de que deseas eliminar esta evidencia?</p>
            <div className="tw-flex tw-justify-end tw-gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="tw-bg-gray-300 hover:tw-bg-gray-400 tw-text-black tw-border tw-border-black tw-px-4 tw-py-2 tw-rounded tw-text-xs tw-font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="tw-bg-red-600 hover:tw-bg-red-700 tw-text-white tw-border tw-border-black tw-px-4 tw-py-2 tw-rounded tw-text-xs tw-font-bold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
