import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setUnauthorizedAuthTimeout, Films} from './hallAllReducer';
import {setSessionFilmName} from './sessionAddReducer';
import {setIsErroneousDeleteSession} from './sessionDeleteReducer';

export type FIlms = {
  id: number,
  title: string,
  movie_duration: number,
  image: string,
  created_at: string,
  updated_at: string | null,
  description: string,
  country_of_origin: string,
}

type ElemsFilmState = {
  filmElems: Films[],
  isLoading: boolean,
  isError: boolean,
  copyFilmsForRender: Films[],
  isFilmDeleteMessage: boolean,
  isErrorAddFilm: boolean,
  isErrorFilmName: boolean,
  isNoneDeleteFilmServer: boolean,
  isSuccessfulGetAllFilms: boolean,
  isNotfound: boolean,
  isErroneousAllFilms: boolean,
  errorMessage: string
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
  copyFilmsForRender: [],
  isFilmDeleteMessage: false,
  isErrorAddFilm: false,
  isErrorFilmName: false,
  isNoneDeleteFilmServer: false,
  isSuccessfulGetAllFilms: false,
  isNotfound: false,
  isErroneousAllFilms: false,
  errorMessage: ''

}

export const fetchGetFilmsElems = createAsyncThunk(
  'film/fetchGetHallElems',
  async function (signal: AbortSignal | undefined, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`${process.env.REACT_APP_ADMIN_URL}/film`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          signal
        });

        if (result.ok) {
          dispatch(setIsSuccessfulGetAllFilms(true));
          const films = await result.json();
          dispatch(setCopyFilmsOverwriting(films));
          dispatch(setFilmsElems(films));
          dispatch(setSessionFilmName(films[0].title));
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setIsErroneousAllFilms(true));
          dispatch(setUnauthorizedAuthTimeout(result.status));
        } else if (result.status === 404) {
          dispatch(setIsNotfound(true));
          dispatch(setIsErroneousAllFilms(true));
        } else {
          const films = await result.json();
          dispatch(setCopyFilmsOverwriting(films));
          dispatch(setFilmsElems(films));
          dispatch(setSessionFilmName(films[0].title));
          dispatch(setIsErroneousAllFilms(true));
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
        dispatch(setIsErroneousAllFilms(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousDeleteSession(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const filmReducer = createSlice({
  name: 'film',
  initialState,
  reducers: {
    setFilmsElems: (state, action) => {
      state.isLoading = false;
      state.filmElems = action.payload;
    },
    setDeleteFilm: (state, action) => {
      state.copyFilmsForRender = state.copyFilmsForRender.filter((film) => film.id !== action.payload);
    },
    setCopyFilmsOverwriting: (state, action) => {
      state.copyFilmsForRender = action.payload;
    },

    setIsErrorAddFilm: (state, action) => {
      state.isErrorAddFilm = action.payload;
    },
    setIsErrorFilmName: (state, action) => {
      state.isErrorFilmName = action.payload;
    },
    setIsNoneDeleteFilmServer: (state, action) => {
      state.isNoneDeleteFilmServer = action.payload;
    },
    setIsSuccessfulGetAllFilms: (state, action) => {
      state.isSuccessfulGetAllFilms = action.payload;
    },
    setIsNotfound: (state, action) => {
      state.isNotfound = action.payload;
    },
    setIsErroneousAllFilms: (state, action) => {
      state.isErroneousAllFilms = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchGetFilmsElems.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchGetFilmsElems.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchGetFilmsElems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});

export const {
  setFilmsElems,
  setDeleteFilm,
  setCopyFilmsOverwriting,
  setIsErrorAddFilm,
  setIsErrorFilmName,
  setIsNoneDeleteFilmServer,
  setIsSuccessfulGetAllFilms,
  setIsNotfound,
  setIsErroneousAllFilms
} = filmReducer.actions;

export default filmReducer.reducer;
