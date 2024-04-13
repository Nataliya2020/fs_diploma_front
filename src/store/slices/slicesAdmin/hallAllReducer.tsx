import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setSessionHallName} from './sessionAddReducer';
import {sortHalls} from '../../../app/utils/sortHalls';

export type Films = {
  id: number | string,
  title: string,
  movie_duration: number,
  image: string,
  created_at: string,
  updated_at: string | null,
  description: string,
  country_of_origin: string
}

type Sessions = {
  id: number,
  hall_id: number,
  film_id: number,
  session_start_time: string,
  session_date: string,
  paid_chairs: string,
  created_at: string,
  updated_at: string | null,
}

export type HallElem = {
  id: number,
  name: string,
  rows: number,
  chairs_in_row: number,
  total_chairs: number,
  blocked_chairs: string,
  number_standard_chairs: string,
  number_vip_chairs: string,
  created_at: string,
  updated_at: string | null,
  price_standart_chair: number,
  price_vip_chair: number,
  is_active: number,
  sessions: Sessions[] | [],
  films: Films[] | []
}

type ElemsHallState = {
  hallElems: HallElem[],
  isLoading: boolean,
  isError: boolean,
  errorMesageHall: string,
  unauthorizedAuthTimeout: string,
  rowsValue: number,
  chairsInRowsValue: number,
  checkedHallId: number,
  blocked: Array<string>,
  standart: Array<string>,
  vip: Array<string>,
  priceStandartValue: number,
  priceVipValue: number,
  checkedHallPriceId: number,
  isNotFound: boolean,
  isSuccessfulAllHall: boolean,
  isErroneousAllHall: boolean,
  errorMessage: string,
  isActiveSale: boolean
}

const initialState: ElemsHallState = {
  hallElems: [
    {
      id: 0,
      name: '',
      rows: 0,
      chairs_in_row: 0,
      total_chairs: 0,
      blocked_chairs: '',
      number_standard_chairs: '',
      number_vip_chairs: '',
      created_at: '',
      updated_at: '',
      price_standart_chair: 0,
      price_vip_chair: 0,
      is_active: 0,
      sessions: [],
      films: []
    }
  ],
  isLoading: false,
  isError: false,
  errorMesageHall: '',
  unauthorizedAuthTimeout: '',
  rowsValue: 0,
  chairsInRowsValue: 0,
  checkedHallId: 0,
  blocked: [],
  standart: [],
  vip: [],
  priceStandartValue: 0,
  priceVipValue: 0,
  checkedHallPriceId: 0,
  isNotFound: false,
  isSuccessfulAllHall: false,
  isErroneousAllHall: false,
  errorMessage: '',
  isActiveSale: false
}

export const fetchGetHallElems = createAsyncThunk(
  'hall/fetchGetHallElems',
  async function (signal: AbortSignal | undefined, {rejectWithValue, dispatch}) {
    try {
      let res = 401;
      if (localStorage.getItem('sanctumToken')) {
        const result = await fetch(`http://localhost:8000/api/hall`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sanctumToken')
          },
          signal
        });
        const resultClone = result.clone();

        if (result.ok) {
          dispatch(setIsSuccessfulAllHall(true));
          dispatch(setIsErroneousAllHall(false));

          const halls: HallElem[] = await result.json();

          halls.forEach((hall) => {
            if (hall.price_vip_chair === null) {
              hall.price_vip_chair = 0;
            }
            if (hall.price_standart_chair === null) {
              hall.price_standart_chair = 0;
            }
          })

          if (halls.length === 0) {
            dispatch(setHallsElems(initialState.hallElems));
          } else if (halls.length !== 0) {
            dispatch(setHallsElems(halls));
          }

          let indexHall = Number(localStorage.getItem('indexHall'));

          const isIndexInHalls = halls.some((hall) => hall.id === indexHall);

          if (!indexHall || !isIndexInHalls) {
            indexHall = 0;
            localStorage.setItem('indexHall', '0');
          }

          dispatch(setCheckedHallId(Number(localStorage.getItem('indexHall'))));

          const hallsSort = sortHalls(halls);
          if (indexHall === 0 && hallsSort.length !== 0) {
            dispatch((setRowsValue(hallsSort[indexHall].rows)));

            dispatch((setChairsInRowsValue(hallsSort[indexHall].chairs_in_row)));
            dispatch((setBlocked(hallsSort[indexHall].blocked_chairs.split(','))));

            if (hallsSort[indexHall].number_standard_chairs === '') {
              dispatch((setStandart([])));
            } else {
              dispatch((setStandart(hallsSort[indexHall].number_standard_chairs.split(','))));
            }

            if (hallsSort[indexHall].number_vip_chairs === '') {
              dispatch(setVip([]));
            } else {
              dispatch((setVip(hallsSort[indexHall].number_vip_chairs.split(','))));
            }
          } else {
            dispatch((setRowsValue(hallsSort.find((el) => el.id === indexHall)?.rows)));
            dispatch((setChairsInRowsValue(hallsSort.find((el) => el.id === indexHall)?.chairs_in_row)));
            dispatch((setBlocked(hallsSort.find((el) => el.id === indexHall)?.blocked_chairs.split(','))));

            if (hallsSort.find((el) => el.id === indexHall)?.number_standard_chairs === '') {
              dispatch(setStandart([]));
            } else {
              dispatch((setStandart(hallsSort.find((el) => el.id === indexHall)?.number_standard_chairs.split(','))));
            }

            if (hallsSort.find((el) => el.id === indexHall)?.number_vip_chairs === '') {
              dispatch(setVip([]));
            } else {
              dispatch((setVip(hallsSort.find((el) => el.id === indexHall)?.number_vip_chairs.split(','))));
            }
          }

          if (halls.length === 0) {
            return;
          }

          if (halls[0].is_active === 1) {
            dispatch(setIsActiveSale(true));
          } else {
            dispatch(setIsActiveSale(false));
          }

          let indexHallPrice = Number(localStorage.getItem('indexHallPrice'));

          if (!indexHallPrice || indexHallPrice > halls.length - 1) {
            indexHallPrice = 0;
            localStorage.setItem('indexHallPrice', '0');
          }

          dispatch(setCheckedHallPriceId(Number(localStorage.getItem('indexHallPrice'))))

          dispatch(setSessionHallName(hallsSort[0].name));
          if (hallsSort[indexHallPrice].price_standart_chair === null) {
            dispatch(setPriceStandartValue(0));
          }
          if (hallsSort[indexHallPrice].price_vip_chair === null) {
            dispatch(setPriceVipValue(0));
          }
          if (hallsSort[indexHallPrice].price_standart_chair !== null) {
            dispatch(setPriceStandartValue(hallsSort[indexHallPrice].price_standart_chair));
          }
          if (hallsSort[indexHallPrice].price_vip_chair !== null) {
            dispatch(setPriceVipValue(hallsSort[indexHallPrice].price_vip_chair));
          }
        } else if (result.status === 401 || result.status === 419) {
          dispatch(setIsErroneousAllHall(true));
          localStorage.removeItem('sanctumToken');
          dispatch(setUnauthorizedAuthTimeout(result.status));
        } else if (result.status === 404) {
          dispatch(setIsNotFound(true));
          dispatch(setIsErroneousAllHall(true));
        }
        return await resultClone.json();
      } else {
        dispatch(setUnauthorizedAuthTimeout(res));
        dispatch(setIsErroneousAllHall(true));
      }
    } catch (e) {
      if (e instanceof Error) {
        dispatch(setIsErroneousAllHall(true));
        return rejectWithValue(e.message);
      }
    }
  }
);

const hallReducer = createSlice({
  name: 'hall',
  initialState,
  reducers: {
    setHallsElems: (state, action) => {
      state.isLoading = false;
      state.hallElems = action.payload;
    },
    setUnauthorizedAuthTimeout: (state, action) => {
      state.unauthorizedAuthTimeout = action.payload;
    },
    setRowsValue: (state, action) => {
      state.rowsValue = action.payload;
    },
    setChairsInRowsValue: (state, action) => {
      state.chairsInRowsValue = action.payload;
    },
    setCheckedHallId: (state, action) => {
      state.checkedHallId = action.payload;
    },
    setBlocked: (state, action) => {
      state.blocked = action.payload;
    },
    setStandart: (state, action) => {
      state.standart = action.payload;
    },
    setVip: (state, action) => {
      state.vip = action.payload;
    },
    setPriceStandartValue: (state, action) => {
      state.priceStandartValue = action.payload;
    },
    setPriceVipValue: (state, action) => {
      state.priceVipValue = action.payload;
    },
    setCheckedHallPriceId: (state, action) => {
      state.checkedHallPriceId = action.payload;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setIsSuccessfulAllHall: (state, action) => {
      state.isSuccessfulAllHall = action.payload;
    },
    setIsErroneousAllHall: (state, action) => {
      state.isErroneousAllHall = action.payload;
    },
    setIsActiveSale: (state, action) => {
      state.isActiveSale = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchGetHallElems.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(fetchGetHallElems.fulfilled, (state) => {
        state.isLoading = false;
        state.errorMessage = '';
        state.isError = false;
      })
      .addCase(fetchGetHallElems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
  },
});

export const {
  setHallsElems,
  setUnauthorizedAuthTimeout,
  setRowsValue,
  setChairsInRowsValue,
  setCheckedHallId,
  setBlocked,
  setStandart,
  setVip,
  setPriceVipValue,
  setPriceStandartValue,
  setCheckedHallPriceId,
  setIsNotFound,
  setIsSuccessfulAllHall,
  setIsErroneousAllHall,
  setIsActiveSale
} = hallReducer.actions;

export default hallReducer.reducer;
