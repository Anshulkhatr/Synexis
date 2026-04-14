import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Bell, BellOff, CheckCheck, Image, AlertTriangle } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { markAllRead, clearNotifications } from '../features/notifications/notificationSlice';

// Helper: relative time string
const timeAgo = (isoString) => {
 const diff = (Date.now() - new Date(isoString)) / 1000
 if (diff < 60) return 'just now'
 if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
 if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
 return `${Math.floor(diff / 86400)}d ago`
}

const Navbar = () => {

 const { user } = useSelector(state => state.auth)
 const { items: notifications } = useSelector(state => state.notifications)
 const dispatch = useDispatch()

 const [notifOpen, setNotifOpen] = useState(false);
 const notifRef = useRef(null);
 const location = useLocation();

 const unreadCount = notifications.filter(n => !n.read).length

 // Close dropdown when clicking outside
 useEffect(() => {
 const handleClick = (e) => {
 if (notifRef.current && !notifRef.current.contains(e.target)) {
 setNotifOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClick);
 return () => document.removeEventListener('mousedown', handleClick);
 }, []);

 const handleBellClick = () => {
 setNotifOpen(prev => !prev)
 if (!notifOpen && unreadCount > 0) {
 dispatch(markAllRead())
 }
 }

 const isExcluded = ['/', '/login', '/register'].includes(location.pathname);
 if (isExcluded && location.pathname === '/') return null;

 return (
 <nav className="sticky top-0 z-40 w-full glass-card border-b border-white/10 bg-[#0a0a0f]/80 px-4 md:px-6 h-16 flex items-center justify-between ">

 {/* Mobile Logo */}
 <div className="flex items-center gap-4 flex-1">
 <div className="md:hidden flex items-center gap-2">
 <Sparkles className="text-violet-500 w-6 h-6" />
 </div>
 </div>

 {/* Right Side Actions */}
 <div className="flex items-center gap-3 md:gap-5">
 <Link
 to="/auth/generate"
 className="hidden md:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-2 rounded-full font-medium text-sm shadow-lg shadow-violet-900/20"
 >
 <Sparkles className="w-4 h-4" />
 <span>Generate</span>
 </Link>

 {/* Notification Bell */}
 <div className="relative" ref={notifRef}>
 <button
 onClick={handleBellClick}
 className="p-2 rounded-full hover:bg-white/10 relative group"
 aria-label="Notifications"
 >
 <Bell className={`w-5 h-5 ${notifOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} />
 {/* Unread badge */}
 {unreadCount > 0 && (
 <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-violet-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center leading-none">
 {unreadCount > 9 ? '9+' : unreadCount}
 </span>
 )}
 </button>

 {/* Notification Panel */}
 {notifOpen && (
 <div className="absolute right-0 top-12 w-80 rounded-2xl border border-white/10 bg-[#0f0f18]/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
 {/* Header */}
 <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
 <div>
 <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Notifications</p>
 <h3 className="text-base font-semibold text-white mt-0.5">
 Welcome, <span className="text-fuchsia-400">{user?.name}</span> 👋
 </h3>
 </div>
 {notifications.length > 0 && (
 <button
 onClick={() => dispatch(clearNotifications())}
 className="text-xs text-gray-500 hover:text-violet-400 flex items-center gap-1"
 title="Clear all"
 >
 <CheckCheck className="w-3.5 h-3.5" />
 Clear
 </button>
 )}
 </div>

 {/* Notification List */}
 <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
 {notifications.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-10 px-5 gap-3 text-center">
 <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
 <BellOff className="w-6 h-6 text-gray-500" />
 </div>
 <p className="text-sm font-medium text-white/50">No new notifications</p>
 <p className="text-xs text-gray-600">You're all caught up! Generate a post to see activity here.</p>
 </div>
 ) : (
 notifications.map(notif => (
 <div key={notif.id} className={`flex items-start gap-3 px-4 py-3.5 hover:bg-white/5 ${!notif.read ? 'bg-fuchsia-500/5' : ''}`}>
 {/* Thumbnail or icon */}
 {notif.type === 'post_generating' ? (
 <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
 <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full " />
 </div>
 ) : notif.type === 'post_failed' ? (
 <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
 <AlertTriangle className="w-5 h-5 text-violet-500" />
 </div>
 ) : notif.imageLink ? (
 <img
 src={notif.imageLink}
 alt="post thumb"
 className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
 />
 ) : (
 <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
 <Image className="w-5 h-5 text-fuchsia-400" />
 </div>
 )}
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-white">{notif.title}</p>
 <p className="text-xs text-gray-400 truncate mt-0.5">{notif.message}</p>
 {notif.prompt && (
 <p className="text-xs text-gray-600 truncate mt-0.5 italic">"{notif.prompt?.substring(0, 50)}..."</p>
 )}
 <p className="text-xs text-fuchsia-400/70 mt-1">{timeAgo(notif.time)}</p>
 </div>
 {!notif.read && (
 <span className="w-2 h-2 bg-fuchsia-500 rounded-full shrink-0 mt-1.5" />
 )}
 </div>
 ))
 )}
 </div>
 </div>
 )}
 </div>

 <Link to={`/auth/profile/${user?.name}`}>
 <UserAvatar src={user?.avatar} alt={user?.name} size="sm" isOnline ring />
 </Link>
 </div>

 </nav>
 );
};

export default Navbar;
