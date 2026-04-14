import React, { useEffect, useState, useMemo } from 'react';

const FuturisticCover = () => {
    const [telemetry, setTelemetry] = useState('0x4F2A');
    
    // Generate static particles once to avoid re-renders during animation
    const particles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const hex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
            setTelemetry(`0x${hex}`);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#050508]">
            {/* Animated Vibrant Nebula Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[100%] bg-cyan-500/10 rounded-full blur-[120px] animate-[float-slow_20s_infinite]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[100%] bg-magenta-500/10 rounded-full blur-[120px] animate-[float-slow_25s_infinite_reverse]"></div>
            <div className="absolute top-[20%] left-[30%] w-[50%] h-[70%] bg-blue-600/10 rounded-full blur-[150px] animate-[float-slow_30s_infinite]"></div>

            {/* Cyber Grid with subtle Magenta tint */}
            <div className="absolute inset-0 cyber-grid opacity-10"></div>
            
            {/* Scanning Horizontal Beam */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent top-0 animate-[sweep-horizontal_8s_linear_infinite] pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>

            {/* Digital Dust Particles */}
            {particles.map(p => (
                <div 
                    key={p.id}
                    className="absolute bg-white/20 rounded-full animate-pulse"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`
                    }}
                ></div>
            ))}
            
            {/* Improved Neural SVG Pattern with dynamic pulses */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#d946ef" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                    </linearGradient>
                    <pattern id="vibrant-neural" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="50" cy="50" r="1.5" fill="url(#neural-gradient)">
                            <animate attributeName="r" values="1;2.2;1" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
                        </circle>
                        <path d="M50 50 L100 0 M50 50 L0 100 M0 0 L50 50" stroke="url(#neural-gradient)" strokeWidth="0.5" strokeOpacity="0.2" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#vibrant-neural)" />
            </svg>

            {/* Futuristic Neon Earth */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative" style={{ width: 180, height: 180 }}>
                    {/* Outer glow aura */}
                    <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-2xl scale-125 animate-pulse"></div>
                    
                    {/* Earth SVG */}
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" style={{ animation: 'spin 30s linear infinite' }}>
                        <defs>
                            <radialGradient id="earthGlow" cx="40%" cy="35%" r="60%">
                                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
                            </radialGradient>
                            <filter id="neonGlow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                        </defs>
                        {/* Earth sphere */}
                        <circle cx="100" cy="100" r="85" fill="url(#earthGlow)" stroke="#06b6d4" strokeWidth="1" opacity="0.9"/>
                        {/* Neon continent shapes */}
                        <g filter="url(#neonGlow)" opacity="0.9">
                            <path d="M70 60 Q80 50 95 55 Q110 48 115 60 Q125 58 130 68 Q120 75 110 72 Q100 80 85 75 Q75 72 70 60Z" fill="#22d3ee" opacity="0.7"/>
                            <path d="M55 80 Q65 75 75 82 Q80 90 72 98 Q62 100 55 92 Q50 85 55 80Z" fill="#06b6d4" opacity="0.6"/>
                            <path d="M120 85 Q132 80 142 88 Q148 98 140 108 Q128 112 118 105 Q112 95 120 85Z" fill="#22d3ee" opacity="0.65"/>
                            <path d="M80 115 Q92 110 100 118 Q108 128 100 138 Q88 142 80 132 Q74 122 80 115Z" fill="#0ea5e9" opacity="0.7"/>
                            <path d="M48 110 Q58 106 65 114 Q68 124 60 130 Q50 132 45 122 Q42 114 48 110Z" fill="#06b6d4" opacity="0.5"/>
                        </g>
                        {/* Grid lines (latitude/longitude) */}
                        <g stroke="#06b6d4" strokeWidth="0.4" fill="none" opacity="0.3">
                            <ellipse cx="100" cy="100" rx="85" ry="25"/>
                            <ellipse cx="100" cy="100" rx="85" ry="55"/>
                            <line x1="100" y1="15" x2="100" y2="185"/>
                            <line x1="40" y1="25" x2="160" y2="175"/>
                        </g>
                        {/* Rim highlight */}
                        <circle cx="100" cy="100" r="85" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.5"/>
                    </svg>

                    {/* Orbital ring 1 */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotateX(75deg)', animation: 'spin 6s linear infinite' }}>
                        <div style={{ width: 220, height: 220, borderRadius: '50%', border: '1.5px solid rgba(34,211,238,0.5)', boxShadow: '0 0 12px rgba(34,211,238,0.3)' }}></div>
                    </div>
                    {/* Orbital ring 2 */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotateX(75deg) rotateZ(60deg)', animation: 'spin 10s linear infinite reverse' }}>
                        <div style={{ width: 250, height: 250, borderRadius: '50%', border: '1px dashed rgba(217,70,239,0.4)', boxShadow: '0 0 8px rgba(217,70,239,0.2)' }}></div>
                    </div>
                    {/* Orbiting dot */}
                    <div className="absolute" style={{ top: -15, left: '50%', width: 8, height: 8, marginLeft: -4, background: '#22d3ee', borderRadius: '50%', boxShadow: '0 0 12px #22d3ee', animation: 'spin 6s linear infinite' }}></div>
                </div>
            </div>

            {/* HUD Glass Telemetry Panels - ULTRA PREMIUM */}
            <div className="absolute top-8 left-8 glossy-hud p-4 rounded-xl flex flex-col gap-1 group overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_cyan]"></span>
                    <span className="text-[9px] font-mono font-bold text-cyan-400 tracking-[0.2em] uppercase">Core_System</span>
                </div>
                <div className="flex items-center gap-4 text-[8px] font-mono text-white/50">
                    <span>SYNCING: 99.9%</span>
                    <span>TEMP: 32°C</span>
                </div>
            </div>

            <div className="absolute top-8 right-8 glossy-hud p-4 rounded-xl flex flex-col items-end gap-1 overflow-hidden group">
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-magenta-400 to-transparent"></div>
                <div className="text-[9px] font-mono font-bold text-magenta-400 tracking-[0.2em] uppercase">Packet_Steam</div>
                <div className="text-[10px] font-mono text-white/70">STRM ID: {telemetry}</div>
                <div className="w-24 h-[1px] bg-magenta-900/30 mt-2 overflow-hidden rounded-full">
                    <div className="h-full bg-magenta-500 w-1/2 animate-[telemetry-bar-fast_1.5s_linear_infinite]"></div>
                </div>
            </div>

            <style>{`
                @keyframes telemetry-bar-fast {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .bg-magenta-500\/10 { background-color: rgba(217, 70, 239, 0.1); }
                .text-magenta-400 { color: rgb(217, 70, 239); }
                .bg-magenta-900\/30 { background-color: rgba(112, 26, 117, 0.3); }
                .bg-magenta-500 { background-color: rgb(217, 70, 239); }
                .via-magenta-400 { stop-color: rgb(217, 70, 239); }
            `}</style>
        </div>
    );
};

export default FuturisticCover;
