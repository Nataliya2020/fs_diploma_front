import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

type Films = {
  id: number,
  title: string,
  movie_duration: number,
  image: string,
  created_at: string,
  updated_at: string | null,
  description: string,
  country_of_origin: string
}

export type Sessions = {
  id: number,
  hall_id: number,
  film_id: number,
  session_start_time: string,
  session_date: string,
  paid_chairs: string,
  created_at: string,
  updated_at: string | null,
}

type HallElem = {
  id: number,
  name: string,
  rows: number,
  chairs_in_row: number,
  total_chairs: number,
  blocked_chairs: string,
  number_standard_chairs: string,
  number_vip_chairs: string,
  created_at: string,
  updated_at: string | null,
  price_standart_chair: number,
  price_vip_chair: number,
  sessions: Sessions[] | [],
  films: Films[] | [],
  is_active: number
}

type HallElemState = {
  hallElem: HallElem,
  isLoading: boolean,
  isError: boolean,
  isNotFound: boolean,
  isSuccessfulGetHall: boolean,
  isErroneousGetHall: boolean,
  errorMessage: string
}

const initialState: HallElemState = {
  hallElem: {
    id: 0,
    name: '',
    rows: 0,
    chairs_in_row: 0,
    total_chairs: 0,
    blocked_chairs: '',
    number_standard_chairs: '',
    number_vip_chairs: '',
    created_at: '',
    updated_at: '',
    price_standart_chair: 0,
    price_vip_chair: 0,
    sessions: [],
    films: [],
    is_active: 0
  },
  isLoading: false,
  isError: false,
  isNotFound: false,
  isSuccessfulGetHall: false,
  isErroneousGetHall: false,
  errorMessage: ''
}

export const fetchClientGetHallElem = createAsyncThunk(
  'hallElem/fetchClientGetHallElem',
  async function (data: { id: number, signal: AbortSignal }, {rejectWithValue, dispatch}) {
    //async function (id: number, {rejectWithValue, dispatch}) {
    const signal = data.signal;
    try {
      const result = await fetch(`http://localhost:8000/hall/${data.id}`, {signal});

      if (result.ok) {
        const hall = await result.json();
        dispatch(setHallElem(hall[0]));
        dispatch(setIsSuccessfulGetHall(true));
        dispatch(setIsErroneousGetHall(false));
      } else if (result.status === 404) {
        dispatch(setIsNotFound(true));
      } else {
        dispatch(setIsErroneousGetHall(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousGetHall(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const hallForClientReducer = createSlice({
  name: 'hallElem',
  initialState,
  reducers: {
    setHallElem: (state, action) => {
      state.hallElem = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsErroneousGetHall: (state, action) => {
      state.isErroneousGetHall = action.payload;
    },
    setIsSuccessfulGetHall: (state, action) => {
      state.isSuccessfulGetHall = action.payload;
    },

  },

  extraReducers: (builder) => {
    builder.addCase(fetchClientGetHallElem.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchClientGetHallElem.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchClientGetHallElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});

export const {
  setHallElem,
  setIsNotFound,
  setIsSuccessfulGetHall,
  setIsErroneousGetHall
} = hallForClientReducer.actions;

export default hallForClientReducer.reducer;
