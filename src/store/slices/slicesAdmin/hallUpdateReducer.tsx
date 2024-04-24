import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';

type HallState = {
  isLoading: boolean,
  isError: boolean,
  errorMessage: string,
  isNotFound: boolean,
  isSuccessfulUpdateHall: boolean,
  isErroneousUpdateHall: boolean
}

const initialState: HallState = {
  isLoading: false,
  isError: false,
  errorMessage: '',
  isNotFound: false,
  isSuccessfulUpdateHall: false,
  isErroneousUpdateHall: false
}

type Data = {
  name: string | undefined,
  rows: number,
  chairs_in_row: number,
  total_chairs: number,
  blocked_chairs: string,
  price_standart_chair: number | undefined,
  price_vip_chair: number | undefined,
  is_active: number | undefined
}

export const fetchUpdateHallElem = createAsyncThunk(
  'hallUpdate/fetchUpdateHallElem',
  async function (data: (Data | number)[], {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      const [updateHallData, id] = data;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`${process.env.REACT_APP_ADMIN_URL}/hall/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getTokenForLogin(),
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          body: JSON.stringify(updateHallData),
        })

        if (result.ok) {
          dispatch(setIsSuccessfulUpdateHall(true));
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsErroneousUpdateHall(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousUpdateHall(true));
        } else {
          dispatch(setIsErroneousUpdateHall(true));
        }
        return await result.json();
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousUpdateHall(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const hallUpdateReducer = createSlice({
  name: 'hallUpdate',
  initialState,
  reducers: {
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulUpdateHall: (state, action) => {
      state.isSuccessfulUpdateHall = action.payload;
    },
    setIsErroneousUpdateHall: (state, action) => {
      state.isErroneousUpdateHall = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUpdateHallElem.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchUpdateHallElem.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchUpdateHallElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setIsNotFound,
  setIsSuccessfulUpdateHall,
  setIsErroneousUpdateHall
} = hallUpdateReducer.actions;

export default hallUpdateReducer.reducer;
