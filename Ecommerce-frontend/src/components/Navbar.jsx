import { ChevronDown, Search, ShoppingCart, User, MoreVertical, LayoutGrid, Package, Heart } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserData } from "@/context/UserContext";
import { CartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, logoutUser, user } = UserData();
  const { totalItem, setTotalItem } = CartData();
  const { search, setSearch } = ProductData();

  const logoutHandler = () => {
    logoutUser(navigate, setTotalItem);
  };

  return (
    <div className="z-50 sticky top-0 w-full bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100">
      <div className="w-full mx-auto px-6 h-20 flex items-center gap-6">
        {/* Logo Section */}
        <div 
          className="flex flex-col cursor-pointer group shrink-0"
          onClick={() => navigate("/")}
        >
          <span className="font-outfit font-black text-2xl tracking-tighter text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1">
            V<span className="text-primary italic">RETAIL</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-[500px] relative items-center bg-slate-100/50 hover:bg-slate-100 rounded-2xl h-12 overflow-hidden transition-all border border-transparent focus-within:border-primary/30 group">
          <input 
            type="text" 
            placeholder="Explore premium collections..." 
            className="w-full h-full pl-6 pr-12 text-sm text-slate-900 outline-none bg-transparent placeholder:text-slate-400 group-hover:placeholder:text-slate-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter') navigate('/products');
            }}
          />
          <div className="absolute right-2 h-8 w-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 cursor-pointer group-hover:bg-primary group-hover:border-primary transition-all" onClick={() => navigate('/products')}>
             <Search className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto text-slate-600 font-semibold text-[14px]">
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-slate-100 outline-none px-4 py-2.5 rounded-xl transition-all group cursor-pointer border border-transparent">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <User className="w-4 h-4 group-hover:text-primary transition-colors" /> 
              </div>
              <span className="hidden sm:block text-slate-700">
                {isAuth ? `Hi, ${user.name?.split(' ')[0].charAt(0).toUpperCase() + user.name?.split(' ')[0].slice(1)}` : 'Account'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 hidden sm:block opacity-40 group-hover:opacity-100 transition-opacity" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mt-3 rounded-2xl shadow-2xl p-2.5 font-medium overflow-hidden border border-slate-100/50 backdrop-blur-md bg-white/95">
              {!isAuth ? (
                <div className="flex flex-col p-2">
                  <DropdownMenuItem onClick={() => navigate("/login")} className="bg-primary text-white hover:bg-primary/90 rounded-xl text-sm items-center justify-center gap-2 cursor-pointer py-3.5 mb-3 font-bold shadow-lg shadow-primary/20">
                    Sign In to Account
                  </DropdownMenuItem>
                  <p className="text-[11px] text-center text-slate-500 uppercase tracking-wider font-bold">New to V-Retail? <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/register')}>Join Now</span></p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="text-slate-600 hover:bg-slate-50 cursor-pointer py-3 px-4 rounded-xl flex items-center gap-3 transition-colors">
                     <User className="w-4 h-4 text-slate-400" /> My Profile
                  </DropdownMenuItem>
                  {user?.role !== "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/wishlist")} className="text-slate-600 hover:bg-slate-50 cursor-pointer py-3 px-4 rounded-xl flex items-center gap-3 transition-colors">
                       <Heart className="w-4 h-4 text-slate-400" /> My Wishlist
                    </DropdownMenuItem>
                  )}
                  {user?.role !== "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/orders")} className="text-slate-600 hover:bg-slate-50 cursor-pointer py-3 px-4 rounded-xl flex items-center gap-3 transition-colors">
                       <Package className="w-4 h-4 text-slate-400" /> My Orders
                    </DropdownMenuItem>
                  )}
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")} className="text-rose-600 bg-rose-50/50 hover:bg-rose-50 cursor-pointer py-3 px-4 rounded-xl flex items-center gap-3 transition-colors mt-1 font-bold">
                       <LayoutGrid className="w-4 h-4" /> Admin Console
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-2 bg-slate-100" />
                  <DropdownMenuItem onClick={logoutHandler} className="text-red-500 hover:bg-red-50 cursor-pointer py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-colors">
                     Sign Out
                  </DropdownMenuItem>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {user?.role !== "admin" && (
            <div 
              className="flex items-center gap-2 cursor-pointer transition-all group"
              onClick={() => navigate("/cart")}
            >
              <div className="relative p-2.5 bg-slate-100 group-hover:bg-primary/10 rounded-xl transition-all">
                <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                {totalItem > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg shadow-primary/30 border-2 border-white">
                    {totalItem}
                  </span>
                )}
              </div>
              <span className="hidden lg:block font-bold text-slate-700 group-hover:text-primary transition-colors tracking-tight">Cart</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Navbar;
