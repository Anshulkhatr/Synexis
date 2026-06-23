import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetch',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await notificationService.getNotifications(token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const markNotificationRead = createAsyncThunk(
    'notifications/markRead',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await notificationService.markAsRead(id, token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const markAllNotificationsRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await notificationService.markAllRead(token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
        },
        clearNotifications: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const index = state.items.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    state.items[index].isRead = true;
                }
            })
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.items.forEach(n => { n.isRead = true; });
            });
    }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
