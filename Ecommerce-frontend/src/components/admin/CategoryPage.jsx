import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, Trash2, LayoutGrid, Tag, Package } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${server}/api/category/all`);
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return toast.error("Category name is required");
    
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/category/new`,
        { name: newCategory },
        { headers: { token: Cookies.get("token") } }
      );
      toast.success(data.message);
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding category");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? This might affect products using it.")) return;
    try {
      const { data } = await axios.delete(`${server}/api/category/${id}`, {
        headers: { token: Cookies.get("token") },
      });
      toast.success(data.message);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Category Manager</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Organize your premium product collection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Add Category Form */}
        <Card className="lg:col-span-1 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl h-fit">
          <CardHeader className="p-8 pb-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Plus className="w-6 h-6" />
             </div>
             <CardTitle className="text-xl font-black tracking-tight">New Classification</CardTitle>
             <p className="text-xs text-slate-400 font-medium">Add a new destination for your products</p>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <form onSubmit={addCategory} className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category Name</label>
                   <input 
                     type="text"
                     placeholder="e.g. Summer Collection"
                     className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                     value={newCategory}
                     onChange={(e) => setNewCategory(e.target.value)}
                   />
                </div>
                <Button 
                   type="submit" 
                   disabled={btnLoading}
                   className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                   {btnLoading ? "Creating..." : "Create Category"}
                </Button>
             </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">Active Categories</CardTitle>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">{categories.length} Current Groups</p>
                </div>
                <LayoutGrid className="w-8 h-8 text-slate-100" />
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {categories.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {categories.map((cat) => (
                      <div key={cat._id} className="p-6 px-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                               <Tag className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{cat.name}</p>
                               <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">Dynamic Classification</p>
                            </div>
                         </div>
                         
                         <button 
                           onClick={() => deleteCategory(cat._id)}
                           className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center">
                     <Package className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                     <p className="font-bold text-slate-300 text-lg">No categories defined.</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
};

export default CategoryPage;
