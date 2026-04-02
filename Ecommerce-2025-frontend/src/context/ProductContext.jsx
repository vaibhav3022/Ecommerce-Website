import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * ProductContext manages the product catalog, category discovery, 
 * and advanced search/filter state synchronized with URL query parameters.
 */
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // --- Catalog State ---
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Filter & Pagination State (Synchronized with URL) ---
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [price, setPrice] = useState(searchParams.get("price") || "");
  
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);

  // --- Logic Gate: URL -> Local State Sync ---
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setSearch(searchParams.get("search") || "");
    setPrice(searchParams.get("price") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // --- Logic Gate: Local State -> URL Sync ---
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (price) params.price = price;
    if (page > 1) params.page = page;
    
    setSearchParams(params, { replace: true });
  }, [search, category, price, page, setSearchParams]);

  // --- Data Fetching Operations ---

  /**
   * Fetches the filtered product list based on current UI state.
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = `${server}/api/product/all?search=${search}&category=${category}&sortByPrice=${price}&page=${page}`;
      const { data } = await axios.get(endpoint);

      setProducts(data.products || []);
      setNewProd(data.newProduct || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("[ProductContext] Failed to resolve product catalog");
    } finally {
      setLoading(false);
    }
  }, [search, category, price, page]);

  /**
   * Discovers unique product categories from the backend.
   */
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get(`${server}/api/category/all`);
      setCategories((data.categories || []).map((c) => c.name));
    } catch (error) {
      // Sliently handle category resolution failures
    }
  }, []);

  /**
   * Loads detailed metadata for a specific product and its related items.
   */
  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/product/${productId}`);
      setProduct(data.product);
      setRelatedProduct(data.relatedProduct);
    } catch (error) {
      console.error(`[ProductContext] Mismatch for product ID: ${productId}`);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle: Auto-resolve catalog on state updates
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <ProductContext.Provider
      value={{
        loading,
        products,
        newProd,
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
        fetchProduct,
        fetchProducts,
        product,
        relatedProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Convenient state hook for components
export const ProductData = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("ProductData must be used within a ProductProvider");
  }
  return context;
};
