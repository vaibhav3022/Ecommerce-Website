import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartData } from "@/context/CartContext";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const Payment = () => {
  const { cart, subTotal, fetchCart } = CartData();
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/${id}`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setAddress(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, [id]);

  const paymentHandler = async () => {
    if (method === "cod") {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/api/order/new/cod`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            headers: {
              token: Cookies.get("token"),
            },
          }
        );

        setLoading(false);
        toast.success(data.message);
        fetchCart();
        navigate("/orders");
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message);
      }
    }

    if (method === "online") {
      const stripePromise = loadStripe(
        "pk_test_51QZEIUFMvOph2hyWyfOWX8VP9LAHjNTzzkExAHOzCqAR7KzHmcU5zufHu51eSnUbxRw49XmOme3vdTmeho2kE9fv00h2fOMgnC"
      );

      try {
        setLoading(true);
        const stripe = await stripePromise;

        const { data } = await axios.post(
          `${server}/api/order/new/online`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            headers: {
              token: Cookies.get("token"),
            },
          }
        );

        if (data.url) {
          window.location.href = data.url;
          setLoading(false);
        } else {
          toast.error("Failed to created Payment Session");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Payment Failed. Please Try again");
        setLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen bg-muted/30 py-12 md:py-20">
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Complete Your Order</h2>
            <p className="text-muted-foreground font-medium">Finalize your premium selection and choose your preferred payment method</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Summary and Details */}
            <div className="lg:col-span-12 space-y-8">
              {/* Products Summary */}
              <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                    📦
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Order Items</h3>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                  {cart &&
                    cart.map((e, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-6 p-4 rounded-2xl bg-muted/30 border border-border/50 group transition-all hover:bg-muted/50"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-border bg-white italic flex items-center justify-center">
                          <img
                            src={e.product.images[0].url}
                            alt={e.product.title}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                            {e.product.title}
                          </h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            ₹{e.product.price.toLocaleString()} × {e.quauntity}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-black text-lg">
                            ₹{(e.product.price * e.quauntity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t flex items-center justify-between">
                   <span className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs">Total Payable</span>
                   <span className="text-3xl font-black text-primary">₹{subTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping & Payment Method */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Shipping Details */}
                {address && (
                  <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                        📍
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Shipping To</h3>
                    </div>
                    
                    <div className="space-y-4 flex-1 text-center md:text-left">
                       <p className="text-lg font-bold leading-tight">{address.address}</p>
                       <div className="flex items-center gap-2 justify-center md:justify-start">
                         <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone</span>
                         <span className="font-bold">{address.phone}</span>
                       </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => navigate("/checkout")} className="mt-6 rounded-full text-xs font-bold text-primary hover:bg-primary/5">
                      Change Address
                    </Button>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                      💳
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Payment Method</h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    {[
                      { id: "cod", label: "Cash on Delivery", icon: "💵" },
                      { id: "online", label: "Stripe Secure Payment", icon: "🌍" },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setMethod(opt.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          method === opt.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border bg-muted/20 hover:border-border/80 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-lg">{opt.icon}</span>
                          <span className="font-bold">{opt.label}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === opt.id ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                           {method === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="pt-4">
                <Button
                  className="w-full h-16 rounded-full font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                  onClick={paymentHandler}
                  disabled={!method || !address || loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loading className="h-5 w-5" /> Processing...
                    </div>
                  ) : (
                    `Pay ₹${subTotal.toLocaleString()} Now`
                  )}
                </Button>
                <div className="mt-6 flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-2">
                    🔒 SSL Encrypted & Secure Connection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
