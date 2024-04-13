import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';
import {setIsVisiblePopupDeleteHall} from './hallAddReducer';

type HallState = {
  isLoading: boolean,
  isError: boolean,
  successfullyDeleteHall: string,
  isNotFound: boolean,
  idForDeletHall: string,
  isSuccessfulDeleteHall: boolean,
  isErroneousDeleteHall: boolean,
  errorMessage: string
}

const initialState: HallState = {
  isLoading: false,
  isError: false,
  successfullyDeleteHall: '',
  isNotFound: false,
  idForDeletHall: '',
  isSuccessfulDeleteHall: false,
  isErroneousDeleteHall: false,
  errorMessage: ''
}

export const fetchDeleteHallElem = createAsyncThunk(
  'deleteHall/fetchDeleteHallElems',
  async function (id: number, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`http://localhost:8000/api/hall/${id}`, {
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
          dispatch(setISuccessfulDeleteHall(true));
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setIsVisiblePopupDeleteHall(false));
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsErroneousDeleteHall(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousDeleteHall(true));
        }
      } else {
        dispatch(setIsErroneousDeleteHall(true));
        dispatch(setUnauthorizedAuthTimeout(res));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousDeleteHall(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const hallDeleteReducer = createSlice({
  name: 'deleteHall',
  initialState,
  reducers: {
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIdForDeletHall: (state, action) => {
      state.idForDeletHall = action.payload;
    },
    setISuccessfulDeleteHall: (state, action) => {
      state.isSuccessfulDeleteHall = action.payload;
    },
    setIsErroneousDeleteHall: (state, action) => {
      state.isErroneousDeleteHall = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDeleteHallElem.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchDeleteHallElem.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchDeleteHallElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string
      })
  },
});

export const {
  setIsNotFound,
  setIdForDeletHall,
  setISuccessfulDeleteHall,
  setIsErroneousDeleteHall
} = hallDeleteReducer.actions;

export default hallDeleteReducer.reducer;
