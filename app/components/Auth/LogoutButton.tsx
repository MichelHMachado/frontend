"use client";
import { logout } from "@/app/actions/auth";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

import React from "react";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
