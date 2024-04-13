import {createSlice} from '@reduxjs/toolkit';

type Props = {
  title: string,
}

type InfoFinal = {
  props: Props,
  isFilmAdded: boolean,
  isFimDeleted: boolean,
  isSessionAdded: boolean,
  isSessionDeleted: boolean,
  deletedFilmMessage: string,
  addedFilmMessage: string,
  addedSessionMessage: string,
  deletedSessionMessage: string,
  isAddedFilmsAndSessions: boolean,
  isDeletedFilmsAndSessions: boolean,
  isGetHallAllForPrice: boolean,
  isGetHallAllForChairs: boolean,
  isAddHallPopup: boolean,
  isDeleteHallPopup: boolean,

}

const initialState: InfoFinal = {
  props: {
    title: '',
  },
  isFilmAdded: false,
  isFimDeleted: false,
  isSessionAdded: false,
  isSessionDeleted: false,
  deletedFilmMessage: '',
  addedFilmMessage: '',
  addedSessionMessage: '',
  deletedSessionMessage: '',
  isAddedFilmsAndSessions: false,
  isDeletedFilmsAndSessions: false,
  isGetHallAllForPrice: false,
  isGetHallAllForChairs: false,
  isAddHallPopup: false,
  isDeleteHallPopup: false
}

const infoFinalActionReducer = createSlice({
  name: 'infoFinalAction',
  initialState,
  reducers: {
    setIsFilmAdded: (state, action) => {
      state.isFilmAdded = action.payload;
    },
    setIsFimDeleted: (state, action) => {
      state.isFimDeleted = action.payload;
    },
    setDeletedFilmMessage: (state, action) => {
      state.deletedFilmMessage = action.payload;
    },
    setAddedFilmMessage: (state, action) => {
      state.addedFilmMessage = action.payload;
    },
    setIsSessionAdded: (state, action) => {
      state.isSessionAdded = action.payload;
    },
    setAddedSessionMessage: (state, action) => {
      state.addedSessionMessage = action.payload;
    },
    setIsAddedFilmsAndSessions: (state, action) => {
      state.isAddedFilmsAndSessions = action.payload;
    },
    setIsSessionDeleted: (state, action) => {
      state.isSessionDeleted = action.payload;
    },
    setDeletedSessionMessage: (state, action) => {
      state.deletedSessionMessage = action.payload;
    },
    setIsDeletedFilmsAndSessions: (state, action) => {
      state.isDeletedFilmsAndSessions = action.payload;
    },
    setIsGetHallAllForPrice: (state, action) => {
      state.isGetHallAllForPrice = action.payload;
    },
    setIsGetHallAllForChairs: (state, action) => {
      state.isGetHallAllForChairs = action.payload;
    },
    setIsAddHallPopup: (state, action) => {
      state.isAddHallPopup = action.payload;
    },
    setIsDeleteHallPopup: (state, action) => {
      state.isDeleteHallPopup = action.payload;
    },
    setPropsTitle: (state, action) => {
      state.props.title = action.payload;
    },
  }
})

export const {
  setIsFilmAdded,
  setIsFimDeleted,
  setDeletedFilmMessage,
  setAddedFilmMessage,
  setIsSessionAdded,
  setAddedSessionMessage,
  setIsAddedFilmsAndSessions,
  setIsSessionDeleted,
  setDeletedSessionMessage,
  setIsDeletedFilmsAndSessions,
  setIsGetHallAllForPrice,
  setIsGetHallAllForChairs,
  setIsAddHallPopup,
  setIsDeleteHallPopup,
  setPropsTitle
} = infoFinalActionReducer.actions;

export default infoFinalActionReducer.reducer;
