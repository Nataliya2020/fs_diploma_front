import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export type Films = {
  id: number,
  title: string,
  movie_duration: number,
  image: string,
  created_at: string,
  updated_at: string | null,
  description: string,
  country_of_origin: string
}

type ElemsFilmState = {
  filmElems: Films[],
  isLoading: boolean,
  isError: boolean,
  isSuccessfulGetAllFilms: boolean,
  isErroneousGetAllFilm: boolean,
  errorMessage: string,
  isNotFound: boolean
}

const initialState: ElemsFilmState = {
  filmElems: [{
    id: 0,
    title: '',
    movie_duration: 0,
    image: '',
    created_at: '',
    updated_at: '',
    description: '',
    country_of_origin: ''
  }],
  isLoading: false,
  isError: false,
  isSuccessfulGetAllFilms: false,
  isErroneousGetAllFilm: false,
  errorMessage: '',
  isNotFound: false
}

export const fetchClientGetFilmsElems = createAsyncThunk(
  'film/fetchClientGetFilmsElems',
  async function (signal: AbortSignal | undefined, {rejectWithValue, dispatch}) {
    try {
      const result = await fetch(`${process.env.REACT_APP_CLIENT_URL}/film`, {signal});

      if (result.ok) {
        dispatch(setIsSuccessfulGetAllFilms(true));
        dispatch(setIsErroneousGetAllFilm(false));
        const films = await result.json();
        dispatch(setFilmsElems(films));
      } else if (result.status === 404) {
        dispatch(setIsNotFound(true));
        dispatch(setIsErroneousGetAllFilm(true));
      } else {
        dispatch(setIsErroneousGetAllFilm(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousGetAllFilm(true));
        return rejectWithValue(e.message);
      }
      const resultError = (e as Error).message;
      return rejectWithValue(resultError);
    }
  }
);

const filmAllClientReducer = createSlice({
  name: 'film',
  initialState,
  reducers: {
    setFilmsElems: (state, action) => {
      state.isLoading = false;
      state.filmElems = action.payload;
    },
    setIsSuccessfulGetAllFilms: (state, action) => {
      state.isSuccessfulGetAllFilms = action.payload;
    },
    setIsErroneousGetAllFilm: (state, action) => {
      state.isErroneousGetAllFilm = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchClientGetFilmsElems.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchClientGetFilmsElems.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchClientGetFilmsElems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});

export const {
  setFilmsElems,
  setIsSuccessfulGetAllFilms,
  setIsErroneousGetAllFilm,
  setIsNotFound
} = filmAllClientReducer.actions;

export default filmAllClientReducer.reducer;
