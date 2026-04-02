import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/context/UserContext";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = UserData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          headers: {
            token: Cookies.get("token"),
          },
        });
        setOrder(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive text-3xl mb-6">
          ❌
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find any order with that identifier.</p>
        <Button onClick={() => navigate("/products")} className="rounded-full px-8">Shop Now</Button>
      </div>
    );
  }

  const isOwnerOrAdmin = user?._id === order?.user?._id || user?.role === "admin";

  return (
    <div className="min-h-screen bg-muted/30 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {!isOwnerOrAdmin ? (
          <div className="bg-card rounded-[2.5rem] p-12 text-center border border-border shadow-2xl">
             <h2 className="text-2xl font-black text-destructive mb-4">Access Restricted</h2>
             <p className="text-muted-foreground mb-8">This order record does not belong to your account.</p>
             <Link to="/">
               <Button variant="outline" className="rounded-full px-8">Return Home</Button>
             </Link>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Invoice Meta */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3">
                  Receipt & Tracking
                </span>
                <h1 className="text-4xl font-black tracking-tight mb-1">Order Details</h1>
                <p className="text-muted-foreground font-mono text-sm opacity-60">ID: {order._id.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-3">
                 <Button variant="outline" onClick={() => window.print()} className="rounded-full font-bold gap-2 print:hidden backdrop-blur-sm bg-background/50">
                   🖨️ Print Invoice
                 </Button>
                 <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                    order.status === "Pending" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                 }`}>
                   {order.status}
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Summary Card */}
              <Card className="lg:col-span-2 rounded-[2rem] border-border shadow-xl overflow-hidden print:shadow-none">
                <CardHeader className="p-8 border-b border-border/50 bg-muted/10">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-base">📊</span>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Date</p>
                      <p className="font-bold">{new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: 'medium' })}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</p>
                      <p className="font-bold uppercase italic">{order.method}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Units</p>
                      <p className="font-bold">{order.items.length} Units</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paid Status</p>
                      <p className="font-bold text-sm">{order.paidAt ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Due upon delivery"}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subtotal Amount</p>
                       <p className="text-4xl font-black text-primary">₹{order.subTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Card */}
              <Card className="rounded-[2rem] border-border shadow-xl bg-primary text-primary-foreground overflow-hidden print:text-black print:bg-white print:border print:shadow-none">
                <CardHeader className="p-8 border-b border-white/10">
                   <CardTitle className="text-xl font-black flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-base">📍</span>
                     Delivery Address
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Recipient</p>
                     <p className="font-bold text-lg">{order.user?.email || "Guest User"}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Phone Contact</p>
                     <p className="font-black text-lg">{order.phone}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Street Address</p>
                     <p className="font-bold leading-relaxed">{order.address}</p>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Items List */}
            <div className="pt-8">
               <h2 className="text-2xl font-black tracking-tight mb-8 px-2 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-base">📦</span>
                  Purchased Items
               </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {order?.items?.map((e, i) => {
                    if (!e.product) {
                      return (
                        <Card key={i} className="group rounded-3xl border-border border-dashed p-8 flex flex-col items-center justify-center text-center opacity-50">
                          <p className="text-2xl mb-2">🚫</p>
                          <p className="font-bold text-sm">Product no longer available</p>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Quantity ordered: {e.quantity}</p>
                        </Card>
                      );
                    }
                    return (
                      <Card key={i} className="group rounded-3xl border-border overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <Link to={`/product/${e.product._id}`} className="block aspect-[4/3] bg-muted overflow-hidden relative">
                           <img
                             src={e.product.images?.[0]?.url || "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=800"}
                             alt={e.product.title}
                             className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                           />
                           <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black shadow-sm">
                              QTY: {e.quantity}
                           </div>
                        </Link>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-base truncate mb-1 group-hover:text-primary transition-colors">{e.product.title}</h3>
                          <div className="flex justify-between items-end">
                             <p className="text-xs text-muted-foreground font-medium">{e.product.category}</p>
                             <p className="font-black text-lg">₹{e.product.price?.toLocaleString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
            </div>

            <div className="flex justify-center print:hidden pt-12">
               <Button variant="ghost" onClick={() => navigate("/orders")} className="rounded-full font-bold text-muted-foreground hover:text-foreground">
                 ← Back to My Orders
               </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
