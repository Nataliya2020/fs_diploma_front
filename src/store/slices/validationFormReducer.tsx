import {createSlice} from '@reduxjs/toolkit';

type Validation = {
  isEmptyFilmName: boolean,
  isEmptyFilmDesc: boolean,
  isEmptyFilmOrigin: boolean,
  isEmptyFilmDuration: boolean,
  isFilmDurationNotNumbers: boolean,
  isBusyFilmName: boolean,
  isUserSelectedAvatarForFilm: boolean,
  isFilmAvatarFileLoad: boolean,
  isHallNameEmpty: boolean,
  isBusyNameHall: boolean,
  isEmptyStartSession: boolean
}

const initialState: Validation = {
  isEmptyFilmName: false,
  isEmptyFilmDesc: false,
  isEmptyFilmOrigin: false,
  isEmptyFilmDuration: false,
  isFilmDurationNotNumbers: false,
  isBusyFilmName: false,
  isFilmAvatarFileLoad: false,
  isUserSelectedAvatarForFilm: false,
  isHallNameEmpty: false,
  isBusyNameHall: false,
  isEmptyStartSession: false
}

const validationFormReducer = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setIsEmptyFilmName: (state, action) => {
      state.isEmptyFilmName = action.payload;
    },
    setIsEmptyFilmDesc: (state, action) => {
      state.isEmptyFilmDesc = action.payload;
    },
    setIsEmptyFilmOrigin: (state, action) => {
      state.isEmptyFilmOrigin = action.payload;
    },
    setIsEmptyFilmDuration: (state, action) => {
      state.isEmptyFilmDuration = action.payload;
    },
    setIsFilmDurationNotNumbers: (state, action) => {
      state.isFilmDurationNotNumbers = action.payload;
    },
    setIsBusyFilmName: (state, action) => {
      state.isBusyFilmName = action.payload;
    },
    setIsFilmAvatarFileLoad: (state, action) => {
      state.isFilmAvatarFileLoad = action.payload;
    },
    setIsUserSelectedAvatarForFilm: (state, action) => {
      state.isUserSelectedAvatarForFilm = action.payload;
    },
    setIsHallNameEmpty: (state, action) => {
      state.isHallNameEmpty = action.payload;
    },
    setIsBusyNameHall: (state, action) => {
      state.isBusyNameHall = action.payload;
    },
    setIsEmptyStartSession: (state, action) => {
      state.isEmptyStartSession = action.payload;
    }
  }
})

export const {
  setIsEmptyFilmName,
  setIsEmptyFilmDesc,
  setIsEmptyFilmOrigin,
  setIsEmptyFilmDuration,
  setIsFilmDurationNotNumbers,
  setIsBusyFilmName,
  setIsUserSelectedAvatarForFilm,
  setIsFilmAvatarFileLoad,
  setIsHallNameEmpty,
  setIsBusyNameHall,
  setIsEmptyStartSession
} = validationFormReducer.actions;

export default validationFormReducer.reducer;
