import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';

type ElemsPopupState = {
  isVisiblePopupAddHall: boolean,
  isVisiblePopupDeleteHall: boolean,
  isLoading: boolean,
  isError: boolean,
  hallName: string,
  isNotFound: boolean,
  isAddHall: boolean,
  isSuccessfulAddHall: boolean,
  isErroneousAddHall: boolean,
  errorMessage: string
}

const initialState: ElemsPopupState = {
  isVisiblePopupAddHall: false,
  isVisiblePopupDeleteHall: false,
  isLoading: false,
  isError: false,
  hallName: '',
  isNotFound: false,
  isAddHall: false,
  isSuccessfulAddHall: false,
  isErroneousAddHall: false,
  errorMessage: ''
}
export const fetchPOSTHallElem = createAsyncThunk(
  'popup/fetchPOSTHallElem',
  async function (hallData: {}, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch('http://localhost:8000/api/hall', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getTokenForLogin(),
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          body: JSON.stringify(hallData),
        })

        if (result.ok) {
          dispatch(setIsSuccessfulAddHall(true));
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsErroneousAddHall(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousAddHall(true));
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
        dispatch(setIsErroneousAddHall(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousAddHall(true));
        return rejectWithValue(e.message);
      }
    }
  }
)

const hallAddReducer = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setIsVisiblePopupAddHall: (state, action) => {
      state.isVisiblePopupAddHall = action.payload;
    },
    setIsVisiblePopupDeleteHall: (state, action) => {
      state.isVisiblePopupDeleteHall = action.payload;
    },
    setHallName: (state, action) => {
      state.hallName = action.payload;
    },
    setIsAddHall: (state, action) => {
      state.isAddHall = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulAddHall: (state, action) => {
      state.isSuccessfulAddHall = action.payload;
    },
    setIsErroneousAddHall: (state, action) => {
      state.isErroneousAddHall = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchPOSTHallElem.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchPOSTHallElem.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchPOSTHallElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setIsVisiblePopupAddHall,
  setIsVisiblePopupDeleteHall,
  setHallName,
  setIsAddHall,
  setIsNotFound,
  setIsSuccessfulAddHall,
  setIsErroneousAddHall
} = hallAddReducer.actions;
export default hallAddReducer.reducer;
