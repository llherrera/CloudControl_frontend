//import { getEnvironment } from '../utils'
import { getEnvironment } from '../utils/environment'

import apis from './index'

const { VITE_API_AUTH } = getEnvironment()

export const apiLogin = () => {
  return apis.post(`${VITE_API_AUTH}/login`, {})
}

export const apiRefreshToken = () => {
  return apis.post(`${VITE_API_AUTH}/refresh`, {})
}

export const apiLogout = () => {
  return apis.post(`${VITE_API_AUTH}/logout`, {})
}
