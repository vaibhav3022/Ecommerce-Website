import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * CartContext manages the user's shopping basket across the application.
 * Handles server-side cart synchronization and local state management for items, quantities, and totals.
 */
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- Persistent State ---
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Renamed from totalItem for clarity
  const [cartTotal, setCartTotal] = useState(0); // Renamed from subTotal
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Fetches the latest cart snapshot from the server.
   * Resolves total quantities and aggregate pricing.
   */
  const fetchCart = useCallback(async () => {
    const sessionToken = Cookies.get("token");
    if (!sessionToken) return;

    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        headers: { token: sessionToken },
      });

      setCart(data.cart || []);
      setCartCount(data.sumofQuantities || 0);
      setCartTotal(data.subTotal || 0);
    } catch (error) {
      // Sliently log but don't notify user to minimize UX noise during bg fetches
      console.error("[CartContext] Resolution failed");
    }
  }, []);

  /**
   * Adds a target product to the server-side basket.
   */
  async function addToCart(productId) {
    const sessionToken = Cookies.get("token");
    if (!sessionToken) return toast.error("Please sign in to add items to your cart");

    try {
      const { data } = await axios.post(
        `${server}/api/cart/add`,
        { product: productId },
        { headers: { token: sessionToken } }
      );

      toast.success(data.message || "Added to cart");
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Storage update failed");
    }
  }

  /**
   * Modifies quantities (increment/decrement) for a specific cart line item.
   */
  async function updateCartQuantity(action, itemId) {
    const sessionToken = Cookies.get("token");
    try {
      await axios.post(
          `${server}/api/cart/update?action=${action}`,
          { id: itemId },
          { headers: { token: sessionToken } }
        );

      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Quantity update mismatch");
    }
  }

  /**
   * Removes a specific item entry from the user's cart.
   */
  async function removeFromCart(itemId) {
    const sessionToken = Cookies.get("token");
    try {
      const { data } = await axios.get(`${server}/api/cart/remove/${itemId}`, {
        headers: { token: sessionToken },
      });

      toast.success(data.message || "Item removed");
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  }

  // Initial Sync: Load cart on mount if session exists
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItem: cartCount, // Map back to original name for UI compatibility
        subTotal: cartTotal,   // Map back to original name for UI compatibility
        fetchCart,
        addToCart,
        setTotalItem: setCartCount,
        updateCart: updateCartQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Application state hook for Basket access
export const CartData = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartData must be used within a CartProvider");
  }
  return context;
};
