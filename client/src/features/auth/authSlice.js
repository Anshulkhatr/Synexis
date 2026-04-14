import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const userExist = JSON.parse(localStorage.getItem('user'))


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: userExist || null,
        profile: {},
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                state.isError = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(loginUser.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                state.isError = false
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = false
                state.message = ""
                state.user = null
            })
            // Listen for avatar updates from profileSlice
            .addCase("UPDATE/IMAGE/fulfilled", (state, action) => {
                const currentUserId = state.user?._id || state.user?.id;
                const payloadId = action.payload?._id || action.payload?.id;
                if (state.user && currentUserId === payloadId) {
                    // Spread action.payload to update all fields (avatar, name, etc.)
                    state.user = { ...state.user, ...action.payload };
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            })
    }
})

export default authSlice.reducer


// Register User
export const registerUser = createAsyncThunk("AUTH/REGISTER", async (formData, thunkAPI) => {
    try {
        return await authService.register(formData)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }

})

// Login User
export const loginUser = createAsyncThunk("AUTH/LOGIN", async (formData, thunkAPI) => {
    try {
        return await authService.login(formData)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }

})

// Logout User
export const logoutUser = createAsyncThunk("AUTH/LOGOUT", async () => {
    localStorage.removeItem('user')
})

