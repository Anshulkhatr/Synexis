export default function Loader() {
 return (
 <div className="flex-1 flex flex-col relative overflow-hidden">
 <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
 <div className="flex items-center justify-center min-h-screen bg-black">
 <div className="relative w-16 h-16">
 {/* Outer rotating ring */}
 <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-violet-500 "></div>

 {/* Middle rotating ring - slower */}
 <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-fuchsia-500 border-l-fuchsia-500 " style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>

 {/* Inner pulsing dot */}
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-2 h-2 bg-violet-500 rounded-full "></div>
 </div>
 </div>
 </div>
 </main>
 </div>
 );
}
