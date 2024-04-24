import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';
import {setIsAddedFilmsAndSessions, setIsSessionAdded} from '../infoFinalActionCrud';

type ParentCoords = {
  bottom: number,
  height: number,
  left: number,
  right: number,
  top: number,
  width: number,
  x: number,
  y: number
}

type SessionElems = {
  parCoords: ParentCoords,
  isLoading: boolean,
  isError: boolean,
  sessionHallName: string,
  timeStartSession: string,
  sessionFilmName: string,
  isNotFound: boolean,
  isAddSession: boolean,
  isVisiblePopupAddSession: boolean,
  isBusySession: boolean,
  isSuccessfulAddSessions: boolean,
  isErroneousAddSession: boolean,
  errorMessage: string,
  isTimelineCrowded: boolean,
  session_date: string
}

const initialState: SessionElems = {
  parCoords: {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0
  },
  isLoading: false,
  isError: false,
  sessionHallName: '',
  timeStartSession: '',
  sessionFilmName: '',
  isNotFound: false,
  isAddSession: false,
  isVisiblePopupAddSession: false,
  isBusySession: false,
  isSuccessfulAddSessions: false,
  isErroneousAddSession: false,
  errorMessage: '',
  isTimelineCrowded: false,
  session_date: ''
}

export const fetchPostSessionElem = createAsyncThunk(
  'session/fetchPostSessionElem',
  async function (sessionData: {}, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`${process.env.REACT_APP_ADMIN_URL}/session`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getTokenForLogin(),
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          body: JSON.stringify(sessionData),
        })

        if (result.ok) {
          dispatch(setIsSuccessfulAddSessions(true));
          localStorage.removeItem('adminInputSessions');
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsVisiblePopupAddSession(false));
          dispatch(setIsSessionAdded(false))
          dispatch(setIsAddedFilmsAndSessions(false));
          dispatch(setIsErroneousAddSession(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousAddSession(true));
        } else {
          dispatch(setIsErroneousAddSession(true));
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
      }
    } catch (e) {
      dispatch(setIsErroneousAddSession(true));
      const resultError = (e as Error).message;
      return rejectWithValue(resultError);
    }
  }
)

const sessionAddReducer = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setTimeStartSession: (state, action) => {
      state.timeStartSession = action.payload;
    },
    setSessionFilmName: (state, action) => {
      state.sessionFilmName = action.payload;
    },
    setSessionHallName: (state, action) => {
      state.sessionHallName = action.payload;
    },
    setIsBusySession: (state, action) => {
      state.isBusySession = action.payload;
    },
    setIsSuccessfulAddSessions: (state, action) => {
      state.isSuccessfulAddSessions = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsErroneousAddSession: (state, action) => {
      state.isErroneousAddSession = action.payload;
    },
    setParCoords: (state, action) => {
      state.parCoords = action.payload;
    },
    setIsTimelineCrowded: (state, action) => {
      state.isTimelineCrowded = action.payload;
    },
    setDateSessions: (state, action) => {
      state.session_date = action.payload;
    },
    setIsVisiblePopupAddSession: (state, action) => {
      state.isVisiblePopupAddSession = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchPostSessionElem.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchPostSessionElem.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchPostSessionElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});
export const {
  setSessionFilmName,
  setSessionHallName,
  setTimeStartSession,
  setIsBusySession,
  setIsSuccessfulAddSessions,
  setIsNotFound,
  setIsErroneousAddSession,
  setParCoords,
  setIsTimelineCrowded,
  setDateSessions,
  setIsVisiblePopupAddSession
} = sessionAddReducer.actions;
export default sessionAddReducer.reducer;
