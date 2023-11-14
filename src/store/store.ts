import type { PreloadedState } from '@reduxjs/toolkit'
import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import authReducer from './auth/authSlice'
import contentReducer from './content/contentSlice'
import planRedurcer from './plan/planSlice'
import chartReducer from './chart/chartSlice'
// En los reducers se definen las propiedades del estado global
// To Do: Hacer mas reducers, los que sean necesarios, se hace la carpeta con el Slice y los thunks

export const reducers = {
  auth: authReducer,
  content: contentReducer,
  plan: planRedurcer,
  chart: chartReducer
  // Aqui se agregan los reducers
}

const rootReducer = combineReducers(reducers)

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}
export type AppStore = ReturnType<typeof setupStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
