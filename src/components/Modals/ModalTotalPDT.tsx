import React, { useState } from "react";
import Modal from "react-modal";

import { useAppSelector, useAppDispatch } from "@/store";
import { setLoadingReport } from "@/store/plan/planSlice";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import IconButton from "@mui/material/IconButton";
import { Spinner } from "@/assets/icons";

import {
  ReportPDTInterface,
  ReportPDTInterface2,
  ModalPDTProps,
} from "@/interfaces";
import { generalReport } from "@/services/api";
import { generateExcelYears } from "@/utils";

export const ModalTotalPDT = () => {
  const dispatch = useAppDispatch();

  const { id_plan } = useAppSelector((store) => store.content);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState<ReportPDTInterface2[]>([]);

  const handleBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setModalIsOpen(true);
    dispatch(setLoadingReport(true));
    genReport().then((data) => setData(data));
  };

  const genReport = async () => {
    const data_: ReportPDTInterface2[] = await generalReport(id_plan);
    dispatch(setLoadingReport(false));
    return data_;
  };

  return (
    <div>
      <ModalPDT modalIsOpen={modalIsOpen} callback={setModalIsOpen} data={data} />
      <IconButton
        size="large"
        color="inherit"
        title="Generar reporte del Plan Indicativo Total"
        className="tw-transition hover:tw--translate-y-1 hover:tw-scale-[1.4]"
        onClick={handleBtn}
      >
        <LibraryBooksIcon />
      </IconButton>
    </div>
  );
};

const ModalPDT = (props: ModalPDTProps): JSX.Element => {
  const { years, levels, loadingReport, colorimeter } = useAppSelector(
    (store) => store.plan
  );

  // ✅ Cabeceras base
  const baseHeaders: { key: string; label: string }[] = [
    { key: "goalCode", label: "Código de la meta producto" },
    { key: "goalDescription", label: "Meta" },
    { key: "metaFromPlan", label: "Descripción Meta producto" },
    { key: "responsible", label: "Responsable" },
    { key: "dimension", label: "Dimensión" },
    { key: "sector", label: "Sector" },
    { key: "programa", label: "Programa" },
    { key: "subprograma", label: "Subprograma" },
    { key: "indicator", label: "Indicador" },
    { key: "base", label: "Línea base" },
  ];

  // Helpers
  const parseCsv = (s?: string) => {
    if (!s) return [];
    const matches = s.match(/\[([^\]]*)\]/g);
    if (!matches) return [];
    return matches.map((match) => match.slice(1, -1).trim());
  };

  const fmtNumberIfPossible = (v: string | number | undefined) => {
    if (v === undefined || v === null || v === "") return "";
    const str = String(v).replace(/\s+/g, "");
    const n = Number(str);
    if (!Number.isFinite(n)) return String(v);
    return n.toLocaleString();
  };

  const getPlanParts = (planSpecificRaw: string) => {
    const parts = parseCsv(planSpecificRaw);
    const [metaFromPlan = "", subprograma = "", programa = "", sector = "", dimension = ""] =
      parts;
    return { metaFromPlan, subprograma, programa, sector, dimension };
  };

  const colorClass = (item: ReportPDTInterface2, index: number) => {
    const percentArr = parseCsv(item.percentExecuted);
    const raw = percentArr[index];
    const value = raw === undefined || raw === "" ? NaN : Number(raw);
    if (Number.isNaN(value)) return "tw-bg-gray-400";
    if (value < 0) return "tw-bg-gray-400";
    if (value < colorimeter[0]) return "tw-bg-redColory";
    if (value < colorimeter[1]) return "tw-bg-yellowColory";
    if (value < colorimeter[2]) return "tw-bg-greenColory";
    return "tw-bg-blueColory hover:tw-ring-blue-200";
  };

  const tableBody = (item: ReportPDTInterface2) => {
    const plan = getPlanParts(item.planSpecific);
    const percentArr = parseCsv(item.percentExecuted);
    const programedArr = parseCsv(item.programed);
    const executedArr = parseCsv(item.executed);

    return (
      <tr key={item.goalCode}>
        {/* ✅ columnas base */}
        <td className="tw-border tw-p-2">{item.goalCode.replace(/(\.\d+)(?=\.)/, "")}</td>
        <td className="tw-border tw-p-2">{item.goalDescription}</td>
        <td className="tw-border tw-p-2">{plan.metaFromPlan}</td>
        <td className="tw-border tw-p-2">{item.responsible}</td>
        <td className="tw-border tw-p-2">{plan.dimension}</td>
        <td className="tw-border tw-p-2">{plan.sector}</td>
        <td className="tw-border tw-p-2">{plan.programa}</td>
        <td className="tw-border tw-p-2">{plan.subprograma}</td>
        <td className="tw-border tw-p-2">{item.indicator}</td>
        <td className="tw-border tw-p-2">{fmtNumberIfPossible(item.base)}</td>

        {/* ✅ columnas dinámicas por años */}
        {years.map((_, index) => (
          <td key={`p-${index}`} className="tw-border tw-p-2">
            {fmtNumberIfPossible(programedArr[index])}
          </td>
        ))}
        {years.map((_, index) => (
          <td key={`e-${index}`} className="tw-border tw-p-2">
            {fmtNumberIfPossible(executedArr[index])}
          </td>
        ))}
        {years.map((_, index) => (
          <td
            key={`%-${index}`}
            className={`tw-border tw-p-2 tw-text-center ${colorClass(item, index)}`}
          >
            {percentArr[index] ?? ""}
          </td>
        ))}
      </tr>
    );
  };

  const data = props.data;

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={() => props.callback(false)}
      contentLabel="Modal de Plan"
    >
      {loadingReport ? (
        <Spinner />
      ) : (
        <div>
          <div className="tw-absolute tw-top-0 tw-right-0">
            <button className="tw-px-2" onClick={() => props.callback(false)}>
              <p className="tw-text-xl tw-text-[#626d75] tw-font-bold">X</p>
            </button>
          </div>
          <h1>Plan</h1>
          <button
            className="tw-bg-gray-300 hover:tw-bg-gray-200 tw-rounded tw-border tw-border-black tw-px-2 tw-py-1 tw-ml-3"
            onClick={() =>
              generateExcelYears(props.data, "InformeTotal", levels, years, colorimeter)
            }
          >
            Exportar
          </button>
          <table id="TablaTotal">
            <thead>
              <tr>
                {baseHeaders.map((h) => (
                  <th key={h.key} className="tw-border tw-bg-gray-400 tw-p-2">
                    {h.label}
                  </th>
                ))}
                {years.map((year) => (
                  <th key={`p-${year}`} className="tw-border tw-bg-gray-400 tw-p-2">
                    Programado {year}
                  </th>
                ))}
                {years.map((year) => (
                  <th key={`e-${year}`} className="tw-border tw-bg-gray-400 tw-p-2">
                    Ejecutado {year}
                  </th>
                ))}
                {years.map((year) => (
                  <th key={`%-${year}`} className="tw-border tw-bg-gray-400 tw-p-2">
                    % ejecución {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{data.map((item) => tableBody(item))}</tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};
