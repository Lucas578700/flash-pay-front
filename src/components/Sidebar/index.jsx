/* eslint-disable no-restricted-globals */
import { useState } from "react";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CabinIcon from "@mui/icons-material/Cabin";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import GroupIcon from "@mui/icons-material/Group";
import {
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useNavigate } from "react-router-dom";
import AMFIcon from "../../assets/logo.png";
import { AMFIconImage, Drawer, TextoAMF } from "./styles";
import { useAuth } from "../../hooks/AuthContext";

function Sidebar({ open, onOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [openSubmenuProduto, setOpenProduto] = useState(false);

  const handleClickProduto = () => {
    setOpenProduto(!openSubmenuProduto);
  };

  const irSalasHoje = () => {
    navigate("/painel/");
  };
  const irListaProduto = () => {
    navigate("/painel/produto");
  };
  const irListaCategoria = () => {
    navigate("/painel/categoria");
  };
  const irListaUniversidade = () => {
    navigate("/painel/universidade");
  };

  const irListaEstabelecimento = () => {
    navigate("/painel/estabelecimento");
  };
  const irListaUsuario = () => {
    navigate("/painel/usuario");
  };

  const t = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Drawer
      variant={t ? "permanent" : "temporary"}
      open={open}
      onOpen={onOpen}
      onClose={onClose}>
      <AMFIconImage src={AMFIcon} alt="Logo FlashPAY" onClick={irSalasHoje} />
      <TextoAMF align="center" variant="h6" onClick={irSalasHoje}>
        Flash Pay
      </TextoAMF>
      <List>
        <ListItem button onClick={irSalasHoje}>
          <svg
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.75 27.5V19.25H19.25V27.5H26.125V16.5H30.25L16.5 4.125L2.75 16.5H6.875V27.5H13.75Z"
              fill="white"
            />
          </svg>
          <ListItemText
            primary="Início"
            style={{ color: "#fff", marginLeft: 20 }}
          />
        </ListItem>
        {user && user.type_user == "Administrador" && (
          <ListItem button onClick={irListaUniversidade}>
            <LocalLibraryIcon style={{ color: "#fff", fontSize: 28 }} />

            <ListItemText
              primary="Universidades"
              style={{ color: "#fff", marginLeft: 20 }}
            />
          </ListItem>
        )}
        <ListItem button onClick={irListaEstabelecimento}>
          <CabinIcon style={{ color: "#fff", fontSize: 28 }} />

          <ListItemText
            primary="Estabelecimentos"
            style={{ color: "#fff", marginLeft: 20 }}
          />
        </ListItem>
        <ListItemButton onClick={handleClickProduto}>
          <ProductionQuantityLimitsIcon
            style={{ color: "#fff", fontSize: 28 }}
          />
          <ListItemText
            primary="Produtos"
            style={{ color: "#fff", marginLeft: 20 }}
          />
          {openSubmenuProduto ? (
            <ExpandLess style={{ color: "#fff", fontSize: 28 }} />
          ) : (
            <ExpandMore style={{ color: "#fff", fontSize: 28 }} />
          )}
        </ListItemButton>
        <Collapse in={openSubmenuProduto} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={irListaCategoria}>
              <ListItemIcon>
                <CategoryIcon style={{ color: "#fff", fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText primary="Categoria" style={{ color: "#fff" }} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={irListaProduto}>
              <ListItemIcon>
                <ProductionQuantityLimitsIcon
                  style={{ color: "#fff", fontSize: 28 }}
                />
              </ListItemIcon>
              <ListItemText primary="Produto" style={{ color: "#fff" }} />
            </ListItemButton>
          </List>
        </Collapse>
        {user && user.type_user == "Administrador" && (
        <ListItem button onClick={irListaUsuario}>
          <GroupIcon style={{ color: "#fff", fontSize: 28 }} />

          <ListItemText
            primary="Usuários"
            style={{ color: "#fff", marginLeft: 20 }}
          />
        </ListItem>
        )}
      </List>
    </Drawer>
  );
}

export default Sidebar;
