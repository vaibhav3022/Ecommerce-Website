import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserData } from "./context/UserContext";
import Verify from "./pages/Verify";
import Loading from "./components/Loading";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderProcessing from "./pages/OrderProcessing";
import Orders from "./pages/Orders";
import OrderPage from "./pages/OrderPage";
import AdminDashboard from "./pages/AdminDashboard";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

import About from "./pages/About";
import Register from "./pages/Register";

const App = () => {
  const { isAuth, loading } = UserData();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={!isAdminPage ? "min-h-screen flex flex-col" : "h-screen overflow-hidden"}>
          {!isAdminPage && <Navbar />}
          <main className={!isAdminPage ? "flex-grow" : "h-full w-full"}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={isAuth ? <Cart /> : <Login />} />
              <Route path="/wishlist" element={isAuth ? <Wishlist /> : <Login />} />
              <Route path="/profile" element={isAuth ? <Profile /> : <Login />} />
              <Route path="/orders" element={isAuth ? <Orders /> : <Login />} />
              <Route
                path="/order/:id"
                element={isAuth ? <OrderPage /> : <Login />}
              />
              <Route
                path="/admin/dashboard"
                element={isAuth ? <AdminDashboard /> : <Login />}
              />
              <Route
                path="/checkout"
                element={isAuth ? <Checkout /> : <Login />}
              />
              <Route
                path="/payment/:id"
                element={isAuth ? <Payment /> : <Login />}
              />
              <Route
                path="/ordersuccess"
                element={isAuth ? <OrderProcessing /> : <Login />}
              />
              <Route path="*" element={<Link to="/"><NotFound /></Link>} />
              <Route path="/login" element={isAuth ? <Home /> : <Login />} />
              <Route path="/register" element={isAuth ? <Home /> : <Register />} />
              <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
            </Routes>
          </main>
          {!isAdminPage && <Footer />}
        </div>
      )}
    </>
  );
};

export default App;
