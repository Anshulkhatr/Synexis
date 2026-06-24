import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileDetails } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Save } from 'lucide-react';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { profile, profileLoading } = useSelector(state => state.profile);

    const [formData, setFormData] = useState({
        name: user?.name || profile?.name || '',
        bio: profile?.bio || '',
        themeColor: profile?.themeColor || '#8b5cf6'
    });

    const PRESET_COLORS = [
        { name: 'Violet', value: '#8b5cf6' },
        { name: 'Fuchsia', value: '#d946ef' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Emerald', value: '#10b981' },
        { name: 'Rose', value: '#f43f5e' }
    ];

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name,
                bio: profile.bio,
                themeColor: profile.themeColor || '#8b5cf6'
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateProfileDetails(formData)).unwrap();
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error || "Failed to update profile");
        }
    };

    return (
        <>
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto mt-4">
                        <h1 className="text-3xl font-syne font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

                        <div className="glass-card bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                        placeholder="Your username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                                    <textarea 
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                        placeholder="Tell the community about yourself..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Profile Accent Color</label>
                                    <div className="flex gap-4">
                                        {PRESET_COLORS.map(color => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, themeColor: color.value })}
                                                className={`w-10 h-10 rounded-full transition-transform ${formData.themeColor === color.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-900' : 'hover:scale-110'}`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={profileLoading}
                                    className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5" />
                                    {profileLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Settings;
