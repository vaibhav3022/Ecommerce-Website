import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  IndianRupee, 
  ArrowUpRight, 
  TrendingUp,
  Activity,
  ArrowRight
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import moment from "moment";
import { Badge } from "../ui/badge";

const HomePage = ({ setSelectedPage }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: { token: Cookies.get("token") },
      });
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  const chartData = [
    { name: "COD", value: stats?.cod || 0, color: "#facc15" },
    { name: "Online", value: stats?.online || 0, color: "#3b82f6" },
  ];

  const COLORS = ["#facc15", "#3b82f6"];

  const StatCard = ({ title, value, icon: Icon, description, trend }) => (
    <Card className="rounded-[2rem] border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-tighter">
              <TrendingUp className="w-3 h-3" /> {trend}
            </div>
          )}
        </div>
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black tracking-tight">{value}</p>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium mt-2">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats?.totalRevenue?.toLocaleString()}`} 
          icon={IndianRupee} 
          description="Gross lifetime earnings"
          trend="+12.5%"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders} 
          icon={ShoppingCart} 
          description="Volume across all statuses"
          trend="+8.2%"
        />
        <StatCard 
          title="Active Users" 
          value={stats?.totalUsers} 
          icon={Users} 
          description="Registered customer base"
          trend="+5.4%"
        />
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts} 
          icon={Package} 
          description="Items managed in 16 categories"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Section */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-border shadow-2xl overflow-hidden glass">
          <CardHeader className="p-8 border-b border-border/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Last 5 store transactions</p>
            </div>
            <Activity className="text-primary w-6 h-6 opacity-20" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-5 font-mono text-xs text-muted-foreground">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-8 py-5">
                         <p className="text-sm font-bold truncate max-w-[150px]">{order.user?.name || "Guest"}</p>
                         <p className="text-[10px] text-muted-foreground">{moment(order.createdAt).fromNow()}</p>
                      </td>
                      <td className="px-8 py-5 font-black text-sm">₹{order.subTotal?.toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                          order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 text-center border-t border-border/50">
                <button 
                 onClick={() => setSelectedPage("orders")}
                 className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center justify-center gap-2 w-full"
                >
                  View All Transactions <ArrowRight className="w-3 h-3" />
                </button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Distribution Chart */}
        <Card className="rounded-[2.5rem] border-border shadow-2xl overflow-hidden glass">
           <CardHeader className="p-8 border-b border-border/50">
             <CardTitle className="text-2xl font-black tracking-tight text-center">Revenue Mix</CardTitle>
             <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest text-center mt-1">Payment Method Split</p>
           </CardHeader>
           <CardContent className="p-8 h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">COD ({stats?.cod})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Online ({stats?.online})</span>
                </div>
             </div>
           </CardContent>
        </Card>

      </div>

      {/* Top Products Comparison */}
      <Card className="rounded-[2.5rem] border-border shadow-2xl overflow-hidden glass p-10">
        <CardHeader className="px-0 pt-0 mb-10 border-b border-border/50 pb-6">
           <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Catalog Performance</CardTitle>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Units sold per top-performing product</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-primary/30" />
           </div>
        </CardHeader>
        <CardContent className="p-0 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.data?.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="sold" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};

export default HomePage;
