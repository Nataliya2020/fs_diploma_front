import {createSlice} from '@reduxjs/toolkit';

type Tooltip = {
  isNotNumberInputRowsInHall: boolean,
  isNotNumberInputChairsInRowsInHall: boolean,
  isNotNumberInputPriceStandart: boolean,
  isNotNumberInputPriceVip: boolean,
  isActive: boolean,
  errorMessage: string,
}

const initialState: Tooltip = {
  isActive: false,
  errorMessage: "",
  isNotNumberInputRowsInHall: false,
  isNotNumberInputChairsInRowsInHall: false,
  isNotNumberInputPriceStandart: false,
  isNotNumberInputPriceVip: false
}

const tooltipReducer = createSlice({
  name: 'tooltip',
  initialState,
  reducers: {
    setIsActive: (state, action) => {
      state.isActive = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setIsNotNumberInputRowsInHall: (state, action) => {
      state.isNotNumberInputRowsInHall = action.payload;
    },
    setIsNotNumberInputChairsInRowsInHall: (state, action) => {
      state.isNotNumberInputChairsInRowsInHall = action.payload;
    },
    setIsNotNumberInputPriceStandart: (state, action) => {
      state.isNotNumberInputPriceStandart = action.payload;
    },
    setIsNotNumberInputPriceVip: (state, action) => {
      state.isNotNumberInputPriceVip = action.payload;
    }
  }
})

export const {
  setIsActive,
  setErrorMessage,
  setIsNotNumberInputRowsInHall,
  setIsNotNumberInputChairsInRowsInHall,
  setIsNotNumberInputPriceStandart,
  setIsNotNumberInputPriceVip
} = tooltipReducer.actions;

export default tooltipReducer.reducer;
