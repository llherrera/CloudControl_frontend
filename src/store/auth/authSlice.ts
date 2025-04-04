import { createSlice } from '@reduxjs/toolkit';

import { InitialStateAuthInterface } from '../../interfaces';
import { getToken, removeToken, setToken } from '../../utils';

import { logout, thunkLogin, thunkLogout, thunkRefreshToken } from './thunks';

const getInitialState = (): InitialStateAuthInterface => {
  const token_info = getToken()
  return {
    authenticating: false,
    errorAuthenticating: undefined,

    refreshingToken: false,
    errorRefreshingToken: undefined,

    loggingOff: false,
    errorLoggingOff: undefined,

    logged: !!token_info,
    token_info
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(thunkLogin.pending, state => {
      if (!state.authenticating) state.authenticating = true;
      state.errorAuthenticating = undefined;
    });
    builder.addCase(thunkLogin.fulfilled, (state, action) => {
      state.authenticating = false;
      state.logged = true;
      state.token_info = action.payload;
      setToken(action.payload);
    });
    builder.addCase(thunkLogin.rejected, (state, action) => {
      state.authenticating = false;
      let error_text = 'Ha occurido un error.';
      if (action.payload) {
        switch (action.payload.status) {
          case 401:
            error_text = 'No está permitido acceder aquí.';
            break;
          case 404:
            alert('Usuario o contraseña incorrecto.');
            error_text = 'Usuario o contraseña incorrecto.';
            break;
          case 500:
            error_text = 'Ha habido un error, pruebe más tarde.';
            break;
          default:
            error_text = '';
            break;
        }
        state.errorAuthenticating = {
          status: action.payload.status,
          error_code: action.payload.error_code ?? action.payload.error,
          error_description: error_text
        };
      } else {
        state.errorAuthenticating = {
          error_code: action.error.code,
          error_description: error_text
        };
      }
    });

    builder.addCase(thunkRefreshToken.pending, state => {
      if (!state.refreshingToken) state.refreshingToken = true;
      state.errorRefreshingToken = undefined;
    });
    builder.addCase(thunkRefreshToken.fulfilled, (state, action) => {
      state.refreshingToken = false;
      state.token_info = action.payload;
      setToken(action.payload);
    });
    builder.addCase(thunkRefreshToken.rejected, state => {
      removeToken();
      state.logged = false;
      state.token_info = undefined;
      state.refreshingToken = false;
      state.errorRefreshingToken = { error_description: 'Error al intentar refrescar el token' };
    });

    builder.addCase(thunkLogout.pending, state => {
      if (!state.loggingOff) state.loggingOff = true;
      state.errorLoggingOff = undefined;
    });
    builder.addCase(thunkLogout.fulfilled, state => {
      state.loggingOff = false;
      state.token_info = undefined;
      state.logged = false;
      removeToken();
    });
    builder.addCase(thunkLogout.rejected, state => {
      state.loggingOff = false;
      state.errorLoggingOff = { error_description: 'Error al intentar desloguear' };
    });

    builder.addCase(logout, state => {
      removeToken();
      state.logged = false;
      state.token_info = undefined;
    });
  }
});
export default authSlice.reducer;
