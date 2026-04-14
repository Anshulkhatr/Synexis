import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import savedPostService from './savedPostService';

const initialState = {
    savedPosts: [],
    savedLoading: false,
    savedSuccess: false,
    savedError: false,
    savedErrorMessage: ""
}

const savedPostSlice = createSlice({
    name: 'savedPost',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSavedPosts.pending, (state) => {
                state.savedLoading = true
                state.savedSuccess = false
                state.savedError = false
            })
            .addCase(getSavedPosts.fulfilled, (state, action) => {
                state.savedLoading = false
                state.savedSuccess = true
                state.savedPosts = action.payload // Array of saved documents containing .post
                state.savedError = false
            })
            .addCase(getSavedPosts.rejected, (state, action) => {
                state.savedLoading = false
                state.savedSuccess = false
                state.savedError = true
                state.savedErrorMessage = action.payload
            })
            .addCase(savePostToCollection.fulfilled, (state, action) => {
                state.savedPosts.push(action.payload)
            })
            .addCase(removePostFromCollection.fulfilled, (state, action) => {
                // action.payload is { id: "postId", msg: "..." }
                state.savedPosts = state.savedPosts.filter(saved => saved.post?._id !== action.payload.id)
            })
    }
});

export default savedPostSlice.reducer

// Get Saved Posts
export const getSavedPosts = createAsyncThunk("SAVED/GET", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await savedPostService.getSavedPosts(token)
    } catch (error) {
        let message = error?.response?.data?.message || "Failed to fetch saved posts"
        return thunkAPI.rejectWithValue(message)
    }
})

// Save Post
export const savePostToCollection = createAsyncThunk("SAVED/SAVE", async (pid, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await savedPostService.savePost(pid, token)
    } catch (error) {
        let message = error?.response?.data?.message || "Failed to save post"
        return thunkAPI.rejectWithValue(message)
    }
})

// Remove Saved Post
export const removePostFromCollection = createAsyncThunk("SAVED/REMOVE", async (pid, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await savedPostService.removeSavedPost(pid, token)
    } catch (error) {
        let message = error?.response?.data?.message || "Failed to remove saved post"
        return thunkAPI.rejectWithValue(message)
    }
})
