import {createSlice} from '@reduxjs/toolkit';

type Info = {
  compareChairsMessage: string,
  comparePriceMessage: string,
  messageNotRemoveFilmsAndSessions: string
}

const initialState: Info = {
  compareChairsMessage: '',
  comparePriceMessage: '',
  messageNotRemoveFilmsAndSessions: ''
}

const infoReducer = createSlice({
  name: 'infoReducer',
  initialState,
  reducers: {
    setCompareChairsMessage: (state, action) => {
      state.compareChairsMessage = action.payload;
    },
    setComparePriceMessage: (state, action) => {
      state.comparePriceMessage = action.payload;
    },
    setMessageNotRemoveFilmsAndSessions: (state, action) => {
      state.messageNotRemoveFilmsAndSessions = action.payload;
    }
  }
})

export const {
  setCompareChairsMessage,
  setComparePriceMessage,
  setMessageNotRemoveFilmsAndSessions
} = infoReducer.actions;

export default infoReducer.reducer;
