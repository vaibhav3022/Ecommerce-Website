import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Loading from "../Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, Search, ArrowRight, Clock, Truck, CheckCircle2 } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: { token: Cookies.get("token") },
      });
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/order/${orderId}`,
        { status },
        { headers: { token: Cookies.get("token") } }
      );
      toast.success(data.message);
      fetchOrders();
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.user?.email?.toLowerCase().includes(search.toLocaleLowerCase()) ||
      order._id?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "Pending": return <Clock className="w-3 h-3 mr-1" />;
      case "Shipped": return <Truck className="w-3 h-3 mr-1" />;
      case "Delivered": return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-3 py-1 font-bold uppercase tracking-widest text-[10px]"><StatusIcon status={status} /> Pending</Badge>;
      case "Shipped":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 font-bold uppercase tracking-widest text-[10px]"><StatusIcon status={status} /> Shipped</Badge>;
      case "Delivered":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 font-bold uppercase tracking-widest text-[10px]"><StatusIcon status={status} /> Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Order Management</h1>
          <p className="text-muted-foreground text-sm font-medium">View, process, and update customer orders across the platform.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by exact email or Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 h-12 rounded-full bg-card border-border shadow-sm focus-visible:ring-primary"
          />
        </div>
        <div className="text-sm font-bold text-muted-foreground">
          Showing <span className="text-foreground">{filteredOrders.length}</span> results
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : filteredOrders.length > 0 ? (
        <Card className="rounded-[2rem] border-border shadow-2xl overflow-hidden glass">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest px-6 h-14">Order ID</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest px-6">Customer Email</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest px-6">Total Amount</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest px-6">Current Status</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest px-6">Date Placed</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id} className="border-border hover:bg-muted/20 transition-colors group">
                    <TableCell className="px-6 font-mono text-xs text-muted-foreground">
                      <Link to={`/order/${order._id}`} className="hover:text-primary transition-colors flex items-center gap-1 group-hover:underline">
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell className="px-6 font-medium text-sm">
                      {order.user?.email || "Guest"}
                    </TableCell>
                    <TableCell className="px-6 font-bold text-sm">
                      ₹{order.subTotal?.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="px-6 text-xs text-muted-foreground font-medium">
                      {moment(order.createdAt).format("MMM DD, YYYY")}
                      <span className="block text-[10px] opacity-70">{moment(order.createdAt).format("hh:mm A")}</span>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {order.status === "Pending" && (
                          <Button 
                            onClick={() => updateOrderStatus(order._id, "Delivered")}
                            variant="outline" 
                            size="sm" 
                            className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500 hover:text-white rounded-full h-8 text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Quick Deliver
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-muted">
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-2xl border-border">
                            <DropdownMenuItem onClick={() => updateOrderStatus(order._id, "Pending")} className="text-xs font-bold cursor-pointer text-yellow-500">
                              <Clock className="w-3 h-3 mr-2" /> Set Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order._id, "Shipped")} className="text-xs font-bold cursor-pointer text-blue-500">
                              <Truck className="w-3 h-3 mr-2" /> Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order._id, "Delivered")} className="text-xs font-bold cursor-pointer text-green-500">
                              <CheckCircle2 className="w-3 h-3 mr-2" /> Mark Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all" asChild>
                           <Link to={`/order/${order._id}`}>
                             <ArrowRight className="w-4 h-4" />
                           </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-[2rem] border border-border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">There are no orders matching your current search parameters. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
