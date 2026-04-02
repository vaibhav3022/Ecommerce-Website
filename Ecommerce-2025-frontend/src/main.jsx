import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "./context/UserContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

export const server = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
