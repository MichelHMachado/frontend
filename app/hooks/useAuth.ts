// hooks/useAuth.ts
import { useEffect, useState } from "react";
import api from "@/app/api";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await api.get("/auth/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false); // On error, set to false for redirect
      }
    };

    checkAuth();
  }, [router]);

  return isAuthenticated;
};

export default useAuth;
