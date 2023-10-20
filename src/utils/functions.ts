import type { AxiosError } from 'axios'

import { apiRefreshToken } from '../apis/authApi'
import { AuthInterface, ErrorBasicInterface } from '../interfaces'

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
