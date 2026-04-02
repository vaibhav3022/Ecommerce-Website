import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/all`, {
          headers: {
            token: Cookies.get("token"),
          },
        });
        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-16 md:py-24 font-inter">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-left">
          <div className="flex flex-col gap-2">
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Purchase History</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Your <span className="italic">Treasures.</span></h1>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Managing {orders.length} premium acquisitions
            </p>
          </div>
          <button 
            onClick={() => navigate("/products")} 
            className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Gallery
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 md:p-32 border border-slate-100 shadow-2xl shadow-slate-200/50 text-center animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-inner">
               📦
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic">No Acquisitions.</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-12 text-lg font-medium leading-relaxed">
              Your collection is currently empty. Explore our world-class products to begin your journey.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/products")}
              className="rounded-2xl px-12 h-16 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all hover:translate-y-[-2px]"
            >
              Start Discovering
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 transition-all duration-500 p-2"
              >
                <div className="p-8 pb-0">
                   <div className="flex justify-between items-center mb-6">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Order ID</span>
                        <h3 className="font-bold font-mono text-[11px] text-slate-500">#{order._id.toUpperCase()}</h3>
                     </div>
                     <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        order.status === "Pending" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                     }`}>
                       {order.status}
                     </div>
                   </div>
                </div>

                <div className="px-8 pb-8 space-y-8 mt-6">
                  <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Items</p>
                      <p className="font-black text-slate-900 text-xl tracking-tighter">{order.items.length} Units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total</p>
                      <p className="font-black text-2xl text-primary italic leading-none pt-1">₹{order.subTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Acquired On</p>
                        <p className="font-bold text-slate-700 text-xs">{new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                        })}</p>
                    </div>
                    <button
                        className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg group/btn"
                        onClick={() => navigate(`/order/${order._id}`)}
                    >
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
