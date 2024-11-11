"use client";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 280;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ paddingLeft: "16px" }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            alignItems: "self-start",
            padding: "16px",
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
            background: "linear-gradient(135deg, #d9e8f5, #a3c4f3)",
          },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Toolbar />
        <List sx={{ width: "100%", height: "100%" }}>
          {[
            { text: "Dashboard", href: "/" },
            { text: "Entries", href: "/entries" },
          ].map((link) => (
            <ListItem
              key={link.text}
              onClick={toggleDrawer}
              sx={{
                padding: 0,
                cursor: "pointer",
                width: "100%",
                marginBottom: "8px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Link className="w-full p-4" href={link.href} passHref>
                <ListItemText primary={link.text} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
