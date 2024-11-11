"use client";
import { useEffect, useState } from "react";

import { redirect } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export function withAuth<ComponentProps>(
  Component: React.ComponentType<ComponentProps>
) {
  return function AuthenticatedComponent(
    props: React.PropsWithChildren<ComponentProps>
  ) {
    const { isAuthenticated } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (isAuthenticated === false) {
        redirect("/sign-in");
      } else {
        setIsChecking(false);
      }
    }, [isAuthenticated]);

    if (isChecking || isAuthenticated === null) return <div>Loading...</div>;

    return <Component {...props} />;
  };
}
