import { Button } from "@/components/ui/button";
import { CartData } from "@/context/CartContext";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { fetchCart } = CartData();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Session Id missing");
        return navigate("/cart");
      }

      if (paymentVerified) return;

      setLoading(true);

      try {
        const { data } = await axios.post(
          `${server}/api/order/verify/payment`,
          { sessionId },
          {
            headers: {
              token: Cookies.get("token"),
            },
          }
        );

        if (data.success) {
          toast.success(data.message || "Order Placed successfully");
          setPaymentVerified(true);
          fetchCart();
          setLoading(false);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Payment verification failed. Please contact support.";
        toast.error(errorMsg);
        console.error("Verification Error:", error);
        
        // If it's a 400 error (like empty cart), it might be a race condition or already processed
        // We'll give it 3 seconds before redirecting
        setTimeout(() => {
            navigate("/cart");
        }, 3000);
      }
    };

    if (sessionId && !paymentVerified) {
      verifyPayment();
    }
  }, [sessionId, paymentVerified, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      {loading ? (
        <div className="bg-card p-12 rounded-[2.5rem] border border-border shadow-2xl max-w-lg w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
            <div className="absolute inset-4 rounded-full bg-primary/20 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-4">Securing Your Order</h1>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
            Please keep this window open while we finalize your payment and secure your premium items. This won't take long.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60">
             <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
             <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
             <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      ) : (
        <div className="max-w-xl w-full bg-card shadow-2xl rounded-[3rem] p-12 md:p-16 text-center border border-border animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl shadow-emerald-500/20 text-white">
              ✓
            </div>
            
            <h1 className="text-4xl font-black tracking-tight mb-4 text-foreground">
              Order Confirmed
            </h1>

            <p className="text-muted-foreground text-lg mb-12 font-medium leading-relaxed">
              Thank you for choosing <span className="text-primary font-bold italic">Aura</span>. Your order has been successfully placed and is now being prepared for shipping.
            </p>

            <div className="space-y-4">
              <Button 
                onClick={() => navigate("/orders")}
                className="w-full h-14 rounded-full font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Track My Delivery
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full h-12 rounded-full font-bold text-muted-foreground hover:text-foreground"
              >
                Return to Store
              </Button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border/50">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  A Confirmation Email has been sent to your inbox
               </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default OrderProcessing;
