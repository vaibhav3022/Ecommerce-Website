import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "@/main";
import ProductCard from "@/components/ProductCard";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/wishlist`, {
        headers: { token: Cookies.get("token") },
      });
      setWishlist(data.wishlist);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 pt-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
               </div>
               <span className="text-rose-500 font-black text-[10px] uppercase tracking-[0.3em]">Your Curated Selection</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">My <span className="italic underline decoration-rose-200">Wishlist.</span></h1>
            <p className="text-slate-500 font-medium max-w-md mt-2">A private gallery of the premium essentials you've discovered and saved for later.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-3">Collection Size:</span>
                <span className="text-xl font-black text-slate-900">{wishlist.length} Items</span>
             </div>
          </div>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-12 md:p-24 text-center max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
               <Heart className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Your collection is empty.</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 max-w-lg mx-auto">
              Start exploring our premium collections and save the ones that catch your eye. Your future favorites are waiting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button 
                 size="lg" 
                 className="rounded-full px-10 h-14 font-bold shadow-xl shadow-primary/20 flex gap-2"
                 onClick={() => navigate('/products')}
               >
                 Discover Products <ArrowRight className="w-4 h-4" />
               </Button>
               <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-10 h-14 font-bold border-2"
                  onClick={() => navigate('/')}
               >
                 Return Home
               </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
