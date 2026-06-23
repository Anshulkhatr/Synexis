import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import chatService from './chatService';

const initialState = {
    contacts: [],
    messages: [],
    onlineUsers: [],
    contactsLoading: false,
    messagesLoading: false,
    chatError: false,
    chatErrorMessage: ""
};

export const fetchContacts = createAsyncThunk("CHAT/CONTACTS", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await chatService.fetchContacts(token);
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch contacts";
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchMessages = createAsyncThunk("CHAT/MESSAGES", async (otherUserId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await chatService.fetchMessages(otherUserId, token);
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch messages";
        return thunkAPI.rejectWithValue(message);
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        resetChatState: (state) => {
            state.messages = [];
            state.chatError = false;
            state.chatErrorMessage = "";
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.contactsLoading = true;
                state.chatError = false;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.contactsLoading = false;
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.contactsLoading = false;
                state.chatError = true;
                state.chatErrorMessage = action.payload;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.messagesLoading = true;
                state.chatError = false;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messagesLoading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.messagesLoading = false;
                state.chatError = true;
                state.chatErrorMessage = action.payload;
            });
    }
});

export const { addMessage, resetChatState, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;
