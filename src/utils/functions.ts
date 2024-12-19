import type { AxiosError } from 'axios';
import ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';

import { doRefreshToken } from '@/services/api';
import {
  AuthInterface,
  ErrorBasicInterface,
  LevelInterface,
  ReportPDTInterface,
  LocationInterface,
  Secretary,
  Item,
  NodesSecretary,
  Visualization,
  VisualizationRedux,
  ActionPlan
} from '../interfaces';
import { setToken } from './storage';

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor = 800) => {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  }
  return debounced;
}

export const parseErrorAxios = (err: unknown) => {
  const error = err as AxiosError<ErrorBasicInterface>;
  if (!error.response) throw err;
  else {
    const status = error.response?.status;
    const error_code = error.response?.data.error ?? error.response?.data.error_code ?? error.response?.data.code;
    const error_description = error.response?.data.error_description ?? error.response?.data.msg;
    return { status, error_code, error_description };
  }
}

export const refreshToken = async () => {
  const { data } = await doRefreshToken();
  const token: AuthInterface = data.data;
  setToken(token);
  return token;
}

export const getYears = (fecha_inicio: string = '') => {
  const years = [
    new Date(fecha_inicio).getUTCFullYear(),
    new Date(fecha_inicio).getUTCFullYear() + 1,
    new Date(fecha_inicio).getUTCFullYear() + 2,
    new Date(fecha_inicio).getUTCFullYear() + 3
  ];
  return years;
}

export const validateEmail = (email: string) => {
  const regexp: RegExp = /\w+([.]\w+)*@[a-zA-Z0-9._-]+[.][a-zA-Z]{2,5}/;
  return regexp.test(email);
}

export const handleUser = (rol: string) => {
  const navigate = useNavigate();
  if (rol === "admin") {
    return navigate('/pdt');
  } else if (rol === "funcionario") {
    return navigate(`/lobby`);
  }
}

export const getLetter = (year: number) => {
  const num = parseInt(((year - 2016) / 4).toString());
  return String.fromCharCode(num + 'A'.charCodeAt(0));
}

export const generateExcel = (
  data: ReportPDTInterface[],
  name: string,
  levels: LevelInterface[],
  year: number,
  color: number[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  worksheet.columns = [
    { header: 'Responsable', key: 'responsable', width: 20 },
    { header: 'Codigo de la meta producto', key: 'codigo_meta', width: 20 },
    { header: 'Descripción Meta producto', key: 'descripcion_meta', width: 20 },
    { header: `% ejecución ${year}`, key: 'ejecucion', width: 20 },
    ...levels.map((l, i) => ({ header: l.name, key: `nivel_${i}`, with: 20 })),
    { header: 'Indicador', key: 'indicador', width: 20 },
    { header: 'Linea base', key: 'linea_base', width: 20 },
    { header: `Programado ${year}`, key: 'programado', width: 20 },
    { header: `Ejecutado ${year}`, key: 'ejec', width: 20 },
  ];

  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9D9D9' },
  };

  worksheet.getRow(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  data.forEach((d: ReportPDTInterface) => {
    let levels_ = d.planSpecific.map((d_, i) => ({ [`nivel_${i}`]: d_ }));
    const aaaa = levels_.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    const row = worksheet.addRow({
      responsable: d.responsible,
      codigo_meta: d.goalCode,
      descripcion_meta: d.goalDescription,
      ejecucion: d.percentExecuted[0] < 0 ? 0 : d.percentExecuted[0],
      ...aaaa,
      indicador: d.indicator,
      linea_base: d.base,
      programado: d.programed[0],
      ejec: d.executed[0]
    });

    const ejecCell = row.getCell('ejecucion');
    const ternary3 = d.percentExecuted[0] < color[2] ? 'FF119432' : 'FF008DCC';
    const ternary2 = d.percentExecuted[0] < color[1] ? 'FFFCC623' : ternary3;
    const ternaty = d.percentExecuted[0] < color[0] ? 'FFFE1700' : ternary2;
    ejecCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: `${d.percentExecuted[0] < 0 ? 'FF9CA3AF' : ternaty}` },
    };
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.xlsx`;
    a.click();
  });

}

export const generateExcelYears = (
  data: ReportPDTInterface[],
  name: string,
  levels: LevelInterface[],
  years: number[],
  color: number[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  worksheet.columns = [
    { header: 'Responsable', key: 'responsable', width: 20 },
    { header: 'Codigo de la meta producto', key: 'codigo_meta', width: 20 },
    { header: 'Descripción Meta producto', key: 'descripcion_meta', width: 20 },
    ...years.map(y => ({ header: `% ejecución ${y}`, key: `ejecucion_${y}`, width: 20 })),
    ...levels.map((l, i) => ({ header: l.name, key: `nivel_${i}`, with: 20 })),
    { header: 'Indicador', key: 'indicador', width: 20 },
    { header: 'Linea base', key: 'linea_base', width: 20 },
    ...years.map(y => ({ header: `Programado ${y}`, key: `programado_${y}`, width: 20 })),
    ...years.map(y => ({ header: `Ejecutado ${y}`, key: `ejecutado_${y}`, width: 20 })),
  ];

  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9D9D9' },
  };

  worksheet.getRow(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  data.forEach((d: ReportPDTInterface) => {
    let tempEjecPor = years.map((y, i) => ({
      [`ejecucion_${y}`]: d.percentExecuted[i] < 0 ? 0 : d.percentExecuted[i]
    }));
    const ejecPor_ = tempEjecPor.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    let tempLevels = d.planSpecific.map((d_, i) => ({ [`nivel_${i}`]: d_ }));
    const levels_ = tempLevels.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    let tempPro = years.map((y, i) => ({ [`programado_${y}`]: d.programed[i] }));
    const pro_ = tempPro.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    let tempEjec = years.map((y, i) => ({ [`ejecutado_${y}`]: d.executed[i] }));
    const ejec_ = tempEjec.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    const row = worksheet.addRow({
      responsable: d.responsible,
      codigo_meta: d.goalCode,
      descripcion_meta: d.goalDescription,
      ...ejecPor_,
      ...levels_,
      indicador: d.indicator,
      linea_base: d.base,
      ...pro_,
      ...ejec_
    });

    years.forEach((y, i) => {
      const ejecCell = row.getCell(`ejecucion_${y}`);

      const ternary3 = d.percentExecuted[i] < color[2] ? 'FF119432' : 'FF008DCC';
      const ternary2 = d.percentExecuted[i] < color[1] ? 'FFFCC623' : ternary3;
      const ternaty = d.percentExecuted[i] < color[0] ? 'FFFE1700' : ternary2;

      ejecCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: `${d.percentExecuted[i] < 0 ? 'FF9CA3AF' : ternaty}`
        },
      };
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.xlsx`;
    a.click();
  });

}

export const generateActionPlanExcel = (actionPlan: ActionPlan) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Plan de Acción', {
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  });

  // Título y encabezado
  sheet.mergeCells('A1:B4');
  sheet.getCell('A1').value = 'Alcaldía de Ibagué';
  sheet.getCell('A1').style = { font: { bold: true, size: 14 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.mergeCells('C1:J2');
  sheet.mergeCells('C3:J4');
  sheet.getCell('C1').value = 'PROCESO: PLANEACION ESTRATEGICA Y TERRITORIAL';
  sheet.getCell('C1').style = { font: { bold: true, size: 14 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('C3').value = 'FORMATO: PLAN DE ACCIÓN';
  sheet.getCell('C3').style = { font: { bold: true, size: 14 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.mergeCells('K1:N1');
  sheet.getCell('K1').value = 'Codigo: FOR-08-PRO-PET-01';
  sheet.getCell('K1').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('K2:N2');
  sheet.getCell('K2').value = 'Version: 01';
  sheet.getCell('K2').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('K3:N3');
  sheet.getCell('K3').value = 'Fecha: 31/08/2017';
  sheet.getCell('K3').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('K4:N4');
  sheet.getCell('K4').value = 'Pagina: 1 de 1';
  sheet.getCell('K4').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.mergeCells('O1:P4');
  sheet.getCell('O1').value = 'Logo';
  sheet.getCell('O1').style = { font: { bold: true, size: 14 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  // Encabezados de detalles del plan
  sheet.addRow([]);
  sheet.addRow([
    'SECRETARÍA / ENTIDAD:',
    actionPlan.office,
    'GRUPO:'
  ]);
  sheet.getCell('A6').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B6').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C6:P6');
  sheet.getCell('C6').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.addRow([
    'FECHA DE PROGRAMACION:',
    actionPlan.programedDate == null ? '' : new Date(actionPlan.programedDate).toLocaleDateString(),
    `FECHA DE SEGUIMIENTO: ${actionPlan.followDate == null ? '' : new Date(actionPlan.followDate).toLocaleDateString()}`,
  ]);
  sheet.getCell('A7').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B7').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C7:P7');
  sheet.getCell('C7').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.addRow([
    'LINEA ESTRATÉGICA:',
    actionPlan.level1,
    '',
    '',
    '',
    '',
    '',
    '',
    `Objetivos: ${actionPlan.Objetives}`,
    '',
    '',
    'RELACION DE CONTRATOS Y CONVENIOS',
    '',
    '',
    '',
    ''
  ]);
  sheet.addRow([
    'SECTOR:',
    actionPlan.level2,
    '',
    '',
    '',
    '',
    '',
    '',
    ``,
    '',
    '',
    'No',
    'OBJETO',
    '',
    '',
    'VALOR'
  ]);
  sheet.addRow([
    'PROGRAMA:',
    actionPlan.level3,
    '',
    '',
    '',
    '',
    '',
    '',
    ``,
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);
  sheet.addRow([
    'NOMBRE DEL PROYECTO POAI:',
    actionPlan.POAINameProject,
    '',
    '',
    '',
    '',
    '',
    '',
    ``,
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);
  sheet.addRow([
    'CODIGO BPIM:',
    actionPlan.BPIMCode,
    '',
    '',
    '',
    '',
    '',
    '',
    ``,
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);
  sheet.addRow(['CODIGO PRESUPUESTAL:', 'RUBRO']);

  sheet.getCell('A8').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B8').style = { font: { bold: false, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('C8').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('I8').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('L8').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C8:H8');
  sheet.mergeCells('L8:P8');
  sheet.getCell('A9').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B9').style = { font: { bold: false, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('C9').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('L9').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('M9').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('P9').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C9:H9');
  sheet.mergeCells('M9:O9');
  sheet.getCell('A10').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B10').style = { font: { bold: false, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('C10').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('L10').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('M10').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('P10').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C10:H10');
  sheet.mergeCells('M10:O10');
  sheet.getCell('A11').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B11').style = { font: { bold: false, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('C11').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('L11').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('M11').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('P11').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C11:H11');
  sheet.mergeCells('M11:O11');
  sheet.getCell('A12').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B12').style = { font: { bold: false, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('C12').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('L12').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('M12').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('P12').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C12:H12');
  sheet.mergeCells('M12:O12');
  sheet.getCell('A13').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('B13').style = { font: { bold: true, size: 12 }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('C13').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('E13').style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('L13').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('M13').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell('P13').style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells('C13:H13');
  sheet.mergeCells('M13:O13');
  sheet.mergeCells('I8:K13');

  // Agregar rubros
  const rubros = actionPlan.rubros ?? [];
  rubros.forEach((rubro, index) => {
    const cell = 14 + (index);
    sheet.addRow([
      rubro.presupuestalCode,
      rubro.rubro,
      '',
      '',
      '',
      '',
      '',
      '',
      ``,
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ]);
    sheet.getCell(`A${cell}`).style = { font: { size: 11 }, alignment: { wrapText: true, vertical: 'top', horizontal: 'left' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`B${cell}`).style = { font: { size: 11 }, alignment: { wrapText: true, vertical: 'top', horizontal: 'left' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

    sheet.mergeCells(`M${cell}:O${cell}`);
    sheet.getCell(`L${cell}`).style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`M${cell}`).style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`P${cell}`).style = { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  });
  let cell = 13;
  if (rubros.length > 0) {
    sheet.mergeCells(`C${cell + 1}:K${cell + rubros.length}`);
    sheet.getCell(`C${cell + 1}`).style = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  }

  // Agregar encabezado de actividades
  sheet.addRow([
    'METAS DE PRODUCTO',
    'ACTIVIDADES',
    'FISICO PROG. / EJEC.',
    'UNIDAD DE MEDIDA',
    'CANTIDAD',
    'FINANCIERO PROG. / OBLIGADO',
    'COSTO TOTAL (PESOS)',
    'FUENTES DE FINANCIACIÓN',
    '',
    '',
    '',
    'PROGRAMACIÓN (dd/mm/aa)',
    '',
    'INDICADORES DE GESTIÓN',
    '',
    ''
  ]);
  sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'INDICE FISICO',
    'INDICE INVERSION',
    'EFICIENCIA'
  ]);
  sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'MPIO',
    'SGP',
    'REGALIAS',
    'OTROS',
    'INICIO',
    'TERMINACION',
    '',
    '',
    ''
  ]);
  sheet.mergeCells(`A${cell + rubros.length + 1}:A${cell + rubros.length + 3}`);
  sheet.getCell(`A${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`B${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`C${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`D${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`E${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`F${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`G${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`H${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`I${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`J${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`K${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`L${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`M${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`N${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`O${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`P${cell + rubros.length + 1}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells(`B${cell + rubros.length + 1}:B${cell + rubros.length + 3}`);
  sheet.mergeCells(`C${cell + rubros.length + 1}:C${cell + rubros.length + 3}`);
  sheet.mergeCells(`D${cell + rubros.length + 1}:D${cell + rubros.length + 3}`);
  sheet.mergeCells(`E${cell + rubros.length + 1}:E${cell + rubros.length + 3}`);
  sheet.mergeCells(`F${cell + rubros.length + 1}:F${cell + rubros.length + 3}`);
  sheet.mergeCells(`G${cell + rubros.length + 1}:G${cell + rubros.length + 3}`);
  sheet.mergeCells(`H${cell + rubros.length + 1}:K${cell + rubros.length + 2}`);
  sheet.mergeCells(`L${cell + rubros.length + 1}:M${cell + rubros.length + 2}`);
  sheet.mergeCells(`N${cell + rubros.length + 1}:P${cell + rubros.length + 1}`);
  sheet.getCell(`N${cell + rubros.length + 2}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`O${cell + rubros.length + 2}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`P${cell + rubros.length + 2}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.mergeCells(`N${cell + rubros.length + 2}:N${cell + rubros.length + 3}`);
  sheet.mergeCells(`O${cell + rubros.length + 2}:O${cell + rubros.length + 3}`);
  sheet.mergeCells(`P${cell + rubros.length + 2}:P${cell + rubros.length + 3}`);
  sheet.getCell(`H${cell + rubros.length + 3}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`I${cell + rubros.length + 3}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`J${cell + rubros.length + 3}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`K${cell + rubros.length + 3}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`L${cell + rubros.length + 3}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`M${cell + rubros.length + 3}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  // Agregar actividades
  actionPlan.actions.forEach((activity, index) => {
    sheet.addRow([
      actionPlan.nodes.find(n => n.id_activity === activity.id_activity)?.name ?? 'NA',
      activity.activityDesc,
      'P',
      activity.unitMeter,
      activity.amountP,
      'P',
      activity.totalCostP,
      activity.municipioP,
      activity.sgpP,
      activity.regaliasP,
      activity.otrosP,
      activity.start_date == null ? '' : new Date(activity.start_date).toLocaleDateString(),
      activity.end_date == null ? '' : new Date(activity.end_date).toLocaleDateString(),
      `${activity.phisicalIndicator}%`,
      `${activity.invertionIndicator}%`,
      activity.efficiencyIndicator
    ]);
    sheet.addRow([
      actionPlan.nodes.find(n => n.id_activity === activity.id_activity)?.name ?? 'NA',
      '',
      'E',
      '',
      activity.amountE,
      'O',
      activity.totalCostE,
      activity.municipioE,
      activity.sgpE,
      activity.regaliasE,
      activity.otrosE,
      '',
      '',
      '',
      '',
      ''
    ]);
    const cell = 14 + rubros.length + 3 + (index * 2);
    sheet.mergeCells(`B${cell}:B${cell+1}`);
    sheet.mergeCells(`D${cell}:D${cell+1}`);
    sheet.mergeCells(`N${cell}:N${cell+1}`);
    sheet.mergeCells(`O${cell}:O${cell+1}`);
    sheet.mergeCells(`P${cell}:P${cell+1}`);

    sheet.getCell(`B${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'top', horizontal: 'left' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`C${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`D${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`E${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`F${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`G${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`H${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`I${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`J${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`K${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`L${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`M${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`N${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`O${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`P${cell}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

    sheet.getCell(`C${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`E${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`F${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`G${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`H${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`I${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`J${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`K${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`L${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`M${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  });

  // Calculo total actividades
  cell = 14 + rubros.length + 3 + actionPlan.actions.length * 2;
  let cellsP = '';
  let cellsE = '';
  for (let i = 0; i < actionPlan.actions.length; i++) {
    cellsP+=`E${14 + rubros.length + 3 + (i * 2)}`;
    cellsE+=`E${15 + rubros.length + 3 + (i * 2)}`;
    if (i < actionPlan.actions.length - 1) {
      cellsP+='+';
      cellsE+='+';
    }
  }

  let startRow = 14 + rubros.length + 3;
  let previousValue = sheet.getCell(`A${startRow}`).value;
  for (let i = startRow + 1; i <= cell - 1; i++) {
    const currentValue = sheet.getCell(`A${i}`).value;
    if (currentValue !== previousValue || i === cell - 1) {
      if (i === cell - 1) {
        sheet.mergeCells(`A${startRow}:A${i}`);
      } else if (i - 1 >= startRow) {
        sheet.mergeCells(`A${startRow}:A${i - 1}`);
      }
      previousValue = currentValue;
      startRow = i;
    }
  }

  sheet.addRow([
    '',
    'TOTAL PLAN DE ACCION',
    'P',
    '',
    '',
    'P',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);
  sheet.addRow([
    '',
    '',
    'E',
    '',
    '',
    'O',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  sheet.getCell(`E${cell}`).value = { formula: cellsP };
  sheet.getCell(`E${cell+1}`).value = { formula: cellsE };
  cellsP = cellsP.replace(/E/g, 'G');
  cellsE = cellsE.replace(/E/g, 'G');
  sheet.getCell(`G${cell}`).value = { formula: cellsP };
  sheet.getCell(`G${cell+1}`).value = { formula: cellsE };
  cellsP = cellsP.replace(/G/g, 'H');
  cellsE = cellsE.replace(/G/g, 'H');
  sheet.getCell(`H${cell}`).value = { formula: cellsP };
  sheet.getCell(`H${cell+1}`).value = { formula: cellsE };
  cellsP = cellsP.replace(/H/g, 'I');
  cellsE = cellsE.replace(/H/g, 'I');
  sheet.getCell(`I${cell}`).value = { formula: cellsP };
  sheet.getCell(`I${cell+1}`).value = { formula: cellsE };
  cellsP = cellsP.replace(/I/g, 'J');
  cellsE = cellsE.replace(/I/g, 'J');
  sheet.getCell(`J${cell}`).value = { formula: cellsP };
  sheet.getCell(`J${cell+1}`).value = { formula: cellsE };
  cellsP = cellsP.replace(/J/g, 'K');
  cellsE = cellsE.replace(/J/g, 'K');
  sheet.getCell(`K${cell}`).value = { formula: cellsP };
  sheet.getCell(`K${cell+1}`).value = { formula: cellsE };
  cellsP = cellsP.replace(/K/g, 'N');
  sheet.getCell(`N${cell}`).value = { formula: `(${cellsP})/${actionPlan.actions.length}` };
  cellsP = cellsP.replace(/N/g, 'O');
  sheet.getCell(`O${cell}`).value = { formula: `(${cellsP})/${actionPlan.actions.length}` };
  cellsP = cellsP.replace(/O/g, 'P');
  sheet.getCell(`P${cell}`).value = { formula: `(${cellsP})/${actionPlan.actions.length}` };

  sheet.mergeCells(`A${cell}:A${cell+1}`);
  sheet.mergeCells(`B${cell}:B${cell+1}`);
  sheet.mergeCells(`D${cell}:D${cell+1}`);
  sheet.mergeCells(`N${cell}:N${cell+1}`);
  sheet.mergeCells(`O${cell}:O${cell+1}`);
  sheet.mergeCells(`P${cell}:P${cell+1}`);

  sheet.getCell(`B${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'top', horizontal: 'left' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`C${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`D${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`E${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`F${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`G${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`H${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`I${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`J${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`K${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`L${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`M${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`N${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`O${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`P${cell}`).style = { font: { bold: true, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.getCell(`C${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`E${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`F${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`G${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`H${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`I${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`J${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`K${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`L${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`M${cell + 1}`).style = { font: { bold: false, size: 11 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.addRow([]);

  sheet.addRow([
    'INDICADORES DE RESULTADO',
    '',
    'METAS DE RESULTADO',
    '',
    '',
    '',
    '',
    '',
    'Unidad de Medida',
    'Medicion',
    '',
    'SECRETARIO/DESPACHO/GERENTE',
    '',
    '',
    '',
    '',
  ]);
  cell = 14 + rubros.length + 3 + actionPlan.actions.length * 2 + 3;
  sheet.mergeCells(`A${cell}:B${cell}`);
  sheet.mergeCells(`C${cell}:H${cell}`);
  sheet.mergeCells(`J${cell}:K${cell}`);
  sheet.mergeCells(`L${cell}:P${cell}`);
  sheet.getCell(`A${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'left' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`C${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`I${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`J${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  sheet.getCell(`L${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };

  sheet.addRow([
    'OBSERVACIONES:',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'FIRMA',
    '',
    '',
    '',
    ''
  ]);
  sheet.addRow([]);
  
  // Agregar las metas de resultado
  /*
  actionPlan.nodesResult.forEach((nr, index) => {
    sheet.addRow([
      'nr.indicator',
      '',
      `META DE RESULTADO No. ${nr.name}`,
      '',
      '',
      '',
      '',
      '',
      nr.unitMeter,
      'P',
      nr.programed,
      `NOMBRE: ${nr.asigned}`,
      '',
      ``,
      ``,
      ''
    ]);
    sheet.addRow([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'E',
      '',
      '',
      '',
      ``,
      ``,
      ''
    ]);

    sheet.mergeCells(`A${cell}:B${cell + 1}`);
    sheet.mergeCells(`C${cell}:H${cell + 1}`);
    sheet.mergeCells(`I${cell}:I${cell + 1}`);
    sheet.mergeCells(`L${cell}:P${cell + 1}`);

    sheet.getCell(`A${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'left' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`C${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`I${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`J${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
    sheet.getCell(`L${cell}`).style = { font: { bold: true, size: 12 }, alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  });
  sheet.mergeCells(`A${cell}:K${cell + 1}`);
  sheet.mergeCells(`L${cell}:P${cell + 1}`);
  */

  // Ajustar tamaños de columnas
  sheet.columns.forEach(column => {
    column.width = 15;
  });

  // Guardar archivo
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-accion.xlsx`;
    a.click();
  });
}

export const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>, callback: (file: File) => void) => {
  e.preventDefault();
  if (e.target.files === null) return;
  const file = e.target.files[0];
  callback(file);
}

export const convertLocations = (locations: LocationInterface[]): Map<LocationInterface, LocationInterface[]> => {
  let result = new Map();
  const locs = locations.filter(loc => (loc.belongs === '' || loc.belongs === null));
  for (const element of locs) {
    const blns = locations.filter(loc => loc.belongs === element.name);
    result.set(element, blns);
  }
  return result;
}

export const manageVisualization = (v: Visualization): VisualizationRedux => {
  return {
    id: v.id,
    title: v.title,
    value: v.value,
    chart: v.chart,
    count: v.count,
  } as VisualizationRedux;
}

export const toItem = (values: LocationInterface[] | Secretary[]): Item[] => {
  const items: Item[] = [];
  values.map(value => {
    items.push({
      value: value.name,
      name: value.name,
    });
  });
  return items;
}

export const arrayToMapNodesSecre = (array: NodesSecretary[]) => {
  const nestedArray: NodesSecretary[] = [];
  const nodeMap: Map<string, NodesSecretary> = new Map();
  for (const node of array) {
    nodeMap.set(node.id_node, node);
  }

  for (const node of array) {
    const currentNode = nodeMap.get(node.id_node)!;
    if (node.parent) {
      const parentNode = nodeMap.get(node.parent)!;
      parentNode.children ??= [];
      parentNode.children!.push(currentNode);
    } else {
      nestedArray.push(currentNode);
    }
  }
  return nestedArray;
}

export function calculateDepth(nodes: NodesSecretary[], nodeId: string | null = null): number {
  let maxDepth = 0;

  function dfs(currentNode: NodesSecretary, depth: number) {
    maxDepth = Math.max(maxDepth, depth);

    if (currentNode.children) {
      for (const child of currentNode.children) {
        dfs(child, depth + 1);
      }
    }
  }

  if (nodeId === null) {
    for (const node of nodes) {
      dfs(node, 1);
    }
  } else {
    const node = nodes.find((n) => n.id_node === nodeId);
    if (node) {
      dfs(node, 1);
    }
  }
  return maxDepth;
}

export function getEnumKeys<T extends string, TEnumValue extends string | number,>(
  enumVariable: { [key in T]: TEnumValue }) {
  return Object.keys(enumVariable) as Array<T>;
}

export function dividirArreglo(arreglo: any[], tamaño: number = 100) {
  const subArreglos = [];
  for (let i = 0; i < arreglo.length; i += tamaño) {
    subArreglos.push(arreglo.slice(i, i + tamaño));
  }
  return subArreglos;
}

export const validateUUID = (uuid: string): boolean => {
  const uuidPat: RegExp = /[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/;
  return uuidPat.test(uuid);
}
