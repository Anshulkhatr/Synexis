import React, { useEffect } from 'react'
import useAuthStatus from '../hooks/useAuthStatus'
import Loader from './Loader'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import socket from '../config/socket'
import { setOnlineUsers } from '../features/chat/chatSlice'

const PrivateComponent = () => {

 const { isAuthenticated, checkingStatus } = useAuthStatus()
 const { user } = useSelector(state => state.auth)
 const dispatch = useDispatch()

 // Connect socket once when authenticated
 useEffect(() => {
   if (!isAuthenticated || !user) return

   const userId = user.id || user._id

   // Handler: register user whenever socket connects (or reconnects)
   const handleConnect = () => {
     socket.emit('register_user', userId)
   }

   // Handler: update online users list in Redux
   const handleOnlineUsers = (userIds) => {
     dispatch(setOnlineUsers(userIds))
   }

   socket.on('connect', handleConnect)
   socket.on('get_online_users', handleOnlineUsers)

   // Connect if not already connected
   if (!socket.connected) {
     socket.connect()
   } else {
     // Already connected (e.g. StrictMode re-run), just re-register
     socket.emit('register_user', userId)
   }

   // Cleanup: only remove listeners, do NOT disconnect the socket.
   // The socket is a global singleton that stays alive.
   // It disconnects naturally on logout (page reload via window.location.replace).
   return () => {
     socket.off('connect', handleConnect)
     socket.off('get_online_users', handleOnlineUsers)
   }
 }, [isAuthenticated, user?.id, user?._id, dispatch])

 if (checkingStatus) {
 return (
 <Loader />
 )
 }

 return isAuthenticated ? <Outlet /> : <Navigate to={"/"} />


}

export default PrivateComponent
