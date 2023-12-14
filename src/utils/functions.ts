import type { AxiosError } from 'axios'
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

import { doRefreshToken } from '@/services/api'
import { AuthInterface, ErrorBasicInterface } from '../interfaces'
import { apiRefreshToken } from '@/apis/authApi'

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
    const error_code = error.response?.data.error ?? error.response?.data.error_code
    const error_description = error.response?.data.error_description
    return { status, error_code, error_description }
  }
}

export const refreshToken = async () => {
  const { data } = await apiRefreshToken()
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
  const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return regexp.test(email)
}

export const exportFile = (tabla: string, name: string) => {
  const table = document.getElementById(tabla);
  const wb = XLSX.utils.table_to_book(table!);
  XLSX.writeFile(wb, `${name}.xlsx`);
  const blob = new Blob([table!.innerHTML], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.xlsx`;
  a.click();
  document.body.removeChild(a);
}

export const handleUser = (rol: string, id: number) => {
  const navigate = useNavigate()
  if (rol === "admin") {
    navigate('/pdt')
    return
  }else if (rol === "funcionario") {
    navigate(`/pdt/PlanIndicativo`, {state: {id}})
    return
  }
}

export const getLetter = (year: number) => {
  const num = parseInt(((year - 2016)/4).toString());
  return String.fromCharCode(num + 'A'.charCodeAt(0));
}