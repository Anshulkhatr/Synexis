import { configureStore } from '@reduxjs/toolkit'
import auth from "./auth/authSlice"
import profile from "./profile/profileSlice"
import post from "./post/postSlice"
import admin from "./admin/adminSlice"
import notifications from "./notifications/notificationSlice"
import savedPost from "./savedPost/savedPostSlice"

export const store = configureStore({
    reducer: { auth, profile, post, admin, notifications, savedPost },
})