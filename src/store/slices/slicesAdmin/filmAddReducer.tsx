import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';
import {setIsAddedFilmsAndSessions, setIsFilmAdded, setIsFimDeleted} from '../infoFinalActionCrud';

type ElemsFilmsState = {
  isLoading: boolean,
  isError: boolean,
  filmName: string,
  filmDescription: string,
  filmDuration: string,
  filmCountryOfOrigin: string
  isNotFound: boolean,
  imageFilm: string,
  isVisiblePopupAddFilm: boolean,
  isSuccessfulAddFilms: boolean,
  isErroneousFilm: boolean,
  errorMessage: string,
}

const initialState: ElemsFilmsState = {
  isLoading: false,
  isError: false,
  filmName: '',
  filmDescription: '',
  filmDuration: '',
  filmCountryOfOrigin: '',
  isNotFound: false,
  imageFilm: '',
  isVisiblePopupAddFilm: false,
  isSuccessfulAddFilms: false,
  isErroneousFilm: false,
  errorMessage: '',
}

export const fetchPostFilmElem = createAsyncThunk(
  'film/fetchPostFilmElem',
  async function (film: {}, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`${process.env.REACT_APP_ADMIN_URL}/film`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getTokenForLogin(),
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken'),
          },
          body: JSON.stringify(film)
        })

        if (result.ok) {
          dispatch(setIsSuccessfulAddFilms(true));
          localStorage.removeItem('adminInputData');
        } else if (result.status === 401 || result.status === 419) {
          dispatch(setIsFimDeleted(false));
          dispatch(setIsVisiblePopupAddFilm(false));
          dispatch(setIsFilmAdded(false));
          dispatch(setIsAddedFilmsAndSessions(false));
          localStorage.removeItem('sanctumToken');
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsErroneousFilm(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousFilm(true));
        } else {
          dispatch(setIsErroneousFilm(true));
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousFilm(true));
        return rejectWithValue(e.message);
      }
    }
  }
)

const filmAddReducer = createSlice({
  name: 'film',
  initialState,
  reducers: {
    setFilmName: (state, action) => {
      state.filmName = action.payload;
    },
    setFilmDescription: (state, action) => {
      state.filmDescription = action.payload;
    },
    setFilmDuration: (state, action) => {
      state.filmDuration = action.payload;
    },
    setFilmCountryOrigin: (state, action) => {
      state.filmCountryOfOrigin = action.payload;
    },
    setImageFilm: (state, action) => {
      state.imageFilm = action.payload;
    },
    setIsSuccessfulAddFilms: (state, action) => {
      state.isSuccessfulAddFilms = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsErroneousFilm: (state, action) => {
      state.isErroneousFilm = action.payload;
    },
    setErrorMesage: (state, action) => {
      state.isErroneousFilm = action.payload;
    },
    setIsVisiblePopupAddFilm: (state, action) => {
      state.isVisiblePopupAddFilm = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchPostFilmElem.pending, (state, action) => {
      state.isLoading = true;
    })
      .addCase(fetchPostFilmElem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchPostFilmElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setFilmName,
  setFilmDuration,
  setFilmDescription,
  setFilmCountryOrigin,
  setImageFilm,
  setIsSuccessfulAddFilms,
  setIsNotFound,
  setIsErroneousFilm,
  setIsVisiblePopupAddFilm
} = filmAddReducer.actions;

export default filmAddReducer.reducer;
