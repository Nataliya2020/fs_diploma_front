import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import getTokenForLogin from '../../../app/utils/getTokenForLogin';

type LoginState = {
  email: string,
  password: string,
  isLoading: boolean,
  isError: boolean,
  isErrorEmail: boolean,
  isErrorPassword: boolean,
  errorMessageEmail: string,
  errorMessagePassword: string,
  isNotFound: boolean,
  errorMessage: string,
  errorStatus: string
}

const initialState: LoginState = {
  email: '',
  password: '',
  isLoading: false,
  isError: false,
  errorMessageEmail: '',
  errorMessagePassword: '',
  isErrorEmail: false,
  isErrorPassword: false,
  isNotFound: false,
  errorMessage: '',
  errorStatus: ''
}

export const fetchPostLoginData = createAsyncThunk(
  'login/fetchPOSTLoginData',
  async function (loginData: {}, {rejectWithValue, dispatch}) {
    try {
      const res = await fetch(`${process.env.REACT_APP_ADMIN_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getTokenForLogin()
        },
        body: JSON.stringify(loginData),
      })

      if (res.status === 200) {
        const token = await res.json();
        localStorage.setItem('sanctumToken', token.token);
      } else if (res.status === 404) {
        dispatch(setIsNotFound(true));
        dispatch(setErrorStatus(res.status));
      } else {
        dispatch(setErrorStatus(res.status));
      }
    } catch (e) {
      if (e instanceof Error) {
        return rejectWithValue(e.message);
      }
    }
  }
);

const loginReducer = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setPassword: (state, action) => {
      state.password = action.payload;
    },

    setErrorMessageEmail: (state, action) => {
      state.errorMessageEmail = action.payload.errorMessage;
      state.isErrorEmail = action.payload.error;
    },

    setErrorMessagePassword: (state, action) => {
      state.errorMessagePassword = action.payload.errorMessage;
      state.isErrorPassword = action.payload.error;
    },
    setIsNotFound: (state, action) => {
      state.isNotFound = action.payload;
    },
    setErrorStatus: (state, action) => {
      state.errorStatus = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchPostLoginData.pending, (state, action) => {
      state.isLoading = true;
    })
      .addCase(fetchPostLoginData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.email = '';
        state.password = '';
        state.errorMessage = '';
      })
      .addCase(fetchPostLoginData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      })
  }
})

export const {
  setEmail,
  setPassword,
  setErrorMessageEmail,
  setErrorMessagePassword,
  setIsNotFound,
  setErrorStatus
} = loginReducer.actions;
export default loginReducer.reducer;
