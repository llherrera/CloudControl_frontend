import { createSlice } from "@reduxjs/toolkit";
import {
  thunkGetActiveSessions,
  thunkCreateSession,
  thunkCloseSession,
  thunkUpdateSessionActivity,
  thunkGetUsersByPlanDetailed,
  thunkGetUserSessionEvents,
  thunkGetUserSessionAlerts,
  thunkGetUserSessionHistory, // ← Agregado
} from "./thunks";
import { Session, User, UserSessionEvent, UserSessionAlert } from "@/interfaces/session";

interface SessionsState {
  list: Session[];
  users: User[];
  events: UserSessionEvent[];
  alerts: UserSessionAlert[];
  history: Session[]; // ← Agregado para el historial de sesiones
  loading: boolean;
  error: string | null;
  currentSessionId: number | null;
}

const initialState: SessionsState = {
  list: [],
  users: [],
  events: [],
  alerts: [],
  history: [], // ← Agregado
  loading: false,
  error: null,
  currentSessionId: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    setCurrentSessionId(state, action) {
      state.currentSessionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunkGetActiveSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunkGetActiveSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(thunkGetActiveSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      })
      .addCase(thunkCreateSession.fulfilled, (state, action) => {
        state.currentSessionId = action.payload.SessionId;
        state.list.unshift(action.payload);
      })
      .addCase(thunkCloseSession.fulfilled, (state, action) => {
        state.list = state.list.map((s) =>
          s.SessionId === action.payload.SessionId ? action.payload : s
        );
        if (state.currentSessionId === action.payload.SessionId) {
          state.currentSessionId = null;
        }
      })
      .addCase(thunkUpdateSessionActivity.fulfilled, (state, action) => {
        state.list = state.list.map((s) =>
          s.SessionId === action.payload.SessionId ? action.payload : s
        );
      })
      .addCase(thunkGetUsersByPlanDetailed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunkGetUsersByPlanDetailed.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(thunkGetUsersByPlanDetailed.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      })
      .addCase(thunkGetUserSessionEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunkGetUserSessionEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(thunkGetUserSessionEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      })
      .addCase(thunkGetUserSessionAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunkGetUserSessionAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(thunkGetUserSessionAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      })
      // ← Nuevos casos para thunkGetUserSessionHistory
      .addCase(thunkGetUserSessionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunkGetUserSessionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(thunkGetUserSessionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Error";
      });
  },
});

export const { setCurrentSessionId } = sessionsSlice.actions;
export default sessionsSlice.reducer;
