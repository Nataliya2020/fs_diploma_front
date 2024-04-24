import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';
import {setIsSessionDeleted} from '../infoFinalActionCrud';

type ElemsSessionState = {
  isLoading: boolean,
  isError: boolean,
  sessionFilmDeleteName: string,
  sessionId: number | string,
  isVisiblePopupDeleteSession: boolean
  isSuccessfulDeleteSession: boolean,
  isErroneousDeleteSession: boolean,
  isNotFound: boolean,
  errorMessage: string
}

const initialState: ElemsSessionState = {
  isLoading: false,
  isError: false,
  sessionFilmDeleteName: '',
  sessionId: 0,
  isVisiblePopupDeleteSession: false,
  isSuccessfulDeleteSession: false,
  isErroneousDeleteSession: false,
  isNotFound: false,
  errorMessage: ''
}

export const fetchDeleteSessionElem = createAsyncThunk(
  'sessionFilmDelete/fetchDeleteFilmElemInSession',
  async function (id: number, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`${process.env.REACT_APP_ADMIN_URL}/session/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getTokenForLogin(),
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          body: JSON.stringify(id),
        })

        if (result.ok) {
          dispatch(setIsSuccessfulDeleteSession(true));
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setIsVisiblePopupDeleteSession(false));
          dispatch(setIsSessionDeleted(false));
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsErroneousDeleteSession(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousDeleteSession(true));
        } else {
          dispatch(setIsErroneousDeleteSession(true));
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousDeleteSession(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const sessionDeleteReducer = createSlice({
  name: 'sessionFilmDelete',
  initialState,
  reducers: {
    setFilmDeleteName: (state, action) => {
      state.sessionFilmDeleteName = action.payload;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    setIsSuccessfulDeleteSession: (state, action) => {
      state.isSuccessfulDeleteSession = action.payload;
    },
    setIsErroneousDeleteSession: (state, action) => {
      state.isErroneousDeleteSession = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsVisiblePopupDeleteSession: (state, action) => {
      state.isVisiblePopupDeleteSession = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDeleteSessionElem.pending, (state, action) => {
      state.isLoading = true;
    })
      .addCase(fetchDeleteSessionElem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchDeleteSessionElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setFilmDeleteName,
  setSessionId,
  setIsSuccessfulDeleteSession,
  setIsErroneousDeleteSession,
  setIsNotFound,
  setIsVisiblePopupDeleteSession
} = sessionDeleteReducer.actions;

export default sessionDeleteReducer.reducer;
