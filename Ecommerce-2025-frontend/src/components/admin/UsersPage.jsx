import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search, UserCheck, UserPlus, Mail, Calendar, Shield } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import moment from "moment";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: { token: Cookies.get("token") },
      });
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const updateRole = async (id) => {
    if (!window.confirm("Are you sure you want to change this user's role?")) return;
    try {
      const { data } = await axios.put(`${server}/api/user/${id}`, {}, {
        headers: { token: Cookies.get("token") },
      });
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">User Directory</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Manage platform access and permissions</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Level</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{u.name}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium lowercase">
                              <Mail className="w-3 h-3" /> {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 italic">
                          <Calendar className="w-3.5 h-3.5 opacity-40" />
                          {moment(u.createdAt).format("MMM DD, YYYY")}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge 
                          variant="outline" 
                          className={`rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm ${
                            u.role === "admin" 
                              ? "bg-slate-900 text-white border-slate-900" 
                              : "bg-white text-slate-500 border-slate-100"
                          }`}
                        >
                          {u.role === "admin" && <Shield className="w-2.5 h-2.5 mr-2" />}
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateRole(u._id)}
                          className={`rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 h-10 px-4 transition-all ${
                            u.role === "admin" 
                              ? "text-red-500 hover:bg-red-50 hover:text-red-600" 
                              : "text-primary hover:bg-primary/5"
                          }`}
                        >
                          {u.role === "admin" ? (
                            <>Demote to User</>
                          ) : (
                            <>Promote to Admin</>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                         <Search className="w-12 h-12" />
                         <p className="font-bold text-lg uppercase tracking-tighter">No users matched your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <div className="flex items-center justify-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-slate-900" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Directory Count: {users.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Staff: {users.filter(u => u.role?.toLowerCase() === 'admin').length}</span>
        </div>
      </div>

    </div>
  );
};

export default UsersPage;
