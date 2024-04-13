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

type Sessions = {
  id: number,
  hall_id: number,
  film_id: number,
  session_start_time: string,
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
  paid_chairs: string,
  price_standart_chair: number,
  price_vip_chair: number,
  is_active: number,
  sessions: Sessions[] | [],
  films: Films[] | []
}

type ElemsHallState = {
  hallElems: HallElem[],
  isLoading: boolean,
  isError: boolean,
  isNotFound: boolean,
  isSuccessfulGetAllHalls: boolean,
  isErroneousGetAllHalls: boolean
  errorMessage: string
}

const initialState: ElemsHallState = {
  hallElems: [
    {
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
      paid_chairs: '',
      price_standart_chair: 0,
      price_vip_chair: 0,
      is_active: 0,
      sessions: [],
      films: []
    }
  ],
  isLoading: false,
  isError: false,
  isNotFound: false,
  isSuccessfulGetAllHalls: false,
  isErroneousGetAllHalls: false,
  errorMessage: ''
}

export const fetchClientGetHalls = createAsyncThunk(
  'hall/fetchClientGetHall',
  async function (signal: AbortSignal | undefined, {rejectWithValue, dispatch}) {
    try {
      const result = await fetch(`http://localhost:8000/hall`, {signal});

      if (result.ok) {
        dispatch(setIsSuccessfulGetAllHalls(true));
        dispatch(setIsErroneousGetAllHalls(false));
        const halls = await result.json();
        dispatch(setHallElems(halls));

      } else if (result.status === 404) {
        dispatch(setIsErroneousGetAllHalls(true));
        dispatch(setIsNotFound(true));
      } else {
        dispatch(setIsErroneousGetAllHalls(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousGetAllHalls(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const hallAllForClientReducer = createSlice({
  name: 'hall',
  initialState,
  reducers: {
    setHallElems: (state, action) => {
      state.hallElems = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulGetAllHalls: (state, action) => {
      state.isSuccessfulGetAllHalls = action.payload;
    },
    setIsErroneousGetAllHalls: (state, action) => {
      state.isErroneousGetAllHalls = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchClientGetHalls.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchClientGetHalls.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchClientGetHalls.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});

export const {
  setHallElems,
  setIsNotFound,
  setIsSuccessfulGetAllHalls,
  setIsErroneousGetAllHalls
} = hallAllForClientReducer.actions;

export default hallAllForClientReducer.reducer;
