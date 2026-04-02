import React from "react";
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  Globe, 
  Users, 
  Zap, 
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-inter animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
            alt="About Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Our Vision</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Redefining the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Digital Standard.</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            We are a collective of enthusiasts dedicated to bringing premium technology and world-class design to your doorstep.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-24 px-4 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Uncompromising Quality",
              desc: "Every product in our catalog undergoes rigorous testing to ensure it meets our high-tier standards.",
              icon: ShieldCheck,
              color: "bg-blue-500/10 text-blue-600"
            },
            {
              title: "Global Reach",
              desc: "With logistics hubs in 12 countries, we ensure your premium essentials reach you wherever you are.",
              icon: Globe,
              color: "bg-emerald-500/10 text-emerald-600"
            },
            {
              title: "Customer First",
              desc: "Our 24/7 support team is always ready to assist you with a human-centric approach.",
              icon: Users,
              color: "bg-violet-500/10 text-violet-600"
            }
          ].map((val, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500">
              <div className={`w-14 h-14 ${val.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <val.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{val.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 relative z-10">
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">The Journey</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              Started as a vision in <br />
              <span className="italic">Hinjewadi, Pune.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Founded by <span className="text-white font-bold">Vaibhav Dhotre</span>, <span className="text-primary font-bold italic text-xl tracking-tighter">V-RETAIL</span> began with a simple mission: to make premium technology and curated lifestyle products accessible to everyone. What started in Lakshmi Chowk has grown into a trusted destination for quality and innovation.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-3xl font-black text-primary">80+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Premium Products</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">16</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Categories</p>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" 
              alt="Office" 
              className="rounded-[2.5rem] relative z-10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700" 
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8">
           Ready to upgrade your <br />
           <span className="text-primary">lifestyle?</span>
        </h2>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200"
        >
          Explore the Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
      
    </div>
  );
};

export default About;
