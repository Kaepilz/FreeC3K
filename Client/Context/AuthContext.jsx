import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const connectSocket = useCallback((user) => {
    try {
      if (!user) return;
      const s = io(backendUrl);
      s.on("connect", () => {
        s.emit("online", user._id);
      });
      s.on("online-users", (list) => setOnlineUsers(list));
      setSocket(s);
    } catch (err) {
      console.error("Socket connect failed", err);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    const check = async () => {
      try {
        axios.defaults.headers.common["token"] = token;
        const { data } = await axios.get("/api/auth/check");
        if (data?.success) {
          setAuthUser(data.user);
          connectSocket(data.user);
        } else {
          setAuthUser(null);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.warn("Auth check failed", err?.message || err);
        localStorage.removeItem("token");
        setAuthUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    check();
  }, [token, connectSocket]);

  const login = async (payload) => {
    try {
      const { data } = await axios.post("/api/auth/login", payload);
      if (data.success) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        setAuthUser(data.user);
        connectSocket(data.user);
        toast.success("Logged in");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    } catch (err) {
      console.warn("Logout error", err);
    }
  };

  const updateProfile = async (formData) => {
    try {
      const { data } = await axios.put("/api/auth/update", formData);
      if (data.success) {
        setAuthUser((prev) => ({ ...prev, ...data.user }));
        toast.success("Profile updated");
      }
      return data;
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  };

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
