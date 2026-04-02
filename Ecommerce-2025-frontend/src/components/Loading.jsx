import { ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";

const Loading = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Curating Excellence",
    "Preparing Your Gallery",
    "Tailoring Selection",
    "Fetching Masterpieces",
    "Syncing Inventory",
    "V-Retail Exclusive"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative">
        {/* Modern Spinner Base */}
        <div className="w-24 h-24 rounded-full border-[1.5px] border-slate-100 border-t-primary animate-spin shadow-inner relative z-10" />
        
        {/* Brand Icon Center */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
           <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-primary/10 border border-slate-50 flex items-center justify-center text-primary animate-bounce duration-[2000ms]">
              <ShoppingBag className="w-6 h-6" />
           </div>
        </div>

        {/* Outer Orbital Pulse */}
        <div className="absolute inset-[-10px] rounded-full border border-dashed border-primary/20 animate-[spin_8s_linear_infinite]" />
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-4 text-center px-6">
         <div className="flex flex-col items-center">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none mb-3">Please wait</span>
           <h2 className="text-xl font-black text-slate-900 tracking-tighter italic animate-in fade-in slide-in-from-bottom-2 duration-700 key={messageIndex}">
             {messages[messageIndex]}<span className="text-primary not-italic">.</span>
           </h2>
         </div>
         
         {/* Animated Progress bar */}
         <div className="w-48 h-1 bg-slate-50 rounded-full overflow-hidden relative border border-slate-100 shadow-sm">
            <div className="absolute inset-0 bg-primary/10" />
            <div className="h-full bg-primary w-1/3 rounded-full animate-[loading_2s_infinite_ease-in-out]" />
         </div>

         <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">V-Retail Premium Experience</p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
