import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

type TicketSeat = {
  ticket_id: number,
  row: number,
  seats_numbers: string,
}

type TicketSeatInit = {
  ticket: {
    film_title: string,
    hall_name: string,
    start_time: string,
    total_price: number,
    seats_ticket: TicketSeat[],
    session_date: string
  },
  isLoading: boolean,
  isError: boolean,
  isNotFound: boolean,
  isSuccessfulGetTicket: boolean,
  isErroneousGetTicket: boolean,
  errorMessage: string
}

const initialState: TicketSeatInit = {
  ticket: {
    film_title: '',
    hall_name: '',
    start_time: '',
    total_price: 0,
    session_date: '',
    seats_ticket: [
      {
        ticket_id: 0,
        row: 0,
        seats_numbers: ''
      }
    ],
  },
  isLoading: false,
  isError: false,
  isNotFound: false,
  isSuccessfulGetTicket: false,
  isErroneousGetTicket: false,
  errorMessage: ''
}

export const fetchGetTicket = createAsyncThunk(
  'ticket/fetchGetTicket',
  async function (data: { id: number, signal: AbortSignal }, {rejectWithValue, dispatch}) {
    const signal = data.signal;

    try {
      const result = await fetch(`${process.env.REACT_APP_CLIENT_URL}/ticket/${data.id}`, {signal});

      if (result.ok) {
        const ticket = await result.json();
        dispatch(setTicket(ticket));
        dispatch(setIsSuccessfulGetTicket(true));
        dispatch(setIsErroneousGetTicket(false));
        return ticket;
      } else if (result.status === 404) {
        dispatch(setIsNotFound(true));
        dispatch(setIsErroneousGetTicket(true));
      } else {
        dispatch(setIsErroneousGetTicket(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousGetTicket(true));
      }
      const resultError = (e as Error).message;
      return rejectWithValue(resultError);
    }
  }
);

const ticketGetReducer = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setTicket: (state, action) => {
      state.ticket = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulGetTicket: (state, action) => {
      state.isSuccessfulGetTicket = action.payload;
    },
    setIsErroneousGetTicket: (state, action) => {
      state.isErroneousGetTicket = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchGetTicket.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchGetTicket.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(fetchGetTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
})

export const {
  setTicket,
  setIsNotFound,
  setIsSuccessfulGetTicket,
  setIsErroneousGetTicket
} = ticketGetReducer.actions;
export default ticketGetReducer.reducer;
