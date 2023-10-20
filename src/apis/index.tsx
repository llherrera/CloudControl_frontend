import axios from 'axios'
import jwt_decode from 'jwt-decode'

import { getToken, refreshToken } from '../utils'

let isRefreshingToken = false
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = []

const processFailedQueue = (error?: unknown) => {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error)
    else promise.resolve()
  })
  failedQueue = []
}

const apis = axios.create()

apis.interceptors.request.use(
  async request => {
    const token = getToken()
    if (token) {
      // @ts-expect-error request.headers
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token.access_token}`
      }

      const decodedToken: { exp: number } = jwt_decode(token.access_token)
      const isExpired = new Date(decodedToken.exp * 1000) < new Date()
      if (!isExpired) return request

      const new_token = await refreshToken()
      if (new_token)
        // @ts-expect-error request.headers
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${new_token.access_token}`
        }
      return request
    }
    return request
  },
  error => Promise.reject(error)
)

apis.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshingToken) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return apis(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }
      originalRequest._retry = true
      isRefreshingToken = true
      return new Promise(function (resolve, reject) {
        refreshToken()
          .then(() => {
            processFailedQueue(null)
            resolve(apis(originalRequest))
          })
          .then(() => {
            isRefreshingToken = false
          })
          .catch((err: unknown) => {
            processFailedQueue(err)
            reject(err)
          })
      })
    }
    return Promise.reject(error)
  }
)

export default apis
