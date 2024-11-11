import { useEffect, useState } from "react";
import api from "@/lib/api";

interface UserData {
  name: string;
  email: string;
  uuid: string;
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/check-auth");
        setIsAuthenticated(response.data.isAuthenticated);
        setUserData(response.data.user);
      } catch (err) {
        console.error("err in use auth :", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, userData };
};

export default useAuth;
