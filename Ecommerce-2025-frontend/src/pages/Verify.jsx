import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartData } from "@/context/CartContext";
import { UserData } from "@/context/UserContext";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { btnLoading, loginUser, verifyUser } = UserData();
  const { fetchCart } = CartData();

  const submitHandler = (e) => {
    e.preventDefault();
    verifyUser(Number(otp), navigate, fetchCart);
  };

  const [timer, setTimer] = useState(90);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    const email = localStorage.getItem("email");
    await loginUser(email, navigate);
    setTimer(90);
    setCanResend(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-[450px] rounded-[2.5rem] border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <CardHeader className="pt-12 pb-8 px-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
            🛡️
          </div>
          <CardTitle className="text-3xl font-black tracking-tight mb-3">Verify Access</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            We've sent a 6-digit access code to your registered email address. Please enter it below to securely log in.
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent className="px-10 space-y-6">
            <div className="space-y-3 text-center">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">One-Time Password</Label>
              <Input
                type="number"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="h-16 rounded-2xl border-border px-6 text-center text-3xl font-black tracking-[0.3em] focus-visible:ring-primary shadow-sm transition-all"
              />
              <p className="text-xs text-muted-foreground font-medium pt-2">
                Check your spam folder if you can't find it in your inbox.
              </p>
            </div>
          </CardContent>

          <CardFooter className="px-10 pb-12 pt-6 flex flex-col gap-4">
            <Button 
              type="submit" 
              disabled={btnLoading || otp.length < 4} 
              className="w-full h-14 rounded-full font-black text-lg shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              {btnLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-5 w-5" /> Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </Button>
            
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {canResend ? (
                  "Didn't receive the code?"
                ) : (
                  <span className="flex items-center gap-2">
                    Resend available in <span className="text-primary font-bold">{formatTime(timer)}</span>
                  </span>
                )}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={!canResend}
                className="h-auto p-0 font-bold text-primary hover:bg-transparent hover:underline transition-all"
              >
                Resend Code Now
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Verify;
