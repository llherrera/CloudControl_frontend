import { getEnvironment } from '../utils/environment'

import apis from './index'

const { BASE_URL } = getEnvironment()

export const apiLogin = () => {
  return apis.post(`${BASE_URL}/login`, {})
}

export const apiRefreshToken = () => {
  return apis.post(`${BASE_URL}/refresh`, {})
}

export const apiLogout = () => {
  return apis.post(`${BASE_URL}/logout`, {})
}
