import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart3, Users, Heart, Image as ImageIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getProfile } from '../features/profile/profileSlice';
import Loader from '../components/Loader';

const Analytics = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile, profileLoading } = useSelector((state) => state.profile);

    useEffect(() => {
        if (user?.name) {
            dispatch(getProfile(user.name));
        }
    }, [dispatch, user]);

    if (profileLoading || !profile) {
        return <Loader />;
    }

    const totalPosts = profile.posts?.length || 0;
    const totalFollowers = profile.followers?.length || 0;
    const totalFollowing = profile.following?.length || 0;
    const totalLikes = profile.posts?.reduce((acc, post) => acc + (post.likes?.length || 0), 0) || 0;

    return (
        <>
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-50 dark:bg-[#0a0a0f]">
                <Navbar />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto mt-4">
                        <div className="mb-8">
                            <h1 className="text-3xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-violet-500" />
                                Your Analytics
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of your account performance</p>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <div className="glass-card bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-violet-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Posts</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPosts}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                                        <Heart className="w-6 h-6 text-fuchsia-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Likes Received</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLikes}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Followers</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFollowers}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Following</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFollowing}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Performance (Mock Graph) */}
                        <div className="glass-card bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Engagement Over Time</h2>
                            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-10">
                                {/* Create a pure CSS bar chart simulation */}
                                {[40, 70, 45, 90, 60, 100, 80].map((height, i) => (
                                    <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                        <div className="w-full relative bg-gray-100 dark:bg-white/5 rounded-t-lg h-full flex items-end justify-center">
                                            <div 
                                                className="w-full bg-gradient-to-t from-violet-600 to-fuchsia-500 rounded-t-lg transition-all duration-500 group-hover:opacity-80"
                                                style={{ height: `${height}%` }}
                                            ></div>
                                            <span className="absolute -top-8 text-xs font-bold text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                {Math.floor(height * 2.4)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">Day {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

export default Analytics;
