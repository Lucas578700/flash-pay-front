import { useState } from "react";
import Box from "@mui/material/Box";
import { Toolbar, Container } from "@mui/material";
import { useLocation, Outlet } from 'react-router-dom';

import { useAuth } from "../../hooks/AuthContext";
import NavBar from "../Navbar";
import Sidebar from "../Sidebar";

import Appbar from "../AppBar";

function Content() {
  const { user } = useAuth();
  const location = useLocation();

  const shouldShowSidebar = location.pathname.includes('/painel');

  const [open, setOpen] = useState(true);

  const toogleDrawer = () => {
    setOpen(openState => !openState);
  };

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {user && shouldShowSidebar ? (
        <>
          <NavBar toogleDrawer={toogleDrawer} open={open} />
          <Sidebar open={open} onOpen={openDrawer} onClose={closeDrawer} />
        </>
      ) : (
        <Appbar />
      )}
      <Box
        component="main"
        sx={{
          backgroundColor: theme => theme.palette.grey[100],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} component="main">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Content;
