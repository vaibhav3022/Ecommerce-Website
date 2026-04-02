import HomePage from "@/components/admin/HomePage";
import InfoPage from "@/components/admin/InfoPage";
import InventoryPage from "@/components/admin/InventoryPage";
import OrdersPage from "@/components/admin/OrdersPage";
import UsersPage from "@/components/admin/UsersPage";
import CategoryPage from "@/components/admin/CategoryPage";
import ProfilePage from "@/components/admin/ProfilePage";
import { Button } from "@/components/ui/button";
import { UserData } from "@/context/UserContext";
import { Home, Info, MenuIcon, ShoppingBag, X, Package, Users, LayoutGrid } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const { user } = UserData();

  if (user.role !== "admin") return navigate("/");

  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage setSelectedPage={setSelectedPage} />;

      case "inventory":
        return <InventoryPage />;

      case "orders":
        return <OrdersPage />;

      case "info":
        return <InfoPage />;

      case "users":
        return <UsersPage />;

      case "categories":
        return <CategoryPage />;

      case "profile":
        return <ProfilePage />;

      default:
        return <HomePage />;
    }
  };
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30 font-inter">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full w-72 glass border-r z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-20 flex-shrink-0 flex items-center px-8 border-b">
            <h1 className="text-xl font-black tracking-tight uppercase">
              V<span className="text-primary italic">RETAIL</span>
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
            {[
              { id: "home", label: "Dashboard", icon: Home },
              { id: "inventory", label: "Inventory", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "users", label: "Users", icon: Users },
              { id: "categories", label: "Categories", icon: LayoutGrid },
              { id: "info", label: "Analytics", icon: Info },
            ].map((item) => (
              <Button
                key={item.id}
                variant={selectedPage === item.id ? "secondary" : "ghost"}
                onClick={() => {
                  setSelectedPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 h-12 rounded-xl text-sm font-bold transition-all ${
                  selectedPage === item.id 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-50">
            <div 
              onClick={() => setSelectedPage("profile")}
              className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all hover:bg-slate-50 group border border-transparent ${selectedPage === 'profile' ? 'bg-primary/5 border-primary/20 shadow-sm' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform ${selectedPage === 'profile' ? 'bg-primary text-white' : ''}`}>
                {user?.name?.charAt(0) || "V"}
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-black truncate text-slate-900">{user?.name || "Vaibhav"}</p>
                <p className="text-[10px] text-primary/60 uppercase font-black tracking-widest leading-tight">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 glass border-b px-6 flex-shrink-0 flex items-center justify-between sticky top-0 z-40">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {selectedPage === "home" ? "Performance Overview" : 
               selectedPage === "inventory" ? "Catalog Management" : 
               selectedPage === "orders" ? "Order Pipeline" : 
               selectedPage === "profile" ? "Staff Identity" : 
               "Analytical Reports"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" onClick={() => navigate("/")} className="rounded-full font-bold text-xs uppercase tracking-wider">
               View Storefront
             </Button>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
