import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

type TicketSeat = {
  ticket_id: number,
  seat: { row: number, col: string[] }[]
}

type TicketSeatsInit = {
  isLoading: boolean,
  isError: boolean,
  isNotFound: boolean,
  isSuccessfulAddTicketSeats: boolean,
  isErroneousAddTicketSeats: boolean,
  errorMessage: string
}

const initialState: TicketSeatsInit = {
  isLoading: false,
  isError: false,
  isNotFound: false,
  isSuccessfulAddTicketSeats: false,
  isErroneousAddTicketSeats: false,
  errorMessage: ''
}

export const fetchAddTicketSeats = createAsyncThunk(
  'ticketSeat/fetchAddTicketSeats',
  async function (dataTicket: TicketSeat, {rejectWithValue, dispatch}) {
    try {
      const result = await fetch(`${process.env.REACT_APP_CLIENT_URL}/ticket_seats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataTicket)
      })

      if (result.ok) {
        dispatch(setIsSuccessfulAddTicketSeats(true));
      } else if (result.status === 404) {
        dispatch(setNotIsFound(true));
        dispatch(setIsErroneousAddTicketSeats(true));
      } else {
        dispatch(setIsErroneousAddTicketSeats(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousAddTicketSeats(true));
        return rejectWithValue(e.message);
      }
    }
  }
)

const ticketSeatsAddReducer = createSlice({
  name: 'ticketSeat',
  initialState,
  reducers: {
    setNotIsFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulAddTicketSeats: (state, action) => {
      state.isSuccessfulAddTicketSeats = action.payload;
    },
    setIsErroneousAddTicketSeats: (state, action) => {
      state.isErroneousAddTicketSeats = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAddTicketSeats.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchAddTicketSeats.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchAddTicketSeats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
});

export const {
  setNotIsFound,
  setIsSuccessfulAddTicketSeats,
  setIsErroneousAddTicketSeats
} = ticketSeatsAddReducer.actions;

export default ticketSeatsAddReducer.reducer;
