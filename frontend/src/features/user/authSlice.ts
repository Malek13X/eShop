import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const user = localStorage.getItem('user') || 'object';
const parsedUser = user !== 'object' ? JSON.parse(user) : null;

const initialState = {
   user: parsedUser ? parsedUser : null,
   isError: false,
   isSuccess: false,
   isLoading: false,
   message: ''
};

// Sign-up/Register user
export const signUp = createAsyncThunk(
   'auth/signUp',
   async (user: any, thunkAPI) => {
      try {
         return await authService.signUp(user);
      } catch (error: any) {
         const message =
            (error.response &&
               error.response.data &&
               error.response.data.message) ||
            error.message ||
            error.toString();

         return thunkAPI.rejectWithValue(message);
      }
   }
);

// Sign-in/login user
export const signIn = createAsyncThunk(
   'auth/signIn',
   async (user: any, thunkAPI) => {
      try {
         return await authService.signIn(user);
      } catch (error: any) {
         const message =
            (error.response &&
               error.response.data &&
               error.response.data.message) ||
            error.message ||
            error.toString();
         return thunkAPI.rejectWithValue(message);
      }
   }
);

// Sign-out/Logout user
export const signOut = createAsyncThunk('auth/signOut', async () => {
   await authService.signOut();
});

// Update user profile
export const updateUserProfile = createAsyncThunk(
   'auth/updateUserProfile',
   async (user: any, thunkAPI) => {
      try {
         const token = localStorage.getItem('token');

         if (!token) {
            throw new Error('Athentication token not found');
         }

         return await authService.updateUserProfile(user, token);
      } catch (error: any) {
         const message =
            (error.response &&
               error.response.data &&
               error.response.data.message) ||
            error.message ||
            error.toString();
         return thunkAPI.rejectWithValue(message);
      }
   }
);

export const authSlice = createSlice({
   name: 'auth',
   initialState: initialState,
   reducers: {
      reset: (state) => {
         state.isError = false;
         state.isSuccess = false;
         state.isLoading = false;
         state.message = '';
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(signUp.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(signUp.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
         })
         .addCase(signUp.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string;
            state.user = null;
         })
         .addCase(signIn.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(signIn.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
         })
         .addCase(signIn.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string;
            state.user = null;
         })

         .addCase(signOut.fulfilled, (state) => {
            state.user = null;
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
         })
         .addCase(updateUserProfile.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
         })
         .addCase(updateUserProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string;
         });
   }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
