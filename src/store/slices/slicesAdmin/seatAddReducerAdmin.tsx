import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';

type Seat = {
  id?: number,
  hall_id: number,
  seat_number: number,
  is_standard_chairs: boolean,
  is_vip_chairs: boolean,
  created_at?: string,
  updated_at?: string,
}

type SeatElemSeat = {
  isLoading: boolean,
  isError: boolean,
  errorMesageSeat: string,
  unauthorizedAuthTimeout: string,
  isSuccessfulAddSeats: boolean,
  isErroneousAddSeats: boolean,
  isNotFound: boolean,
  errorMessage: string
}

const initialState: SeatElemSeat = {
  isLoading: false,
  isError: false,
  errorMesageSeat: '',
  unauthorizedAuthTimeout: '',
  isSuccessfulAddSeats: false,
  isErroneousAddSeats: false,
  isNotFound: false,
  errorMessage: ''
}

export const fetchAddSeatElems = createAsyncThunk(
  'seat/fetchAddSeatElems',
  async function (seat: Seat[], {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`http://localhost:8000/api/seat`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getTokenForLogin(),
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          body: JSON.stringify(seat),
        });

        if (result.ok) {
          dispatch(setIsSuccessfulAddSeats(true));
          const seat: SeatElemSeat[] = await result.json();

          if (seat.length === 0) {
            return;
          }
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsErroneousAddSeats(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousAddSeats(true));
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
        dispatch(setIsErroneousAddSeats(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousAddSeats(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const seatAddReducerAdmin = createSlice({
  name: 'seat',
  initialState,
  reducers: {
    setUnauthorizedAuthTimeout: (state, action) => {
      state.unauthorizedAuthTimeout = action.payload;
    },
    setIsSuccessfulAddSeats: (state, action) => {
      state.isSuccessfulAddSeats = action.payload;
    },
    setIsErroneousAddSeats: (state, action) => {
      state.isErroneousAddSeats = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isErroneousAddSeats = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAddSeatElems.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchAddSeatElems.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchAddSeatElems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setUnauthorizedAuthTimeout,
  setIsSuccessfulAddSeats,
  setIsErroneousAddSeats,
  setIsNotFound
} = seatAddReducerAdmin.actions;

export default seatAddReducerAdmin.reducer;
