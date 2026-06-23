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

 useEffect(() => {
   if (isAuthenticated && user) {
     socket.connect()
     socket.emit('register_user', user.id || user._id)

     socket.on('get_online_users', (userIds) => {
       dispatch(setOnlineUsers(userIds))
     })

     return () => {
       socket.off('get_online_users')
       socket.disconnect()
     }
   }
 }, [isAuthenticated, user, dispatch])

 if (checkingStatus) {
 return (
 <Loader />
 )
 }

 return isAuthenticated ? <Outlet /> : <Navigate to={"/"} />


}

export default PrivateComponent
