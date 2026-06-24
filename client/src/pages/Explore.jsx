import React, { useEffect, useState } from 'react';
import MasonryGrid from '../components/MasonryGrid';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import { Search, Flame, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../features/post/postSlice';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Explore = () => {

 const { posts, postLoading, postSucess, postError, postErrorMessage } = useSelector(state => state.post)


 const dispatch = useDispatch()

 const [searchQuery, setSearchQuery] = useState('');
 const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'trending'

 let activePosts = posts.filter(post => post.isPublished)

 // Filter by search
 if (searchQuery.trim() !== '') {
 const query = searchQuery.toLowerCase();
 activePosts = activePosts.filter(post => 
 post.prompt?.toLowerCase().includes(query) || 
 post.user?.name?.toLowerCase().includes(query)
 );
 }

 // Sort posts
 activePosts = [...activePosts].sort((a, b) => {
 if (sortBy === 'trending') {
 return b.likes?.length - a.likes?.length;
 }
 return new Date(b.createdAt) - new Date(a.createdAt);
 });

 useEffect(() => {
 dispatch(getPosts())
 }, [])


 if (postLoading) {
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
 <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h1 className="text-3xl font-syne font-bold mb-2 text-gray-900 dark:text-white">Discover</h1>
 <p className="text-gray-600 dark:text-gray-400">Explore community creations</p>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 items-center">
 {/* Search Bar */}
 <div className="relative w-full sm:w-64 lg:w-80">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Search className="w-5 h-5 text-gray-400" />
 </div>
 <input
 type="text"
 placeholder="Search tags, prompts or creators..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
 />
 </div>

 {/* Sort Toggle */}
 <div className="flex bg-gray-100 dark:bg-black/40 p-1 rounded-xl border border-gray-200 dark:border-white/10 self-stretch sm:self-auto">
 <button
 onClick={() => setSortBy('latest')}
 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'latest' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
 >
 <Clock className="w-4 h-4" /> Latest
 </button>
 <button
 onClick={() => setSortBy('trending')}
 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'trending' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
 >
 <Flame className={`w-4 h-4 ${sortBy === 'trending' ? 'text-orange-500' : ''}`} /> Trending
 </button>
 </div>
 </div>
 </div>

 {activePosts.length > 0 ? (
 <MasonryGrid>
 {activePosts.map(post => (
 <PostCard key={post._id} post={post} />
 ))}
 </MasonryGrid>
 ) : (
 <div className="text-center py-20 text-gray-500">
 No posts found for this category.
 </div>
 )}
 </div>
 </main>
 </div>
 </>


 );
};

export default Explore;
