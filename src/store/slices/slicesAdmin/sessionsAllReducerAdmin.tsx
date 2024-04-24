import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';

export type Sessions = {
  id: number | string,
  hall_id: number,
  film_id: number,
  session_start_time: string,
  dateSession: string,
  created_at: string,
  updated_at: string | null,
}

type ElemsSessionState = {
  sessionsElems: Sessions[],
  copySessionsElems: Sessions[],
  isLoading: boolean,
  isError: boolean,
  errorMesageSessions: string,
  isSuccessfulGetAllSessions: boolean,
  isNotfound: boolean,
  isErroneousAllSession: boolean,
  errorMessage: string,
}

const initialState: ElemsSessionState = {
  sessionsElems: [
    {
      id: 0,
      hall_id: 0,
      film_id: 0,
      session_start_time: '',
      dateSession: '',
      updated_at: '',
      created_at: ''
    }
  ],
  copySessionsElems: [
    {
      id: 0,
      hall_id: 0,
      film_id: 0,
      session_start_time: '',
      dateSession: '',
      updated_at: '',
      created_at: ''
    }
  ],
  isLoading: false,
  isError: false,
  errorMesageSessions: '',
  isSuccessfulGetAllSessions: false,
  isNotfound: false,
  isErroneousAllSession: false,
  errorMessage: '',
}

export const fetchGetSessionElems = createAsyncThunk(
  'session/fetchGetSessionElems',
  async function (data: { date: string, signal: AbortSignal | undefined }, {rejectWithValue, dispatch}) {
    const signal = data.signal;
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`${process.env.REACT_APP_ADMIN_URL}/session?date=${data.date}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          signal
        });

        if (result.ok) {
          dispatch(setIsSuccessfulGetAllSessions(true));
          const sessions: Sessions[] = await result.json();
          dispatch(setSessionsElems(sessions));
          dispatch(setCopySessionsElems(sessions));
          if (sessions.length === 0) {
            return;
          }
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setIsErroneousAllSession(true))
          dispatch(setUnauthorizedAuthTimeout(result.status));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousAllSession(true))
        } else {
          dispatch(setIsErroneousAllSession(true))
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));

      }
    } catch (e) {
      const resultError = (e as Error).message;
      return rejectWithValue(resultError);
    }
  }
);

const sessionsAllReducerAdmin = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionsElems: (state, action) => {
      state.sessionsElems = action.payload;
    },
    setCopySessionsElems: (state, action) => {
      state.copySessionsElems = action.payload;
    },
    setIsSuccessfulGetAllSessions: (state, action) => {
      state.isSuccessfulGetAllSessions = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isErroneousAllSession = action.payload;
    },
    setIsErroneousAllSession: (state, action) => {
      state.isErroneousAllSession = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchGetSessionElems.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchGetSessionElems.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchGetSessionElems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setSessionsElems,
  setCopySessionsElems,
  setIsSuccessfulGetAllSessions,
  setIsNotFound,
  setIsErroneousAllSession
} = sessionsAllReducerAdmin.actions;

export default sessionsAllReducerAdmin.reducer;
