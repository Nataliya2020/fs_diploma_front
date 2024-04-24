import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setUnauthorizedAuthTimeout} from './hallAllReducer';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';
import {setIsFimDeleted} from '../infoFinalActionCrud';

type FilmState = {
  isLoading: boolean,
  isError: boolean,
  filmNameForDelete: string,
  idFilmForDelete: string,
  isVisiblePopupDeleteFilm: boolean,
  isNotFound: boolean,
  isSuccessfulDeleteFilm: boolean,
  isErroneousDeleteFilm: boolean,
  errorMessage: string
}

const initialState: FilmState = {
  isLoading: false,
  isError: false,
  filmNameForDelete: '',
  idFilmForDelete: '',
  isVisiblePopupDeleteFilm: false,
  isNotFound: false,
  isSuccessfulDeleteFilm: false,
  isErroneousDeleteFilm: false,
  errorMessage: ''
}

export const fetchDeleteFilmElem = createAsyncThunk(
  'deleteFilm/fetchDeleteFilmElem',
  async function (id: number, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`${process.env.REACT_APP_ADMIN_URL}/film/${id}`, {
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
          dispatch(setIsSuccessfulDeleteFilm(true));
        } else if (result.status === 401 || result.status === 419) {
          localStorage.removeItem('sanctumToken');
          dispatch(setIsVisiblePopupDeleteFilm(false));
          dispatch(setIsFimDeleted(false));
          dispatch(setUnauthorizedAuthTimeout(result.status));
          dispatch(setIsErroneousDeleteFilm(true));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousDeleteFilm(true));
        } else {
          dispatch(setIsErroneousDeleteFilm(true));
        }
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousDeleteFilm(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const filmDeleteReducer = createSlice({
  name: 'deleteFilm',
  initialState,
  reducers: {
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulDeleteFilm: (state, action) => {
      state.isSuccessfulDeleteFilm = action.payload;
    },
    setIsErroneousDeleteFilm: (state, action) => {
      state.isErroneousDeleteFilm = action.payload;
    },
    setFilmNameForDelete: (state, action) => {
      state.filmNameForDelete = action.payload;
    },
    setIsVisiblePopupDeleteFilm: (state, action) => {
      state.isVisiblePopupDeleteFilm = action.payload;
    },
    setIdFilmForDelete: (state, action) => {
      state.idFilmForDelete = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDeleteFilmElem.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchDeleteFilmElem.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchDeleteFilmElem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setIsNotFound,
  setIsSuccessfulDeleteFilm,
  setIsErroneousDeleteFilm,
  setFilmNameForDelete,
  setIdFilmForDelete,
  setIsVisiblePopupDeleteFilm
} = filmDeleteReducer.actions;

export default filmDeleteReducer.reducer;
