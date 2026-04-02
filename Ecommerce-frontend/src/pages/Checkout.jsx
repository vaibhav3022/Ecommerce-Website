import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setAddress(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
    addressType: "Home",
  });

  const handleAddAddress = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        newAddress,
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      toast.success(data.message);
      fetchAddress();
      setNewAddress({
        name: "", phone: "", pincode: "", locality: "", address: "", 
        city: "", state: "", landmark: "", alternatePhone: "", addressType: "Home"
      });
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding address");
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        const { data } = await axios.delete(`${server}/api/address/${id}`, {
          headers: {
            token: Cookies.get("token"),
          },
        });

        toast.success(data.message);
        fetchAddress();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Shipping Address</h1>
            <p className="text-muted-foreground font-medium">Select where you want your premium goods delivered</p>
          </div>
          <Button 
            onClick={() => setModalOpen(true)}
            className="rounded-full px-6 font-bold shadow-lg shadow-primary/20"
          >
            Add New +
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {address && address.length > 0 ? (
              address.map((e) => (
                <div 
                  key={e._id}
                  className="group relative bg-card p-6 rounded-3xl border border-border shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                       {e.addressType}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => deleteHandler(e._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                     <h3 className="font-black text-slate-900">{e.name}</h3>
                     <span className="text-xs font-bold text-muted-foreground">{e.phone}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                    {e.address}, {e.locality}, {e.city}, {e.state} - <span className="font-black">{e.pincode}</span>
                  </p>
                  
                  <Link to={`/payment/${e._id}`}>
                    <Button className="w-full rounded-2xl font-bold shadow-sm group-hover:shadow-primary/20" variant="secondary">
                      Deliver to this address
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-card rounded-3xl border border-dashed border-border p-12 text-center">
                 <p className="text-muted-foreground text-lg mb-6">No shipping addresses found.</p>
                 <Button variant="outline" className="rounded-full px-8" onClick={() => setModalOpen(true)}>
                   Add your first address
                 </Button>
              </div>
            )}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="rounded-[2rem] sm:max-w-[425px] p-8">
            <DialogHeader className="mb-6 text-center sm:text-left">
              <DialogTitle className="text-2xl font-black">Add New Address</DialogTitle>
              <p className="text-sm text-muted-foreground font-medium pr-8">Please provide your accurate shipping details for a seamless delivery experience.</p>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</Label>
                <Input
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</Label>
                <Input
                  placeholder="10-digit number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pincode</Label>
                <Input
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Locality</Label>
                <Input
                  placeholder="Locality"
                  value={newAddress.locality}
                  onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="col-span-full space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Address</Label>
                <textarea
                  placeholder="Area and Street"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full rounded-xl p-3 border border-input h-20 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City/Town</Label>
                <Input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</Label>
                <Input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="col-span-full pt-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 block mb-3">Address Type</Label>
                 <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="Home" checked={newAddress.addressType === "Home"} onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})} className="accent-primary" />
                      <span className="text-xs font-bold">Home</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="Work" checked={newAddress.addressType === "Work"} onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})} className="accent-primary" />
                      <span className="text-xs font-bold">Work</span>
                    </label>
                 </div>
              </div>
            </div>

            <DialogFooter className="mt-10 sm:justify-center gap-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)} className="rounded-full px-6 font-bold">
                Cancel
              </Button>
              <Button onClick={handleAddAddress} className="rounded-full px-8 font-black shadow-lg shadow-primary/20">
                Save & Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Checkout;
