import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { ProductData } from "@/context/ProductContext";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Percent, Smartphone, Laptop, Tv, Shirt, Scissors, Sofa, Plane, ShoppingBasket } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const productSectionRef = React.useRef(null);
  const { products, newProd, setCategory, setPage, setSearch, setPrice, categories } = ProductData();

  const handleCategoryClick = (catName) => {
    setCategory(catName);
    setSearch("");
    setPrice("");
    setPage(1);
    
    if (productSectionRef.current) {
        productSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 w-full font-inter">
      
      {/* Categories Modern Strip */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Explore <span className="text-primary italic">Categories</span></h2>
          <div className="h-[2px] flex-1 bg-slate-100 mx-8 hidden md:block"></div>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {categories.slice(0, 10).map((catName, i) => {
            return (
              <div 
                key={i} 
                className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl cursor-pointer hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                onClick={() => handleCategoryClick(catName)}
              >
                <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-primary/10 transition-colors`}>
                  <ShoppingBasket className={`w-5 h-5 text-primary group-hover:scale-110 transition-transform`} />
                </div>
                <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                  {catName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Hero navigate={navigate} />

      {/* Product Sections */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-20 flex flex-col gap-24">
        
        {/* Latest Products Block */}
        <section ref={productSectionRef}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">New Arrivals</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">The Modern <span className="italic">Collection.</span></h2>
            </div>
            <button 
              className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer" 
              onClick={() => navigate('/products')}
            >
               View all products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {newProd && newProd.length > 0 ? (
              newProd.slice(0, 5).map((e) => (
                <ProductCard key={e._id} product={e} latest={"yes"} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                Curating premium essentials...
              </div>
            )}
          </div>
        </section>

        {/* Second Row block */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]">Top Rated</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Trusted <span className="italic">Favorites.</span></h2>
            </div>
            <button 
              className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer" 
              onClick={() => navigate('/products')}
            >
               View all products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
             {products && products.length > 0 ? (
              products.slice(0, 5).reverse().map((e) => (
                <ProductCard key={e._id} product={e} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                Curating premium essentials...
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
