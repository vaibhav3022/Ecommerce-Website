import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartData } from "@/context/CartContext";
import { ShoppingCart, Trash } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, totalItem, subTotal, updateCart, removeFromCart } = CartData();
  const navigate = useNavigate();

  const updateCartHander = async (action, id) => {
    await updateCart(action, id);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-16 md:py-24 font-inter">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Your Selection</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Shopping <span className="italic">Bag.</span></h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
              {totalItem} distinct masterpieces curated
            </p>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={() => navigate("/products")} 
              className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Continue Exploring
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 md:p-32 border border-slate-100 shadow-2xl shadow-slate-200/50 text-center animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-inner">
               🕊️
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic">Empty Horizons.</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-12 text-lg font-medium leading-relaxed">
              Your bag is currently awaiting its first premium addition. Let's find something extraordinary.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/products")}
              className="rounded-2xl px-12 h-16 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all hover:translate-y-[-2px]"
            >
              Explore Collection
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                {cart.map((e, index) => (
                  <React.Fragment key={e._id}>
                    <div className="p-8 md:p-10 flex flex-col sm:flex-row items-center gap-10 group">
                      {/* Product Image */}
                      <div 
                        className="w-40 h-40 bg-slate-50 rounded-[2rem] overflow-hidden flex-shrink-0 cursor-pointer border border-slate-100 transition-all group-hover:shadow-xl group-hover:scale-105"
                        onClick={() => navigate(`/product/${e.product._id}`)}
                      >
                        <img
                          src={e.product.images[0].url}
                          alt={e.product.title}
                          className="w-full h-full object-contain mix-blend-multiply p-4"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {e.product.category}
                            </span>
                            <h2 
                              className="text-2xl font-black text-slate-900 tracking-tight cursor-pointer hover:text-primary transition-colors pr-2 line-clamp-1"
                              onClick={() => navigate(`/product/${e.product._id}`)}
                            >
                              {e.product.title}
                            </h2>
                          </div>
                          <button
                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            onClick={() => removeFromCart(e._id)}
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-6">
                          <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                            <button
                              className="w-10 h-10 rounded-xl bg-white text-slate-900 border border-slate-100 flex items-center justify-center font-black hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => updateCartHander("dec", e._id)}
                              disabled={e.quauntity <= 1}
                            >
                              -
                            </button>
                            <span className="w-12 text-center text-sm font-black text-slate-900">{e.quauntity}</span>
                            <button
                              className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black hover:bg-slate-800 transition-colors"
                              onClick={() => updateCartHander("inc", e._id)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Value Amount</p>
                            <p className="text-2xl font-black text-slate-900">₹{(e.product.price * e.quauntity).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < cart.length - 1 && <div className="h-px bg-slate-50 mx-10" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-32">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-300">
                <h2 className="text-2xl font-black tracking-tight mb-10 italic">Summary.</h2>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Inventory Subtotal</span>
                    <span>₹{subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-400">Logistics</span>
                    <span className="text-emerald-400 uppercase tracking-[0.2em] text-[10px] pt-1">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-6">
                    <span className="text-slate-400">Total Selection</span>
                    <span className="text-3xl font-black text-primary italic">₹{subTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-18 py-8 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 transition-all hover:translate-y-[-2px] shadow-xl shadow-primary/20"
                  onClick={() => navigate("/checkout")}
                  disabled={cart.length === 0}
                >
                  Proceed to Payment
                </Button>
                
                <div className="mt-8 flex items-center justify-center gap-4 text-slate-500">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">End-to-End Encryption</span>
                </div>
              </div>

              {/* Promo Code Card */}
              <div className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between gap-4 group cursor-pointer hover:border-primary/30 transition-all">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sm shadow-sm transition-transform group-hover:rotate-12">✨</div>
                   <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Apply Special Code</span>
                 </div>
                 <span className="text-primary font-black text-[10px] uppercase tracking-widest pt-1">Apply</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
