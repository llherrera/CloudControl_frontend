import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { apiLogin, apiLogout, apiRefreshToken } from '../../apis/authApi'
import { AuthInterface, ErrorBasicInterface } from '../../interfaces'
import { parseErrorAxios } from '../../utils'

// eslint-disable-next-line @typescript-eslint/ban-types
export const thunkLogin = createAsyncThunk<AuthInterface, {}, { rejectValue: ErrorBasicInterface }>(
  'auth/login',
  async (props, { rejectWithValue }) => {
    try {
      const { data } = await apiLogin()
      return data.data
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
      const { data } = await apiRefreshToken()
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
      const { data } = await apiLogout()
      return data.data
    } catch (err) {
      const result = parseErrorAxios(err)
      return rejectWithValue(result)
    }
  }
)

export const logout = createAction('auth/logout')
