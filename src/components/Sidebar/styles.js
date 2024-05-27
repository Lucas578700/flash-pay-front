import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";

const Drawer = styled(
  MuiDrawer,
  {}
)(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    marginTop: 60,
    height: "calc(100% - 60px)",
    background:
      "linear-gradient(180deg, #5125b0 60%, rgba(0, 0, 0, 0.1305) 90%), rgba(0, 0, 0, 0.87)",
    position: "relative",
    whiteSpace: "nowrap",
    width: 220,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
    }),
    overflow: "hidden",
  },
}));

const AMFIconImage = styled("img")({
  width: "125px",
  display: "block",
  marginTop: 20,
  marginLeft: "auto",
  marginRight: "auto",
  marginBottom: 10,
});

const TextoAMF = styled(Typography)({
  margin: 10,
  color: "#fff",
  wordWrap: "break-word",
});

export { Drawer, AMFIconImage, TextoAMF };
