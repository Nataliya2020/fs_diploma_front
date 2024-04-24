import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export type Sessions = {
  id: number,
  hall_id: number,
  film_id: number,
  session_start_time: string,
}

type ElemsFilmState = {
  sessionsElems: Sessions[],
  isLoading: boolean,
  isError: boolean,
  isNotFound: boolean,
  isSuccessfulSessionAll: boolean,
  isErroneousSessionAll: boolean,
  errorMessage: string
}

const initialState: ElemsFilmState = {
  sessionsElems: [{
    id: 0,
    hall_id: 0,
    session_start_time: '',
    film_id: 0,
  }],
  isLoading: false,
  isError: false,
  isNotFound: false,
  isSuccessfulSessionAll: false,
  isErroneousSessionAll: false,
  errorMessage: ''
}

export const fetchClientGetSession = createAsyncThunk(
  'session/fetchClientGetSessions',
  async function (data: { date: string, signal: AbortSignal | undefined }, {rejectWithValue, dispatch}) {
    const signal = data.signal;

    try {
      const result = await fetch(`${process.env.REACT_APP_CLIENT_URL}/session?date=${data.date}`, {signal});
      if (result.ok) {
        dispatch(setIsSuccessfulSessionAll(true));
        dispatch(setIsErroneousSessionAll(false));
        const sessions = await result.json();
        dispatch(setSessionsElems(sessions));
      } else if (result.status === 404) {
        dispatch(setIsNotFound(true));
        dispatch(setIsErroneousSessionAll(true));
      } else {
        dispatch(setIsErroneousSessionAll(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousSessionAll(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const sessionAllForClientReducer = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionsElems: (state, action) => {
      state.sessionsElems = action.payload;
    },
    setIsSuccessfulSessionAll: (state, action) => {
      state.isSuccessfulSessionAll = action.payload;
    },
    setIsErroneousSessionAll: (state, action) => {
      state.isErroneousSessionAll = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchClientGetSession.pending, (state) => {
      state.isLoading = true;

    })
      .addCase(fetchClientGetSession.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchClientGetSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});

export const {
  setSessionsElems,
  setIsSuccessfulSessionAll,
  setIsErroneousSessionAll,
  setIsNotFound
} = sessionAllForClientReducer.actions;

export default sessionAllForClientReducer.reducer;
