import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { AuthInterface, ErrorBasicInterface } from '../../interfaces'
import { parseErrorAxios, setToken } from '../../utils'

import { doLogin, doRefreshToken, doLogout } from '@/services/api'

interface LoginProps {
  username: string
  password: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const thunkLogin = createAsyncThunk<AuthInterface, LoginProps, { rejectValue: ErrorBasicInterface }>(
  'auth/login',
  async (props: LoginProps, { rejectWithValue }) => {
    try {
      const res = await doLogin(props)
      const { token } = res
      if (token) {
        return res
      }else {
        const result = parseErrorAxios(res)
        return rejectWithValue(result)
      }
    } catch (err) {
      const result = parseErrorAxios(err)
      return rejectWithValue(result)
    }
  }
)

export const thunkRefreshToken = createAsyncThunk<AuthInterface>(
  'auth/refreshToken',
  async (props, { rejectWithValue }) => {
    try {
      const { data } = await doRefreshToken()
      return data.data
    } catch (err) {
      const result = parseErrorAxios(err)
      return rejectWithValue(result)
    }
  }
)

export const thunkLogout = createAsyncThunk<AuthInterface>(
  'auth/thunkLogout', 
  async (props, { rejectWithValue }) => {
    try {
      const res = await doLogout()
      return res
    } catch (err) {
      const result = parseErrorAxios(err)
      return rejectWithValue(result)
    }
  }
)

export const logout = createAction('auth/logout')
