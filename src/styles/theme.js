import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { COLORS } from "./colors";

// eslint-disable-next-line import/no-mutable-exports
let theme = createTheme({
  palette: {
    primary: {
      main: COLORS.main.hex,
    },
    error: {
      main: COLORS.error.hex,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#69848a",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
