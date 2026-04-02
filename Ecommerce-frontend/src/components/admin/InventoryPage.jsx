import { ProductData } from "@/context/ProductContext";
import React, { useState } from "react";
import Loading from "../Loading";
import ProductCard from "../ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { server } from "@/main";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { Plus, Package, Search, LayoutGrid } from "lucide-react";

const InventoryPage = () => {
  const { products, page, setPage, fetchProducts, loading, totalPages, categories } = ProductData();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFromData] = useState({
    title: "",
    about: "",
    category: "",
    price: "",
    stock: "",
    images: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFromData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFromData((prev) => ({ ...prev, images: e.target.files }));
  };

  const submitHanlder = async (e) => {
    e.preventDefault();
    if (!formData.images || formData.images.length === 0) {
      toast.error("Please select images");
      return;
    }

    const myFrom = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        for (let i = 0; i < value.length; i++) {
          myFrom.append("files", value[i]);
        }
      } else {
        myFrom.append(key, value);
      }
    });

    try {
      const { data } = await axios.post(`${server}/api/product/new`, myFrom, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.get("token"),
        },
      });

      toast.success(data.message);
      setOpen(false);
      setFromData({
        title: "", about: "", category: "", price: "", stock: "", images: null,
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  };

  const filteredProducts = products?.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Inventory Management</h1>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Manage your 80+ products across 16 categories.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-full px-8 h-12 font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <Plus className="w-5 h-5 mr-2" /> Add New Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search products or categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-full bg-card border-border shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <LayoutGrid className="w-4 h-4" /> Total Items: <span className="text-foreground">{products?.length}</span>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((e) => (
              <ProductCard product={e} key={e._id} latest={"no"} />
            ))
          ) : (
            <div className="col-span-full py-20 bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem] text-center">
               <p className="font-bold text-muted-foreground">No products found for your search.</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center pb-10">
        <Pagination className="bg-card border border-border p-2 rounded-2xl shadow-sm">
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem className="cursor-pointer" onClick={() => setPage(page - 1)}>
                <PaginationPrevious className="rounded-xl font-bold" />
              </PaginationItem>
            )}
            <PaginationItem>
               <span className="px-6 font-black text-sm">Page {page} of {totalPages}</span>
            </PaginationItem>
            {page !== totalPages && (
              <PaginationItem className="cursor-pointer" onClick={() => setPage(page + 1)}>
                <PaginationNext className="rounded-xl font-bold" />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-10 border-border shadow-3xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black">Create New Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitHanlder} className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Title</label>
              <Input name="title" placeholder="e.g. Premium Silk Scarf" value={formData.title} onChange={handleChange} required className="h-12 rounded-xl" />
            </div>
            
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">About Product</label>
              <textarea name="about" placeholder="Describe the product details..." value={formData.about} onChange={handleChange} required className="w-full rounded-xl p-4 border border-input h-24 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full h-12 rounded-xl border border-input px-4 text-sm bg-background">
                <option value="">Select Category</option>
                {categories.map((e) => <option value={e} key={e}>{e}</option>)}
              </select>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Base Price (INR)</label>
               <Input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} required className="h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Stock Quantity</label>
               <Input name="stock" type="number" placeholder="0" value={formData.stock} onChange={handleChange} required className="h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Images</label>
               <Input type="file" multiple accept="image/*" onChange={handleFileChange} required className="h-12 rounded-xl pt-[10px]" />
            </div>

            <div className="col-span-2 pt-6">
               <Button type="submit" className="w-full h-14 rounded-full font-black text-lg shadow-xl shadow-primary/20">
                 Finalize & Add to Catalog
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
