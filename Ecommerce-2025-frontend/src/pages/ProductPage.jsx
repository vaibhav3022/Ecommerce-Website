import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext";
import { UserData } from "@/context/UserContext";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Edit, Loader, X, Star, Heart, Trash2, ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const ProductPage = () => {
  const navigate = useNavigate();
  const { fetchProduct, product, relatedProduct, loading, categories } = ProductData();
  const { addToCart } = CartData();

  const { id } = useParams();

  const { isAuth, user } = UserData();

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${server}/api/product/review/${id}`);
      setReviews(data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async () => {
    if (!comment) return toast.error("Please add a comment");
    setReviewLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/product/review/${id}`,
        { rating, comment },
        { headers: { token: Cookies.get("token") } }
      );
      toast.success(data.message);
      setComment("");
      setRating(5);
      fetchReviews();
      fetchProduct(id);
      setReviewLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setReviewLoading(false);
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const { data } = await axios.delete(
        `${server}/api/product/review?id=${reviewId}&productId=${id}`,
        { headers: { token: Cookies.get("token") } }
      );
      toast.success(data.message);
      fetchReviews();
      fetchProduct(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const toggleWishlist = async () => {
    if (!isAuth) return toast.error("Please login to save favorites");
    setWishlistLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/wishlist/${id}`,
        {},
        { headers: { token: Cookies.get("token") } }
      );
      toast.success(data.message);
      // We should ideally refresh the user context here, but at least we give feedback
      setWishlistLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(id);
    fetchReviews();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id);
  };

  const buyNowHandler = async () => {
    setBtnLoading(true);
    await addToCart(id);
    setBtnLoading(false);
    navigate("/checkout");
  };

  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);

  const updateHandler = () => {
    setShow(!show);
    setCategory(product.category);
    setTitle(product.title);
    setAbout(product.about);
    setStock(product.stock);
    setPrice(product.price);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { title, about, price, stock, category },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const [updatedImages, setUpdatedImages] = useState(null);

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!updatedImages || updatedImages.length === 0) {
      toast.error("Please select new images.");
      setBtnLoading(false);
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}`,
        formData,
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      toast.success(data.message);
      fetchProduct(id);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-12">
          {user && user.role === "admin" && (
            <div className="mb-12 max-w-2xl mx-auto">
              <Button 
                variant="outline" 
                onClick={updateHandler}
                className="mb-6 rounded-full gap-2"
              >
                {show ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {show ? "Cancel Editing" : "Edit Product Details"}
              </Button>
              
              {show && (
                <div className="bg-card p-8 rounded-3xl border border-border shadow-xl space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Title</Label>
                      <Input
                        placeholder="e.g. iPhone 15 Pro"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Category</Label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm rounded-xl border border-input bg-background"
                      >
                        {categories.map((e) => (
                          <option value={e} key={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Price ($)</Label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Stock</Label>
                      <Input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">About Product</Label>
                    <textarea
                      placeholder="Detailed description..."
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-background text-sm"
                    />
                  </div>
                  <Button
                    className="w-full h-12 rounded-full font-bold shadow-lg shadow-primary/20"
                    disabled={btnLoading}
                    onClick={submitHandler}
                  >
                    {btnLoading ? <Loader className="animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column: Images */}
              <div className="space-y-8">
                <div className="relative group bg-muted rounded-[2.5rem] overflow-hidden border border-border">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {product.images?.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-square flex items-center justify-center overflow-hidden">
                            <img
                              src={image.url}
                              alt={product.title}
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.15]"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-6" />
                    <CarouselNext className="right-6" />
                  </Carousel>
                </div>

                {user?.role === "admin" && (
                  <div className="bg-card p-6 rounded-2xl border border-border border-dashed">
                    <form onSubmit={handleSubmitImage} className="space-y-4 text-center">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Swap Images (Admin)</Label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setUpdatedImages(e.target.files)}
                        className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:opacity-90 transition-all cursor-pointer"
                      />
                      <Button variant="secondary" size="sm" type="submit" disabled={btnLoading} className="rounded-full px-6">
                        {btnLoading ? <Loader className="animate-spin h-4 w-4" /> : "Upload New Images"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="flex flex-col h-full pt-4">
                <div className="space-y-2 mb-6">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    {product.category}
                  </span>
                  <h1 className="text-5xl font-black tracking-tight leading-[1.1]">{product.title}</h1>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-outfit font-bold">₹{product?.price?.toLocaleString() || product?.price || 0}</span>
                  <div className="h-8 w-[1px] bg-border" />
                  <span className={`text-sm font-bold ${product.stock > 0 ? "text-green-500" : "text-destructive"}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"}
                  </span>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed mb-10 pb-10 border-b border-border">
                  <p className="text-lg leading-relaxed">{product.about}</p>
                </div>

                <div className="space-y-6 mt-auto">
                  {isAuth ? (
                    user.role !== "admin" ? (
                      product.stock > 0 ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            size="lg" 
                            variant="outline"
                            onClick={addToCartHandler}
                            className="flex-1 h-16 rounded-full text-lg font-bold border-2 border-primary text-primary shadow-sm hover:bg-primary hover:text-white transition-all hover:scale-[1.02] active:scale-95"
                          >
                            Add to Cart
                          </Button>
                          <Button 
                            size="lg" 
                            onClick={buyNowHandler}
                            disabled={btnLoading}
                            className="flex-1 h-16 rounded-full text-lg font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex gap-2 items-center justify-center transform bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                          >
                            {btnLoading ? <Loader className="animate-spin w-5 h-5" /> : "Buy Now"}
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={toggleWishlist}
                            disabled={wishlistLoading}
                            className={`h-16 w-16 rounded-full border-2 flex items-center justify-center transition-all hover:scale-[1.05] active:scale-95 ${
                              user?.wishlist?.includes(product._id) ? "border-rose-200 bg-rose-50 text-rose-500" : "border-slate-100 text-slate-400"
                            }`}
                          >
                            <Heart className={`w-6 h-6 ${user?.wishlist?.includes(product._id) ? "fill-rose-500" : ""} ${wishlistLoading ? "animate-pulse" : ""}`} />
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 bg-destructive/10 text-destructive rounded-2xl text-center font-bold">
                          Currently Unavailable
                        </div>
                      )
                    ) : (
                      <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 text-center">
                        <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Management Mode</p>
                        <p className="text-xs text-slate-500 font-medium">As an admin, focus on curating and managing this product. Customer purchasing options are hidden.</p>
                      </div>
                    )
                  ) : (
                    <div className="p-6 bg-muted rounded-2xl text-center">
                      <p className="text-sm font-medium mb-4">Please sign in to add this item to your cart</p>
                      <Button variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-white transition-all" onClick={() => window.location.href='/login'}>
                        Sign In Now
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-12 grid grid-cols-2 gap-6 pt-12 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-lg">🚚</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Fast Delivery</p>
                      <p className="text-xs text-muted-foreground">Free on orders over ₹500</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-lg">✨</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Premium Quality</p>
                      <p className="text-xs text-muted-foreground">Guaranteed authentic</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {relatedProduct?.length > 0 && (
            <div className="mt-32">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-black tracking-tight">You May Also Like</h2>
                <div className="flex-1 h-[1px] bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {relatedProduct.map((e) => (
                  <ProductCard key={e._id} product={e} />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-32 border-t border-border pt-24 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Review Summary */}
                <div className="lg:col-span-1">
                   <div className="sticky top-32">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Client Feedback</span>
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">Product <span className="italic">Reviews.</span></h2>
                      
                      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                         <div className="flex items-center gap-6 mb-8">
                            <div className="text-6xl font-black text-slate-900 leading-none">{product.ratings?.toFixed(1) || "0.0"}</div>
                            <div>
                               <div className="flex gap-1 mb-1">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.ratings) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                  ))}
                               </div>
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{product.numOfReviews} Verified Reviews</p>
                            </div>
                         </div>

                         {/* Rating Distribution Bars */}
                         <div className="space-y-3 mb-10">
                            {[5, 4, 3, 2, 1].map((star) => {
                               const count = reviews.filter(r => r.rating === star).length;
                               const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                               return (
                                 <div key={star} className="flex items-center gap-4 group">
                                    <span className="text-xs font-bold text-slate-500 w-2 shrink-0">{star}</span>
                                    <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                                       <div 
                                         className="h-full bg-amber-400 transition-all duration-1000 group-hover:bg-primary" 
                                         style={{ width: `${percentage}%` }}
                                       />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 w-6 text-right">{count}</span>
                                 </div>
                               );
                            })}
                         </div>

                         {isAuth && user?.role !== 'admin' && (
                           <div className="pt-10 border-t border-slate-50">
                              <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Write a Review</h3>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  {[1,2,3,4,5].map((s) => (
                                    <button 
                                      key={s} 
                                      onClick={() => setRating(s)}
                                      className="transition-transform active:scale-110"
                                    >
                                      <Star className={`w-6 h-6 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                    </button>
                                  ))}
                                </div>
                                <textarea 
                                  placeholder="Share your thoughts on this piece..."
                                  className="w-full min-h-[120px] rounded-2xl bg-slate-50 border-none p-4 text-sm placeholder:text-slate-300 focus:ring-1 focus:ring-primary/20 transition-all"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                />
                                <Button 
                                  className="w-full rounded-full h-12 font-bold shadow-lg shadow-primary/20"
                                  onClick={submitReview}
                                  disabled={reviewLoading}
                                >
                                  {reviewLoading ? "Publishing..." : "Publish Review"}
                                </Button>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2">
                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        Customer Opinions <span className="w-1 h-1 bg-primary rounded-full" />
                      </h3>
                   </div>

                   {reviews.length > 0 ? (
                     <div className="space-y-10">
                       {reviews.map((rev) => (
                         <div key={rev._id} className="group pb-10 border-b border-slate-50 last:border-none animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-start justify-between mb-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                    {rev.user?.name?.charAt(0) || "U"}
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-3">
                                        <p className="text-sm font-black text-slate-900">{rev.user?.name || "Verified Customer"}</p>
                                        <Badge variant="outline" className="text-[8px] h-4 rounded-full px-2 border-slate-100 text-slate-400 font-black uppercase">Verified</Badge>
                                     </div>
                                     <div className="flex gap-0.5 mt-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                        ))}
                                     </div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                  {(user?._id === rev.user?._id || user?.role === "admin") && (
                                    <button 
                                      onClick={() => deleteReviewHandler(rev._id)}
                                      className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                               </div>
                            </div>
                            <div className="relative pl-1">
                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-50 rounded-full group-hover:bg-primary/20 transition-colors" />
                               <p className="text-slate-600 font-medium leading-relaxed italic text-sm pl-6">
                                  "{rev.comment}"
                                </p>
                            </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="h-80 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 p-10 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-6 text-slate-200 shadow-sm border border-slate-50 scale-110">
                           <Star className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 italic">Be the Trendsetter.</h3>
                        <p className="text-sm text-slate-400 font-medium max-w-[280px] leading-relaxed">No reviews yet. Share your experience with this premium selection as our first verified client.</p>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
