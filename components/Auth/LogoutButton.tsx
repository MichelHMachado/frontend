"use client";
import { logout } from "@/lib/actions/auth";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";

import React from "react";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };
  return (
    <Button sx={{ color: "white" }} onClick={handleLogout}>
      <LogoutIcon color="info" />
    </Button>
  );
};

export default LogoutButton;
