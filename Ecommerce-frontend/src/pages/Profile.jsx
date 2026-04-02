import { UserData } from "@/context/UserContext";
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  Power, 
  ChevronRight,
  ChevronDown,
  CreditCard,
  Bell,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "@/main";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logoutUser, updateProfile } = UserData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // profile, addresses
  const [isEditing, setIsEditing] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
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

  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: { token: Cookies.get("token") }
      });
      setAddresses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(formData.name, formData.gender, formData.phone);
    setIsEditing(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${server}/api/address/add`, addressFormData, {
        headers: { token: Cookies.get("token") }
      });
      toast.success(data.message);
      setShowAddressForm(false);
      fetchAddresses();
      setAddressFormData({
        name: "", phone: "", pincode: "", locality: "", address: "", 
        city: "", state: "", landmark: "", alternatePhone: "", addressType: "Home"
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding address");
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/address/${id}`, {
        headers: { token: Cookies.get("token") }
      });
      toast.success(data.message);
      fetchAddresses();
    } catch (error) {
      toast.error("Error deleting address");
    }
  };

  const handleLogout = () => {
    logoutUser(navigate, () => {});
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-8 font-inter">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-80 flex flex-col gap-4">
          {/* User Brief */}
          <div className="bg-white p-4 rounded-sm shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Hello,</p>
              <h2 className="font-bold text-lg text-slate-800 line-clamp-1">{user?.name}</h2>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden text-sm">
            {/* Orders Section */}
            <div 
              className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              onClick={() => navigate("/orders")}
            >
              <div className="flex items-center gap-4">
                <Package className="text-primary w-5 h-5" />
                <span className="font-bold text-gray-500 group-hover:text-primary transition-colors uppercase tracking-tight">My Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>

            {/* Account Settings Section */}
            <div className="border-b border-gray-100">
              <div className="p-4 flex items-center gap-4 bg-slate-50/50">
                <User className="text-primary w-5 h-5" />
                <span className="font-bold text-gray-500 uppercase tracking-tight">Account Settings</span>
              </div>
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`pl-14 py-3 text-left hover:bg-primary/5 transition-colors ${activeTab === "profile" ? "bg-primary/10 text-primary font-bold" : "text-gray-600"}`}
                >
                  Profile Information
                </button>
                <button 
                  onClick={() => setActiveTab("addresses")}
                  className={`pl-14 py-3 text-left hover:bg-primary/5 transition-colors ${activeTab === "addresses" ? "bg-primary/10 text-primary font-bold" : "text-gray-600"}`}
                >
                  Manage Addresses
                </button>
                <button className="pl-14 py-3 text-left text-gray-400 cursor-not-allowed">PAN Card Information</button>
              </div>
            </div>

            {/* Payments Section */}
            <div className="border-b border-gray-100">
               <div className="p-4 flex items-center gap-4 bg-slate-50/50">
                <CreditCard className="text-primary w-5 h-5" />
                <span className="font-bold text-gray-500 uppercase tracking-tight">Payments</span>
              </div>
              <div className="flex flex-col opacity-50 cursor-not-allowed">
                <button className="pl-14 py-3 text-left">Gift Cards</button>
                <button className="pl-14 py-3 text-left">Saved UPI</button>
                <button className="pl-14 py-3 text-left">Saved Cards</button>
              </div>
            </div>

            {/* My Stuff Section */}
            <div className="border-b border-gray-100">
              <div className="p-4 flex items-center gap-4 bg-slate-50/50">
                <Bell className="text-primary w-5 h-5" />
                <span className="font-bold text-gray-500 uppercase tracking-tight">My Stuff</span>
              </div>
              <div className="flex flex-col">
                <button className="pl-14 py-3 text-left text-gray-600 hover:bg-slate-50 transition-colors">Coupons</button>
                <button className="pl-14 py-3 text-left text-gray-600 hover:bg-slate-50 transition-colors">Reviews & Ratings</button>
                <button className="pl-14 py-3 text-left text-gray-600 hover:bg-slate-50 transition-colors">All Notifications</button>
                <button 
                  onClick={() => navigate("/wishlist")}
                  className="pl-14 py-3 text-left text-gray-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  My Wishlist
                </button>
              </div>
            </div>

            {/* Logout */}
            <div 
              className="p-4 flex items-center gap-4 hover:bg-red-50 transition-colors cursor-pointer group"
              onClick={handleLogout}
            >
              <Power className="text-red-500 w-5 h-5" />
              <span className="font-bold text-gray-500 group-hover:text-red-500 transition-colors uppercase tracking-tight">Logout</span>
            </div>
          </div>

          {/* Legal/Footer */}
          <div className="bg-white p-4 rounded-sm shadow-sm text-xs text-gray-400 space-y-2">
            <p className="hover:text-primary cursor-pointer">Frequently Asked Questions</p>
            <p className="hover:text-primary cursor-pointer">Privacy Policy</p>
            <p className="hover:text-primary cursor-pointer">Terms of Use</p>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-white p-6 md:p-8 rounded-sm shadow-sm min-h-[600px]">
          
          {activeTab === "profile" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              {/* Personal Information */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full p-3 border rounded-sm outline-none transition-all ${isEditing ? "border-primary bg-white shadow-sm" : "border-transparent bg-slate-50 cursor-not-allowed"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Gender</label>
                    <div className="flex gap-6 items-center h-12">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="gender" 
                          value="Male"
                          disabled={!isEditing}
                          checked={formData.gender === "Male"}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="w-4 h-4 accent-primary" 
                        />
                        <span className={`text-sm ${formData.gender === "Male" ? "text-slate-900 font-bold" : "text-gray-500"}`}>Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="gender" 
                          value="Female"
                          disabled={!isEditing}
                          checked={formData.gender === "Female"}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="w-4 h-4 accent-primary" 
                        />
                        <span className={`text-sm ${formData.gender === "Female" ? "text-slate-900 font-bold" : "text-gray-500"}`}>Female</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email"
                      disabled={true}
                      value={formData.email}
                      className="w-full p-3 border border-transparent bg-slate-50 rounded-sm cursor-not-allowed text-gray-400 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mobile Number</label>
                    <input 
                      type="text"
                      disabled={!isEditing}
                      placeholder="Enter mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full p-3 border rounded-sm outline-none transition-all ${isEditing ? "border-primary bg-white shadow-sm" : "border-transparent bg-slate-50 cursor-not-allowed"}`}
                    />
                  </div>

                  {isEditing && (
                    <div className="col-span-full pt-4 flex gap-4">
                      <button 
                        type="submit"
                        className="bg-primary text-white font-black px-10 py-3 rounded-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
                      >
                        Save
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user?.name,
                            gender: user?.gender,
                            phone: user?.phone,
                            email: user?.email
                          });
                        }}
                        className="text-slate-500 font-bold px-8 py-3 hover:bg-slate-50 rounded-sm transition-colors text-sm uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </section>

              {/* FAQs and Info */}
              <section className="pt-10 border-t border-gray-100">
                <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-[10px]">Frequently Asked Questions</h4>
                <div className="space-y-2 max-w-2xl">
                  {[
                    {
                      q: "What happens when I update my email address?",
                      a: "For security, email updates are currently managed by our support team to prevent unauthorized access. Your current email remains the primary way we contact you about orders."
                    },
                    {
                      q: "When will my mobile number be updated?",
                      a: "Your mobile number is updated instantly as soon as you hit 'Save'. You will see the updated number reflected under your Profile Information immediately."
                    },
                    {
                      q: "Can I save more than one address?",
                      a: "Yes! You can jump to 'Manage Addresses' to save multiple shipping locations (Home, Office, etc.) and select any one of them during checkout for faster delivery."
                    },
                    {
                      q: "How do I track my order status?",
                      a: "Simply click on 'My Orders' in the sidebar. You can view all your current and past orders, including their delivery status and purchase details."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-slate-50 last:border-0">
                      <button 
                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        className="w-full py-4 flex items-center justify-between text-left group"
                      >
                        <span className={`text-sm font-bold transition-colors ${activeFaq === index ? "text-primary" : "text-slate-600 group-hover:text-slate-900"}`}>
                          {faq.q}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${activeFaq === index ? "rotate-180 text-primary" : ""}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? "max-h-40 pb-4" : "max-h-0"}`}>
                        <p className="text-sm text-slate-500 leading-relaxed pl-1 border-l-2 border-primary/20 ml-1">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <button className="text-sm font-bold text-red-500 pt-10 hover:underline">Deactivate Account</button>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Manage Addresses</h3>
               </div>

               {!showAddressForm ? (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="w-full p-4 border border-slate-200 rounded-sm flex items-center gap-4 text-primary font-bold hover:bg-primary/5 transition-colors"
                  >
                    <span className="text-xl">+</span> ADD A NEW ADDRESS
                  </button>
               ) : (
                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-sm">
                  <form onSubmit={handleAddAddress} className="space-y-6">
                    <h4 className="text-sm font-black text-primary uppercase tracking-widest">Add New Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        required 
                        placeholder="Name" 
                        value={addressFormData.name}
                        onChange={(e) => setAddressFormData({...addressFormData, name: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                      <input 
                        required 
                        placeholder="10-digit mobile number" 
                        value={addressFormData.phone}
                        onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                      <input 
                        required 
                        placeholder="Pincode" 
                        value={addressFormData.pincode}
                        onChange={(e) => setAddressFormData({...addressFormData, pincode: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                      <input 
                        required 
                        placeholder="Locality" 
                        value={addressFormData.locality}
                        onChange={(e) => setAddressFormData({...addressFormData, locality: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                      <textarea 
                        required 
                        placeholder="Address (Area and Street)" 
                        className="col-span-full p-3 border rounded-sm outline-none focus:border-primary bg-white h-24 transition-all"
                        value={addressFormData.address}
                        onChange={(e) => setAddressFormData({...addressFormData, address: e.target.value})}
                      />
                      <input 
                        required 
                        placeholder="City/District/Town" 
                        value={addressFormData.city}
                        onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                      <input 
                        required 
                        placeholder="State" 
                        value={addressFormData.state}
                        onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                      <input 
                        placeholder="Landmark (Optional)" 
                        value={addressFormData.landmark}
                        onChange={(e) => setAddressFormData({...addressFormData, landmark: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                      <input 
                        placeholder="Alternate Phone (Optional)" 
                        value={addressFormData.alternatePhone}
                        onChange={(e) => setAddressFormData({...addressFormData, alternatePhone: e.target.value})}
                        className="p-3 border rounded-sm outline-none focus:border-primary bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Address Type</p>
                       <div className="flex gap-8">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="addrType" 
                              value="Home" 
                              checked={addressFormData.addressType === "Home"}
                              onChange={(e) => setAddressFormData({...addressFormData, addressType: e.target.value})}
                              className="w-4 h-4 accent-primary" 
                            />
                            <span className="text-sm">Home</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="addrType" 
                              value="Work" 
                              checked={addressFormData.addressType === "Work"}
                              onChange={(e) => setAddressFormData({...addressFormData, addressType: e.target.value})}
                              className="w-4 h-4 accent-primary" 
                            />
                            <span className="text-sm">Work</span>
                         </label>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                      <button 
                        type="submit"
                        className="bg-primary text-white font-black px-12 py-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all text-xs uppercase"
                      >
                        Save
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-gray-500 font-bold px-8"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
               )}

               {/* Address List */}
               <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="py-20 text-center">
                       <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                       <p className="text-gray-300 font-bold">No saved addresses found.</p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div key={addr._id} className="p-6 border border-gray-100 rounded-sm relative group hover:shadow-md transition-shadow">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-xs uppercase">
                            {addr.addressType}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                           <span className="font-bold text-slate-900">{addr.name}</span>
                           <span className="font-bold text-slate-900">{addr.phone}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                          {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                        </p>
                        
                        <div className="absolute top-6 right-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => deleteAddress(addr._id)}
                             className="text-xs font-bold text-red-500 hover:underline"
                           >
                             Delete
                           </button>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Profile;
