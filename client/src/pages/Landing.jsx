import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Users, Image as ImageIcon, ChevronDown, Zap, Layout, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633519842514-6880099cc948?q=80&w=2564&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2564&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=2564&auto=format&fit=crop"
];

const CREATORS = [
    { name: "@neo_artist", img: MOCK_IMAGES[0] },
    { name: "@cyber_dreams", img: MOCK_IMAGES[1] },
    { name: "@pixel_god", img: MOCK_IMAGES[2] },
    { name: "@synth_wave", img: MOCK_IMAGES[3] },
    { name: "@render_master", img: MOCK_IMAGES[4] },
    { name: "@ai_visionary", img: MOCK_IMAGES[5] }
];

const FAQS = [
    { q: "How fast is image generation?", a: "Most images are generated in under 3 seconds using our advanced cloud infrastructure." },
    { q: "Who owns the copyright?", a: "You own 100% of the copyright for any image you generate on Synexis, including commercial rights for Pro users." },
    { q: "Can I sell my prompts?", a: "Yes! The community marketplace allows you to monetize your best prompt structures." }
];

const STEPS = [
    { title: "Imagine", desc: "Type any idea that comes to your mind, no matter how wild.", icon: Wand2, color: "text-violet-400", bg: "bg-violet-500/10" },
    { title: "Generate", desc: "Our AI engines process your prompt in seconds.", icon: Zap, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
    { title: "Share", desc: "Post your creation to the community and get feedback.", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" }
];

const STATS = [
    { label: "Images Generated", value: "2.4M+", color: "from-violet-400 to-fuchsia-400" },
    { label: "Active Creators", value: "85K+", color: "from-fuchsia-400 to-pink-400" },
    { label: "Average Generation", value: "< 3s", color: "from-pink-400 to-indigo-400" },
    { label: "User Satisfaction", value: "4.9/5", color: "from-indigo-400 to-violet-400" }
];

const TESTIMONIALS = [
    { name: "Sarah Jenkins", role: "Concept Artist", quote: "Synexis has completely changed my workflow. The speed and quality are unlike anything else I've tried.", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "David Chen", role: "UI Designer", quote: "The community here is so inspiring. I love how easy it is to discover new prompt techniques.", avatar: "https://i.pravatar.cc/150?u=david" },
    { name: "Elena Rodriguez", role: "NFT Creator", quote: "The upscaling tools are a lifesaver. My art looks crisp and professional every time.", avatar: "https://i.pravatar.cc/150?u=elena" }
];

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const Landing = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [faqOpen, setFaqOpen] = useState(null);
    const [isPromptPlaying, setIsPromptPlaying] = useState(false);
    
    // For Parallax Gallery
    const galleryRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: galleryRef,
        offset: ["start end", "end start"]
    });
    
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);

    useEffect(() => {
        // Redirect logic if logged in...
    }, [user]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1,  transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="w-full min-h-screen bg-[#0a0a0f] overflow-x-hidden flex flex-col relative selection:bg-fuchsia-500/30">
            {/* Animated Background Mesh */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000"></div>
            </div>

            {/* Nav */}
            <nav className="relative z-50 w-full p-6 flex items-center justify-between max-w-7xl mx-auto backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <Sparkles className="text-violet-500 w-8 h-8" />
                    <span className="font-syne font-bold text-2xl bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Synexis</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                    <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">Log In</Link>
                    <Link to="/register" className="px-6 py-2 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">Sign Up</Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full pt-16 pb-32 min-h-[90vh]">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center w-full">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-violet-500/30 text-violet-300 mb-8 max-w-full overflow-hidden hover:border-violet-500/60 transition-colors cursor-default">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span className="text-xs md:text-sm font-medium truncate">The Next-Gen AI Art Community</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-syne font-extrabold text-white mb-6 leading-[1.1]">
                        Visualize <br className="md:hidden" />
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Anything.</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-medium">
                        Join a community of millions of creators. Generate breathtaking AI art, discover new prompts, and share your imagination with the world.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-20">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-violet-500/40 transition-all duration-300">
                            Start Creating <Wand2 className="w-5 h-5" />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full glass-card text-white font-bold text-lg hover:bg-white/10 flex items-center justify-center hover:scale-105 transition-all duration-300">
                            Explore Feed
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Floating UI Hero Component */}
                <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }} className="relative w-full max-w-4xl mx-auto h-64 md:h-96 hidden sm:block mb-10">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] md:w-3/4 h-full glass-card rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-float z-10 bg-black/40">
                        <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
                           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
                           <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600 via-transparent to-transparent z-0"></div>
                           <div className="glass-card px-4 py-3 md:px-6 md:py-4 rounded-xl flex items-center gap-3 md:gap-4 bg-white/10 z-10 transform md:scale-110 border-white/20 backdrop-blur-xl shadow-2xl">
                                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" />
                                <span className="font-mono text-white text-sm md:text-base">a surreal futuristic city skyline at neon sunset...<span className="animate-pulse font-bold text-fuchsia-400">|</span></span>
                           </div>
                        </div>
                     </div>
                     
                     <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="absolute top-[15%] -left-4 md:-left-12 w-40 h-40 md:w-56 md:h-56 glass-card rounded-2xl border border-white/20 p-2 animate-float animation-delay-2000 shadow-2xl bg-black/50 z-20 cursor-pointer">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-600/60 to-purple-800/60 rounded-xl bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center"></div>
                     </motion.div>

                     <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="absolute top-[30%] -right-4 md:-right-12 w-48 h-56 md:w-64 md:h-72 glass-card rounded-2xl border border-white/20 p-2 animate-float animation-delay-4000 shadow-2xl bg-black/50 z-20 cursor-pointer">
                        <div className="w-full h-full bg-gradient-to-br from-fuchsia-600/60 to-pink-800/60 rounded-xl bg-[url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center"></div>
                     </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
                    <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                        <ChevronDown className="w-6 h-6" />
                    </motion.div>
                </motion.div>
            </main>

            {/* NEW: How It Works Section */}
            <section className="relative z-10 py-32 bg-transparent overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-20">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="px-4 py-1 rounded-full border border-violet-500/30 text-violet-400 text-xs font-bold mb-4 tracking-widest uppercase bg-violet-500/5">
                            Process
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-syne font-bold text-white mb-6">How it <span className="text-fuchsia-400">Works</span></h2>
                        <p className="text-gray-400 max-w-2xl text-lg">Three simple steps to turn your wildest dreams into digital reality.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block -translate-y-12"></div>
                        
                        {STEPS.map((step, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                <div className={`w-24 h-24 rounded-[2rem] ${step.bg} border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500 group-hover:border-white/20 shadow-xl`}>
                                    <step.icon className={`w-10 h-10 ${step.color}`} />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm shadow-lg">
                                        {idx + 1}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-syne font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed px-4">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW: Interactive Prompt Showcase */}
            <section className="relative z-10 py-32 bg-transparent text-center px-4">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-6">Create at the Speed of <span className="text-fuchsia-400">Thought</span></h2>
                    <p className="text-gray-400 text-lg mb-12">Write your prompt, hit generate, and watch magic happen.</p>
                    
                    <div className="glass-card rounded-[2rem] p-4 md:p-8 relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(217,70,239,0.1)]">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 relative z-10">
                            <div className="flex-1 w-full glass-card bg-black/40 rounded-xl p-4 md:p-6 text-left border-white/5 flex items-center gap-3">
                                <Sparkles className="text-violet-400 w-6 h-6 shrink-0" />
                                <span className="font-mono text-gray-300 text-sm md:text-base">
                                  {isPromptPlaying ? <TypewriterText text="A cyberpunk astronaut exploring a bioluminescent alien forest, 8k resolution, unreal engine render" /> : "Click play to test a prompt"}
                                  <span className="animate-pulse text-white">_</span>
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsPromptPlaying(true)}
                                className="px-8 py-5 md:py-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center"
                            >
                                <Play className="w-5 h-5 fill-white" /> Run
                            </button>
                        </div>
                        
                        <div className="w-full h-48 md:h-[400px] bg-black/30 rounded-2xl border border-white/5 overflow-hidden relative">
                            {isPromptPlaying ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    transition={{ delay: 3, duration: 1.5, ease: "easeOut" }}
                                    className="w-full h-full"
                                >
                                    <img src={MOCK_IMAGES[1]} alt="Generated content" className="w-full h-full object-cover" />
                                </motion.div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-syne font-semibold flex-col gap-4">
                                    <ImageIcon className="w-12 h-12 opacity-50" />
                                    <span>Generation output will appear here</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Parallax Infinite Gallery Section */}
            <section ref={galleryRef} className="relative z-10 py-32 bg-black/60 border-y border-white/5 overflow-hidden backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-syne font-bold text-white mb-4">
                        Endless <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">Inspiration</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Explore a vast gallery of community-generated art. Scroll down to see the models in action.
                    </motion.p>
                </div>
                
                <div className="flex justify-center gap-6 px-4 md:px-0 h-[600px] overflow-hidden rotate-[-5deg] scale-110">
                    <motion.div style={{ y: y1 }} className="flex flex-col gap-6 pt-24 min-w-[250px] md:min-w-[300px]">
                        {[MOCK_IMAGES[0], MOCK_IMAGES[1], MOCK_IMAGES[2]].map((img, idx) => (
                            <div key={idx} className="w-full h-80 rounded-3xl overflow-hidden glass-card p-2 shadow-xl shadow-fuchsia-500/10 hover:shadow-fuchsia-500/30 transition-shadow">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-2xl" />
                            </div>
                        ))}
                    </motion.div>
                    
                    <motion.div style={{ y: y2 }} className="flex flex-col gap-6 -mt-48 min-w-[250px] md:min-w-[300px] hidden sm:flex">
                        {[MOCK_IMAGES[3], MOCK_IMAGES[4], MOCK_IMAGES[5]].map((img, idx) => (
                            <div key={idx} className="w-full h-80 rounded-3xl overflow-hidden glass-card p-2 shadow-xl shadow-violet-500/10 hover:shadow-violet-500/30 transition-shadow">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-2xl" />
                            </div>
                        ))}
                    </motion.div>

                    <motion.div style={{ y: y1 }} className="flex flex-col gap-6 pt-48 min-w-[250px] md:min-w-[300px] hidden lg:flex">
                        {[MOCK_IMAGES[2], MOCK_IMAGES[0], MOCK_IMAGES[4]].map((img, idx) => (
                            <div key={idx} className="w-full h-80 rounded-3xl overflow-hidden glass-card p-2 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-shadow">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-2xl" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* NEW: Community Stats Section */}
            <section className="relative z-10 py-24 border-b border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {STATS.map((stat, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center md:items-start"
                            >
                                <span className={`text-4xl md:text-5xl font-syne font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                    {stat.value}
                                </span>
                                <span className="text-gray-500 font-medium text-sm tracking-widest uppercase">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW: Top Creators Marquee */}
            <section className="relative z-10 py-24 bg-transparent overflow-hidden">
                <div className="text-center mb-16">
                     <h2 className="text-3xl font-syne font-bold text-white mb-2">Featured Creators</h2>
                     <p className="text-gray-400">Join thousands of artists making incredible visuals daily</p>
                </div>
                
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <motion.div 
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                        className="flex items-center justify-center gap-6 pr-6 w-max hover:[animation-play-state:paused]"
                    >
                        {[...CREATORS, ...CREATORS].map((creator, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-3xl p-4 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md">
                                <img src={creator.img} className="w-24 h-24 rounded-full object-cover border-2 border-violet-500/50" alt={creator.name} />
                                <span className="font-medium text-white">{creator.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Staggered Section */}
            <section className="relative z-10 bg-transparent py-32 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                     <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-4">Powerful <span className="text-violet-400">Features</span></h2>
                        <p className="text-gray-400 max-w-xl mx-auto text-lg">Everything you need to create, share, and discover modern AI-generated visuals.</p>
                     </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -10 }} className="glass-card p-10 rounded-[2.5rem] relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center mb-8 border border-violet-500/20 shadow-lg shadow-violet-500/20">
                                <Zap className="w-8 h-8 text-violet-400" />
                            </div>
                            <h3 className="text-2xl font-syne font-bold text-white mb-4">Generate Instantly</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">Simply type your prompt and watch as our models bring your imagination to life in seconds.</p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.3 }} whileHover={{ y: -10 }} className="glass-card p-10 rounded-[2.5rem] relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-fuchsia-600/20 flex items-center justify-center mb-8 border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/20">
                                <Users className="w-8 h-8 text-fuchsia-400" />
                            </div>
                            <h3 className="text-2xl font-syne font-bold text-white mb-4">Vibrant Community</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">Follow creators, discover new styles, and build an audience around your vision.</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.5 }} whileHover={{ y: -10 }} className="glass-card p-10 rounded-[2.5rem] relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-8 border border-indigo-500/20 shadow-lg shadow-indigo-500/20">
                                <Layout className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-syne font-bold text-white mb-4">Curate Collections</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">Organize your favorite generations into beautiful public or private moodboards.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* NEW: Testimonials Section */}
            <section className="relative z-10 py-32 bg-transparent overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-20 text-center">Loved by <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">thousands.</span></h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: idx === 0 ? -30 : idx === 2 ? 30 : 0, y: 20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                                className="glass-card p-8 rounded-3xl text-left border-violet-500/10 hover:border-violet-500/30 transition-colors group"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-fuchsia-500/20 group-hover:border-fuchsia-500/50 transition-colors">
                                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{t.name}</h4>
                                        <p className="text-gray-500 text-sm">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic leading-relaxed">"{t.quote}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW: Pricing Section */}
            <section className="relative z-10 py-32 bg-black/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-gray-400">Choose the perfect plan for your creative journey.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 rounded-3xl flex flex-col">
                            <h3 className="text-2xl font-syne font-bold text-white mb-2">Basic</h3>
                            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <ul className="flex flex-col gap-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-fuchsia-500" /> 50 Generations/month</li>
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-fuchsia-500" /> Standard Resolution</li>
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-fuchsia-500" /> Public Gallery</li>
                            </ul>
                            <button className="w-full py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">Current Plan</button>
                        </motion.div>

                        {/* Pro Tier - Highlighted */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card p-8 rounded-3xl flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] border-violet-500/50">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                            <div className="absolute top-4 right-4 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
                            <h3 className="text-2xl font-syne font-bold text-white mb-2 mt-2">Pro Creator</h3>
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-6">$15<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <ul className="flex flex-col gap-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-violet-400" /> Unlimited Generations</li>
                                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-violet-400" /> 4k Resolution Upscaling</li>
                                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-violet-400" /> Private Boards</li>
                                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-violet-400" /> Priority Server Access</li>
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:scale-105 transition-transform shadow-lg">Upgrade Now</button>
                        </motion.div>

                        {/* Studio Tier */}
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 rounded-3xl flex flex-col">
                            <h3 className="text-2xl font-syne font-bold text-white mb-2">Studio</h3>
                            <div className="text-4xl font-bold text-white mb-6">$45<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <ul className="flex flex-col gap-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-fuchsia-500" /> Everything in Pro</li>
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-fuchsia-500" /> API Access</li>
                                <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-fuchsia-500" /> Commercial Usage Rights</li>
                            </ul>
                            <button className="w-full py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">Contact Sales</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* NEW: FAQ Section wrapper */}
            <section className="relative z-10 py-32 border-t border-white/10 bg-transparent">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-syne font-bold text-white mb-4">Frequently Asked Questions</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {FAQS.map((faq, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl overflow-hidden cursor-pointer" onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}>
                                <div className="p-6 flex items-center justify-between">
                                    <h4 className="text-lg font-medium text-white">{faq.q}</h4>
                                    <motion.div animate={{ rotate: faqOpen === idx ? 90 : 0 }} className="text-gray-400">
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.div>
                                </div>
                                <AnimatePresence>
                                    {faqOpen === idx && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-gray-400">
                                            {faq.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW: Newsletter Section */}
            <section className="relative z-10 py-32 bg-transparent">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-[3rem] p-12 text-center relative overflow-hidden border-white/5"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px] translate-y-12 -translate-x-12"></div>
                        
                        <div className="relative z-10">
                            <Sparkles className="w-12 h-12 text-fuchsia-400 mx-auto mb-6" />
                            <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-6">Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Revolution</span></h2>
                            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Subscribe to our newsletter and get early access to new AI models and community insights.</p>
                            
                            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all font-medium"
                                />
                                <button className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                                    Subscribe
                                </button>
                            </form>
                            <p className="mt-6 text-gray-500 text-sm">Join 50,000+ creators. No spam, ever.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer CTA */}
            <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative z-10 border-t border-white/10 bg-black/80 py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-transparent to-transparent pointer-events-none"></div>
                <h2 className="text-3xl md:text-5xl font-syne font-bold text-white mb-6">Ready to shape the future?</h2>
                <p className="text-gray-400 mb-10 max-w-md text-lg">Join Synexis today and start generating incredible art with the power of AI.</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="px-10 py-5 rounded-full bg-white text-black font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow">
                        Create Free Account
                    </Link>
                </motion.div>
                <p className="mt-16 text-gray-600 text-sm">© {new Date().getFullYear()} Synexis. All rights reserved.</p>
            </motion.footer>
        </div>
    );
};

export default Landing;
