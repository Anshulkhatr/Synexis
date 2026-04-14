import React from 'react';
import { X, Sparkles } from 'lucide-react';

const DetailModal = ({ isOpen, onClose, title, content, icon: Icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-300">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              {Icon ? <Icon className="w-6 h-6 text-red-400" /> : <Sparkles className="w-6 h-6 text-red-400" />}
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-syne font-bold text-white uppercase tracking-tight">{title}</h3>
              <div className="text-[10px] font-mono text-red-500 tracking-[0.3em] uppercase opacity-50">Protocol: Information // Detail</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10 max-h-[70vh] overflow-y-auto">
          <p className="text-gray-400 leading-relaxed font-normal mb-8">
            {content}
          </p>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Status</span>
                <span className="text-xs font-mono text-green-500 uppercase tracking-widest">Authorized</span>
             </div>
             <div className="h-[1px] w-full bg-white/5"></div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Sector</span>
                <span className="text-xs font-mono text-white uppercase tracking-widest">Neural / CORE</span>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-colors cursor-pointer"
          >
            DISMISS
          </button>
          <button 
             onClick={onClose}
             className="px-6 py-2 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
