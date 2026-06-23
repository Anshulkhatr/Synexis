import React, { useEffect, useRef } from 'react'
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
 const registeredRef = useRef(false)

 useEffect(() => {
   if (!isAuthenticated || !user) return

   const userId = user.id || user._id

   const handleConnect = () => {
     socket.emit('register_user', userId)
     registeredRef.current = true
   }

   const handleOnlineUsers = (userIds) => {
     dispatch(setOnlineUsers(userIds))
   }

   // Set up listeners
   socket.on('connect', handleConnect)
   socket.on('get_online_users', handleOnlineUsers)

   // Connect if not already connected
   if (!socket.connected) {
     socket.connect()
   } else {
     // Already connected, register immediately
     socket.emit('register_user', userId)
     registeredRef.current = true
   }

   return () => {
     socket.off('connect', handleConnect)
     socket.off('get_online_users', handleOnlineUsers)
     registeredRef.current = false
     socket.disconnect()
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

