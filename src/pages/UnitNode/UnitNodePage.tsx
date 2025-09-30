import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UpgradeIcon from '@mui/icons-material/Upgrade';
import IconButton from "@mui/material/IconButton";

import { Headerbase } from "@/components/Frame/frame";

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkGetUnit, thunkUpdateIndicator } from "@/store/unit/thunks";
import { resetUnit } from "@/store/unit/unitSlice";
import { thunkGetEvidence } from '@/store/evidence/thunks';
import { resetEvidence, setPoints } from "@/store/evidence/evidenceSlice";
import { AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";

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
    const { rootTree, years } = useAppSelector(store => store.plan);
    const { unit, loadingUnit } = useAppSelector(store => store.unit);
    const { evidences } = useAppSelector(store => store.evidence);
    const { id_plan, node } = useAppSelector(store => store.content);

    const [acum, setAcum] = useState(0);
    const [acumFinan, setAcumFinan] = useState(0);

    const [showEvidence, setShowEvidence] = useState(false);
    const fileUpload = useRef<HTMLInputElement>(null);

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

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
      

    const Ternary = () => (
        evidences.length > 0 ? (
            <div className="tw-mb-4 tw-mx-[5%] tw-my-8">
                <p className="tw-text-2xl tw-font-bold tw-flex tw-justify-center tw-mb-4">Evidencias</p>
                <table className="tw-mx-auto tw-table-auto tw-border-collapse">
                    <thead>
                        <tr>
                            <th className="tw-bg-black tw-border">
                                <p className="tw-text-white">Fecha de seguimiento</p>
                            </th>
                            <th className="tw-bg-black tw-border tw-hidden lg:tw-table-cell">
                                <p className="tw-text-white">Descripción</p>
                            </th>
                            <th className="tw-bg-black tw-border tw-hidden lg:tw-table-cell">
                                <p className="tw-text-white">Comuna o Corregimiento</p>
                            </th>
                            <th className="tw-bg-black tw-border tw-hidden md:tw-table-cell">
                                <p className="tw-text-white">Barrio o Vereda</p>
                            </th>
                            <th className="tw-bg-black tw-border tw-hidden md:tw-table-cell">
                                <p className="tw-text-white">Unidad</p>
                            </th>
                            <th className="tw-bg-black tw-border tw-hidden md:tw-table-cell">
                                <p className="tw-text-white">Cantidad</p>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <p className="tw-text-white">Grupo poblacional</p>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <p className="tw-text-white">Población beneficiada</p>
                            </th>
                            <th className="tw-bg-black tw-border tw-hidden md:tw-table-cell">
                                <p className="tw-text-white">Fecha archivo</p>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <p className="tw-text-white">Enlace</p>
                            </th>
                            <th className="tw-bg-black tw-border">
                                <p className="tw-text-white">Acciones</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {evidences.map((evi, index) => (
                            <ShowEvidence
                                evi={evi}
                                index={index}
                                key={evi.id_evidence}
                                handleEvidence={handleEvidence}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="tw-text-2xl tw-font-bold tw-flex tw-justify-center">
                No hay evidencias cargadas
            </p>
        )
    );


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
                        {rol === 'admin' || (rol === 'funcionario' && id === id_plan) ?
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
                    
                    {showEvidence ? <Ternary /> : null}
                </div>
            </div>
    );

}
