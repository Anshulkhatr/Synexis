import React from 'react';

const UserAvatar = ({ src, alt, size = 'md', isOnline = false, ring = false }) => {

 const sizeClasses = {
 sm: 'w-8 h-8',
 md: 'w-10 h-10',
 lg: 'w-16 h-16',
 xl: 'w-24 h-24'
 };

 // Robust check for missing avatar source
 const hasValidSrc = src && src !== 'undefined' && src !== 'null' && src !== '';
 
 const avatarUrl = hasValidSrc 
 ? src 
 : `https://api.dicebear.com/7.x/initials/svg?seed=${alt || 'VX'}&backgroundType=gradientLinear&fontFamily=Syne&fontSize=40&fontWeight=700`;

 return (
 <div className={`relative inline-block ${sizeClasses[size]}`}>
 <div className={`w-full h-full rounded-full overflow-hidden ${ring ? 'ring-2 ring-violet-500/50' : 'border border-white/10'} bg-gray-900 flex items-center justify-center`}>
 <img 
 src={avatarUrl} 
 alt={alt} 
 className="w-full h-full object-cover"
 onError={(e) => {
 // Final fallback if the image fails to load
 e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${alt || 'VX'}&backgroundType=gradientLinear`;
 }}
 />
 </div>
 {isOnline && (
 <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-[#0a0a0f] bg-green-500"></span>
 )}
 </div>
 );
};

export default UserAvatar;
