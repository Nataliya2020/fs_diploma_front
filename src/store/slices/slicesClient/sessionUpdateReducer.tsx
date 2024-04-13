import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

type SessionUpdateData = {
  id: number,
  hall_id: number,
  session_start_time: string,
  film_id: number,
  paid_chairs: string
}

type SessionState = {
  isLoading: boolean,
  isError: boolean,
  isNotFound: boolean,
  isSuccessfulUpdateSession: boolean,
  isErroneousUpdateSession: boolean,
  errorMessage: string
}

const initialState: SessionState = {
  isLoading: false,
  isError: false,
  isNotFound: false,
  isSuccessfulUpdateSession: false,
  isErroneousUpdateSession: false,
  errorMessage: ''
}
export const fetchSessionUpdate = createAsyncThunk(
  'sessionUpdate/fetchSessionUpdate',
  async function (data: SessionUpdateData, {rejectWithValue, dispatch}) {
    try {
      const result = await fetch(`http://localhost:8000/session/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (result.ok) {
        dispatch(setIsSuccessfulUpdateSession(true));
      } else if (result.status === 404) {
        dispatch(setIsNotFound(true));
        dispatch(setIsErroneousUpdateSession(true));
      } else {
        dispatch(setIsErroneousUpdateSession(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousUpdateSession(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const sessionUpdateReducer = createSlice({
  name: 'sessionUpdate',
  initialState,
  reducers: {
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulUpdateSession: (state, action) => {
      state.isSuccessfulUpdateSession = action.payload;
    },
    setIsErroneousUpdateSession: (state, action) => {
      state.isErroneousUpdateSession = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSessionUpdate.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchSessionUpdate.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchSessionUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});

export const {
  setIsNotFound,
  setIsSuccessfulUpdateSession,
  setIsErroneousUpdateSession
} = sessionUpdateReducer.actions;

export default sessionUpdateReducer.reducer;
