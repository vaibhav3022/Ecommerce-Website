import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const Hero = ({ navigate }) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto mt-8 px-4 md:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 h-[500px] flex items-center group">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/premium_shopping_hero_1775035304651.png" 
            alt="Premium Shopping" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full md:w-3/5 px-8 md:px-16 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Limited Edition Release</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-outfit font-black text-white leading-[1.1] tracking-tighter">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Digital Lifestyle.</span>
          </h1>
          
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Discover a curated collection of world-class electronics and premium essentials designed for the modern era.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => navigate("/products")}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-primary/40 transition-all cursor-pointer"
            >
              Shop Collection
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-violet-500/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default Hero;
