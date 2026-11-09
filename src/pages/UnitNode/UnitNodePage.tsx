import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UpgradeIcon from '@mui/icons-material/Upgrade';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";

import { Headerbase } from "@/components/Frame/frame";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetUnit, thunkUpdateIndicator, thunkUpdateUnit } from "@/store/unit/thunks";
import { resetUnit } from "@/store/unit/unitSlice";
import { thunkGetEvidence } from '@/store/evidence/thunks';
import { resetEvidence, setPoints } from "@/store/evidence/evidenceSlice";
import { AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";
import { thunkGetSecretaries } from "@/store/plan/thunks";
import { UnitInterface } from "@/interfaces";

import { decode, notify } from "@/utils";
import {
  ShowEvidence, BackBtn, DoubleBackBtn, SettingsBtn,
  HvBtn, UnitFrame, ModalShare
} from "@/components/Citizen";
import { Spinner } from "@/assets/icons";

export const UnitNodePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token_info } = useAppSelector(store => store.auth);
  const { rootTree, years, secretaries } = useAppSelector(store => store.plan);
  const { unit, loadingUnit } = useAppSelector(store => store.unit);
  const { evidences } = useAppSelector(store => store.evidence);
  const { id_plan, node } = useAppSelector(store => store.content);

  const [acum, setAcum] = useState(0);
  const [acumFinan, setAcumFinan] = useState(0);

  const [showEvidence, setShowEvidence] = useState(false);
  const fileUpload = useRef<HTMLInputElement>(null);

  const [rol, setRol] = useState("");
  const [id, setId] = useState(0);

  const [isEditingResponsible, setIsEditingResponsible] = useState(false);
  const [selectedResponsible, setSelectedResponsible] = useState("");
  const [customResponsible, setCustomResponsible] = useState("");
  const [savingResponsible, setSavingResponsible] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCommune, setFilterCommune] = useState("");
  const [filterType, setFilterType] = useState<"all" | "file" | "link">("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);
  }, [searchTerm, filterCommune, filterType, sortOrder]);

  useEffect(() => {
    if (token_info?.token !== undefined) {
      const decoded = decode(token_info.token);
      setRol(decoded.rol);
      setId(decoded.id_plan);
    }
  }, []);

  useEffect(() => {
    if (id_plan === undefined || node === undefined) return;
    dispatch(thunkGetUnit({ id_plan: id_plan.toString(), id_node: node.id_node }));
  }, []);

  useEffect(() => {
    if (id_plan) {
      const planIdNum = typeof id_plan === 'string' ? parseInt(id_plan) : id_plan;
      if (planIdNum > 0 && (!secretaries || secretaries.length === 0)) {
        dispatch(thunkGetSecretaries(planIdNum));
      }
    }
  }, [id_plan, secretaries]);

  useEffect(() => {
    if (unit === undefined || unit === null) return;
    let acumProgramed = 0;
    let acumPhisical = 0;
    let acumFinalcial = 0;
    for (const element of unit.years) {
      acumProgramed += element.physical_programming;
      acumPhisical += element.physical_execution;
      acumFinalcial += parseInt(element.financial_execution.toString());
    }
    setAcum(acumPhisical / acumProgramed);
    setAcumFinan(acumFinalcial);
  }, [unit]);

  const isAdminOrPlanner = rol === 'admin' || (rol === 'planeacion' && (Number(id) === Number(id_plan) || !id));

  const responsibleOptions = useMemo(() => {
    const set = new Set<string>();
    if (secretaries) {
      secretaries.forEach(s => {
        if (s.name?.trim()) set.add(s.name.trim());
      });
    }
    if (unit?.responsible?.trim()) {
      set.add(unit.responsible.trim());
    }
    return Array.from(set);
  }, [secretaries, unit?.responsible]);

  const uniqueCommunes = useMemo(() => {
    const set = new Set<string>();
    evidences.forEach(e => {
      if (e.commune?.trim()) set.add(e.commune.trim());
    });
    return Array.from(set).sort();
  }, [evidences]);

  const filteredEvidences = useMemo(() => {
    return evidences
      .filter(evi => {
        if (searchTerm.trim() !== "") {
          const term = searchTerm.toLowerCase();
          const desc = (evi.activitiesDesc || "").toLowerCase();
          const comm = (evi.commune || "").toLowerCase();
          const neigh = (evi.neighborhood || "").toLowerCase();
          const nameFile = (evi.name_file || "").toLowerCase();
          if (!desc.includes(term) && !comm.includes(term) && !neigh.includes(term) && !nameFile.includes(term)) {
            return false;
          }
        }
        if (filterCommune !== "" && evi.commune !== filterCommune) {
          return false;
        }
        if (filterType !== "all") {
          const fl = evi.file_link || "";
          if (filterType === "file" && !fl.includes(".pdf") && !fl.includes('"type":"file"')) {
            return false;
          }
          if (filterType === "link" && !fl.includes('"type":"link"') && !fl.startsWith("http")) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [evidences, searchTerm, filterCommune, filterType, sortOrder]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredEvidences.length / itemsPerPage));
  }, [filteredEvidences.length, itemsPerPage]);

  const paginatedEvidences = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvidences.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvidences, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSaveResponsible = async () => {
    if (!unit || !node || !id_plan) return;
    const finalResponsible = selectedResponsible === "__custom__"
      ? customResponsible.trim()
      : selectedResponsible.trim();

    if (!finalResponsible) {
      return notify("Debe seleccionar o ingresar un responsable", "error");
    }

    try {
      setSavingResponsible(true);
      const updatedUnit: UnitInterface = {
        ...unit,
        responsible: finalResponsible
      };

      const planIdStr = id_plan.toString();
      await dispatch(thunkUpdateUnit({
        id_plan: planIdStr,
        id_node: node.id_node,
        unit: updatedUnit,
        years: unit.years || []
      })).unwrap();

      dispatch(thunkGetUnit({ id_plan: planIdStr, id_node: node.id_node }));
      setIsEditingResponsible(false);
      setCustomResponsible("");
    } catch (err: any) {
      notify(err?.msg || err?.message || "Error al actualizar responsable", "error");
    } finally {
      setSavingResponsible(false);
    }
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      if (file[0].type !== 'application/pdf') {
        alert('El archivo debe ser pdf');
        e.target.value = '';
        return;
      }
      dispatch(thunkUpdateIndicator({ id_node: node!.id_node, file: file![0] }));
    }
  };

  const handleSubmitButton = () => {
    dispatch(setPoints([]));
    if (unit.code === '') return notify('Termine de configurar esta meta de producto', 'info');
    navigate(`/pdt/PlanIndicativo/Meta/evidencia`);
  };

  const handleEvidence = () => {
    const id_ = parseInt(id_plan.toString());
    dispatch(thunkGetEvidence({ id_plan: id_, code: unit.code }))
      .unwrap()
      .then((res) => {
        if (res.length === 0)
          notify('No hay evidencias para esta meta');
        else
          setShowEvidence(true);
      })
  };

  const handleStartReturn = () => {
    dispatch(AddRootTree([]));
    dispatch(resetEvidence());
    dispatch(resetUnit());
    dispatch(setZeroLevelIndex());
    navigate(-1);
  };

  const UploadBtn = () => (
    <div>
      <input type="file"
        className="tw-hidden"
        id="inputFile"
        ref={fileUpload}
        onChange={handleChangeFile} />
      <label
        htmlFor="inputFile"
        className="tw-hidden">a
      </label>
      <IconButton aria-label="delete"
        size="small"
        color="inherit"
        title="Actualizar Hoja de vida"
        onClick={() => fileUpload.current?.click()}>
        <UpgradeIcon />
      </IconButton>
    </div>
  );

  const handleSettings = () => navigate(`/pdt/PlanIndicativo/Meta/configuracion`);

  const TernaryIndicatorShow = () => (
    (unit.hv_indicator === '' ||
      unit.hv_indicator === null ||
      unit.hv_indicator === undefined) ?
      null : <HvBtn link={unit.hv_indicator} />
  );

  const TernaryIndicator = () => (
    (rol === 'admin' ||
      ((rol === 'funcionario' || rol === 'planeacion')
        && id === id_plan)) ? <UploadBtn /> : null
  );

  const UnidadForm = () => {
    if (unit === undefined || unit === null) return null;
    return (
      <div className="tw-bg-white tw-h-full tw-w-full tw-text-black tw-pt-4 tw-pb-12 tw-px-4">
        <p className="tw-text-2xl">
          <span className="tw-font-bold">Codigo:</span>{" "}
          <span className="tw-font-semibold">{unit.code}</span>
        </p>

        <p className="tw-text-2xl tw-text-justify">
          <span className="tw-font-bold">Descripcion:</span>{" "}
          <span className="tw-font-semibold">{unit.description}</span>
        </p>

        <p className="tw-text-2xl">
          <span className="tw-font-bold">Línea base:</span>{" "}
          <span className="tw-font-semibold">{unit.base}</span>
        </p>

        <p className="tw-text-2xl">
          <span className="tw-font-bold">Meta:</span>{" "}
          <span className="tw-font-semibold">{unit.goal}</span>
        </p>

        <p className="tw-text-2xl tw-text-justify">
          <span className="tw-font-bold">Indicador:</span>{" "}
          <span className="tw-font-semibold">{unit.indicator}</span>
        </p>

        <div className="tw-text-2xl tw-my-1">
          <span className="tw-font-bold">Responsable:</span>{" "}
          {!isEditingResponsible ? (
            <span className="tw-inline-flex tw-items-center tw-gap-2">
              <span className="tw-font-semibold">{unit.responsible || "No asignado"}</span>
              {isAdminOrPlanner && (
                <IconButton
                  size="small"
                  color="primary"
                  title="Modificar responsable"
                  onClick={() => {
                    setSelectedResponsible(unit.responsible || "");
                    setIsEditingResponsible(true);
                  }}
                  className="tw-ml-2 hover:tw-bg-blue-50"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </span>
          ) : (
            <div className="tw-mt-3 tw-p-4 tw-bg-blue-50 tw-border tw-border-blue-300 tw-rounded-lg tw-flex tw-flex-col tw-gap-3">
              <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center tw-gap-3">
                <select
                  value={selectedResponsible}
                  onChange={(e) => setSelectedResponsible(e.target.value)}
                  className="tw-border tw-border-gray-400 tw-rounded tw-p-2 tw-text-base tw-bg-white tw-text-black focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-flex-1"
                >
                  <option value="">-- Seleccionar Secretaría / Responsable --</option>
                  {responsibleOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="__custom__">✏️ Escribir otro responsable manualmente...</option>
                </select>

                {selectedResponsible === "__custom__" && (
                  <input
                    type="text"
                    placeholder="Escriba el nombre del responsable"
                    value={customResponsible}
                    onChange={(e) => setCustomResponsible(e.target.value)}
                    className="tw-border tw-border-gray-400 tw-rounded tw-p-2 tw-text-base tw-bg-white tw-text-black focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-flex-1"
                  />
                )}
              </div>

              <div className="tw-flex tw-gap-2">
                <button
                  type="button"
                  disabled={savingResponsible}
                  onClick={handleSaveResponsible}
                  className="tw-bg-green-600 hover:tw-bg-green-700 disabled:tw-opacity-50 tw-text-white tw-font-bold tw-py-1.5 tw-px-4 tw-rounded tw-text-sm tw-transition-colors"
                >
                  {savingResponsible ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  disabled={savingResponsible}
                  onClick={() => {
                    setIsEditingResponsible(false);
                    setCustomResponsible("");
                  }}
                  className="tw-bg-gray-400 hover:tw-bg-gray-500 tw-text-white tw-font-bold tw-py-1.5 tw-px-4 tw-rounded tw-text-sm tw-transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="tw-text-2xl tw-text-justify">
          <span className="tw-font-bold">Hoja de Vida Indicador:</span>{" "}
          <span className="tw-font-semibold">
            <TernaryIndicatorShow />
            <TernaryIndicator />
          </span>
        </div>
      </div>
    );
  };




  const YearsForm = () => {
    if (unit === undefined || unit === null) return null;

    return (
      <div className="tw-flex tw-flex-row tw-mx-[2%] tw-gap-6 tw-w-full tw-mt-3 tw-bg-white tw-p-8 ">
        {/* Columna izquierda 2/3 con años en grid 2x2 */}
        <div className="tw-w-2/3 tw-grid tw-grid-cols-2 tw-gap-6">
          {unit.years.map((item, index) => (
            <div key={index} className="tw-mr-6">
              <p
                className="tw-mx-2 tw-border-x tw-border-t tw-border-black 
                               tw-text-xl tw-text-center tw-bg-yellow-300 tw-rounded-t"
              >
                {years[index]}
              </p>
              <div className="tw-flex tw-justify-between tw-mx-2 tw-bg-white tw-border tw-border-black tw-p-2">
                <div className="tw-flex tw-flex-col tw-justify-center tw-border-r tw-border-black tw-px-3">
                  <p className="tw-text-center">Programación</p>
                  <p className="tw-text-center tw-border-t tw-border-black">
                    {item.physical_programming}
                  </p>
                </div>
                <div className="tw-flex tw-flex-col tw-justify-center tw-border-r tw-border-black tw-px-3">
                  <p className="tw-text-center">Ejecución física</p>
                  <p className="tw-text-center tw-border-t tw-border-black">
                    {item.physical_execution}
                  </p>
                </div>
                <div className="tw-flex tw-flex-col tw-justify-center tw-px-3">
                  <p className="tw-text-center">Ejecución financiera</p>
                  <p className="tw-text-center tw-border-t tw-border-black">
                    $
                    {item.financial_execution
                      .toString()
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Columna derecha 1/3 */}
        <div className="tw-w-1/3 tw-flex tw-flex-col tw-items-center tw-gap-4">
          {/* Botón añadir evidencia primero */}
          {(rol === "admin") ||
            ((rol === "funcionario" ||
              rol === "planeacion" ||
              rol === "sectorialista") &&
              id === id_plan) ? (
            <button
              onClick={handleSubmitButton}
              className="tw-bg-slate-400 hover:tw-bg-slate-200 
                             tw-rounded tw-p-2 tw-font-bold tw-text-white hover:tw-text-black tw-w-4/5"
            >
              Añadir evidencia
            </button>
          ) : null}

          {/* Total */}
          <div className="tw-w-full tw-my-2">
            <p
              className="tw-mx-2 tw-border-x tw-border-t tw-border-black 
                             tw-text-xl tw-text-center tw-bg-yellow-300 tw-rounded-t"
            >
              Total
            </p>
            <div className="tw-flex tw-justify-between tw-mx-2 tw-bg-white tw-border tw-border-black tw-p-2">
              <div className="tw-flex tw-flex-col tw-justify-center tw-border-r tw-border-black tw-px-3">
                <p className="tw-text-center">Ejecución física</p>
                <p className="tw-text-center tw-border-t tw-border-black">
                  {isNaN(acum) ? 0 : parseFloat((acum * 100).toFixed(2))}%
                </p>
              </div>
              <div className="tw-flex tw-flex-col tw-justify-center tw-px-3">
                <p className="tw-text-center">Ejecución financiera</p>
                <p className="tw-text-center tw-border-t tw-border-black">
                  $
                  {acumFinan
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </p>
              </div>
            </div>
          </div>

          {/* Botón mostrar evidencias */}
          <button
            onClick={handleEvidence}
            className="tw-bg-blue-500 hover:tw-bg-blue-300 
                           tw-rounded tw-p-2 tw-font-bold tw-text-white hover:tw-text-black tw-w-4/5"
          >
            Mostrar evidencias
          </button>
        </div>
      </div>
    );
  };


        return (
        loadingUnit ? <Spinner /> :
        <div className="tw-min-h-screen tw-w-screen tw-bg-gradient-to-b tw-from-[#06283b] tw-via-[#1f4f63] tw-to-[#dbeff6]">

          {/* Header fijo arriba y ancho completo */}
          <div className="tw-w-full tw-bg-[#06283b] tw-shadow-md tw-fixed tw-top-0 tw-left-0 tw-z-50">
            <Headerbase />
          </div>

          {/* Contenido debajo del header */}
          <div className="tw-pt-32 tw-flex tw-flex-col tw-items-center tw-w-full">

            <div className="tw-flex tw-w-full tw-m-4 tw-pl-8">
              <DoubleBackBtn handle={handleStartReturn} id={id_plan} />
              {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === id_plan) ?
                <SettingsBtn handle={handleSettings} id={id_plan} />
                : null
              }
              {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === id_plan) ?
                <ModalShare meta />
                : null
              }
            </div>

            <div className="tw-flex tw-flex-row tw-gap-6 tw-mx-[2%] tw-justify-center tw-items-start tw-border tw-border-white tw-p-4 tw-my-4">
              {/* Tabla a la izquierda */}
              <table className="tw-w-1/2 tw-text-left tw-text-white">
                <tbody>
                  {rootTree.map((name) => (
                    <tr key={name[0]}>
                      <td className="tw-py-2 tw-px-4">
                        <span className="tw-text-white tw-text-2xl tw-font-bold">{name[1]}:</span>
                        <span className="tw-ml-1 tw-text-xl tw-font-semibold">{name[0]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Componente a la derecha */}
              <div className="tw-w-1/2 tw-w-2/3 tw-h-full tw-bg-white ">
                <UnidadForm />
              </div>
            </div>



            <div className="tw-flex tw-justify-center">
              <YearsForm />
            </div>

            {showEvidence ? (
              evidences.length > 0 ? (
                <div className="tw-mt-10 tw-pt-6 tw-mb-12 tw-mx-auto tw-w-full tw-max-w-5xl tw-px-4">
                  {/* Cabecera de la sección */}
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center tw-justify-between tw-gap-3 tw-mb-4 tw-border-b tw-border-white/30 tw-pb-3">
                    <div>
                      <h2 className="tw-text-2xl tw-font-bold tw-text-white">Listado de Evidencias</h2>
                      <p className="tw-text-sm tw-text-slate-200">Avances y soportes documentales registrados para esta meta</p>
                    </div>
                    <div className="tw-flex tw-items-center tw-gap-2">
                      <span className="tw-bg-yellow-300 tw-text-black tw-border tw-border-black tw-text-sm tw-font-bold tw-px-3.5 tw-py-1.5 tw-rounded-md tw-shadow">
                        {filteredEvidences.length === 0
                          ? '0 evidencias'
                          : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredEvidences.length)} de ${filteredEvidences.length}`}
                      </span>
                      {expandedId !== null && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(null)}
                          className="tw-bg-slate-200 hover:tw-bg-white tw-text-black tw-border tw-border-black tw-text-xs tw-font-bold tw-px-3 tw-py-2 tw-rounded tw-shadow"
                        >
                          Colapsar detalle ▲
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Barra de Filtros interactiva */}
                  <div className="tw-bg-white tw-border-2 tw-border-black tw-rounded-lg tw-p-3.5 tw-mb-4 tw-shadow tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-items-center">
                    {/* Búsqueda de texto */}
                    <div className="tw-w-full md:tw-w-2/5">
                      <input
                        type="text"
                        placeholder="🔍 Buscar por actividad, barrio, soporte..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="tw-w-full tw-border-2 tw-border-gray-400 tw-rounded tw-p-2 tw-text-xs tw-bg-white tw-text-black focus:tw-outline-none focus:tw-border-blue-500"
                      />
                    </div>

                    {/* Filtro por Comuna */}
                    <div className="tw-w-full md:tw-w-1/4">
                      <select
                        value={filterCommune}
                        onChange={(e) => setFilterCommune(e.target.value)}
                        className="tw-w-full tw-border-2 tw-border-gray-400 tw-rounded tw-p-2 tw-text-xs tw-bg-white tw-text-black focus:tw-outline-none focus:tw-border-blue-500"
                      >
                        <option value="">Todas las comunas</option>
                        {uniqueCommunes.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por tipo de soporte */}
                    <div className="tw-w-full md:tw-w-1/5">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as "all" | "file" | "link")}
                        className="tw-w-full tw-border-2 tw-border-gray-400 tw-rounded tw-p-2 tw-text-xs tw-bg-white tw-text-black focus:tw-outline-none focus:tw-border-blue-500"
                      >
                        <option value="all">Todos los soportes</option>
                        <option value="file">Con archivo PDF</option>
                        <option value="link">Con enlace Web</option>
                      </select>
                    </div>

                    {/* Orden cronológico */}
                    <div className="tw-w-full md:tw-w-1/6">
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                        className="tw-w-full tw-border-2 tw-border-gray-400 tw-rounded tw-p-2 tw-text-xs tw-bg-white tw-text-black focus:tw-outline-none focus:tw-border-blue-500"
                      >
                        <option value="desc">Más recientes</option>
                        <option value="asc">Más antiguos</option>
                      </select>
                    </div>

                    {/* Botón limpiar */}
                    {(searchTerm || filterCommune || filterType !== "all" || sortOrder !== "desc") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterCommune("");
                          setFilterType("all");
                          setSortOrder("desc");
                        }}
                        className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-800 tw-border tw-border-black tw-text-xs tw-font-bold tw-px-3 tw-py-2 tw-rounded tw-whitespace-nowrap"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>

                  {/* Lista de tarjetas de evidencia filtradas y paginadas */}
                  {paginatedEvidences.length > 0 ? (
                    <div className="tw-flex tw-flex-col tw-gap-3.5">
                      {paginatedEvidences.map((evi, i) => (
                        <ShowEvidence
                          evi={evi}
                          index={(currentPage - 1) * itemsPerPage + i}
                          key={evi.id_evidence}
                          handleEvidence={handleEvidence}
                          isExpanded={expandedId === evi.id_evidence}
                          onToggle={() => setExpandedId(prev => prev === evi.id_evidence ? null : evi.id_evidence)}
                        />
                      ))}

                      {/* Paginador */}
                      {totalPages > 1 && (
                        <div className="tw-mt-4 tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-between tw-gap-3 tw-bg-white tw-border-2 tw-border-black tw-rounded-lg tw-p-3 tw-shadow">
                          <div className="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-font-semibold tw-text-gray-700">
                            <span>Por página:</span>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              className="tw-border tw-border-black tw-rounded tw-px-2 tw-py-1 tw-text-xs tw-bg-white focus:tw-outline-none"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                            </select>
                            <span className="tw-ml-2 tw-text-gray-500">
                              Página {currentPage} de {totalPages}
                            </span>
                          </div>

                          <div className="tw-flex tw-items-center tw-gap-1.5">
                            <button
                              type="button"
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-border tw-border-black tw-rounded tw-shadow-sm disabled:tw-opacity-40 disabled:tw-cursor-not-allowed tw-bg-gray-100 hover:tw-bg-gray-200 tw-text-black"
                            >
                              ◀ Anterior
                            </button>

                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                              const isCurrent = pageNum === currentPage;
                              if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={pageNum}
                                    type="button"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-border tw-border-black tw-rounded tw-shadow-sm ${
                                      isCurrent
                                        ? "tw-bg-yellow-300 tw-text-black"
                                        : "tw-bg-white hover:tw-bg-gray-100 tw-text-gray-800"
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              }
                              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return (
                                  <span key={pageNum} className="tw-px-1 tw-text-xs tw-text-gray-400">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            })}

                            <button
                              type="button"
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-border tw-border-black tw-rounded tw-shadow-sm disabled:tw-opacity-40 disabled:tw-cursor-not-allowed tw-bg-gray-100 hover:tw-bg-gray-200 tw-text-black"
                            >
                              Siguiente ▶
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="tw-bg-white tw-border-2 tw-border-black tw-rounded-lg tw-p-6 tw-text-center tw-shadow">
                      <p className="tw-text-base tw-font-bold tw-text-gray-800">
                        No se encontraron evidencias con los filtros seleccionados
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterCommune("");
                          setFilterType("all");
                        }}
                        className="tw-mt-2 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-border tw-border-black tw-text-xs tw-font-bold tw-px-3 tw-py-1.5 tw-rounded"
                      >
                        Restablecer filtros
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="tw-my-8 tw-bg-white tw-border-2 tw-border-black tw-rounded-lg tw-p-6 tw-text-center tw-mx-auto tw-max-w-md tw-shadow">
                  <p className="tw-text-lg tw-font-bold tw-text-black">
                    No hay evidencias cargadas para esta meta
                  </p>
                  <p className="tw-text-sm tw-text-gray-600 tw-mt-1">
                    Haga clic en &quot;Añadir evidencia&quot; para registrar un nuevo avance con sus soportes.
                  </p>
                </div>
              )
            ) : null}
          </div>
        </div>
        );

}
