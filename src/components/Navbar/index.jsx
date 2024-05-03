import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

import { StyledMenuIcon } from "./styles";

function NavBar({ toogleDrawer, open }) {
  const theme = useTheme();

  const { signOut } = useAuth();
  const navigate = useNavigate();

  const settings = ["Perfil", "Sair"];
  const [imageProfile, setImageProfile] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClickUserMenu = (event, setting) => {
    if (setting && setting == "Sair") {
      signOut();
    } else if (setting && setting == "Perfil") {
      navigate("/painel/perfil");
    }

    setAnchorElUser(null);
  };

  return (
    <AppBar position="absolute">
      <Toolbar
        sx={{
          pr: "24px",
          flexGrow: 1, // Adicionado para ocupar o espaço restante à direita
        }}>
        <Typography variant="h6" noWrap sx={{ mr: 6, ml: 8 }}>
          AMF
        </Typography>

        <IconButton
          size="large"
          color="inherit"
          aria-label="Abrir drawer"
          onClick={toogleDrawer}>
          <StyledMenuIcon open={open} theme={theme} />
        </IconButton>

        <Box sx={{ marginLeft: "auto" }}>
          <Tooltip title="Abrir configurações">
            {imageProfile ? (
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            ) : (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit">
                <AccountCircle />
              </IconButton>
            )}
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleClickUserMenu}>
            {settings.map(setting => (
              <MenuItem
                key={setting}
                onClick={event => handleClickUserMenu(event, setting)}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
