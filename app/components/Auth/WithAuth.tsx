"use client";
import { useEffect, useState } from "react";
import api from "@/app/api";
import { redirect, useRouter } from "next/navigation";

export function withAuth<ComponentProps>(
  Component: React.ComponentType<ComponentProps>
) {
  return function AuthenticatedComponent(
    props: React.PropsWithChildren<ComponentProps>
  ) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) {
            // Token not found, trigger redirect
            setIsAuthenticated(false);
            return;
          }

          const response = await api.get("/auth/check-auth", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.isAuthenticated) {
            setIsAuthenticated(true);
            // Redirect to homepage if authenticated
            router.push("/");
          } else {
            // If not authenticated, set flag to false for redirect
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error(err);
          setIsAuthenticated(false); // On error, set to false for redirect
        }
      };

      checkAuth();
    }, [router]);

    if (isAuthenticated === null) return null; // Loading state
    if (!isAuthenticated) {
      redirect("/sign-in"); // Redirect to sign-in if not authenticated
      return null;
    }

    return <Component {...props} />;
  };
}
