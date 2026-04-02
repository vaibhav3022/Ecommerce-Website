import { Facebook, Twitter, Youtube, Briefcase, HelpCircle, Gift, Star } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#06061a] text-slate-400 pt-24 pb-12 mt-20 border-t border-primary/10 shadow-2xl shadow-primary/5">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          <div className="flex flex-col gap-6">
              <span className="font-outfit font-black text-2xl tracking-tighter text-white group-hover:text-primary transition-colors flex items-center gap-1">
                V<span className="text-primary italic">RETAIL</span>
              </span>
             <p className="text-sm leading-relaxed max-w-xs">
                Founded by <span className="text-white font-bold">Vaibhav Dhotre</span>. Redefining the digital shopping experience with curated premium collections from Hinjewadi, Pune.
             </p>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/vaibhav-dhotre-96b83a224/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                   <Twitter size={18} />
                </a>
                <a href="https://vaibhavdhotre-portfolio.vercel.app/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer text-xs font-black uppercase tracking-tighter">
                   PORT
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                   <Facebook size={18} />
                </a>
             </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest text-primary/80">Navigation</h3>
            <ul className="flex flex-col gap-3 text-sm font-bold">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Collections</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Order Tracking</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Bag</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest text-primary/80">Support</h3>
            <ul className="flex flex-col gap-3 text-sm font-bold">
              <li className="text-white">Lakshmi Chowk, Hinjewadi,</li>
              <li className="text-white mb-2">Pune-411057</li>
              <li><a href="mailto:vaibhavdhotre682@gmail.com" className="hover:text-primary transition-colors italic truncate block">vaibhavdhotre682@gmail.com</a></li>
              <li className="text-primary font-black">+91 9021850960</li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest text-primary/80">Newsletter</h3>
            <p className="text-sm">Join our elite circle for exclusive early access and luxury updates from V-Retail.</p>
            <div className="relative">
               <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
               />
               <button className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary/90 transition-colors">
                  JOIN
               </button>
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest">
          <p>© {currentYear} V-Retail by Vaibhav Dhotre. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
              <Briefcase size={12}/> Merchant Hub
            </Link>
            <span className="flex items-center gap-2"><Star size={12}/> Featured</span>
            <span className="flex items-center gap-2 border-l border-white/5 pl-8">Secured by Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
