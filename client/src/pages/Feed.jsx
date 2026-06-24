import React, { useEffect } from 'react';
import MasonryGrid from '../components/MasonryGrid';
import PostCard from '../components/PostCard';
import { MOCK_POSTS } from '../mockData';
import { Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../features/post/postSlice';
import Loader from '../components/Loader';
import { getProfile } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Feed = () => {

 const { posts, postLoading, postSucess, postError, postErrorMessage } = useSelector(state => state.post)
 const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth)
 const { profile, profileLoading } = useSelector(state => state.profile)

 const dispatch = useDispatch()
 const navigate = useNavigate()

 const [feedType, setFeedType] = React.useState('following'); // 'following' | 'global'

 // Sort all posts chronologically
 const sortedPosts = [...(posts || [])].filter(post => post.isPublished).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

 const filteredPosts = feedType === 'following' 
 ? sortedPosts.filter(post => profile?.following?.some(follow => follow._id === post.user._id))
 : sortedPosts;





 useEffect(() => {

 if (user.isAdmin) {
 navigate("/admin/dashboard")
 }

 // Fetch Posts
 dispatch(getPosts())
 // Fetch Profile
 if (user) {
 dispatch(getProfile(user?.name))
 }


 if (postError && postErrorMessage || isError && message) {
 toast.error(postErrorMessage || message, { position: "top-center" })
 }


 }, [postError, postErrorMessage, isError, message, user])


 if (postLoading || isLoading || profileLoading) {
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
 <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto mt-4">
 <div className="mb-8 flex items-center justify-between">
 <h1 className="text-3xl font-syne font-bold">Your Feed</h1>
 <div className="flex bg-gray-100 dark:bg-black/40 p-1 rounded-xl border border-gray-200 dark:border-white/10">
 <button 
 onClick={() => setFeedType('global')}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${feedType === 'global' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
 >
 Global
 </button>
 <button 
 onClick={() => setFeedType('following')}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${feedType === 'following' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
 >
 Following
 </button>
 </div>
 </div>

 {filteredPosts?.length > 0 ? (
 <MasonryGrid>
 {filteredPosts.map(post => (
 <PostCard key={post._id} post={post} />
 ))}
 </MasonryGrid>
 ) : (
 <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
 <Sparkles className="w-12 h-12 text-fuchsia-500 opacity-40" />
 <h2 className="text-xl font-semibold text-gray-900 dark:text-white/60">Your feed is empty</h2>
 <p className="text-sm text-gray-500 max-w-xs">
 {feedType === 'following' ? 'Follow other creators on ' : 'No posts found on '}
 <span className="text-fuchsia-400 font-medium">Explore</span> to see their AI art here.
 </p>
 </div>
 )}
 </div>
 </main>
 </div>

 </>



 );
};

export default Feed;
