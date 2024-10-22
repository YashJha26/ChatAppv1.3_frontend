import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const AuthContext = createContext({
  loggedInUser: { isAuthenticated: false, user: null },
  setLoggedInUser: () => {},
  showLoading: true,
});

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cookies] = useCookies(["token"]);
  const [loggedInUser, setLoggedInUser] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const authUser = async () => {
      setShowLoading(true);
      if (cookies && cookies?.token && typeof cookies?.token === "string") {
        console.log(cookies);

        try {
          const response = await axios.get(
            `${BASE_URL}/api/auth/verifyUser`,
            {
              headers: {
                Authorization: `Bearer ${cookies.token}`, // Include Bearer token here
              },
              withCredentials: true,
            }
          );
          if (response && response?.data) {
            setLoggedInUser(response?.data ?? null);
            if (pathname === "/auth") {
              navigate("/");
            }
          }
        } catch (error) {
          console.log(error);
          toast.error(
            error?.toString() ??
              "Failed to authenticate and verify user. Please try again",
            {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            }
          );
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }
      setShowLoading(false);
    };
    authUser();
  }, [cookies, navigate, pathname]);

  return (
    <AuthContext.Provider
      value={{ loggedInUser, setLoggedInUser, showLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContextProvider;
