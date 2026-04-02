import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductData } from "@/context/ProductContext";
import { Filter, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const Products = () => {
  const [show, setShow] = useState(false);
  const {
    search,
    setSearch,
    categories,
    category,
    setCategory,
    totalPages,
    price,
    setPrice,
    page,
    setPage,
    products,
    loading,
  } = ProductData();

  const productHeaderRef = React.useRef(null);

  useEffect(() => {
    if (productHeaderRef.current) {
        productHeaderRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [category, search, price, page]);

  const clearFilter = () => {
    setPrice("");
    setCategory("");
    setSearch("");
    setPage(1);
  };

  const nextPage = () => {
    setPage(page + 1);
  };
  const prevPage = () => {
    setPage(page - 1);
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen py-10 w-full font-inter">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        {/* Sidebar - Desktop */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 transform transition-transform duration-500 lg:sticky lg:top-24 lg:h-fit lg:translate-x-0 lg:z-0 lg:shadow-none ${
            show ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between lg:hidden mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Filters</h2>
            <Button variant="ghost" size="icon" onClick={() => setShow(false)} className="rounded-full bg-slate-50">
              <X className="w-5 h-5 text-slate-600" />
            </Button>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 pl-1">
                Search
              </h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Find your style..."
                  className="rounded-2xl h-12 bg-slate-50 border-transparent focus:border-primary/20 focus:ring-0 transition-all pl-5"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 pl-1">
                Collections
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${category === "" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-transparent text-slate-600 hover:bg-slate-50"}`}
                  onClick={() => setCategory("")}
                >
                  All Masterpieces
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold capitalize transition-all ${category === c ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-transparent text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 pl-1">
                Sort Preference
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${price === "lowToHigh" ? "bg-slate-100 text-slate-900" : "bg-transparent text-slate-500 hover:bg-slate-50"}`}
                  onClick={() => setPrice("lowToHigh")}
                >
                  Value: Low to High
                </button>
                <button
                  className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${price === "highToLow" ? "bg-slate-100 text-slate-900" : "bg-transparent text-slate-500 hover:bg-slate-50"}`}
                  onClick={() => setPrice("highToLow")}
                >
                  Value: High to Low
                </button>
              </div>
            </div>

            <button
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all mt-4"
              onClick={clearFilter}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Curated Selection</span>
              <h1 ref={productHeaderRef} className="text-4xl font-black text-slate-900 tracking-tighter">Everything You <span className="italic">Desire.</span></h1>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Discovering {products?.length || 0} premium items
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="lg:hidden rounded-2xl font-black gap-3 h-14 px-8 border-slate-200"
              onClick={() => setShow(true)}
            >
              <Filter className="w-4 h-4 text-primary" /> Filter Collection
            </Button>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {products && products.length > 0 ? (
                  products.map((e) => (
                    <ProductCard key={e._id} product={e} latest={"no"} />
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-xl font-bold text-slate-400">No treasures match your criteria.</p>
                    <button onClick={clearFilter} className="mt-4 text-primary font-black text-sm uppercase tracking-widest hover:underline">
                      View All Products
                    </button>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-24 flex justify-center pb-12">
                  <Pagination>
                    <PaginationContent className="gap-6">
                      <PaginationItem>
                        <button 
                          onClick={prevPage} 
                          disabled={page === 1}
                          className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          <PaginationPrevious className="m-0" />
                        </button>
                      </PaginationItem>

                      <div className="flex items-center gap-2">
                         <span className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-xl shadow-primary/30">
                           {page}
                         </span>
                         <span className="text-slate-300 font-bold px-2 whitespace-nowrap uppercase text-[10px] tracking-widest pt-1">
                           of {totalPages}
                         </span>
                      </div>

                      <PaginationItem>
                        <button 
                          onClick={nextPage} 
                          disabled={page === totalPages}
                          className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          <PaginationNext className="m-0" />
                        </button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
