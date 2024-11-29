import type { AxiosError } from 'axios'
import ExcelJS from 'exceljs'
import { useNavigate } from 'react-router-dom'

import { doRefreshToken } from '@/services/api'
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
  VisualizationRedux } from '../interfaces'
import { setToken } from './storage'

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor = 800) => {
  let timeout: NodeJS.Timeout
  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
  return debounced
}

export const parseErrorAxios = (err: unknown) => {
  const error = err as AxiosError<ErrorBasicInterface>
  if (!error.response) throw err
  else {
    const status = error.response?.status
    const error_code = error.response?.data.error ?? error.response?.data.error_code ?? error.response?.data.code
    const error_description = error.response?.data.error_description ?? error.response?.data.msg
    return { status, error_code, error_description }
  }
}

export const refreshToken = async () => {
  const { data } = await doRefreshToken()
  const token: AuthInterface = data.data
  setToken(token)
  return token
}

export const getYears = (fecha_inicio: string= '') => {
  const years = [
    new Date(fecha_inicio).getUTCFullYear(),
    new Date(fecha_inicio).getUTCFullYear()+1, 
    new Date(fecha_inicio).getUTCFullYear()+2, 
    new Date(fecha_inicio).getUTCFullYear()+3
  ]
  return years
}

export const validateEmail = (email: string) => {
  const regexp: RegExp = /\w+([.]\w+)*@[a-zA-Z0-9._-]+[.][a-zA-Z]{2,5}/
  return regexp.test(email)
}

export const handleUser = (rol: string) => {
  const navigate = useNavigate()
  if (rol === "admin") {
    return navigate('/pdt')
  }else if (rol === "funcionario") {
    return navigate(`/lobby`)
  }
}

export const getLetter = (year: number) => {
  const num = parseInt(((year - 2016)/4).toString())
  return String.fromCharCode(num + 'A'.charCodeAt(0))
}

export const generateExcel = (
  data: ReportPDTInterface[], 
  name: string, 
  levels: LevelInterface[], 
  year: number, 
  color: number[]) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Reporte')

  worksheet.columns = [
    {header: 'Responsable', key: 'responsable', width: 20},
    {header: 'Codigo de la meta producto', key: 'codigo_meta', width: 20},
    {header: 'Descripción Meta producto', key: 'descripcion_meta', width: 20},
    {header:`% ejecución ${year}`, key: 'ejecucion', width: 20},
    ...levels.map((l, i) => ({header: l.name, key: `nivel_${i}`, with: 20})),
    {header: 'Indicador', key: 'indicador', width: 20},
    {header: 'Linea base', key: 'linea_base', width: 20},
    {header: `Programado ${year}`, key: 'programado', width: 20},
    {header: `Ejecutado ${year}`, key: 'ejec', width: 20},
  ]

  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9D9D9' },
  }

  worksheet.getRow(1).border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  }

  data.forEach((d: ReportPDTInterface) => {
    let levels_ = d.planSpecific.map((d_, i) => ({[`nivel_${i}`]: d_}))
    const aaaa = levels_.reduce((acc, curr) => ({...acc, ...curr}), {})

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
    })

    const ejecCell = row.getCell('ejecucion')
    const ternary3= d.percentExecuted[0] < color[2] ? 'FF119432' : 'FF008DCC'
    const ternary2= d.percentExecuted[0] < color[1] ? 'FFFCC623' : ternary3
    const ternaty = d.percentExecuted[0] < color[0] ? 'FFFE1700' : ternary2
    ejecCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: `${d.percentExecuted[0] < 0 ? 'FF9CA3AF' : ternaty}` },
    }
  })

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.xlsx`
    a.click()
  })

}

export const generateExcelYears = (
  data: ReportPDTInterface[], 
  name: string, 
  levels: LevelInterface[], 
  years: number[], 
  color: number[]) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Reporte')

  worksheet.columns = [
    {header: 'Responsable', key: 'responsable', width: 20},
    {header: 'Codigo de la meta producto', key: 'codigo_meta', width: 20},
    {header: 'Descripción Meta producto', key: 'descripcion_meta', width: 20},
    ...years.map(y => ({header:`% ejecución ${y}`, key: `ejecucion_${y}`, width: 20})),
    ...levels.map((l, i) => ({header: l.name, key: `nivel_${i}`, with: 20})),
    {header: 'Indicador', key: 'indicador', width: 20},
    {header: 'Linea base', key: 'linea_base', width: 20},
    ...years.map(y => ({header: `Programado ${y}`, key: `programado_${y}`, width: 20})),
    ...years.map(y => ({header: `Ejecutado ${y}`, key: `ejecutado_${y}`, width: 20})),
  ]

  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9D9D9' },
  }

  worksheet.getRow(1).border = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  }

  data.forEach((d: ReportPDTInterface) => {
    let tempEjecPor = years.map((y, i) => ({
      [`ejecucion_${y}`]: d.percentExecuted[i] < 0 ? 0 : d.percentExecuted[i]
    }))
    const ejecPor_ = tempEjecPor.reduce((acc, curr) => ({...acc, ...curr}), {})

    let tempLevels = d.planSpecific.map((d_, i) => ({[`nivel_${i}`]: d_}))
    const levels_ = tempLevels.reduce((acc, curr) => ({...acc, ...curr}), {})

    let tempPro = years.map((y, i) => ({[`programado_${y}`]: d.programed[i]}))
    const pro_ = tempPro.reduce((acc, curr) => ({...acc, ...curr}), {})

    let tempEjec = years.map((y, i) => ({[`ejecutado_${y}`]: d.executed[i]}))
    const ejec_ = tempEjec.reduce((acc, curr) => ({...acc, ...curr}), {})

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
    })

    years.forEach((y, i) => {
      const ejecCell = row.getCell(`ejecucion_${y}`)

      const ternary3= d.percentExecuted[i] < color[2] ? 'FF119432' : 'FF008DCC'
      const ternary2= d.percentExecuted[i] < color[1] ? 'FFFCC623' : ternary3
      const ternaty = d.percentExecuted[i] < color[0] ? 'FFFE1700' : ternary2

      ejecCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: `${d.percentExecuted[i] < 0 ? 'FF9CA3AF' : ternaty}`
        },
      }
    })
  })

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.xlsx`
    a.click()
  })

}

export const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>, callback: (file:File)=>void) => {
  e.preventDefault()
  if (e.target.files === null) return
  const file = e.target.files[0]
  callback(file)
}

export const convertLocations = (locations: LocationInterface[]): Map<LocationInterface, LocationInterface[]> => {
  let result = new Map();
  const locs = locations.filter(loc => (loc.belongs === '' || loc.belongs === null));
  for(const element of locs) {
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
  } as VisualizationRedux
}

export const toItem = (values: LocationInterface[] | Secretary[]): Item[] => {
  const items: Item[] = []
  values.map(value => {
    items.push({
      value: value.name,
      name: value.name,
    })
  })
  return items
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
