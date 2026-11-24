import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { toast } from 'react-toastify';

import { decode } from '@/utils';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  thunkGetMapZoomByPlan,
  thunkUpdateMapZoomByPlan,
  thunkGetSecretaries,
} from '@/store/plan/thunks';

import { BackBtn, Frame, SecretarySelect } from '@/components/Citizen';

import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

const FALLBACK_COLORS = [
  '#012947',
  '#FD8E19',
  '#119432',
  '#008DCC',
  '#DC2626',
  '#7C3AED',
  '#0D9488',
  '#D97706',
  '#2563EB',
  '#DB2777',
];

const getDeterministicColor = (label: string): string => {
  const clean = (label || '').trim().toLowerCase();
  if (!clean) return '#012947';
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
};

const formatNumber = (val?: number | string | null): string => {
  if (val === undefined || val === null || val === '') return 'No disponible';
  const num = Number(val);
  if (!Number.isFinite(num)) return String(val);
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(num);
};

const formatCurrency = (val?: number | string | null): string => {
  if (val === undefined || val === null || val === '') return '$ 0';
  const num = Number(val);
  if (!Number.isFinite(num)) return `$ ${val}`;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDateLabel = (dateStr?: string | null): string => {
  if (!dateStr) return 'No registrada';
  try {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(dateStr));
  } catch {
    return dateStr.split('T')[0];
  }
};

export const InterventionMap = () => (
  <Frame>
    <Section />
  </Frame>
);

const Section = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    plan,
    planLocation,
    bounding1,
    bounding2,
    bounding3,
    bounding4,
    secretaries: planSecretaries,
    levels,
  } = useAppSelector((store) => store.plan);
  const { id_plan, locs, secretary } = useAppSelector((store) => store.content);
  const { logged, token_info } = useAppSelector((store) => store.auth);

  const [mapZoom, setMapZoom] = useState<number>(13);
  const [isSavingZoom, setIsSavingZoom] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [localSecretaryFilter, setLocalSecretaryFilter] = useState<string>('');
  const [rootGroupFilter, setRootGroupFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(null);

  const iconCacheRef = useRef<Record<string, Icon>>({});

  useEffect(() => {
    if (logged && token_info?.token) {
      try {
        const decoded = decode(token_info.token) as { rol?: string };
        const rolUsuario = (decoded.rol || '').trim().toLowerCase();
        setIsAdmin(rolUsuario === 'admin' || rolUsuario === 'administrador');
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [logged, token_info]);

  useEffect(() => {
    if (id_plan > 0 && (!planSecretaries || planSecretaries.length === 0)) {
      dispatch(thunkGetSecretaries(id_plan));
    }
  }, [id_plan, planSecretaries, dispatch]);

  useEffect(() => {
    if (id_plan) {
      dispatch(thunkGetMapZoomByPlan(id_plan))
        .unwrap()
        .then((zoomStr) => {
          const zoomParsed = parseInt(zoomStr, 10);
          if (!isNaN(zoomParsed)) {
            setMapZoom(zoomParsed);
          }
        })
        .catch(() => {
          // Mantener zoom por defecto
        });
    }
  }, [id_plan, dispatch]);

  const resolveSecretaryColor = (responsible?: string): string => {
    const target = String(responsible || '').trim().toLowerCase();
    const foundSec = planSecretaries?.find(
      (s) => s?.name && s.name.trim().toLowerCase() === target
    );
    if (foundSec?.color && foundSec.color.trim()) {
      return foundSec.color.trim();
    }
    return getDeterministicColor(responsible || '');
  };

  const createColoredIcon = (color: string, isSelected: boolean) => {
    const cacheKey = `${color}_${isSelected ? 'sel' : 'std'}`;
    const cache = iconCacheRef.current;
    if (cache[cacheKey]) return cache[cacheKey];

    const size = isSelected ? 42 : 34;
    const strokeColor = isSelected ? '#FD8E19' : '#012947';
    const strokeWidth = isSelected ? '1.8' : '0.8';
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='${size}' height='${size}'>
        <path fill='${color}' stroke='${strokeColor}' stroke-width='${strokeWidth}' d='M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z'/>
        <circle cx='12' cy='9' r='2.6' fill='#ffffff' />
      </svg>`.trim();

    const icon = new Icon({
      iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });

    cache[cacheKey] = icon;
    return icon;
  };

  // Normalizar marcadores con coordenadas válidas, clave única y color de secretaría
  const normalizedMarkers = useMemo(() => {
    if (!Array.isArray(locs)) return [];
    return locs
      .filter((loc) => {
        const lat = Number(loc?.lat);
        const lng = Number(loc?.lng);
        return Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
      })
      .map((loc, idx) => {
        const codeStr = String(loc.code || '').trim();
        const rootSegment = codeStr.split('.').filter(Boolean)[0] || 'General';
        return {
          ...loc,
          lat: Number(loc.lat),
          lng: Number(loc.lng),
          markerKey: `${codeStr}-${loc.lat}-${loc.lng}-${loc.date || idx}-${idx}`,
          markerColor: resolveSecretaryColor(loc.responsible),
          rootSegment,
        };
      });
  }, [locs, planSecretaries]);

  const availableSecretaries = useMemo(() => {
    const map = new Map<string, string>();
    normalizedMarkers.forEach((m) => {
      const name = String(m.responsible || 'Sin secretaría').trim();
      if (!map.has(name)) {
        map.set(name, m.markerColor);
      }
    });
    return Array.from(map.entries())
      .map(([name, color]) => ({ name, color }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [normalizedMarkers]);

  const availableRootGroups = useMemo(() => {
    const set = new Set<string>();
    normalizedMarkers.forEach((m) => {
      if (m.rootSegment) set.add(m.rootSegment);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  }, [normalizedMarkers]);

  const filteredMarkers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return normalizedMarkers.filter((m) => {
      if (localSecretaryFilter && String(m.responsible || 'Sin secretaría').trim() !== localSecretaryFilter) {
        return false;
      }
      if (rootGroupFilter && m.rootSegment !== rootGroupFilter) {
        return false;
      }
      if (q) {
        const hay = `${m.code} ${m.name} ${m.responsible} ${m.activitiesDesc} ${m.benefited_population} ${m.resource_font}`
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [normalizedMarkers, localSecretaryFilter, rootGroupFilter, searchQuery]);

  const selectedMarker = useMemo(() => {
    if (filteredMarkers.length === 0) return null;
    if (selectedMarkerKey) {
      const found = filteredMarkers.find((m) => m.markerKey === selectedMarkerKey);
      if (found) return found;
    }
    return filteredMarkers[0];
  }, [filteredMarkers, selectedMarkerKey]);

  const summary = useMemo(() => {
    const uniqueMetas = new Set(filteredMarkers.map((m) => m.code).filter(Boolean));
    const uniqueSecs = new Set(filteredMarkers.map((m) => m.responsible).filter(Boolean));
    return {
      totalMarkers: filteredMarkers.length,
      totalMetas: uniqueMetas.size,
      totalSecretaries: uniqueSecs.size,
    };
  }, [filteredMarkers]);

  const rootLevelLabel = levels?.[0]?.name || 'Línea / Nivel 1';

  function MapViewController({
    zoom,
    targetMarker,
  }: {
    zoom: number;
    targetMarker: { lat: number; lng: number } | null;
  }) {
    const map = useMap();

    useEffect(() => {
      if (Number.isFinite(zoom)) {
        map.setZoom(zoom);
      }
    }, [zoom, map]);

    useEffect(() => {
      if (targetMarker && Number.isFinite(targetMarker.lat) && Number.isFinite(targetMarker.lng)) {
        map.panTo([targetMarker.lat, targetMarker.lng], { animate: true });
      }
    }, [targetMarker?.lat, targetMarker?.lng, map]);

    return null;
  }

  const handleBack = () => navigate(-1);

  return planLocation === undefined ? (
    <div className="tw-flex tw-justify-center tw-items-center tw-h-[60vh]">
      <div className="tw-bg-white tw-shadow-lg tw-rounded-xl tw-p-8 tw-text-center">
        <p className="tw-text-lg tw-font-semibold tw-text-gray-700">Cargando mapa georreferenciado...</p>
      </div>
    </div>
  ) : (
    <div className="tw-bg-slate-50 tw-min-h-[82vh] tw-py-5 tw-px-4 md:tw-px-6 tw-m-3 md:tw-m-5 tw-rounded-3xl tw-shadow-xl tw-border tw-border-slate-200">
      {/* Cabecera + Tarjetas KPI */}
      <div className="tw-bg-white tw-rounded-2xl tw-border tw-border-slate-200 tw-p-5 tw-shadow-sm tw-mb-4">
        <div className="tw-flex tw-flex-col xl:tw-flex-row xl:tw-items-start tw-justify-between tw-gap-4">
          <div className="tw-flex tw-items-start tw-gap-3">
            <BackBtn handle={handleBack} id={id_plan} />
            <div>
              <h1 className="tw-text-2xl tw-font-bold tw-text-[#012947]">
                Mapa de Intervención
              </h1>
              <p className="tw-text-xs md:tw-text-sm tw-text-slate-600 tw-mt-0.5">
                Evidencias georreferenciadas del plan con sus metas y secretarías responsables.
              </p>
              {plan?.name && (
                <p className="tw-text-xs tw-font-semibold tw-text-[#FD8E19] tw-mt-1">
                  Plan: {plan.name}
                </p>
              )}
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-3 tw-gap-2.5 xl:tw-min-w-[340px]">
            <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5">
              <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
                Marcadores
              </div>
              <div className="tw-mt-0.5 tw-text-xl tw-font-extrabold tw-text-[#012947]">
                {summary.totalMarkers}
              </div>
            </div>
            <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5">
              <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
                Metas
              </div>
              <div className="tw-mt-0.5 tw-text-xl tw-font-extrabold tw-text-[#012947]">
                {summary.totalMetas}
              </div>
            </div>
            <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5">
              <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
                Secretarías
              </div>
              <div className="tw-mt-0.5 tw-text-xl tw-font-extrabold tw-text-[#012947]">
                {summary.totalSecretaries}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Filtros: Selector nativo de secretaría + filtros rápidos por secretaría, nivel 1 y texto */}
        <div className="tw-mt-4 tw-pt-4 tw-border-t tw-border-slate-200 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-3 tw-items-end">
          <div className="tw-flex tw-flex-col tw-gap-1">
            <span className="tw-text-[11px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
              Cargar puntos por secretaría
            </span>
            <div className="tw-flex tw-items-center tw-gap-2">
              <SecretarySelect />
              {secretary !== 'void' && (
                <span className="tw-bg-emerald-50 tw-border tw-border-emerald-200 tw-text-emerald-800 tw-px-2.5 tw-py-1 tw-rounded-lg tw-text-xs tw-font-bold tw-truncate">
                  {secretary}
                </span>
              )}
            </div>
          </div>

          <div className="tw-flex tw-flex-col tw-gap-1">
            <label className="tw-text-[11px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
              Filtrar secretaría en mapa
            </label>
            <select
              value={localSecretaryFilter}
              onChange={(e) => setLocalSecretaryFilter(e.target.value)}
              className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-bg-white tw-px-3 tw-py-2 tw-text-xs tw-font-medium tw-text-[#012947] focus:tw-outline-none focus:tw-border-[#FD8E19]"
            >
              <option value="">Todas ({availableSecretaries.length})</option>
              {availableSecretaries.map((sec) => (
                <option key={sec.name} value={sec.name}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          <div className="tw-flex tw-flex-col tw-gap-1">
            <label className="tw-text-[11px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
              Filtrar por {rootLevelLabel}
            </label>
            <select
              value={rootGroupFilter}
              onChange={(e) => setRootGroupFilter(e.target.value)}
              className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-bg-white tw-px-3 tw-py-2 tw-text-xs tw-font-medium tw-text-[#012947] focus:tw-outline-none focus:tw-border-[#FD8E19]"
            >
              <option value="">Todos</option>
              {availableRootGroups.map((grp) => (
                <option key={grp} value={grp}>
                  Código {grp}
                </option>
              ))}
            </select>
          </div>

          <div className="tw-flex tw-flex-col tw-gap-1">
            <label className="tw-text-[11px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
              Buscar meta o actividad
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Código, descripción o población..."
              className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-bg-white tw-px-3 tw-py-2 tw-text-xs tw-text-[#012947] focus:tw-outline-none focus:tw-border-[#FD8E19]"
            />
          </div>
        </div>

        {/* Leyenda de colores por secretaría */}
        {availableSecretaries.length > 0 && (
          <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-gap-2">
            {availableSecretaries.map((sec) => {
              const active = localSecretaryFilter === sec.name;
              return (
                <button
                  key={sec.name}
                  type="button"
                  onClick={() => setLocalSecretaryFilter(active ? '' : sec.name)}
                  className={`tw-inline-flex tw-items-center tw-gap-1.5 tw-rounded-full tw-border tw-px-2.5 tw-py-1 tw-text-[11px] tw-font-semibold tw-transition ${
                    active
                      ? 'tw-border-[#FD8E19] tw-bg-orange-50 tw-text-[#012947]'
                      : 'tw-border-slate-200 tw-bg-slate-50 tw-text-slate-700 hover:tw-bg-white'
                  }`}
                >
                  <span
                    className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-shrink-0"
                    style={{ backgroundColor: sec.color }}
                  />
                  <span>{sec.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Contenido principal: Mapa a la izquierda + Panel de Detalle y Listado Rápido a la derecha */}
      <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-4">
        <div className="xl:tw-col-span-8 tw-flex tw-flex-col tw-gap-4">
          <div className="tw-bg-white tw-rounded-2xl tw-border tw-border-slate-200 tw-p-3 tw-shadow-sm">
            <div className="tw-w-full tw-h-[58vh] tw-rounded-xl tw-overflow-hidden">
              <MapContainer
                center={[planLocation.lat, planLocation.lng]}
                zoom={mapZoom}
                bounds={[
                  [bounding1, bounding3],
                  [bounding2, bounding4],
                ]}
                scrollWheelZoom={true}
                className="tw-w-full tw-h-full"
              >
                <MapViewController zoom={mapZoom} targetMarker={selectedMarker} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredMarkers.map((loc) => {
                  const isSelected = selectedMarker?.markerKey === loc.markerKey;
                  const icon = createColoredIcon(loc.markerColor, isSelected);
                  return (
                    <Marker
                      key={loc.markerKey}
                      position={[loc.lat, loc.lng]}
                      icon={icon}
                      eventHandlers={{
                        click: () => setSelectedMarkerKey(loc.markerKey),
                      }}
                    >
                      <Popup>
                        <div className="tw-space-y-1 tw-text-xs tw-max-w-[260px]">
                          <div className="tw-font-bold tw-text-[#012947]">{loc.responsible}</div>
                          <div>
                            <span className="tw-font-bold">Meta {loc.code}:</span> {loc.name}
                          </div>
                          <div>
                            <span className="tw-font-bold">Fecha:</span> {formatDateLabel(loc.date)}
                          </div>
                          <div>
                            <span className="tw-font-bold">Actividad:</span> {loc.activitiesDesc}
                          </div>
                          <div>
                            <span className="tw-font-bold">Beneficiados:</span>{' '}
                            {formatNumber(loc.benefited_population_number)} ({loc.benefited_population || 'N/A'})
                          </div>
                          <div>
                            <span className="tw-font-bold">Recursos:</span> {formatCurrency(loc.executed_resources)}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                <Rectangle
                  bounds={[
                    [bounding1, bounding3],
                    [bounding2, bounding4],
                  ]}
                  pathOptions={{ color: '#012947', weight: 1.5, fillOpacity: 0 }}
                />
              </MapContainer>
            </div>
          </div>

          {/* Controles de zoom exclusivos para Administrador */}
          {isAdmin && (
            <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-2xl tw-p-4 tw-flex tw-flex-wrap tw-items-center tw-gap-3">
              <label className="tw-text-[#012947] tw-font-bold tw-text-xs sm:tw-text-sm">
                Configurar zoom por defecto del plan:
              </label>
              <input
                type="number"
                min={0}
                max={18}
                value={mapZoom}
                onChange={(e) => setMapZoom(Number(e.target.value))}
                className="tw-w-20 tw-px-3 tw-py-1.5 tw-border tw-border-slate-300 tw-rounded-lg tw-bg-white tw-text-sm tw-font-semibold"
              />
              <button
                type="button"
                disabled={isSavingZoom}
                onClick={async () => {
                  if (!id_plan) return;
                  try {
                    setIsSavingZoom(true);
                    await dispatch(
                      thunkUpdateMapZoomByPlan({ id_plan, mapZoom: mapZoom.toString() })
                    ).unwrap();
                    toast.success('Zoom actualizado correctamente');
                  } catch {
                    toast.error('Error al guardar zoom');
                  } finally {
                    setIsSavingZoom(false);
                  }
                }}
                className={`tw-px-4 tw-py-1.5 tw-rounded-lg tw-font-bold tw-text-xs tw-transition ${
                  isSavingZoom
                    ? 'tw-bg-slate-400 tw-cursor-not-allowed tw-text-white'
                    : 'tw-bg-[#012947] hover:tw-bg-[#0b3b60] tw-text-white'
                }`}
              >
                {isSavingZoom ? 'Guardando...' : 'Guardar zoom'}
              </button>
            </div>
          )}
        </div>

        {/* Panel Lateral: Detalle del Marcador + Listado Rápido */}
        <div className="xl:tw-col-span-4 tw-flex tw-flex-col tw-gap-3 tw-bg-white tw-rounded-2xl tw-border tw-border-slate-200 tw-p-4 tw-shadow-sm">
          <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5">
            {selectedMarker ? (
              <p className="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-bold tw-text-[#012947]">
                <span
                  className="tw-h-3 tw-w-3 tw-rounded-full tw-shrink-0"
                  style={{ backgroundColor: selectedMarker.markerColor }}
                />
                <span className="tw-truncate">
                  Meta {selectedMarker.code} · {selectedMarker.responsible || 'Sin secretaría'}
                </span>
              </p>
            ) : (
              <p className="tw-text-xs tw-text-slate-600">
                Selecciona una secretaría o un marcador en el mapa para ver el detalle.
              </p>
            )}
          </div>

          {selectedMarker ? (
            <div className="tw-space-y-2.5 tw-text-xs">
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
                  <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-text-slate-500">Fecha</div>
                  <div className="tw-mt-0.5 tw-font-bold tw-text-[#012947]">
                    {formatDateLabel(selectedMarker.date)}
                  </div>
                </div>
                <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
                  <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-text-slate-500">Fuente</div>
                  <div className="tw-mt-0.5 tw-font-bold tw-text-[#012947] tw-truncate">
                    {selectedMarker.resource_font || 'No registrada'}
                  </div>
                </div>
              </div>

              <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
                <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-text-slate-500">Meta</div>
                <p className="tw-mt-1 tw-text-slate-700 tw-leading-relaxed">
                  {selectedMarker.name || 'Sin descripción'}
                </p>
              </div>

              <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
                <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-text-slate-500">
                  Actividad reportada
                </div>
                <p className="tw-mt-1 tw-text-slate-700 tw-leading-relaxed">
                  {selectedMarker.activitiesDesc || 'No registrada'}
                </p>
              </div>

              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
                  <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-text-slate-500">
                    Población beneficiada
                  </div>
                  <div className="tw-mt-0.5 tw-font-bold tw-text-[#012947]">
                    {selectedMarker.benefited_population || 'No registrada'}
                  </div>
                </div>
                <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
                  <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-text-slate-500">
                    Beneficiarios
                  </div>
                  <div className="tw-mt-0.5 tw-font-bold tw-text-[#012947]">
                    {formatNumber(selectedMarker.benefited_population_number)}
                  </div>
                </div>
                <div className="tw-col-span-2 tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
                  <div className="tw-text-[10px] tw-font-bold tw-uppercase tw-text-slate-500">
                    Recursos ejecutados
                  </div>
                  <div className="tw-mt-0.5 tw-text-sm tw-font-extrabold tw-text-emerald-700">
                    {formatCurrency(selectedMarker.executed_resources)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-4 tw-text-xs tw-text-slate-500">
              No hay evidencias georreferenciadas para el filtro seleccionado.
            </div>
          )}

          {/* Listado rápido de marcadores */}
          {filteredMarkers.length > 0 && (
            <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-slate-50 tw-p-3">
              <div className="tw-mb-2 tw-flex tw-items-center tw-justify-between">
                <span className="tw-text-[10px] tw-font-bold tw-uppercase tw-tracking-wider tw-text-slate-500">
                  Listado rápido
                </span>
                <span className="tw-text-[11px] tw-font-semibold tw-text-slate-500">
                  {filteredMarkers.length} registro(s)
                </span>
              </div>
              <div className="tw-max-h-[210px] tw-overflow-y-auto tw-space-y-1.5 tw-pr-1">
                {filteredMarkers.map((m) => {
                  const active = selectedMarker?.markerKey === m.markerKey;
                  return (
                    <button
                      key={m.markerKey}
                      type="button"
                      onClick={() => setSelectedMarkerKey(m.markerKey)}
                      className={`tw-w-full tw-rounded-xl tw-border tw-p-2.5 tw-text-left tw-transition ${
                        active
                          ? 'tw-border-[#FD8E19] tw-bg-orange-50 tw-text-[#012947]'
                          : 'tw-border-slate-200 tw-bg-white tw-text-slate-700 hover:tw-border-slate-300'
                      }`}
                    >
                      <div className="tw-flex tw-items-center tw-gap-1.5 tw-text-xs tw-font-bold">
                        <span
                          className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-shrink-0"
                          style={{ backgroundColor: m.markerColor }}
                        />
                        <span>{m.code}</span>
                      </div>
                      <div className="tw-text-[11px] tw-text-slate-500 tw-truncate">
                        {m.responsible}
                      </div>
                      <div className="tw-text-[11px] tw-text-slate-700 tw-truncate tw-mt-0.5">
                        {m.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Section;
