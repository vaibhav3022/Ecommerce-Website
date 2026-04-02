import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

/**
 * UserContext manages the global authentication state and profile data.
 * It provides centralized methods for login, verification, and session management.
 */
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // --- Global State ---
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // --- Authentication Flow ---

  /**
   * Initiates the login process by requesting an OTP.
   */
  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });

      toast.success(data.message);
      localStorage.setItem("email", data.email);
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate login");
    } finally {
      setBtnLoading(false);
    }
  }

  /**
   * Verifies the OTP and establishes a persistent session via HTTP cookies.
   */
  async function verifyUser(otp, navigate, fetchCart) {
    setBtnLoading(true);
    const email = localStorage.getItem("email");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        email,
        otp,
      });

      toast.success(data.message);
      localStorage.clear(); // Cleanup transient login data
      
      setIsAuth(true);
      setUser(data.user);

      // Session Persistence via Cookies
      Cookies.set("token", data.token, {
        expires: 15, // 15-day session
        secure: true,
        sameSite: 'strict',
        path: "/",
      });

      fetchCart();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  /**
   * Validates the current session on app mount or page refresh.
   */
  async function fetchUser() {
    const sessionToken = Cookies.get("token");
    
    if (!sessionToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: sessionToken,
        },
      });

      setIsAuth(true);
      setUser(data);
    } catch (error) {
      setIsAuth(false);
      setUser([]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Clears the session and redirects to login.
   */
  function logoutUser(navigate, setTotalItem) {
    Cookies.remove("token"); // Correct usage of cookie removal
    setUser([]);
    setIsAuth(false);
    
    setTotalItem(0);
    navigate("/login");
    toast.success("Signed out successfully");
  }

  // --- Profile Management ---

  /**
   * Updates user identity details.
   */
  async function updateProfile(name, gender, phone) {
    try {
      const { data } = await axios.put(
        `${server}/api/user/profile`,
        { name, gender, phone },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );

      setUser(data.user);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  }

  // Effect: Resolve session on initialization
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        isAuth,
        loginUser,
        verifyUser,
        logoutUser,
        updateProfile,
      }}
    >
      {children}
      <Toaster position="top-center" />
    </UserContext.Provider>
  );
};

// Custom Hook: Convenient access to User state
export const UserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserData must be used within a UserProvider");
  }
  return context;
};
