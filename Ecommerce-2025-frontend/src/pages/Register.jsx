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
import { UserData } from "@/context/UserContext";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { loginUser, btnLoading } = UserData();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, navigate);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-[450px] rounded-[2.5rem] border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <CardHeader className="pt-12 pb-8 px-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
            ✨
          </div>
          <CardTitle className="text-3xl font-black tracking-tight mb-3">Join V-Retail</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Create an account to start shopping and tracking your orders seamlessly.
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent className="px-10 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email or Mobile Number</Label>
              <Input
                type="text"
                placeholder="Email or 10-digit number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-2xl border-border px-6 text-lg focus-visible:ring-primary shadow-sm transition-all"
              />
              <p className="text-[11px] text-muted-foreground font-medium ml-1">
                We'll send a 6-digit access code to verify your identity.
              </p>
            </div>
          </CardContent>

          <CardFooter className="px-10 pb-12 pt-6 flex flex-col gap-6">
            <Button 
              type="submit" 
              disabled={btnLoading || !email} 
              className="w-full h-14 rounded-full font-black text-lg shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              {btnLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-5 w-5" /> Sending Code...
                </div>
              ) : (
                "Get Access Code"
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Already have an account?</p>
              <span 
                className="text-sm font-black text-primary cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign In Instead
              </span>
            </div>

            <p className="text-xs text-center text-muted-foreground font-medium px-6 leading-relaxed">
              By joining, you agree to our <span className="text-foreground font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-foreground font-bold cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
