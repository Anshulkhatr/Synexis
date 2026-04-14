import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CURRENT_USER, MOCK_POSTS } from '../mockData';
import MasonryGrid from '../components/MasonryGrid';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import { Settings, Share2, MapPin, Calendar, CircleDollarSign, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { follow, getProfile, unfollow, updateImage } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState, useRef } from 'react';

const Profile = () => {

 const [activeTab, setActiveTab] = useState('creations');

 const { profile, profileSuccess, profileLoading, profileError, profileErrorMessage } = useSelector(state => state.profile)
 const { user } = useSelector(state => state.auth)

 const fileInputRef = useRef(null);
 const isOwner = profile?._id === (user?._id || user?.id);

 const alreadyFollowed = profile?.followers?.some(follow => follow?._id === (user?._id || user?.id)) || false;

 const dispatch = useDispatch()
 const { username } = useParams();

 console.log(username)

 const handleFollowUnfollow = async (id) => {

 if (alreadyFollowed) {
 // Unfolow
 await dispatch(unfollow(id))
 } else {
 // Follow
 await dispatch(follow(id))
 }

 // Refresh The Profile
 dispatch(getProfile(username))
 }

 const handleShare = async () => {
 try {
 if (navigator.share) {
 await navigator.share({
 title: `${profile?.name} on Synexis`,
 text: `Check out ${profile?.name}'s profile on Synexis!`,
 url: window.location.href,
 });
 } else {
 await navigator.clipboard.writeText(window.location.href);
 toast.success("Profile link copied to clipboard!", { position: "top-center", theme: "dark" });
 }
 } catch (error) {
 console.log("Error sharing:", error);
 }
 };

 const handleAvatarClick = () => {
 if (isOwner) {
 fileInputRef.current.click();
 }
 };

 const handleAvatarChange = async (e) => {
 const file = e.target.files[0];
 if (file) {
 if (file.size > 5 * 1024 * 1024) {
 return toast.error("File size must be less than 5MB");
 }

 const formData = new FormData();
 formData.append('avatar', file);

 try {
 await dispatch(updateImage(formData)).unwrap();
 toast.success("Avatar updated successfully!");
 // Refresh profile to show new image
 dispatch(getProfile(username));
 } catch (error) {
 toast.error(error || "Failed to update avatar");
 }
 }
 };




 useEffect(() => {
 // Get Profile
 dispatch(getProfile(username))

 if (profileError && profileErrorMessage) {
 toast.error(profileErrorMessage, { position: "top-center", theme: "dark" })
 }


 }, [username])


 if (profileLoading) {
 return (
 <Loader />
 )
 }


 return (

 <>
 <Sidebar />
 <div className="flex-1 flex flex-col relative overflow-hidden">
 <Navbar />
 <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
 <div className="w-full relative pb-20">
 {/* Cover Image */}
 <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-[#0a0a0f]">
 <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-fuchsia-900/20 to-[#0a0a0f]"></div>
 {/* Overlay for depth and contrast */}
 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80"></div>
 <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
 </div>

 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 sm:-mt-32">
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
 <div className="flex items-end gap-6 relative z-10">
 <div className="relative group">
 <div className="relative">
 <UserAvatar src={profile?.avatar} alt={profile?.name} size="xl" ring />
 {profileLoading && (
 <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full z-20">
 <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"></div>
 </div>
 )}
 </div>
 {isOwner && !profileLoading && (
 <>
 <button 
 onClick={handleAvatarClick}
 className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer border-2 border-dashed border-white/30"
 title="Change Avatar"
 >
 <Camera className="w-8 h-8 text-white" />
 </button>
 <input 
 type="file" 
 ref={fileInputRef} 
 onChange={handleAvatarChange} 
 className="hidden" 
 accept="image/*"
 />
 </>
 )}
 </div>
 <div className="mb-2">
 <h1 className="text-3xl font-syne font-bold text-white">{profile?.name}</h1>
 <p className="text-gray-400">@{username}</p>
 </div>
 </div>

 <div className="flex gap-3 relative z-10 sm:mb-2">
 <button onClick={handleShare} className="p-2 rounded-full glass-card hover:bg-white/10">
 <Share2 className="w-5 h-5 text-gray-300" />
 </button>
 {profile?._id !== (user?.id || user?._id) && (
 <button onClick={() => handleFollowUnfollow(profile._id)} className={alreadyFollowed ? "px-5 py-2 rounded-full text-white font-medium hover:bg-white/20 text-sm bg-violet-500" : "px-5 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 text-sm"}>
 {alreadyFollowed ? "Unfollow" : "Follow"}
 </button>
 )}
 </div>
 </div>

 {/* Bio & Stats */}
 <div className="max-w-2xl text-gray-300 mb-8 space-y-4">
 <p className="leading-relaxed">{profile?.bio}</p>

 <div className="flex gap-6 text-sm text-gray-400">
 <div className="flex items-center gap-1.5"><CircleDollarSign className="w-4 h-4" /> Credits : {profile?.credits}</div>
 <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(profile?.createdAt).toLocaleDateString('en-IN')}</div>
 </div>

 <div className="flex gap-8 pt-4 border-t border-white/10">
 <div className="flex flex-col text-center">
 <span className="text-xl font-bold text-white">{profile?.posts?.length || 0}</span>
 <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Posts</span>
 </div>
 <div className="flex flex-col text-center">
 <span className="text-xl font-bold text-white">{profile?.followers?.length || 0}</span>
 <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Followers</span>
 </div>
 <div className="flex flex-col text-center">
 <span className="text-xl font-bold text-white">{profile?.following?.length || 0}</span>
 <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Following</span>
 </div>
 </div>
 </div>

 {/* Tabs */}
 <div className="flex gap-8 mb-8 border-b border-white/10">
 <button 
 onClick={() => setActiveTab('creations')}
 className={`pb-4 font-medium relative ${activeTab === 'creations' ? 'text-violet-500 border-b-2 border-violet-500' : 'text-gray-400 hover:text-white'}`}
 >
 Creations
 </button>
 <button 
 onClick={() => setActiveTab('liked')}
 className={`pb-4 font-medium relative ${activeTab === 'liked' ? 'text-violet-500 border-b-2 border-violet-500' : 'text-gray-400 hover:text-white'}`}
 >
 Liked
 </button>
 {profile?._id === (user?.id || user?._id) && (
 <button 
 onClick={() => setActiveTab('collections')}
 className={`pb-4 font-medium relative ${activeTab === 'collections' ? 'text-violet-500 border-b-2 border-violet-500' : 'text-gray-400 hover:text-white'}`}
 >
 Collections
 </button>
 )}
 </div>

 {/* Posts Grid */}
 <MasonryGrid>
 {activeTab === 'creations' && profile?.posts?.map(post => (
 <PostCard key={post._id} post={post} />
 ))}
 {activeTab === 'liked' && profile?.likedPosts?.map(post => (
 <PostCard key={post._id} post={post} />
 ))}
 {activeTab === 'collections' && profile?.savedPosts?.map(post => (
 <PostCard key={post._id} post={post} />
 ))}
 </MasonryGrid>

 {/* Empty States */}
 {activeTab === 'creations' && profile?.posts?.length === 0 && (
 <div className="text-center py-20 text-gray-500">No creations yet.</div>
 )}
 {activeTab === 'liked' && profile?.likedPosts?.length === 0 && (
 <div className="text-center py-20 text-gray-500">No liked posts yet.</div>
 )}
 {activeTab === 'collections' && profile?.savedPosts?.length === 0 && (
 <div className="text-center py-20 text-gray-500">No saved collections yet.</div>
 )}
 </div>
 </div>
 </main>
 </div>
 </>




 );
};

export default Profile;
