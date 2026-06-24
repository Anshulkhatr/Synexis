import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import commentService from './commentService'

const initialState = {
    comments: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}

export const getComments = createAsyncThunk('comment/getAll', async (pid, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.fetchComments(pid, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
})

export const addComment = createAsyncThunk('comment/add', async (commentData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.addComment(commentData.pid, commentData.text, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
})

export const removeComment = createAsyncThunk('comment/remove', async (cid, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.deleteComment(cid, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
})

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => { state.isLoading = true })
            .addCase(getComments.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.comments = action.payload
            })
            .addCase(getComments.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload)
            })
            .addCase(removeComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(c => c._id !== action.payload._id)
            })
    }
})

export default commentSlice.reducer
