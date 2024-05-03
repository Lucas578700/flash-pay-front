import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "src/styles/theme";
import Routes from "src/routes";
import ModalsProvider from "src/components/Modals";
import ModalProviderLib from "mui-modal-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./providers/AuthProvider";
import APIErrorProvider from "./providers/APIErrorProvider";
import APIErrorNotification from "./components/APIErrorNotification";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModalsProvider>
        <ModalProviderLib>
          <APIErrorProvider>
            <AuthProvider>
              <Routes />
              <APIErrorNotification />
            </AuthProvider>
          </APIErrorProvider>
        </ModalProviderLib>
      </ModalsProvider>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
