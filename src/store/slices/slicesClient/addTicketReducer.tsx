import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

type Seats = {
  row: number,
  col: number
}

type Payment = {
  ticketId: number,
  isLoading: boolean,
  isError: boolean,
  isNotFound: boolean,
  titleFilm: string,
  seats: Seats[],
  seatsForDeleteTicket: string,
  hallName: string,
  startTime: string,
  price: number,
  isSuccessfulAddTicket: boolean,
  isErroneousAddTicket: boolean,
  errorMessage: string,
  dateForTicket: string
}

const initialState: Payment = {
  ticketId: 0,
  isLoading: false,
  isError: false,
  isNotFound: false,
  titleFilm: '',
  seats: [],
  seatsForDeleteTicket: '',
  hallName: '',
  startTime: '',
  price: 0,
  isSuccessfulAddTicket: false,
  isErroneousAddTicket: false,
  errorMessage: '',
  dateForTicket: ''
}

export const fetchAddTicket = createAsyncThunk(
  'ticketData/fetchAddTicket',
  async function (ticketData: {}, {rejectWithValue, dispatch}) {
    try {
      const result = await fetch('http://localhost:8000/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
        },
        body: JSON.stringify(ticketData),
      })

      if (result.ok) {
        const ticket = await result.json();
        dispatch(setTicketId(ticket.id));
        dispatch(setIsSuccessfulAddTicket(true));

        return ticket;
      } else if (result.status === 404) {
        dispatch(setIsErroneousAddTicket(true));
        dispatch(setIsNotFound(true));
      } else {
        dispatch(setIsErroneousAddTicket(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousAddTicket(true));
        return rejectWithValue(e.message);
      }
      const resultError = (e as Error).message;
      return rejectWithValue(resultError);
    }
  }
)

const addTicketReducer = createSlice({
  name: 'ticketData',
  initialState,
  reducers: {
    setTitleFilm: (state, action) => {
      state.titleFilm = action.payload;
    },
    setSeats: (state, action) => {
      state.seats = action.payload;
    },
    sethallName: (state, action) => {
      state.hallName = action.payload;
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setTicketId: (state, action) => {
      state.ticketId = action.payload;
    },
    setSeatsForDeleteTicket: (state, action) => {
      state.seatsForDeleteTicket = action.payload;
    },
    setIsSuccessfulAddTicket: (state, action) => {
      state.isSuccessfulAddTicket = action.payload;
    },
    setIsErroneousAddTicket: (state, action) => {
      state.isErroneousAddTicket = action.payload;
    },
    setDateForTicket: (state, action) => {
      state.dateForTicket = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAddTicket.pending, (state, action) => {
      state.isLoading = true;
    })
      .addCase(fetchAddTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchAddTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  }
})

export const {
  setTitleFilm,
  setSeats,
  sethallName,
  setStartTime,
  setPrice,
  setIsNotFound,
  setTicketId,
  setSeatsForDeleteTicket,
  setIsSuccessfulAddTicket,
  setIsErroneousAddTicket,
  setDateForTicket
} = addTicketReducer.actions;

export default addTicketReducer.reducer;
