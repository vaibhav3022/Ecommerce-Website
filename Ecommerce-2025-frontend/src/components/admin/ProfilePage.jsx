import React, { useState } from "react";
import { UserData } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { User, Mail, Phone, Shield, Camera, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartData } from "@/context/CartContext";

const ProfilePage = () => {
  const { user, updateProfile, logoutUser } = UserData();
  const { setTotalItem } = CartData();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(name, gender, phone);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutUser(navigate, setTotalItem);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Admin <span className="text-primary not-italic">Identity.</span></h2>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <Shield className="w-3 h-3 text-primary" /> Secure Administrator Profile
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="rounded-2xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold transition-all gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden text-center p-8">
             <div className="relative inline-block mx-auto mb-6 group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-4xl font-black text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500 border-2 border-dashed border-slate-100">
                   {user?.name?.charAt(0) || "V"}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-slate-50">
                   <Camera className="w-4 h-4" />
                </button>
             </div>
             <h3 className="text-xl font-black text-slate-900">{user?.name || "Administrator"}</h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">V-Retail Staff</p>
             
             <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-3 text-left p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                   <Mail className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                   <div className="flex-1 truncate">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter leading-none mb-1">Email address</p>
                      <p className="text-xs font-bold text-slate-600 truncate">{user?.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 text-left p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                   <Phone className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                   <div className="flex-1 truncate">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter leading-none mb-1">Contact Phone</p>
                      <p className="text-xs font-bold text-slate-600 truncate">{user?.phone || "Not provided"}</p>
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <Card className="md:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl p-10">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Information</h3>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="rounded-2xl h-10 px-6 font-bold text-xs uppercase tracking-widest">
                  Edit Profile
                </Button>
              )}
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Display Name</label>
                    <div className="relative">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <input 
                         type="text" 
                         disabled={!isEditing}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 disabled:opacity-50"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         placeholder="Your name"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                    <div className="relative">
                       <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <input 
                         type="number" 
                         disabled={!isEditing}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 disabled:opacity-50"
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         placeholder="10 digit mobile"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Gender</label>
                    <select 
                      disabled={!isEditing}
                      className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 disabled:opacity-50 appearance-none"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                       <option value="">Select Gender</option>
                       <option value="Male">Male</option>
                       <option value="Female">Female</option>
                       <option value="Other">Other</option>
                    </select>
                 </div>
              </div>

              {isEditing && (
                <div className="flex items-center gap-4 pt-6">
                   <Button type="submit" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
                      Save Profile Changes
                   </Button>
                   <Button variant="ghost" onClick={() => setIsEditing(false)} className="h-14 px-8 rounded-2xl font-bold text-slate-400 hover:bg-slate-50">
                      Cancel
                   </Button>
                </div>
              )}
           </form>

           <div className="mt-12 p-6 bg-amber-50/50 rounded-3xl border border-amber-100 flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                 <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1 pt-1">
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-800">Security Tip</h4>
                 <p className="text-[11px] text-amber-700/70 font-medium leading-relaxed">
                   As an administrator, your performance is public to the team. Ensure your display name reflects your official identity for accurate reporting in analytical sheets.
                 </p>
              </div>
           </div>
        </Card>
      </div>

    </div>
  );
};

export default ProfilePage;
