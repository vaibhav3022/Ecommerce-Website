import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "@/context/UserContext";
import axios from "axios";
import { server } from "@/main";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const ProductCard = ({ product, latest }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuth) return toast.error("Please login to save favorites");
    
    setWishlistLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/wishlist/${product._id}`,
        {},
        { headers: { token: Cookies.get("token") } }
      );
      toast.success(data.message);
      setWishlistLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setWishlistLoading(false);
    }
  };

  // Fake a discount for aesthetics
  const mrp = Math.floor(product.price * 1.35); // 35% more
  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);

  return (
    <div className="group h-full cursor-pointer relative">
      {product && (
        <div 
          onClick={() => navigate(`/product/${product._id}`)}
          className="relative flex flex-col h-full bg-white rounded-[1.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 overflow-hidden"
        >
          {/* Wishlist Button */}
          {user?.role !== "admin" && (
            <button 
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all shadow-sm border border-slate-100/50 hover:scale-110 active:scale-95 ${
                user?.wishlist?.includes(product._id) ? "text-rose-500 fill-rose-500" : "text-slate-300 hover:text-rose-500"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={user?.wishlist?.includes(product._id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${wishlistLoading ? "animate-pulse" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-50 flex items-center justify-center p-4">
            <img
              src={product.images[0]?.url}
              alt={product.title}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute bottom-4 left-4 flex flex-col gap-1">
              {latest === "yes" && (
                <div className="bg-primary/95 backdrop-blur-sm text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-primary/20">
                  NEW SEASON
                </div>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <div className="bg-rose-500 text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/20">
                  LOW STOCK
                </div>
              )}
            </div>
          </div>

          {/* Content Details */}
          <div className="flex flex-col flex-1 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Selection</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-slate-900 italic">4.8</span>
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors leading-tight">
              {product.title}
            </h3>
            
            {/* Pricing Section */}
            <div className="flex flex-col mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-bold text-slate-400 line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                  Save {discountPercent}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 italic">Free Shipping</span>
              </div>
            </div>

            {/* Hidden Action Button (on hover) */}
            <div className="mt-6 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                 View Details 
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
               </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
