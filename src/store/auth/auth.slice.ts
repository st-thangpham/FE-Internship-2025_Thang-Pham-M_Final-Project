// src/app/shared/store/slices/auth.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/shared/models/user';
import { AuthStorageService } from '@app/core/services/auth-storage.service';

const authService = new AuthService();
const authStorage = new AuthStorageService();

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: authStorage.getUserInfo() ? new User(authStorage.getUserInfo()) : null,
  token: authStorage.getToken(),
  isAuthenticated: !!authStorage.getToken(),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await authService.signIn(data);
      const { userInfo, accessToken } = res;

      if (!userInfo || !accessToken) {
        return thunkAPI.rejectWithValue('Invalid login response');
      }

      authStorage.setToken(accessToken);
      authStorage.setUserInfo(userInfo);

      return { user: userInfo, token: accessToken };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.errors?.[0] || 'Login failed'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: any, thunkAPI) => {
    try {
      await authService.register(data);
      return 'success';
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.errors?.[0] || 'Register failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authStorage.removeToken();
      authStorage.removeUserInfo();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = new User(action.payload.user);
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
