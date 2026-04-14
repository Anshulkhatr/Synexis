import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import postService from './postService';
import { addNotification } from '../notifications/notificationSlice';

const initialState = {
    posts: [],
    post: null,
    postLoading: false,
    postSuccess: false,
    postError: false,
    postErrorMessage: ""
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generatePost.pending, (state, action) => {
                state.postLoading = true
                state.postSuccess = false
                state.postError = false
            })
            .addCase(generatePost.fulfilled, (state, action) => {
                state.postLoading = false
                state.postSuccess = true
                state.post = action.payload
                if (Array.isArray(state.posts)) {
                    state.posts.unshift(action.payload)
                }
                state.postError = false
            })
            .addCase(generatePost.rejected, (state, action) => {
                state.postLoading = false
                state.postSuccess = false
                state.postError = true
                state.postErrorMessage = action.payload
            })
            .addCase(getPosts.pending, (state, action) => {
                state.postLoading = true
                state.postSuccess = false
                state.postError = false
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.postLoading = false
                state.postSuccess = true
                state.posts = action.payload
                state.post = null
                state.postError = false
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.postLoading = false
                state.postSuccess = false
                state.postError = true
                state.postErrorMessage = action.payload
            })
            .addCase(getPost.pending, (state, action) => {
                state.postLoading = true
                state.postSuccess = false
                state.postError = false
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.postLoading = false
                state.postSuccess = true
                state.post = action.payload
                state.postError = false
            })
            .addCase(getPost.rejected, (state, action) => {
                state.postLoading = false
                state.postSuccess = false
                state.postError = true
                state.postErrorMessage = action.payload
            })
            .addCase(likeUnlikePost.pending, (state, action) => {
                state.postLoading = true
                state.postSuccess = false
                state.postError = false
            })
            .addCase(likeUnlikePost.fulfilled, (state, action) => {
                state.postLoading = false
                state.postSuccess = true
                state.post = action.payload
                state.postError = false
            })
            .addCase(likeUnlikePost.rejected, (state, action) => {
                state.postLoading = false
                state.postSuccess = false
                state.postError = true
                state.postErrorMessage = action.payload
            })
            .addCase(reportPost.pending, (state, action) => {
                state.postLoading = true
                state.postSuccess = false
                state.postError = false
            })
            .addCase(reportPost.fulfilled, (state, action) => {
                state.postLoading = false
                state.postSuccess = true
                state.postError = false
            })
            .addCase(reportPost.rejected, (state, action) => {
                state.postLoading = false
                state.postSuccess = false
                state.postError = true
                state.postErrorMessage = action.payload
            })
            .addCase(removePost.pending, (state) => {
                state.postLoading = true
                state.postSuccess = false
                state.postError = false
            })
            .addCase(removePost.fulfilled, (state, action) => {
                state.postLoading = false
                state.postSuccess = true
                state.posts = state.posts.filter(p => p._id !== action.payload.id)
                state.post = null
                state.postError = false
            })
            .addCase(removePost.rejected, (state, action) => {
                state.postLoading = false
                state.postSuccess = false
                state.postError = true
                state.postErrorMessage = action.payload
            })
    }
});

export const { } = postSlice.actions

export default postSlice.reducer

// Generate Post
export const generatePost = createAsyncThunk("POST/GENERATE", async (postData, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    const notifId = Date.now().toString() + "_gen";
    
    thunkAPI.dispatch(addNotification({
        id: notifId,
        type: 'post_generating',
        title: 'Generating Artwork...',
        message: 'Your AI artwork is brewing in the background.',
        prompt: postData.prompt.substring(0, 50) + "...",
    }))

    try {
        const result = await postService.generateAndPostImage(postData, token)
        
        thunkAPI.dispatch(addNotification({
            id: notifId,
            type: 'post_created',
            title: 'Post Created!',
            message: `Your AI artwork has been published successfully.`,
            prompt: result.prompt,
            imageLink: result.imageLink,
        }))

        return result
    } catch (error) {
        let message = error?.response?.data?.message || "Generation failed"
        
        thunkAPI.dispatch(addNotification({
            id: notifId,
            type: 'post_failed',
            title: 'Generation Failed',
            message: `Uh oh, something went wrong. ${message}`,
            prompt: prompt.substring(0, 50) + "...",
        }))
        
        return thunkAPI.rejectWithValue(message)
    }
})


// Get Posts
export const getPosts = createAsyncThunk("POSTS/GET", async (_, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await postService.fetchPosts(token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


// Get Post
export const getPost = createAsyncThunk("POST/GET", async (pid, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await postService.fetchPost(pid, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


// Like Or Unlike Post
export const likeUnlikePost = createAsyncThunk("POST/LIKEORUNLIKE", async (pid, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await postService.updateLikeUnlike(pid, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }


})



// Report Post
export const reportPost = createAsyncThunk("POST/REPORT", async (postDetails, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await postService.postReport(postDetails, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }


})


// Delete Post
export const removePost = createAsyncThunk("POST/DELETE", async (pid, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await postService.deletePost(pid, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }


})
