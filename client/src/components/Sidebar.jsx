import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, User, Sparkles, Settings, LogOut, LayoutDashboard, MessageSquare, Bell, X, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { logoutUser } from '../features/auth/authSlice';
import { resetProfile } from '../features/profile/profileSlice';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../features/notifications/notificationSlice';

const Sidebar = () => {

 const { user, isSuccess } = useSelector(state => state.auth)
 const { items: notifications } = useSelector(state => state.notifications)
 const [isPanelOpen, setIsPanelOpen] = React.useState(false);
 const { theme, toggleTheme } = useTheme();
 
 if (!user) return null;

 const dispatch = useDispatch()
 const navigate = useNavigate()
 const location = useLocation()

 React.useEffect(() => {
   if (user) {
     dispatch(fetchNotifications());
   }
 }, [user, dispatch]);

 const unreadCount = notifications.filter(n => !n.isRead).length;

 const navItems = [
   { icon: user?.isAdmin ? LayoutDashboard : Home, label: user?.isAdmin ? "Dashboard" : 'Feed', path: user?.isAdmin ? "/admin/dashboard" : '/auth/feed' },
   { icon: Compass, label: 'Explore', path: '/auth/explore' },
   { icon: PlusSquare, label: 'Generate', path: '/auth/generate' },
   { icon: MessageSquare, label: 'Messages', path: '/auth/chat' },
   { icon: User, label: 'Profile', path: `/auth/profile/${user?.name}` },
 ];


 const handleLogout = async () => {
 await dispatch(logoutUser())
 dispatch(resetProfile())
 window.location.replace("/") // Hard redirect to clear all states and ensure Landing page is reached
 }

 return (
 <>
 {/* Desktop Sidebar */}
 <aside className="hidden md:flex flex-col w-64 h-full border-r border-gray-200 dark:border-white/10 glass-card bg-gray-50 dark:bg-[#0a0a0f]/95 shrink-0">
 <div className="p-6">
 <Link to="/auth/feed" className="flex items-center gap-2 group">
 <Sparkles className="text-violet-500 w-8 h-8 group-hover:" />
 <h1 className="font-syne font-bold text-2xl bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
 Synexis
 </h1>
 </Link>
 </div>

 <nav className="flex-1 px-4 mt-6 flex flex-col gap-2">
 {navItems.map((item) => (
 <NavLink
 key={item.label}
 to={item.path}
 className={({ isActive }) =>
 `flex items-center gap-4 px-4 py-3 rounded-xl relative ${isActive
 ? 'bg-violet-600/20 text-violet-400'
 : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/5'
 }`
 }
 >
 <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-violet-400' : 'group-hover:text-violet-400'}`} />
 <span className="font-medium">{item.label}</span>
 {location.pathname === item.path && (
 <div className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
 )}
 </NavLink>
 ))}
 </nav>

 <div className="p-4 mb-4 mt-auto">
 <button onClick={toggleTheme} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-white/5 hover:text-violet-400 cursor-pointer w-full relative">
 {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
 </button>
 <button onClick={() => setIsPanelOpen(true)} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-white/5 hover:text-violet-400 cursor-pointer w-full relative mt-1">
 <Bell className="w-5 h-5" />
 <span>Notifications</span>
 {unreadCount > 0 && (
   <span className="absolute right-4 bg-fuchsia-500 text-gray-900 dark:text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
     {unreadCount}
   </span>
 )}
 </button>
 <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-white/5 hover:text-violet-400 cursor-pointer mt-1">
 <LogOut className="w-5 h-5" />
 <span>Log out</span>
 </button>
 </div>
 </aside>

 {/* Notification Slide-out Panel */}
 {isPanelOpen && (
   <div className="fixed inset-0 z-[100] flex">
     <div className="absolute inset-0 bg-white dark:bg-black/50 backdrop-blur-sm" onClick={() => setIsPanelOpen(false)} />
     <div className="relative w-80 md:w-96 bg-gray-50 dark:bg-[#0a0a0f] border-r border-gray-200 dark:border-white/10 h-full flex flex-col shadow-2xl animate-slide-in-left">
       <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
         <h2 className="text-xl font-syne font-bold flex items-center gap-2">
           <Bell className="text-fuchsia-500 w-5 h-5" /> Notifications
         </h2>
         <div className="flex items-center gap-2">
           <button onClick={() => dispatch(markAllNotificationsRead())} className="text-xs text-violet-400 hover:text-violet-300">
             Mark all read
           </button>
           <button onClick={() => setIsPanelOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400">
             <X className="w-5 h-5" />
           </button>
         </div>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-3">
         {notifications.length > 0 ? notifications.map(notif => (
           <div 
             key={notif._id} 
             onClick={() => {
               if (!notif.isRead) dispatch(markNotificationRead(notif._id));
               if (notif.type === 'message') {
                 setIsPanelOpen(false);
                 navigate('/auth/chat');
               }
             }}
             className={`p-3 rounded-xl border cursor-pointer transition ${notif.isRead ? 'bg-gray-100 dark:bg-white/5 border-transparent opacity-70' : 'bg-violet-900/20 border-violet-500/30 shadow-lg'}`}
           >
             <div className="flex gap-3 items-center">
               {notif.sender?.avatar ? (
                 <img src={notif.sender.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
               ) : (
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-gray-900 dark:text-white">
                   {notif.sender?.name?.charAt(0)?.toUpperCase()}
                 </div>
               )}
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium truncate">
                   <span className="font-bold">{notif.sender?.name}</span>
                   {notif.type === 'message' && ' sent you a message.'}
                   {notif.type === 'like' && ' liked your post.'}
                   {notif.type === 'follow' && ' followed you.'}
                 </p>
                 <span className="text-[10px] text-gray-500">{new Date(notif.createdAt).toLocaleString()}</span>
               </div>
               {!notif.isRead && <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>}
             </div>
           </div>
         )) : (
           <div className="text-center text-gray-500 mt-10">No notifications yet.</div>
         )}
       </div>
     </div>
   </div>
 )}

 {/* Mobile Bottom Bar */}
 <div className="md:hidden fixed bottom-0 w-full h-16 glass-card border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0a0a0f]/95 z-50 flex items-center justify-around px-2">
 {navItems.map((item) => (
 <NavLink
 key={item.label}
 to={item.path}
 className={({ isActive }) =>
 `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-violet-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
 }`
 }
 >
 <item.icon className={`w-6 h-6 ${item.label === 'Generate' ? 'text-fuchsia-500' : ''}`} />
 </NavLink>
 ))}
  </div>
  {/* Mobile Bottom Bar Notifications Button */}
  <div className="fixed bottom-20 right-4 md:hidden z-50">
    <button onClick={() => setIsPanelOpen(true)} className="bg-violet-600 p-3 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] relative">
      <Bell className="w-6 h-6 text-gray-900 dark:text-white" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-gray-900 dark:text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md border-2 border-[#0a0a0f]">
          {unreadCount}
        </span>
      )}
    </button>
  </div>
  </>
 );
};

export default Sidebar;
