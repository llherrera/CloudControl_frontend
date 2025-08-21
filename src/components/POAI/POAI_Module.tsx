import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  thunkGetLevelArrayByPlan,
  thunkGetNodeArrayByPlan,
} from "@/store/plan/thunks";
import { Spinner } from "@/assets/icons";

/* ----------------- Helpers ----------------- */

const normalizeLevelsOrder = (levels: any[]): any[] => {
  if (!Array.isArray(levels) || levels.length === 0) return [];
  const hasIdLevel = levels.every((l) => l && "id_level" in l);
  if (!hasIdLevel) return levels;
  return levels
    .slice()
    .sort((a, b) => Number(a.id_level) - Number(b.id_level));
};

const formatGoalCodeDisplay = (code: string | undefined | null) => {
  if (!code) return "";
  const parts = String(code)
    .split(".")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 3) return parts.join(".");
  if (/^\d+$/.test(parts[1]))
    return [parts[0], ...parts.slice(2)].join(".");
  return parts.join(".");
};

const getSegmentFromFullPath = (node: any, idx: number) => {
  const fp =
    (node?.full_path ??
      node?.fullPath ??
      node?.fullpath ??
      "")
      .toString()
      .trim();
  if (!fp) return "";
  const parts = fp
    .split(">")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts[idx] ?? "";
};

/* ----------------- Componente ----------------- */

const POAINodesTable: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { id_plan } = useAppSelector((s) => s.content);

  const [levelsState, setLevelsState] = useState<any[]>([]);
  const [nodesState, setNodesState] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id_plan) return;

    setLoading(true);

    dispatch(thunkGetLevelArrayByPlan(id_plan))
      .unwrap()
      .then((res) => {
        setLevelsState(res.levels ?? []);
      })
      .catch((err) =>
        console.error("❌ Error cargando niveles:", err)
      );

    dispatch(thunkGetNodeArrayByPlan(id_plan))
      .unwrap()
      .then((res) => {
        setNodesState(res.nodes ?? []);
      })
      .catch((err) =>
        console.error("❌ Error cargando nodos:", err)
      )
      .finally(() => setLoading(false));
  }, [id_plan, dispatch]);

  if (loading) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-py-8">
        <Spinner />
      </div>
    );
  }

  if (!nodesState || nodesState.length === 0) {
    console.warn("[POAI] No se encontraron nodos para este plan.");
    return (
      <div className="tw-p-4">
        <h2 className="tw-text-lg tw-font-semibold tw-mb-2">
          Nodos - POAI
        </h2>
        <div className="tw-text-sm tw-text-gray-600">
          No se encontraron nodos para este plan.
        </div>
      </div>
    );
  }

  return (
    <div className="tw-p-4">
      <h2 className="tw-text-xl tw-font-bold tw-mb-4 tw-text-gray-800">
        Nodos - POAI
      </h2>

      <div className="tw-overflow-x-auto tw-rounded-lg tw-shadow-md">
        <table
          className="tw-min-w-[1600px] tw-w-full tw-border tw-border-gray-300 tw-text-sm tw-bg-white"
          id="TablaNodosPOAI"
        >
          <thead>
            <tr className="tw-bg-gray-100 tw-text-gray-800 tw-text-left">
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[160px]">
                Código de la meta producto
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                Meta
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[180px]">
                Responsable
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                EJE PROGRAMATICO
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                Sector
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                Programa
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[250px]">
                Descripción de Meta
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                Indicador
              </th>

              {/* --- Nuevas columnas --- */}
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                TOTAL RECURSOS 2025
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                CÓDIGO DEL PROGRAMA PRESUPUESTAL
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[250px]">
                Ingresos Corrientes de Libre Destinación - ICLD
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[250px]">
                Ingresos Corrientes de Destinación Específica - ICDE
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                SGP Educación
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                SGP Salud
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[250px]">
                SGP Agua Potable y Saneamiento Básico
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                SGP Propósito General
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[250px]">
                SGP Asignaciones Especiales
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                Cofinanciación
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                Crédito
              </th>
              <th className="tw-border tw-p-3 tw-font-semibold min-w-[200px]">
                Otros
              </th>
            </tr>
          </thead>

          <tbody>
            {nodesState.map((node: any, idx: number) => {
              const eje = getSegmentFromFullPath(node, 0);
              const sector = getSegmentFromFullPath(node, 1);
              const programa = getSegmentFromFullPath(node, 2);
              const descripcionMeta =
                node?.plan_description ?? node?.node_description ?? "";
              const meta =
                node?.node_name ??
                node?.name ??
                node?.plan_description ??
                "";

              return (
                <tr
                  key={node?.id_node ?? node?.code ?? idx}
                  className={
                    idx % 2 === 0
                      ? "tw-bg-white"
                      : "tw-bg-gray-50"
                  }
                >
                  <td className="tw-border tw-p-3">
                    {formatGoalCodeDisplay(node?.code)}
                  </td>
                  <td className="tw-border tw-p-3">{meta}</td>
                  <td className="tw-border tw-p-3">
                    {node?.responsible ??
                      node?.responsible_name ??
                      ""}
                  </td>
                  <td className="tw-border tw-p-3">{eje}</td>
                  <td className="tw-border tw-p-3">{sector}</td>
                  <td className="tw-border tw-p-3">{programa}</td>
                  <td className="tw-border tw-p-3">
                    {descripcionMeta}
                  </td>
                  <td className="tw-border tw-p-3">
                    {node?.indicator ?? ""}
                  </td>

                  {/* --- Nuevas columnas con N/A --- */}
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                  <td className="tw-border tw-p-3">N/A</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default POAINodesTable;
